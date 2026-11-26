import { z } from "zod";
import type { ParsedMultipartPayload } from "@/server/middlewares/multerUpload";
import { ValidationError } from "@/server/utils/errors/AppError";
import {
  TRAINING_DEFAULT_LIMIT,
  TRAINING_DEFAULT_PAGE,
  TRAINING_MAX_LIMIT,
} from "./training.constants";
import type {
  ListTrainingsQuery,
  ValidatedCreateTrainingInput,
  ValidatedUpdateTrainingInput,
} from "./training.types";

const listTrainingsQuerySchema = z.object({
  isRegistrationOpen: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(TRAINING_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(TRAINING_MAX_LIMIT)
    .default(TRAINING_DEFAULT_LIMIT),
});

/**
 * Parses and validates a positive integer training ID from dynamic route params.
 */
export function parseTrainingId(rawId: string): number {
  const parsed = Number(rawId);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError("Training ID must be a positive integer.");
  }
  return parsed;
}

/**
 * Parses a date string from FormData and validates that it yields a valid Date.
 */
function parseRequiredDate(rawValue: string | undefined, label: string): Date {
  const trimmed = (rawValue ?? "").trim();
  if (!trimmed) {
    throw new ValidationError(`${label} is required.`);
  }
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    throw new ValidationError(`${label} must be a valid date/time.`);
  }
  return date;
}

/**
 * Parses boolean strings submitted via multipart FormData.
 */
function parseBooleanField(rawValue: string | undefined, fallback: boolean): boolean {
  if (rawValue === undefined) return fallback;
  const normalized = rawValue.trim().toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "on") {
    return true;
  }
  if (normalized === "false" || normalized === "0" || normalized === "off") {
    return false;
  }
  throw new ValidationError("isRegistrationOpen must be a boolean value.");
}

/**
 * Validates a Multer-parsed multipart payload for creating a Training record.
 */
export function validateCreateTrainingMultipart(
  multipart: ParsedMultipartPayload
): ValidatedCreateTrainingInput {
  const title = (multipart.fields.title ?? "").trim();
  if (!title) {
    throw new ValidationError("Training title is required.");
  }
  if (title.length > 191) {
    throw new ValidationError("Training title cannot exceed 191 characters.");
  }

  const rawShortDesc = (multipart.fields.shortDescription ?? "").trim();
  if (rawShortDesc.length > 191) {
    throw new ValidationError("Short description cannot exceed 191 characters.");
  }

  const description = (multipart.fields.description ?? "").trim();
  if (!description) {
    throw new ValidationError("Description is required.");
  }

  const startDate = parseRequiredDate(multipart.fields.startDate, "Start date");
  const endDate = parseRequiredDate(multipart.fields.endDate, "End date");
  if (endDate.getTime() < startDate.getTime()) {
    throw new ValidationError("End date must be on or after the start date.");
  }

  const isRegistrationOpen = parseBooleanField(
    multipart.fields.isRegistrationOpen,
    true
  );

  return {
    title,
    shortDescription: rawShortDesc || null,
    description,
    imageFile: multipart.files.image ?? null,
    startDate,
    endDate,
    isRegistrationOpen,
  };
}

/**
 * Validates a Multer-parsed multipart payload for updating an existing Training record.
 */
export function validateUpdateTrainingMultipart(
  multipart: ParsedMultipartPayload,
  existingDates: { startDate: Date; endDate: Date }
): ValidatedUpdateTrainingInput {
  const hasField = (name: string) =>
    Object.prototype.hasOwnProperty.call(multipart.fields, name);

  let title: string | undefined;
  if (hasField("title")) {
    const trimmed = multipart.fields.title.trim();
    if (!trimmed) {
      throw new ValidationError("Training title cannot be empty.");
    }
    if (trimmed.length > 191) {
      throw new ValidationError("Training title cannot exceed 191 characters.");
    }
    title = trimmed;
  }

  let shortDescription: string | null | undefined;
  if (hasField("shortDescription")) {
    const trimmed = multipart.fields.shortDescription.trim();
    if (trimmed.length > 191) {
      throw new ValidationError("Short description cannot exceed 191 characters.");
    }
    shortDescription = trimmed || null;
  }

  let description: string | undefined;
  if (hasField("description")) {
    const trimmed = multipart.fields.description.trim();
    if (!trimmed) {
      throw new ValidationError("Description cannot be empty.");
    }
    description = trimmed;
  }

  const startDate = hasField("startDate")
    ? parseRequiredDate(multipart.fields.startDate, "Start date")
    : undefined;
  const endDate = hasField("endDate")
    ? parseRequiredDate(multipart.fields.endDate, "End date")
    : undefined;

  const effectiveStart = startDate ?? existingDates.startDate;
  const effectiveEnd = endDate ?? existingDates.endDate;
  if (effectiveEnd.getTime() < effectiveStart.getTime()) {
    throw new ValidationError("End date must be on or after the start date.");
  }

  const isRegistrationOpen = hasField("isRegistrationOpen")
    ? parseBooleanField(multipart.fields.isRegistrationOpen, true)
    : undefined;

  const removeImage = multipart.fields.removeImage === "true";
  const imageFile = multipart.files.image ?? null;

  if (
    title === undefined &&
    shortDescription === undefined &&
    description === undefined &&
    startDate === undefined &&
    endDate === undefined &&
    isRegistrationOpen === undefined &&
    !imageFile &&
    !removeImage
  ) {
    throw new ValidationError("At least one field must be provided to update.");
  }

  return {
    title,
    shortDescription,
    description,
    imageFile,
    removeImage,
    startDate,
    endDate,
    isRegistrationOpen,
  };
}

/**
 * Validates URL query parameters for listing Training records.
 */
export function validateListTrainingsQuery(
  searchParams: URLSearchParams
): ListTrainingsQuery {
  const rawQuery = {
    isRegistrationOpen: searchParams.get("isRegistrationOpen") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listTrainingsQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid query parameters.",
      parsed.error.issues
    );
  }

  return parsed.data;
}
