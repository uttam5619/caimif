import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type { AuthUserRole } from "@/server/utils/auth/jwt";

export type UserAccountStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

/**
 * Safe public/dashboard user representation (strictly excludes `password`).
 */
export interface AuthenticatedUserDto {
  id: string;
  name: string;
  email: string;
  role: AuthUserRole;
  adminRole: AdminRole;
  status: UserAccountStatus;
  activeSessionCount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Validated login request payload.
 */
export interface LoginInput {
  email: string;
  password: string;
  role?: AdminRole | AuthUserRole;
}

/**
 * Device request metadata stored alongside each refresh session row.
 */
export interface SessionRequestMetadata {
  userAgent: string | null;
  ipAddress: string | null;
}

/**
 * Paginated users query and response contracts (SecurityAdmin-only endpoints).
 */
export interface ListUsersQuery {
  role?: AuthUserRole;
  status?: UserAccountStatus;
  search?: string;
  page: number;
  limit: number;
}

export interface PaginatedUsersDto {
  items: AuthenticatedUserDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: AuthUserRole;
  status?: UserAccountStatus;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: AuthUserRole;
  status?: UserAccountStatus;
}

export interface SessionMutationResult {
  user: AuthenticatedUserDto;
  accessToken: string;
  refreshToken: string;
}
