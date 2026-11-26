import { z } from "zod";
import { ValidationError } from "@/server/utils/errors/AppError";
import { optionalNullableText } from "@/server/utils/validation/commonSchemas";
import {
  PATENT_DEFAULT_LIMIT,
  PATENT_DEFAULT_PAGE,
  PATENT_MAX_LIMIT,
  PATENT_MAX_YEAR,
  PATENT_MIN_YEAR,
  PATENT_STATUSES,
} from "./patents.constants";
import type {
  CreatePatentInput,
  ListPatentsQuery,
  UpdatePatentInput,
} from "./patents.types";

const optionalNullableYear = z
  .union([
    z.literal(""),
    z.null(),
    z.coerce
      .number()
      .int("Year must be an integer.")
      .min(PATENT_MIN_YEAR, `Year must be at least ${PATENT_MIN_YEAR}.`)
      .max(PATENT_MAX_YEAR, `Year cannot exceed ${PATENT_MAX_YEAR}.`),
  ])
  .transform((val) => (val === "" ? null : val))
  .optional();

const optionalNullableStatus = z
  .union([
    z.literal(""),
    z.null(),
    z.enum(PATENT_STATUSES, {
      message: "Status must be either PUBLISHED or GRANTED.",
    }),
  ])
  .transform((val) => (val === "" ? null : val))
  .optional();

export const createPatentSchema = z
  .object({
    year: optionalNullableYear,
    domain: optionalNullableText(191),
    title: z.string().trim().min(1, "Patent name is required."),
    status: optionalNullableStatus,
    nameOfInventors: optionalNullableText(),
    patentAgency: optionalNullableText(191),
    country: optionalNullableText(191),
    // Empty strings normalize to null so multiple unpublished patents do not violate @unique
    grantNumber: optionalNullableText(191),
  })
  .strict();

export const updatePatentSchema = createPatentSchema.partial().strict();

export const listPatentsQuerySchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(PATENT_MIN_YEAR)
    .max(PATENT_MAX_YEAR)
    .optional(),
  domain: z.string().trim().min(1).optional(),
  status: z.enum(PATENT_STATUSES).optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(PATENT_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(PATENT_MAX_LIMIT)
    .default(PATENT_DEFAULT_LIMIT),
});

/**
 * Validates JSON body for creating a Patent record.
 */
export function validateCreatePatentPayload(raw: unknown): CreatePatentInput {
  const parsed = createPatentSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid patent payload.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates JSON body for updating a Patent record, ensuring at least one field is provided.
 */
export function validateUpdatePatentPayload(raw: unknown): UpdatePatentInput {
  const parsed = updatePatentSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid patent update payload.",
      parsed.error.issues
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    throw new ValidationError("At least one field must be provided to update.");
  }

  return parsed.data;
}

/**
 * Validates URL query parameters for listing Patent records.
 */
export function validateListPatentsQuery(
  searchParams: URLSearchParams
): ListPatentsQuery {
  const rawQuery = {
    year: searchParams.get("year") ?? undefined,
    domain: searchParams.get("domain") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listPatentsQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid query parameters.",
      parsed.error.issues
    );
  }

  return parsed.data;
}
