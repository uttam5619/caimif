/**
 * Pagination, role mapping, and default authentication configuration constants.
 */
export const AUTH_USERS_DEFAULT_PAGE = 1;
export const AUTH_USERS_DEFAULT_LIMIT = 20;
export const AUTH_USERS_MAX_LIMIT = 100;

export const AUTH_ALLOWED_DB_ROLES = ["SECURITY_ADMIN", "SUB_ADMIN"] as const;
export const AUTH_USER_STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;
