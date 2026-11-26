import { z } from "zod";
import { ValidationError } from "@/server/utils/errors/AppError";
import {
  optionalNullableText,
  optionalNullableUrl,
} from "@/server/utils/validation/commonSchemas";
import {
  CONFERENCE_DEFAULT_LIMIT,
  CONFERENCE_DEFAULT_PAGE,
  CONFERENCE_MAX_LIMIT,
  CONFERENCE_MAX_YEAR,
  CONFERENCE_MIN_YEAR,
} from "./conference.constants";
import type {
  CreateConferenceInput,
  ListConferencesQuery,
  UpdateConferenceInput,
} from "./conference.types";

export const createConferenceSchema = z.object({
  year: z.coerce
    .number()
    .int("Year must be an integer.")
    .min(CONFERENCE_MIN_YEAR, `Year must be at least ${CONFERENCE_MIN_YEAR}.`)
    .max(CONFERENCE_MAX_YEAR, `Year cannot exceed ${CONFERENCE_MAX_YEAR}.`),
  domain: z
    .string()
    .trim()
    .min(1, "Research domain is required.")
    .max(191, "Research domain cannot exceed 191 characters."),
  title: z.string().trim().min(1, "Paper title is required."),
  authorFromCaimif: z
    .string()
    .trim()
    .min(1, "CAIMIF author(s) field is required."),
  otherAuthors: optionalNullableText(),
  conferenceName: z.string().trim().min(1, "Conference name is required."),
  publisher: optionalNullableText(191),
  indexing: optionalNullableText(191),
  quartile: optionalNullableText(50),
  weblink: optionalNullableUrl,
});

export const updateConferenceSchema = createConferenceSchema.partial();

export const listConferencesQuerySchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(CONFERENCE_MIN_YEAR)
    .max(CONFERENCE_MAX_YEAR)
    .optional(),
  domain: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(CONFERENCE_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(CONFERENCE_MAX_LIMIT)
    .default(CONFERENCE_DEFAULT_LIMIT),
});

/**
 * Validates JSON body for creating a Conference record.
 */
export function validateCreateConferencePayload(
  raw: unknown
): CreateConferenceInput {
  const parsed = createConferenceSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid conference payload.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates JSON body for updating a Conference record, ensuring at least one field is provided.
 */
export function validateUpdateConferencePayload(
  raw: unknown
): UpdateConferenceInput {
  const parsed = updateConferenceSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid conference update payload.",
      parsed.error.issues
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    throw new ValidationError("At least one field must be provided to update.");
  }

  return parsed.data;
}

/**
 * Validates URL query parameters for listing Conference records.
 */
export function validateListConferencesQuery(
  searchParams: URLSearchParams
): ListConferencesQuery {
  const rawQuery = {
    year: searchParams.get("year") ?? undefined,
    domain: searchParams.get("domain") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listConferencesQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid query parameters.",
      parsed.error.issues
    );
  }

  return parsed.data;
}
