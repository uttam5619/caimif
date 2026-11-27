import { getPrisma } from "@/server/database/prisma";
import type { Prisma } from "../../../../prisma/generated/prisma/client";
import type { ListUsersQuery, UserAccountStatus } from "./auth.types";
import type { AuthUserRole } from "@/server/utils/auth/jwt";

const SAFE_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      sessions: {
        where: {
          revokedAt: null,
        },
      },
    },
  },
} satisfies Prisma.UserSelect;

export type SafeUserRecord = Prisma.UserGetPayload<{
  select: typeof SAFE_USER_SELECT;
}>;

export type AuthLoginUserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "SECURITY_ADMIN" | "ADMIN" | "SUB_ADMIN";
  status: UserAccountStatus;
  createdAt: Date;
  updatedAt: Date;
};

function buildUserWhereClause(query: ListUsersQuery): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {
    // Scope admin RBAC listing cleanly to the two administrative roles
    role: query.role ? query.role : { in: ["SECURITY_ADMIN", "SUB_ADMIN"] },
  };

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { email: { contains: query.search } },
    ];
  }

  return where;
}

/**
 * Repository encapsulating all Prisma 7 ORM operations for `User` and `AuthSession`.
 * Password hashes are strictly excluded from all general query selects and only
 * returned in `findUserForAuthByEmail` for server-side Argon2id verification.
 */
export const authRepository = {
  async findUserForAuthByEmail(
    email: string
  ): Promise<AuthLoginUserRecord | null> {
    const prisma = getPrisma();
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async findSafeUserById(id: string): Promise<SafeUserRecord | null> {
    const prisma = getPrisma();
    return prisma.user.findUnique({
      where: { id },
      select: SAFE_USER_SELECT,
    });
  },

  async findUserIdByEmail(email: string): Promise<{ id: string } | null> {
    const prisma = getPrisma();
    return prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
  },

  async findUsersPaginated(
    query: ListUsersQuery
  ): Promise<{ items: SafeUserRecord[]; total: number }> {
    const prisma = getPrisma();
    const where = buildUserWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: SAFE_USER_SELECT,
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { items, total };
  },

  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: AuthUserRole;
    status: UserAccountStatus;
  }): Promise<SafeUserRecord> {
    const prisma = getPrisma();
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
        role: data.role,
        status: data.status,
      },
      select: SAFE_USER_SELECT,
    });
  },

  async updateUserWithSessionRevocation(
    id: string,
    data: {
      name?: string;
      email?: string;
      passwordHash?: string;
      role?: AuthUserRole;
      status?: UserAccountStatus;
    },
    revokeSessions: boolean
  ): Promise<SafeUserRecord> {
    const prisma = getPrisma();
    return prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id },
        data: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.email !== undefined ? { email: data.email } : {}),
          ...(data.passwordHash !== undefined
            ? { password: data.passwordHash }
            : {}),
          ...(data.role !== undefined ? { role: data.role } : {}),
          ...(data.status !== undefined ? { status: data.status } : {}),
        },
        select: SAFE_USER_SELECT,
      });

      if (revokeSessions) {
        await tx.authSession.updateMany({
          where: {
            userId: id,
            revokedAt: null,
          },
          data: {
            revokedAt: new Date(),
          },
        });
      }

      return updated;
    });
  },

  async deleteUser(id: string): Promise<void> {
    const prisma = getPrisma();
    await prisma.user.delete({ where: { id } });
  },

  /**
   * Persists a new per-device `AuthSession` storing only the SHA-256 hash of its refresh token.
   */
  async createAuthSession(data: {
    id: string;
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
    userAgent: string | null;
    ipAddress: string | null;
  }): Promise<void> {
    const prisma = getPrisma();
    await prisma.authSession.create({
      data: {
        id: data.id,
        userId: data.userId,
        refreshTokenHash: data.refreshTokenHash,
        expiresAt: data.expiresAt,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
      },
    });
  },

  /**
   * Fetches an `AuthSession` by ID together with its owner user's auth posture.
   */
  async findSessionWithUser(sessionId: string) {
    const prisma = getPrisma();
    return prisma.authSession.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  },

  /**
   * Atomically rotates a refresh session token hash using compare-and-swap semantics (`updateMany`),
   * preventing concurrent refresh race conditions from double-issuing tokens on the same hash.
   */
  async rotateSessionAtomic(params: {
    sessionId: string;
    userId: string;
    expectedRefreshHash: string;
    nextRefreshHash: string;
    nextExpiresAt: Date;
    now: Date;
    userAgent: string | null;
    ipAddress: string | null;
  }): Promise<number> {
    const prisma = getPrisma();
    const result = await prisma.authSession.updateMany({
      where: {
        id: params.sessionId,
        userId: params.userId,
        refreshTokenHash: params.expectedRefreshHash,
        revokedAt: null,
        expiresAt: { gt: params.now },
      },
      data: {
        refreshTokenHash: params.nextRefreshHash,
        expiresAt: params.nextExpiresAt,
        userAgent: params.userAgent,
        ipAddress: params.ipAddress,
      },
    });

    return result.count;
  },

  /**
   * Revokes a single device session cleanly if not already revoked.
   */
  async revokeSessionById(sessionId: string, userId?: string): Promise<number> {
    const prisma = getPrisma();
    const result = await prisma.authSession.updateMany({
      where: {
        id: sessionId,
        ...(userId ? { userId } : {}),
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
    return result.count;
  },

  /**
   * Revokes every active refresh session belonging to a user across all devices.
   */
  async revokeAllUserSessions(userId: string): Promise<number> {
    const prisma = getPrisma();
    const result = await prisma.authSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
    return result.count;
  },
};
