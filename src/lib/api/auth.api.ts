import type { AdminAuthPayload, AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  AdminUserRecord,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
} from "@/components/admin/dashboard/users/types";
import { authenticatedFetch, ensureCsrfToken } from "./authFetch";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface PaginatedAdminUsersResponse {
  items: AdminUserRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.success) {
    const errorMessage =
      payload?.error?.message ||
      payload?.message ||
      `Request failed with status ${response.status}.`;
    throw new Error(errorMessage);
  }

  return payload.data as T;
}

/**
 * Authenticates admin credentials via `POST /api/auth/login`.
 */
export async function loginAdmin(
  payload: AdminAuthPayload
): Promise<{ user: AdminUserRecord }> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<{ user: AdminUserRecord }>(response);
}

/**
 * Attempts a silent refresh rotation using the HttpOnly `refresh_token` cookie.
 */
export async function refreshAuthSession(): Promise<{
  user: AdminUserRecord;
} | null> {
  const csrfToken = await ensureCsrfToken();
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "same-origin",
    headers: csrfToken ? { "x-csrf-token": csrfToken } : {},
  });

  if (!response.ok) {
    return null;
  }

  return parseApiResponse<{ user: AdminUserRecord }>(response);
}

/**
 * Fetches the authenticated user's live profile and RBAC role (`GET /api/auth/me`).
 */
export async function fetchCurrentUser(): Promise<{ user: AdminUserRecord }> {
  const response = await authenticatedFetch("/api/auth/me", {
    method: "GET",
    cache: "no-store",
  });
  return parseApiResponse<{ user: AdminUserRecord }>(response);
}

/**
 * Revokes only the current device session (`POST /api/auth/logout`).
 */
export async function logoutCurrentSession(): Promise<{ loggedOut: boolean }> {
  const csrfToken = await ensureCsrfToken();
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
    headers: csrfToken ? { "x-csrf-token": csrfToken } : {},
  });
  return parseApiResponse<{ loggedOut: boolean }>(response);
}

/**
 * Revokes all active sessions across all devices for the authenticated user (`POST /api/auth/logout-all`).
 */
export async function logoutAllDeviceSessions(): Promise<{
  revokedCount: number;
}> {
  const response = await authenticatedFetch("/api/auth/logout-all", {
    method: "POST",
  });
  return parseApiResponse<{ revokedCount: number }>(response);
}

/**
 * Lists admin accounts (`SecurityAdmin` only) from `GET /api/users`.
 */
export async function fetchAdminUsers(params: {
  role?: AdminRole | "SECURITY_ADMIN" | "SUB_ADMIN";
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedAdminUsersResponse> {
  const searchParams = new URLSearchParams();
  if (params.role) searchParams.set("role", params.role);
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs ? `/api/users?${qs}` : "/api/users";

  const response = await authenticatedFetch(url, {
    method: "GET",
    cache: "no-store",
  });
  return parseApiResponse<PaginatedAdminUsersResponse>(response);
}

/**
 * Creates a new SecurityAdmin or SubAdmin account (`SecurityAdmin` only).
 */
export async function createAdminUser(
  payload: CreateAdminUserPayload
): Promise<AdminUserRecord> {
  const response = await authenticatedFetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseApiResponse<AdminUserRecord>(response);
}

/**
 * Updates an admin user's role, status, profile, or password (`SecurityAdmin` only).
 */
export async function updateAdminUser(
  userId: string,
  payload: UpdateAdminUserPayload
): Promise<AdminUserRecord> {
  const response = await authenticatedFetch(
    `/api/users/${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  return parseApiResponse<AdminUserRecord>(response);
}

/**
 * Deletes an admin user (`SecurityAdmin` only).
 */
export async function deleteAdminUser(
  userId: string
): Promise<{ id: string }> {
  const response = await authenticatedFetch(
    `/api/users/${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    }
  );
  return parseApiResponse<{ id: string }>(response);
}
