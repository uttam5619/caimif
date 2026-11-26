import { z } from "zod";
import type { ParsedMultipartPayload } from "@/server/middlewares/multerUpload";
import { ValidationError } from "@/server/utils/errors/AppError";
import {
  EVENT_DEFAULT_LIMIT,
  EVENT_DEFAULT_PAGE,
  EVENT_MAX_LIMIT,
} from "./event.constants";
import type {
  ListEventsQuery,
  ValidatedCreateEventInput,
  ValidatedUpdateEventInput,
} from "./event.types";

const listEventsQuerySchema = z.object({
  isRegistrationOpen: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(EVENT_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(EVENT_MAX_LIMIT)
    .default(EVENT_DEFAULT_LIMIT),
});

/**
 * Parses and validates a positive integer event ID from dynamic route params.
 */
export function parseEventId(rawId: string): number {
  const parsed = Number(rawId);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError("Event ID must be a positive integer.");
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
 * Normalizes optional bounded string fields from multipart FormData.
 */
function parseOptionalBoundedText(
  rawValue: string | undefined,
  label: string,
  maxLen = 191
): string | null {
  const trimmed = (rawValue ?? "").trim();
  if (trimmed.length > maxLen) {
    throw new ValidationError(`${label} cannot exceed ${maxLen} characters.`);
  }
  return trimmed || null;
}

/**
 * Validates a Multer-parsed multipart payload for creating an Event record.
 */
export function validateCreateEventMultipart(
  multipart: ParsedMultipartPayload
): ValidatedCreateEventInput {
  const title = (multipart.fields.title ?? "").trim();
  if (!title) {
    throw new ValidationError("Event title is required.");
  }
  if (title.length > 191) {
    throw new ValidationError("Event title cannot exceed 191 characters.");
  }

  const shortDescription = parseOptionalBoundedText(
    multipart.fields.shortDescription,
    "Short description"
  );

  const description = (multipart.fields.description ?? "").trim();
  if (!description) {
    throw new ValidationError("Description is required.");
  }

  const startDate = parseRequiredDate(multipart.fields.startDate, "Start date");
  const endDate = parseRequiredDate(multipart.fields.endDate, "End date");
  if (endDate.getTime() < startDate.getTime()) {
    throw new ValidationError("End date must be on or after the start date.");
  }

  const location = parseOptionalBoundedText(multipart.fields.location, "Location");
  const venue = parseOptionalBoundedText(multipart.fields.venue, "Venue");
  const isRegistrationOpen = parseBooleanField(
    multipart.fields.isRegistrationOpen,
    true
  );

  return {
    title,
    shortDescription,
    description,
    imageFile: multipart.files.image ?? null,
    startDate,
    endDate,
    location,
    venue,
    isRegistrationOpen,
  };
}

/**
 * Validates a Multer-parsed multipart payload for updating an existing Event record.
 */
export function validateUpdateEventMultipart(
  multipart: ParsedMultipartPayload,
  existingDates: { startDate: Date; endDate: Date }
): ValidatedUpdateEventInput {
  const hasField = (name: string) =>
    Object.prototype.hasOwnProperty.call(multipart.fields, name);

  let title: string | undefined;
  if (hasField("title")) {
    const trimmed = multipart.fields.title.trim();
    if (!trimmed) {
      throw new ValidationError("Event title cannot be empty.");
    }
    if (trimmed.length > 191) {
      throw new ValidationError("Event title cannot exceed 191 characters.");
    }
    title = trimmed;
  }

  const shortDescription = hasField("shortDescription")
    ? parseOptionalBoundedText(multipart.fields.shortDescription, "Short description")
    : undefined;

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

  const location = hasField("location")
    ? parseOptionalBoundedText(multipart.fields.location, "Location")
    : undefined;
  const venue = hasField("venue")
    ? parseOptionalBoundedText(multipart.fields.venue, "Venue")
    : undefined;

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
    location === undefined &&
    venue === undefined &&
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
    location,
    venue,
    isRegistrationOpen,
  };
}

/**
 * Validates URL query parameters for listing Event records.
 */
export function validateListEventsQuery(
  searchParams: URLSearchParams
): ListEventsQuery {
  const rawQuery = {
    isRegistrationOpen: searchParams.get("isRegistrationOpen") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listEventsQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid query parameters.",
      parsed.error.issues
    );
  }

  return parsed.data;
}
