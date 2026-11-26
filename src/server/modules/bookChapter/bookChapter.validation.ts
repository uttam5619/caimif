import { z } from "zod";
import { ValidationError } from "@/server/utils/errors/AppError";
import {
  optionalNullableText,
  optionalNullableUrl,
} from "@/server/utils/validation/commonSchemas";
import {
  BOOK_CHAPTER_DEFAULT_LIMIT,
  BOOK_CHAPTER_DEFAULT_PAGE,
  BOOK_CHAPTER_MAX_LIMIT,
  BOOK_CHAPTER_MAX_YEAR,
  BOOK_CHAPTER_MIN_YEAR,
} from "./bookChapter.constants";
import type {
  CreateBookChapterInput,
  ListBookChaptersQuery,
  UpdateBookChapterInput,
} from "./bookChapter.types";

export const createBookChapterSchema = z.object({
  year: z.coerce
    .number()
    .int("Year must be an integer.")
    .min(BOOK_CHAPTER_MIN_YEAR, `Year must be at least ${BOOK_CHAPTER_MIN_YEAR}.`)
    .max(BOOK_CHAPTER_MAX_YEAR, `Year cannot exceed ${BOOK_CHAPTER_MAX_YEAR}.`),
  domain: z
    .string()
    .trim()
    .min(1, "Research domain is required.")
    .max(191, "Research domain cannot exceed 191 characters."),
  chapterTitle: z.string().trim().min(1, "Chapter title is required."),
  bookName: z.string().trim().min(1, "Book name is required."),
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

export const updateBookChapterSchema = createBookChapterSchema.partial();

export const listBookChaptersQuerySchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(BOOK_CHAPTER_MIN_YEAR)
    .max(BOOK_CHAPTER_MAX_YEAR)
    .optional(),
  domain: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(BOOK_CHAPTER_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(BOOK_CHAPTER_MAX_LIMIT)
    .default(BOOK_CHAPTER_DEFAULT_LIMIT),
});

/**
 * Validates JSON body for creating a BookChapter record.
 */
export function validateCreateBookChapterPayload(
  raw: unknown
): CreateBookChapterInput {
  const parsed = createBookChapterSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid book chapter payload.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates JSON body for updating a BookChapter record, ensuring at least one field is provided.
 */
export function validateUpdateBookChapterPayload(
  raw: unknown
): UpdateBookChapterInput {
  const parsed = updateBookChapterSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid book chapter update payload.",
      parsed.error.issues
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    throw new ValidationError("At least one field must be provided to update.");
  }

  return parsed.data;
}

/**
 * Validates URL query parameters for listing BookChapter records.
 */
export function validateListBookChaptersQuery(
  searchParams: URLSearchParams
): ListBookChaptersQuery {
  const rawQuery = {
    year: searchParams.get("year") ?? undefined,
    domain: searchParams.get("domain") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listBookChaptersQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid query parameters.",
      parsed.error.issues
    );
  }

  return parsed.data;
}
