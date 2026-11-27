import { randomUUID } from "crypto";
import { toAdminRole, toAuthDbRole } from "@/server/middlewares/adminAuth";
import {
  hashRefreshToken,
  REFRESH_TOKEN_TTL_SECONDS,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type AuthUserRole,
} from "@/server/utils/auth/jwt";
import {
  hashPassword,
  verifyPassword,
} from "@/server/utils/auth/password";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/server/utils/errors/AppError";
import { Prisma } from "../../../../prisma/generated/prisma/client";
import { authRepository, type SafeUserRecord } from "./auth.repository";
import type {
  AuthenticatedUserDto,
  CreateUserInput,
  ListUsersQuery,
  LoginInput,
  PaginatedUsersDto,
  SessionMutationResult,
  SessionRequestMetadata,
  UpdateUserInput,
} from "./auth.types";

// Precomputed dummy Argon2id hash to mitigate email-enumeration timing side-channels
const TIMING_DUMMY_ARGON2ID_HASH =
  "$argon2id$v=19$m=65536,t=3,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function assertSupportedAdminDbRole(
  role: "SECURITY_ADMIN" | "ADMIN" | "SUB_ADMIN"
): AuthUserRole {
  if (role === "SECURITY_ADMIN" || role === "SUB_ADMIN") {
    return role;
  }
  throw new ForbiddenError(
    "This account role is not authorized for SecurityAdmin or SubAdmin access."
  );
}

function toSafeUserDto(record: SafeUserRecord): AuthenticatedUserDto {
  const dbRole = assertSupportedAdminDbRole(record.role);
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: dbRole,
    adminRole: toAdminRole(dbRole),
    status: record.status,
    activeSessionCount: record._count.sessions,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Service layer coordinating Argon2id credential authentication, JOSE token lifecycle,
 * SHA-256 refresh session storage, atomic rotation, replay detection, and SecurityAdmin RBAC.
 */
export const authService = {
  /**
   * Authenticates an admin user with Argon2id, enforces account status & selected role,
   * creates a device-independent `AuthSession`, and signs short-lived access + 30d refresh tokens.
   */
  async login(
    input: LoginInput,
    metadata: SessionRequestMetadata
  ): Promise<SessionMutationResult> {
    const account = await authRepository.findUserForAuthByEmail(input.email);

    if (!account) {
      // Spend equivalent Argon2id CPU time to reduce email-enumeration timing differences
      await verifyPassword(input.password, TIMING_DUMMY_ARGON2ID_HASH);
      throw new UnauthorizedError("Invalid email or password.");
    }

    const isPasswordValid = await verifyPassword(
      input.password,
      account.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    if (account.status !== "ACTIVE") {
      throw new ForbiddenError(
        `Account access denied (${account.status.toLowerCase()}). Please contact a Security Admin.`
      );
    }

    const dbRole = assertSupportedAdminDbRole(account.role);

    if (input.role) {
      const requestedRole = toAuthDbRole(input.role);
      if (requestedRole !== dbRole) {
        throw new ForbiddenError(
          "Selected role does not match your account permissions."
        );
      }
    }

    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId: account.id, role: dbRole }),
      signRefreshToken({ userId: account.id, sessionId }),
    ]);

    await authRepository.createAuthSession({
      id: sessionId,
      userId: account.id,
      refreshTokenHash: hashRefreshToken(refreshToken),
      expiresAt,
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
    });

    return {
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        role: dbRole,
        adminRole: toAdminRole(dbRole),
        status: account.status,
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
      },
      accessToken,
      refreshToken,
    };
  },

  /**
   * Validates the incoming refresh cookie JWT, checks live DB session & user status,
   * detects token replay/theft, and rotates both access & refresh tokens atomically.
   */
  async refreshSession(
    rawRefreshToken: string | null,
    metadata: SessionRequestMetadata
  ): Promise<SessionMutationResult> {
    if (!rawRefreshToken) {
      throw new UnauthorizedError("Refresh token cookie is missing.");
    }

    const claims = await verifyRefreshToken(rawRefreshToken);
    const incomingHash = hashRefreshToken(rawRefreshToken);
    const now = new Date();

    const session = await authRepository.findSessionWithUser(claims.sid);
    if (!session || session.userId !== claims.sub) {
      throw new UnauthorizedError("Refresh session could not be found.");
    }

    // If a previously rotated/revoked refresh token is presented again, revoke all user sessions
    if (
      session.revokedAt !== null ||
      session.refreshTokenHash !== incomingHash
    ) {
      await authRepository.revokeAllUserSessions(session.userId);
      throw new UnauthorizedError(
        "Refresh token reuse or revocation detected; all active sessions revoked."
      );
    }

    if (session.expiresAt <= now) {
      await authRepository.revokeSessionById(session.id, session.userId);
      throw new UnauthorizedError("Refresh session has expired.");
    }

    if (session.user.status !== "ACTIVE") {
      await authRepository.revokeAllUserSessions(session.userId);
      throw new ForbiddenError("Your account is inactive or suspended.");
    }

    const dbRole = assertSupportedAdminDbRole(session.user.role);
    const nextExpiresAt = new Date(
      Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000
    );

    const [nextAccessToken, nextRefreshToken] = await Promise.all([
      signAccessToken({ userId: session.user.id, role: dbRole }),
      signRefreshToken({ userId: session.user.id, sessionId: session.id }),
    ]);

    const nextRefreshHash = hashRefreshToken(nextRefreshToken);

    const updatedCount = await authRepository.rotateSessionAtomic({
      sessionId: session.id,
      userId: session.user.id,
      expectedRefreshHash: incomingHash,
      nextRefreshHash,
      nextExpiresAt,
      now,
      userAgent: metadata.userAgent ?? session.userAgent,
      ipAddress: metadata.ipAddress ?? session.ipAddress,
    });

    if (updatedCount !== 1) {
      throw new UnauthorizedError(
        "Concurrent or stale refresh attempt rejected."
      );
    }

    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: dbRole,
        adminRole: toAdminRole(dbRole),
        status: session.user.status,
        createdAt: session.user.createdAt.toISOString(),
        updatedAt: session.user.updatedAt.toISOString(),
      },
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
    };
  },

  /**
   * Revokes only the current device session identified by its `refresh_token` cookie.
   */
  async logoutCurrentSession(rawRefreshToken: string | null): Promise<void> {
    if (!rawRefreshToken) {
      return;
    }

    try {
      const claims = await verifyRefreshToken(rawRefreshToken);
      await authRepository.revokeSessionById(claims.sid, claims.sub);
    } catch {
      // Allow logout to proceed cleanly so dead/expired cookies are still cleared by controller
    }
  },

  /**
   * Revokes every active refresh session belonging to the authenticated user.
   */
  async logoutAllSessions(userId: string): Promise<{ revokedCount: number }> {
    const revokedCount = await authRepository.revokeAllUserSessions(userId);
    return { revokedCount };
  },

  /**
   * Retrieves the current authenticated user's safe profile DTO (excluding password hash).
   */
  async getCurrentUser(userId: string): Promise<AuthenticatedUserDto> {
    const user = await authRepository.findSafeUserById(userId);
    if (!user) {
      throw new NotFoundError("Authenticated user not found.");
    }
    return toSafeUserDto(user);
  },

  /**
   * Lists admin users (`SECURITY_ADMIN` / `SUB_ADMIN`) with filtering & pagination.
   */
  async listUsers(query: ListUsersQuery): Promise<PaginatedUsersDto> {
    const { items, total } = await authRepository.findUsersPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));

    return {
      items: items.map((item) => toSafeUserDto(item)),
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
      },
    };
  },

  async getUserById(id: string): Promise<AuthenticatedUserDto> {
    const user = await authRepository.findSafeUserById(id);
    if (!user) {
      throw new NotFoundError("User not found.");
    }
    return toSafeUserDto(user);
  },

  /**
   * Creates a new admin user with Argon2id-hashed password. Strictly invokes SecurityAdmin RBAC in controller.
   */
  async createUser(input: CreateUserInput): Promise<AuthenticatedUserDto> {
    const existing = await authRepository.findUserIdByEmail(input.email);
    if (existing) {
      throw new ConflictError("An account with this email already exists.");
    }

    const passwordHash = await hashPassword(input.password);

    try {
      const created = await authRepository.createUser({
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role,
        status: input.status ?? "ACTIVE",
      });
      return toSafeUserDto(created);
    } catch (error: unknown) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictError("An account with this email already exists.");
      }
      throw error;
    }
  },

  /**
   * Updates user attributes (`name`, `email`, `role`, `status`, or Argon2id-hashed `password`).
   * Automatically revokes all active sessions if status becomes non-ACTIVE, role changes, or password changes.
   */
  async updateUser(
    id: string,
    input: UpdateUserInput,
    actorUserId: string
  ): Promise<AuthenticatedUserDto> {
    const existing = await authRepository.findSafeUserById(id);
    if (!existing) {
      throw new NotFoundError("User not found.");
    }

    if (
      id === actorUserId &&
      ((input.status && input.status !== "ACTIVE") ||
        (input.role && input.role !== "SECURITY_ADMIN"))
    ) {
      throw new ConflictError(
        "You cannot suspend or downgrade your own active SecurityAdmin account."
      );
    }

    if (input.email && input.email !== existing.email) {
      const duplicate = await authRepository.findUserIdByEmail(input.email);
      if (duplicate && duplicate.id !== id) {
        throw new ConflictError("An account with this email already exists.");
      }
    }

    const passwordHash =
      input.password !== undefined
        ? await hashPassword(input.password)
        : undefined;

    const shouldRevokeSessions = Boolean(
      passwordHash !== undefined ||
        (input.role !== undefined && input.role !== existing.role) ||
        (input.status !== undefined && input.status !== "ACTIVE")
    );

    try {
      const updated = await authRepository.updateUserWithSessionRevocation(
        id,
        {
          name: input.name,
          email: input.email,
          passwordHash,
          role: input.role,
          status: input.status,
        },
        shouldRevokeSessions
      );
      return toSafeUserDto(updated);
    } catch (error: unknown) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictError("An account with this email already exists.");
      }
      throw error;
    }
  },

  async deleteUser(id: string, actorUserId: string): Promise<void> {
    if (id === actorUserId) {
      throw new ConflictError("You cannot delete your own active account.");
    }

    const existing = await authRepository.findSafeUserById(id);
    if (!existing) {
      throw new NotFoundError("User not found.");
    }

    await authRepository.deleteUser(id);
  },
};
