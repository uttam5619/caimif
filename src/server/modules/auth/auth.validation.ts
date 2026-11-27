import { z } from "zod";
import { toAuthDbRole } from "@/server/middlewares/adminAuth";
import { ValidationError } from "@/server/utils/errors/AppError";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/server/utils/auth/password";
import {
  AUTH_ALLOWED_DB_ROLES,
  AUTH_USER_STATUSES,
  AUTH_USERS_DEFAULT_LIMIT,
  AUTH_USERS_DEFAULT_PAGE,
  AUTH_USERS_MAX_LIMIT,
} from "./auth.constants";
import type {
  CreateUserInput,
  ListUsersQuery,
  LoginInput,
  UpdateUserInput,
} from "./auth.types";

const roleInputSchema = z.enum([
  "SECURITY_ADMIN",
  "SUB_ADMIN",
  "SecurityAdmin",
  "SubAdmin",
]);

const dbRoleSchema = z.enum(AUTH_ALLOWED_DB_ROLES);
const statusSchema = z.enum(AUTH_USER_STATUSES);

const loginPayloadSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address.")
    .max(191, "Email address is too long.")
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(1, "Password is required.")
    .max(PASSWORD_MAX_LENGTH, "Password length exceeds limit."),
  role: roleInputSchema.optional(),
});

const listUsersQuerySchema = z.object({
  role: roleInputSchema
    .optional()
    .transform((value) => (value ? toAuthDbRole(value) : undefined)),
  status: statusSchema.optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(AUTH_USERS_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(AUTH_USERS_MAX_LIMIT)
    .default(AUTH_USERS_DEFAULT_LIMIT),
});

const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(191, "Full name cannot exceed 191 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address.")
    .max(191, "Email address cannot exceed 191 characters.")
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(
      PASSWORD_MIN_LENGTH,
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
    )
    .max(
      PASSWORD_MAX_LENGTH,
      `Password cannot exceed ${PASSWORD_MAX_LENGTH} characters.`
    ),
  role: roleInputSchema
    .default("SUB_ADMIN")
    .transform((value) => toAuthDbRole(value))
    .pipe(dbRoleSchema),
  status: statusSchema.optional().default("ACTIVE"),
});

const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(191, "Full name cannot exceed 191 characters.")
      .optional(),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .max(191, "Email address cannot exceed 191 characters.")
      .transform((val) => val.toLowerCase())
      .optional(),
    password: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
      )
      .max(
        PASSWORD_MAX_LENGTH,
        `Password cannot exceed ${PASSWORD_MAX_LENGTH} characters.`
      )
      .optional(),
    role: roleInputSchema
      .optional()
      .transform((value) => (value ? toAuthDbRole(value) : undefined)),
    status: statusSchema.optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.email !== undefined ||
      data.password !== undefined ||
      data.role !== undefined ||
      data.status !== undefined,
    { message: "At least one field must be provided to update." }
  );

/**
 * Validates and trims a required user route ID parameter.
 */
export function parseUserId(rawId: string): string {
  const trimmed = (rawId ?? "").trim();
  if (!trimmed) {
    throw new ValidationError("User ID is required.");
  }
  return trimmed;
}

/**
 * Validates JSON body for `POST /api/auth/login`.
 */
export function validateLoginPayload(body: unknown): LoginInput {
  const parsed = loginPayloadSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid login credentials format.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates query parameters for `GET /api/users`.
 */
export function validateListUsersQuery(
  searchParams: URLSearchParams
): ListUsersQuery {
  const raw = {
    role: searchParams.get("role") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listUsersQuerySchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid user query parameters.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates JSON body for `POST /api/users`.
 */
export function validateCreateUserPayload(body: unknown): CreateUserInput {
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid user registration payload.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates JSON body for `PATCH /api/users/[id]`.
 */
export function validateUpdateUserPayload(body: unknown): UpdateUserInput {
  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid user update payload.",
      parsed.error.issues
    );
  }
  return parsed.data;
}
