import { z } from "zod";
import { ValidationError } from "@/server/utils/errors/AppError";
import {
  JOURNAL_DEFAULT_LIMIT,
  JOURNAL_DEFAULT_PAGE,
  JOURNAL_MAX_LIMIT,
  JOURNAL_MAX_YEAR,
  JOURNAL_MIN_YEAR,
} from "./journal.constants";
import type {
  CreateJournalInput,
  ListJournalsQuery,
  UpdateJournalInput,
} from "./journal.types";

/**
 * Normalizes optional string fields by trimming whitespace and converting empty strings to null.
 */
const optionalNullableText = (maxLen?: number) =>
  z
    .string()
    .trim()
    .refine((val) => (maxLen ? val.length <= maxLen : true), {
      message: maxLen ? `Value cannot exceed ${maxLen} characters.` : "Invalid value.",
    })
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional();

/**
 * Validates optional http(s) URLs while normalizing empty strings to null.
 */
const optionalNullableUrl = z
  .string()
  .trim()
  .transform((val) => (val === "" ? null : val))
  .nullable()
  .optional()
  .refine(
    (val) => {
      if (val === null || val === undefined) return true;
      try {
        const parsed = new URL(val);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "weblink must be a valid http(s) URL." }
  );

export const createJournalSchema = z.object({
  year: z.coerce
    .number()
    .int("Year must be an integer.")
    .min(JOURNAL_MIN_YEAR, `Year must be at least ${JOURNAL_MIN_YEAR}.`)
    .max(JOURNAL_MAX_YEAR, `Year cannot exceed ${JOURNAL_MAX_YEAR}.`),
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
  journalName: z.string().trim().min(1, "Journal name is required."),
  publisher: optionalNullableText(191),
  indexing: optionalNullableText(191),
  quartile: optionalNullableText(50),
  weblink: optionalNullableUrl,
});

export const updateJournalSchema = createJournalSchema.partial();

export const listJournalsQuerySchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(JOURNAL_MIN_YEAR)
    .max(JOURNAL_MAX_YEAR)
    .optional(),
  domain: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(JOURNAL_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(JOURNAL_MAX_LIMIT)
    .default(JOURNAL_DEFAULT_LIMIT),
});

/**
 * Validates JSON body for creating a Journal record.
 */
export function validateCreateJournalPayload(raw: unknown): CreateJournalInput {
  const parsed = createJournalSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid journal payload.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates JSON body for updating a Journal record, ensuring at least one field is provided.
 */
export function validateUpdateJournalPayload(raw: unknown): UpdateJournalInput {
  const parsed = updateJournalSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid journal update payload.",
      parsed.error.issues
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    throw new ValidationError("At least one field must be provided to update.");
  }

  return parsed.data;
}

/**
 * Validates URL query parameters for listing Journal records.
 */
export function validateListJournalsQuery(
  searchParams: URLSearchParams
): ListJournalsQuery {
  const rawQuery = {
    year: searchParams.get("year") ?? undefined,
    domain: searchParams.get("domain") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listJournalsQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid query parameters.",
      parsed.error.issues
    );
  }

  return parsed.data;
}
