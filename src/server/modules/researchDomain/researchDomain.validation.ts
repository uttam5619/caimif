import { z } from "zod";
import type { ParsedMultipartPayload } from "@/server/middlewares/multerUpload";
import { ValidationError } from "@/server/utils/errors/AppError";
import type {
  CreateFieldInput,
  CustomFieldValues,
  DomainFieldDto,
  UpdateFieldInput,
  ValidatedDomainSubmission,
} from "./researchDomain.types";

const FIELD_TYPES = [
  "text",
  "textarea",
  "number",
  "url",
  "file",
  "date",
  "select",
  "email",
] as const;

const IDENTIFIER_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/;

export const createFieldSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "uniqueIdentifier must be at least 2 characters.")
    .max(64, "uniqueIdentifier cannot exceed 64 characters.")
    .regex(
      IDENTIFIER_REGEX,
      "uniqueIdentifier must start with a letter and contain only letters, numbers, or underscores."
    ),
  label: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(100, "Title cannot exceed 100 characters."),
  type: z.enum(FIELD_TYPES),
  placeholder: z
    .string()
    .trim()
    .min(1, "placeHolder is required.")
    .max(200, "placeHolder cannot exceed 200 characters."),
  required: z.boolean(),
  description: z.string().trim().max(500).optional(),
});

export const updateFieldSchema = createFieldSchema.partial();

/**
 * Parses and validates JSON input for creating a domain schema field.
 */
export function validateCreateFieldPayload(raw: unknown): CreateFieldInput {
  const parsed = createFieldSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid field configuration.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Parses and validates JSON input for updating an existing domain schema field.
 */
export function validateUpdateFieldPayload(raw: unknown): UpdateFieldInput {
  const parsed = updateFieldSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid field update payload.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates a single scalar string value against its configured DomainFieldType.
 */
function parseScalarValue(
  field: DomainFieldDto,
  rawValue: string
): string | number {
  const trimmed = rawValue.trim();

  if (field.type === "number") {
    const num = Number(trimmed);
    if (!Number.isFinite(num)) {
      throw new ValidationError(`"${field.label}" must be a valid number.`);
    }
    return num;
  }

  if (field.type === "url") {
    try {
      const parsedUrl = new URL(trimmed);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        throw new Error("Unsupported protocol");
      }
    } catch {
      throw new ValidationError(
        `"${field.label}" must be a valid http(s) URL.`
      );
    }
  }

  if (field.type === "email") {
    const emailCheck = z.string().email().safeParse(trimmed);
    if (!emailCheck.success) {
      throw new ValidationError(
        `"${field.label}" must be a valid email address.`
      );
    }
  }

  return trimmed;
}

/**
 * Dynamically validates a Multer-parsed multipart submission against the active
 * ResearchDomainField definitions stored in the database.
 */
export function validateMultipartDomainSubmission(
  multipart: ParsedMultipartPayload,
  activeFields: DomainFieldDto[],
  options: {
    isUpdate?: boolean;
    existingCustomFields?: CustomFieldValues;
    hasExistingImage?: boolean;
  } = {}
): ValidatedDomainSubmission {
  const isUpdate = options.isUpdate ?? false;
  const removeImage = multipart.fields.removeImage === "true";

  let title = "";
  let shortDescription = "";
  let description = "";
  let imageFile: Express.Multer.File | null = null;
  const customTextValues: CustomFieldValues = isUpdate
    ? { ...(options.existingCustomFields ?? {}) }
    : {};
  const customFiles: Record<string, Express.Multer.File> = {};

  for (const field of activeFields) {
    // Handle file-type fields parsed by Multer (`image` or custom `file` fields)
    if (field.type === "file") {
      const uploadedFile = multipart.files[field.name];
      if (uploadedFile && uploadedFile.size > 0) {
        if (field.name === "image") {
          imageFile = uploadedFile;
        } else {
          customFiles[field.name] = uploadedFile;
        }
        continue;
      }

      const hasPreservedFile =
        isUpdate &&
        ((field.name === "image" && options.hasExistingImage && !removeImage) ||
          (field.name !== "image" && Boolean(customTextValues[field.name])));

      if (field.required && !hasPreservedFile) {
        throw new ValidationError(
          `Please upload the required field: ${field.label}.`
        );
      }
      continue;
    }

    // Handle string/scalar inputs from `multipart.fields`
    const hasKey = Object.prototype.hasOwnProperty.call(
      multipart.fields,
      field.name
    );
    const rawVal = multipart.fields[field.name];
    const stringVal = typeof rawVal === "string" ? rawVal.trim() : "";

    if (!stringVal) {
      if (field.required) {
        throw new ValidationError(
          `Please fill in the required field: ${field.label}.`
        );
      }

      if (
        isUpdate &&
        hasKey &&
        field.name !== "title" &&
        field.name !== "shortDescription" &&
        field.name !== "description"
      ) {
        delete customTextValues[field.name];
      }
      continue;
    }

    const parsed = parseScalarValue(field, stringVal);

    if (field.name === "title") {
      title = String(parsed);
    } else if (field.name === "shortDescription") {
      shortDescription = String(parsed);
    } else if (field.name === "description") {
      description = String(parsed);
    } else {
      customTextValues[field.name] = parsed;
    }
  }

  // Fallback for core DB columns if an admin deleted a system field from the active form schema
  const activeFieldNames = new Set(activeFields.map((f) => f.name));
  if (!title) {
    if (activeFieldNames.has("title")) {
      throw new ValidationError("Domain Title is required.");
    }
    title = `Domain-${Date.now()}`;
  }

  return {
    title,
    shortDescription,
    description,
    imageFile,
    removeImage,
    customTextValues,
    customFiles,
  };
}
