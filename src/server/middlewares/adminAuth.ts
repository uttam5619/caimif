import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import { ForbiddenError, UnauthorizedError } from "@/server/utils/errors/AppError";

export interface AdminAuthContext {
  role: AdminRole;
  subject?: string;
}

const VALID_ROLES: ReadonlySet<AdminRole> = new Set(["SecurityAdmin", "SubAdmin"]);

/**
 * Extracts a bearer token or HTTP-only session cookie from the incoming request.
 */
function extractSessionToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }

  return request.cookies.get("caimif_admin_session")?.value ?? null;
}

/**
 * Verifies the administrative caller's identity and role permissions.
 *
 * - When JWT_SECRET is configured (or in production), a signed JWT session token
 *   is strictly required and verified with `jose`.
 * - In local development before auth routes are configured, falls back to the
 *   explicit `x-admin-role` header (still enforcing role authorization rules).
 */
export async function requireAdminRole(
  request: NextRequest,
  allowedRoles: readonly AdminRole[]
): Promise<AdminAuthContext> {
  const jwtSecret = process.env.JWT_SECRET;
  const token = extractSessionToken(request);

  if (jwtSecret) {
    if (!token) {
      throw new UnauthorizedError("Missing admin session token.");
    }

    try {
      const secretKey = new TextEncoder().encode(jwtSecret);
      const { payload } = await jwtVerify(token, secretKey);
      const role = payload.role;

      if (typeof role !== "string" || !VALID_ROLES.has(role as AdminRole)) {
        throw new UnauthorizedError("Invalid administrative role in session token.");
      }

      if (!allowedRoles.includes(role as AdminRole)) {
        throw new ForbiddenError(
          `Role "${role}" is not permitted to perform this operation.`
        );
      }

      return {
        role: role as AdminRole,
        subject: typeof payload.sub === "string" ? payload.sub : undefined,
      };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
        throw error;
      }
      throw new UnauthorizedError("Invalid or expired admin session token.");
    }
  }

  // Never allow unauthenticated fallback in production builds.
  if (process.env.NODE_ENV === "production") {
    throw new UnauthorizedError("Server authentication is not configured.");
  }

  const headerRole = request.headers.get("x-admin-role") ?? "SecurityAdmin";
  if (!VALID_ROLES.has(headerRole as AdminRole)) {
    throw new UnauthorizedError("Unrecognized administrative role.");
  }

  const role = headerRole as AdminRole;
  if (!allowedRoles.includes(role)) {
    throw new ForbiddenError(
      `Role "${role}" is not permitted to perform this operation.`
    );
  }

  return { role };
}
