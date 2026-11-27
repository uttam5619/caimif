import { z } from "zod";
import type { ParsedMultipartPayload } from "@/server/middlewares/multerUpload";
import { ValidationError } from "@/server/utils/errors/AppError";
import {
  FEATURED_RESEARCH_DEFAULT_LIMIT,
  FEATURED_RESEARCH_DEFAULT_PAGE,
  FEATURED_RESEARCH_MAX_LIMIT,
} from "./featuredResearch.constants";
import type {
  ListFeaturedResearchQuery,
  ValidatedCreateFeaturedResearchInput,
  ValidatedUpdateFeaturedResearchInput,
} from "./featuredResearch.types";

const listFeaturedResearchQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(FEATURED_RESEARCH_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(FEATURED_RESEARCH_MAX_LIMIT)
    .default(FEATURED_RESEARCH_DEFAULT_LIMIT),
});

/**
 * Parses and validates a FeaturedResearch CUID/string ID from dynamic route params.
 */
export function parseFeaturedResearchId(rawId: string): string {
  const trimmed = rawId.trim();
  if (!trimmed || trimmed.length > 191 || !/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    throw new ValidationError("Invalid featured research ID.");
  }
  return trimmed;
}

/**
 * Validates a required bounded VARCHAR(191) field from multipart FormData.
 */
function parseRequiredBoundedText(
  rawValue: string | undefined,
  label: string,
  maxLen = 191
): string {
  const trimmed = (rawValue ?? "").trim();
  if (!trimmed) {
    throw new ValidationError(`${label} is required.`);
  }
  if (trimmed.length > maxLen) {
    throw new ValidationError(`${label} cannot exceed ${maxLen} characters.`);
  }
  return trimmed;
}

/**
 * Validates a Multer-parsed multipart payload for creating a FeaturedResearch record.
 */
export function validateCreateFeaturedResearchMultipart(
  multipart: ParsedMultipartPayload
): ValidatedCreateFeaturedResearchInput {
  const imageFile = multipart.files.image ?? null;

  const authorName = parseRequiredBoundedText(
    multipart.fields.authorName,
    "Author name"
  );
  const title = parseRequiredBoundedText(multipart.fields.title, "Title");

  const description = (multipart.fields.description ?? "").trim();
  if (!description) {
    throw new ValidationError("Description is required.");
  }

  return {
    imageFile,
    authorName,
    title,
    description,
  };
}

/**
 * Validates a Multer-parsed multipart payload for updating an existing FeaturedResearch record.
 * Since `imageKey` is non-nullable on the schema, images can be replaced but not removed.
 */
export function validateUpdateFeaturedResearchMultipart(
  multipart: ParsedMultipartPayload
): ValidatedUpdateFeaturedResearchInput {
  const hasField = (fieldName: string) =>
    Object.prototype.hasOwnProperty.call(multipart.fields, fieldName);

  const authorName = hasField("authorName")
    ? parseRequiredBoundedText(multipart.fields.authorName, "Author name")
    : undefined;

  const title = hasField("title")
    ? parseRequiredBoundedText(multipart.fields.title, "Title")
    : undefined;

  let description: string | undefined;
  if (hasField("description")) {
    const trimmed = multipart.fields.description.trim();
    if (!trimmed) {
      throw new ValidationError("Description cannot be empty.");
    }
    description = trimmed;
  }

  const imageFile = multipart.files.image ?? null;

  if (
    authorName === undefined &&
    title === undefined &&
    description === undefined &&
    !imageFile
  ) {
    throw new ValidationError("At least one field must be provided to update.");
  }

  return {
    imageFile,
    authorName,
    title,
    description,
  };
}

/**
 * Validates URL query parameters for listing FeaturedResearch records.
 */
export function validateListFeaturedResearchQuery(
  searchParams: URLSearchParams
): ListFeaturedResearchQuery {
  const rawQuery = {
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listFeaturedResearchQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid query parameters.",
      parsed.error.issues
    );
  }

  return parsed.data;
}
