import { z } from "zod";
import { ValidationError } from "@/server/utils/errors/AppError";
import {
  optionalNullableText,
  optionalNullableUrl,
} from "@/server/utils/validation/commonSchemas";
import {
  BOOK_DEFAULT_LIMIT,
  BOOK_DEFAULT_PAGE,
  BOOK_MAX_LIMIT,
  BOOK_MAX_YEAR,
  BOOK_MIN_YEAR,
} from "./book.constants";
import type {
  CreateBookInput,
  ListBooksQuery,
  UpdateBookInput,
} from "./book.types";

export const createBookSchema = z.object({
  year: z.coerce
    .number()
    .int("Year must be an integer.")
    .min(BOOK_MIN_YEAR, `Year must be at least ${BOOK_MIN_YEAR}.`)
    .max(BOOK_MAX_YEAR, `Year cannot exceed ${BOOK_MAX_YEAR}.`),
  domain: z
    .string()
    .trim()
    .min(1, "Research domain is required.")
    .max(191, "Research domain cannot exceed 191 characters."),
  title: z.string().trim().min(1, "Book title is required."),
  bookAuthor: z.string().trim().min(1, "Book author(s) field is required."),
  authorFromCaimif: z
    .string()
    .trim()
    .min(1, "CAIMIF author(s) field is required."),
  otherAuthors: optionalNullableText(),
  publisher: optionalNullableText(191),
  indexing: optionalNullableText(191),
  quartile: optionalNullableText(50),
  weblink: optionalNullableUrl,
});

export const updateBookSchema = createBookSchema.partial();

export const listBooksQuerySchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(BOOK_MIN_YEAR)
    .max(BOOK_MAX_YEAR)
    .optional(),
  domain: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(BOOK_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(BOOK_MAX_LIMIT)
    .default(BOOK_DEFAULT_LIMIT),
});

/**
 * Validates JSON body for creating a Book record.
 */
export function validateCreateBookPayload(raw: unknown): CreateBookInput {
  const parsed = createBookSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid book payload.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates JSON body for updating a Book record, ensuring at least one field is provided.
 */
export function validateUpdateBookPayload(raw: unknown): UpdateBookInput {
  const parsed = updateBookSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid book update payload.",
      parsed.error.issues
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    throw new ValidationError("At least one field must be provided to update.");
  }

  return parsed.data;
}

/**
 * Validates URL query parameters for listing Book records.
 */
export function validateListBooksQuery(
  searchParams: URLSearchParams
): ListBooksQuery {
  const rawQuery = {
    year: searchParams.get("year") ?? undefined,
    domain: searchParams.get("domain") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listBooksQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid query parameters.",
      parsed.error.issues
    );
  }

  return parsed.data;
}
