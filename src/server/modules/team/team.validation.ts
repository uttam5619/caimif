import { z } from "zod";
import type { ParsedMultipartPayload } from "@/server/middlewares/multerUpload";
import { ValidationError } from "@/server/utils/errors/AppError";
import type { TeamCategory } from "../../../../prisma/generated/prisma/client";
import {
  TEAM_CATEGORIES,
  TEAM_DEFAULT_LIMIT,
  TEAM_DEFAULT_PAGE,
  TEAM_MAX_LIMIT,
} from "./team.constants";
import type {
  ListTeamQuery,
  ValidatedCreateTeamInput,
  ValidatedUpdateTeamInput,
} from "./team.types";

const listTeamQuerySchema = z.object({
  category: z.enum(TEAM_CATEGORIES).optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(TEAM_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(TEAM_MAX_LIMIT)
    .default(TEAM_DEFAULT_LIMIT),
});

const optionalEmailSchema = z.string().email("Email must be a valid email address.");

/**
 * Parses and validates a Team member CUID/string ID from dynamic route params.
 */
export function parseTeamId(rawId: string): string {
  const trimmed = rawId.trim();
  if (!trimmed || trimmed.length > 191 || !/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    throw new ValidationError("Invalid team member ID.");
  }
  return trimmed;
}

/**
 * Validates and normalizes the required `TeamCategory` enum value.
 */
function parseTeamCategory(rawValue: string | undefined): TeamCategory {
  const normalized = (rawValue ?? "").trim().toUpperCase();
  if (!normalized) {
    throw new ValidationError("Category is required.");
  }

  if (!TEAM_CATEGORIES.includes(normalized as TeamCategory)) {
    throw new ValidationError(
      `Category must be one of: ${TEAM_CATEGORIES.join(", ")}.`
    );
  }

  return normalized as TeamCategory;
}

/**
 * Normalizes optional bounded VARCHAR(191) string fields from multipart FormData.
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
 * Normalizes optional unbounded `@db.Text` fields from multipart FormData.
 */
function parseOptionalLongText(rawValue: string | undefined): string | null {
  const trimmed = (rawValue ?? "").trim();
  return trimmed || null;
}

/**
 * Validates an optional email address while normalizing blank strings to `null`
 * so multiple team members without an email do not violate MySQL's `@unique` index.
 */
function parseOptionalEmail(rawValue: string | undefined): string | null {
  const trimmed = (rawValue ?? "").trim();
  if (!trimmed) return null;

  if (trimmed.length > 191) {
    throw new ValidationError("Email cannot exceed 191 characters.");
  }

  const parsed = optionalEmailSchema.safeParse(trimmed);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Email must be a valid email address."
    );
  }

  return trimmed.toLowerCase();
}

/**
 * Parses JSON string-array attributes (`specializations`, `certifications`) from FormData.
 * Supports either a serialized JSON array (e.g. `["AI","ML"]`) or comma/newline-delimited text
 * so API clients and admin forms both integrate cleanly.
 */
function parseStringListJsonField(
  rawValue: string | undefined,
  label: string
): string[] | null {
  const trimmed = (rawValue ?? "").trim();
  if (!trimmed) return null;

  let rawItems: unknown[];
  if (trimmed.startsWith("[")) {
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(trimmed);
    } catch {
      throw new ValidationError(`${label} must be a valid JSON array of strings.`);
    }

    if (!Array.isArray(parsedJson)) {
      throw new ValidationError(`${label} must be a JSON array.`);
    }
    rawItems = parsedJson;
  } else {
    rawItems = trimmed.split(/[\n,]+/);
  }

  const cleaned: string[] = [];
  const seen = new Set<string>();

  for (const entry of rawItems) {
    if (typeof entry !== "string") {
      throw new ValidationError(`Each entry in ${label} must be a string.`);
    }
    const item = entry.trim();
    if (!item) continue;

    // Deduplicate case-insensitively while preserving the first entered casing
    const dedupeKey = item.toLowerCase();
    if (!seen.has(dedupeKey)) {
      seen.add(dedupeKey);
      cleaned.push(item);
    }
  }

  return cleaned.length > 0 ? cleaned : null;
}

/**
 * Validates a Multer-parsed multipart payload for creating a Team member record.
 */
export function validateCreateTeamMultipart(
  multipart: ParsedMultipartPayload
): ValidatedCreateTeamInput {
  const category = parseTeamCategory(multipart.fields.category);

  const name = (multipart.fields.name ?? "").trim();
  if (!name) {
    throw new ValidationError("Member name is required.");
  }
  if (name.length > 191) {
    throw new ValidationError("Member name cannot exceed 191 characters.");
  }

  const designation = parseOptionalBoundedText(
    multipart.fields.designation,
    "Designation"
  );
  const about = parseOptionalLongText(multipart.fields.about);
  const school = parseOptionalBoundedText(multipart.fields.school, "School");
  const department = parseOptionalBoundedText(
    multipart.fields.department,
    "Department"
  );
  const email = parseOptionalEmail(multipart.fields.email);
  const qualification = parseOptionalLongText(multipart.fields.qualification);
  const specializations = parseStringListJsonField(
    multipart.fields.specializations,
    "Specializations"
  );
  const certifications = parseStringListJsonField(
    multipart.fields.certifications,
    "Certifications"
  );
  const areaOfInterest = parseOptionalLongText(multipart.fields.areaOfInterest);

  return {
    imageFile: multipart.files.image ?? null,
    category,
    name,
    designation,
    about,
    school,
    department,
    email,
    qualification,
    specializations,
    certifications,
    areaOfInterest,
  };
}

/**
 * Validates a Multer-parsed multipart payload for updating an existing Team member record.
 */
export function validateUpdateTeamMultipart(
  multipart: ParsedMultipartPayload
): ValidatedUpdateTeamInput {
  const hasField = (fieldName: string) =>
    Object.prototype.hasOwnProperty.call(multipart.fields, fieldName);

  const category = hasField("category")
    ? parseTeamCategory(multipart.fields.category)
    : undefined;

  let name: string | undefined;
  if (hasField("name")) {
    const trimmed = multipart.fields.name.trim();
    if (!trimmed) {
      throw new ValidationError("Member name cannot be empty.");
    }
    if (trimmed.length > 191) {
      throw new ValidationError("Member name cannot exceed 191 characters.");
    }
    name = trimmed;
  }

  const designation = hasField("designation")
    ? parseOptionalBoundedText(multipart.fields.designation, "Designation")
    : undefined;
  const about = hasField("about")
    ? parseOptionalLongText(multipart.fields.about)
    : undefined;
  const school = hasField("school")
    ? parseOptionalBoundedText(multipart.fields.school, "School")
    : undefined;
  const department = hasField("department")
    ? parseOptionalBoundedText(multipart.fields.department, "Department")
    : undefined;
  const email = hasField("email")
    ? parseOptionalEmail(multipart.fields.email)
    : undefined;
  const qualification = hasField("qualification")
    ? parseOptionalLongText(multipart.fields.qualification)
    : undefined;
  const specializations = hasField("specializations")
    ? parseStringListJsonField(multipart.fields.specializations, "Specializations")
    : undefined;
  const certifications = hasField("certifications")
    ? parseStringListJsonField(multipart.fields.certifications, "Certifications")
    : undefined;
  const areaOfInterest = hasField("areaOfInterest")
    ? parseOptionalLongText(multipart.fields.areaOfInterest)
    : undefined;

  const removeImage = multipart.fields.removeImage === "true";
  const imageFile = multipart.files.image ?? null;

  if (
    category === undefined &&
    name === undefined &&
    designation === undefined &&
    about === undefined &&
    school === undefined &&
    department === undefined &&
    email === undefined &&
    qualification === undefined &&
    specializations === undefined &&
    certifications === undefined &&
    areaOfInterest === undefined &&
    !imageFile &&
    !removeImage
  ) {
    throw new ValidationError("At least one field must be provided to update.");
  }

  return {
    imageFile,
    removeImage,
    category,
    name,
    designation,
    about,
    school,
    department,
    email,
    qualification,
    specializations,
    certifications,
    areaOfInterest,
  };
}

/**
 * Validates URL query parameters for listing Team member records.
 */
export function validateListTeamQuery(
  searchParams: URLSearchParams
): ListTeamQuery {
  const rawCategory = searchParams.get("category");
  const rawQuery = {
    category: rawCategory ? rawCategory.trim().toUpperCase() : undefined,
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listTeamQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid query parameters.",
      parsed.error.issues
    );
  }

  return parsed.data;
}
