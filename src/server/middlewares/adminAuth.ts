import type { NextRequest } from "next/server";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import { getPrisma } from "@/server/database/prisma";
import { assertCsrfProtection } from "@/server/middlewares/csrf";
import { readAccessTokenCookie } from "@/server/utils/auth/cookies";
import { verifyAccessToken, type AuthUserRole } from "@/server/utils/auth/jwt";
import {
  ForbiddenError,
  UnauthorizedError,
} from "@/server/utils/errors/AppError";

export type AcceptedAdminRole = AdminRole | AuthUserRole;

export interface AdminAuthContext {
  userId: string;
  role: AdminRole;
  dbRole: AuthUserRole;
  name: string;
  email: string;
  subject: string;
}

const ROLE_TO_DB_MAP: Record<AcceptedAdminRole, AuthUserRole> = {
  SecurityAdmin: "SECURITY_ADMIN",
  SECURITY_ADMIN: "SECURITY_ADMIN",
  SubAdmin: "SUB_ADMIN",
  SUB_ADMIN: "SUB_ADMIN",
};

const DB_TO_ADMIN_ROLE_MAP: Record<AuthUserRole, AdminRole> = {
  SECURITY_ADMIN: "SecurityAdmin",
  SUB_ADMIN: "SubAdmin",
};

/**
 * Translates database `UserRole` into UI `AdminRole`.
 */
export function toAdminRole(dbRole: AuthUserRole): AdminRole {
  return DB_TO_ADMIN_ROLE_MAP[dbRole];
}

/**
 * Translates UI `AdminRole` or `AuthUserRole` into canonical database `AuthUserRole`.
 */
export function toAuthDbRole(role: AcceptedAdminRole): AuthUserRole {
  return ROLE_TO_DB_MAP[role];
}

/**
 * Extracts an access token from `Authorization: Bearer` header or the HttpOnly `access_token` cookie.
 * Returns whether the token came from cookies so state-changing cookie requests can enforce CSRF checks.
 */
function extractAccessToken(request: NextRequest): {
  token: string | null;
  fromCookie: boolean;
} {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const bearer = authHeader.slice(7).trim();
    if (bearer) {
      return { token: bearer, fromCookie: false };
    }
  }

  const cookieToken = readAccessTokenCookie(request);
  return { token: cookieToken, fromCookie: Boolean(cookieToken) };
}

/**
 * Authorizes an incoming API request using verified HS256 access tokens, live Prisma user state,
 * CSRF checks on cookie-authenticated mutations, and explicit RBAC role matching.
 */
export async function requireAdminRole(
  request: NextRequest,
  allowedRoles: readonly AcceptedAdminRole[]
): Promise<AdminAuthContext> {
  const { token, fromCookie } = extractAccessToken(request);

  if (!token) {
    throw new UnauthorizedError("Authentication is required.");
  }

  // Protect all state-changing requests using HttpOnly cookies against CSRF
  if (fromCookie) {
    assertCsrfProtection(request);
  }

  // Enforce signature, exp, type === "access", sub, and role claims
  const claims = await verifyAccessToken(token);

  // Confirm live DB user existence, ACTIVE status, and unchanged role permissions
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: claims.sub },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError("Authenticated account no longer exists.");
  }

  if (user.status !== "ACTIVE") {
    throw new ForbiddenError("Your account is inactive or suspended.");
  }

  if (user.role !== "SECURITY_ADMIN" && user.role !== "SUB_ADMIN") {
    throw new ForbiddenError("Account role is not permitted for admin access.");
  }

  if (user.role !== claims.role) {
    throw new UnauthorizedError(
      "Role permissions have changed; please refresh or sign in again."
    );
  }

  const normalizedAllowed = new Set<AuthUserRole>(
    allowedRoles.map((role) => ROLE_TO_DB_MAP[role])
  );

  if (!normalizedAllowed.has(user.role)) {
    throw new ForbiddenError(
      `Role "${toAdminRole(user.role)}" is not permitted to perform this operation.`
    );
  }

  return {
    userId: user.id,
    dbRole: user.role,
    role: toAdminRole(user.role),
    name: user.name,
    email: user.email,
    subject: user.id,
  };
}
