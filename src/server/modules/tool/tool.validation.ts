import { z } from "zod";
import type { ParsedMultipartPayload } from "@/server/middlewares/multerUpload";
import { ValidationError } from "@/server/utils/errors/AppError";
import {
  TOOL_DEFAULT_LIMIT,
  TOOL_DEFAULT_PAGE,
  TOOL_MAX_LIMIT,
} from "./tool.constants";
import type {
  CreateToolTypeInput,
  ListToolsQuery,
  ListToolTypesQuery,
  UpdateToolTypeInput,
  ValidatedCreateToolInput,
  ValidatedUpdateToolInput,
} from "./tool.types";

const listToolTypesQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(TOOL_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(TOOL_MAX_LIMIT)
    .default(TOOL_DEFAULT_LIMIT),
});

const listToolsQuerySchema = z.object({
  toolTypeId: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(TOOL_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(TOOL_MAX_LIMIT)
    .default(TOOL_DEFAULT_LIMIT),
});

const createToolTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tool type name is required.")
    .max(191, "Tool type name cannot exceed 191 characters."),
});

const updateToolTypeSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Tool type name cannot be empty.")
      .max(191, "Tool type name cannot exceed 191 characters.")
      .optional(),
  })
  .refine((data) => data.name !== undefined, {
    message: "At least one field must be provided to update.",
  });

const toolTextFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Tool title is required.")
    .max(191, "Tool title cannot exceed 191 characters."),
  version: z
    .string()
    .trim()
    .min(1, "Tool version is required.")
    .max(191, "Tool version cannot exceed 191 characters."),
  description: z.string().trim().min(1, "Tool description is required."),
  toolTypeId: z
    .string()
    .trim()
    .min(1, "Tool type ID is required.")
    .max(191, "Tool type ID cannot exceed 191 characters."),
});

/**
 * Validates and trims a required entity ID route parameter (`ToolType` or `Tool`).
 */
export function parseToolEntityId(rawId: string, label = "ID"): string {
  const trimmed = (rawId ?? "").trim();
  if (!trimmed) {
    throw new ValidationError(`${label} is required.`);
  }
  return trimmed;
}

/**
 * Validates URL query parameters for listing `ToolType` records.
 */
export function validateListToolTypesQuery(
  searchParams: URLSearchParams
): ListToolTypesQuery {
  const rawQuery = {
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listToolTypesQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid tool type query parameters.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates JSON payload for creating a `ToolType`.
 */
export function validateCreateToolTypePayload(
  body: unknown
): CreateToolTypeInput {
  const parsed = createToolTypeSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid tool type payload.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates JSON payload for partially updating a `ToolType`.
 */
export function validateUpdateToolTypePayload(
  body: unknown
): UpdateToolTypeInput {
  const parsed = updateToolTypeSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid tool type update payload.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates URL query parameters for listing `Tool` records.
 */
export function validateListToolsQuery(
  searchParams: URLSearchParams
): ListToolsQuery {
  const rawQuery = {
    toolTypeId: searchParams.get("toolTypeId") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listToolsQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid tool query parameters.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates multipart or normalized JSON input for creating a new `Tool`.
 * Accepts either an uploaded `image` file or a non-empty `image` / `imageKey` string.
 */
export function validateCreateToolPayload(
  payload: ParsedMultipartPayload
): ValidatedCreateToolInput {
  const parsedFields = toolTextFieldsSchema.safeParse({
    title: payload.fields.title ?? "",
    version: payload.fields.version ?? "",
    description: payload.fields.description ?? "",
    toolTypeId: payload.fields.toolTypeId ?? "",
  });

  if (!parsedFields.success) {
    throw new ValidationError(
      parsedFields.error.issues[0]?.message ?? "Invalid tool payload.",
      parsedFields.error.issues
    );
  }

  const imageFile = payload.files.image ?? null;
  const rawImageKey = (
    payload.fields.image ??
    payload.fields.imageKey ??
    ""
  ).trim();

  if (!imageFile && !rawImageKey) {
    throw new ValidationError("Tool image is required.");
  }

  if (rawImageKey.length > 191) {
    throw new ValidationError("Tool image key cannot exceed 191 characters.");
  }

  return {
    title: parsedFields.data.title,
    version: parsedFields.data.version,
    description: parsedFields.data.description,
    toolTypeId: parsedFields.data.toolTypeId,
    imageFile,
    imageKey: imageFile ? null : rawImageKey,
  };
}

/**
 * Validates multipart or normalized JSON input for partially updating an existing `Tool`.
 */
export function validateUpdateToolPayload(
  payload: ParsedMultipartPayload
): ValidatedUpdateToolInput {
  const hasField = (name: string) =>
    Object.prototype.hasOwnProperty.call(payload.fields, name);

  let title: string | undefined;
  if (hasField("title")) {
    const trimmed = payload.fields.title.trim();
    if (!trimmed) {
      throw new ValidationError("Tool title cannot be empty.");
    }
    if (trimmed.length > 191) {
      throw new ValidationError("Tool title cannot exceed 191 characters.");
    }
    title = trimmed;
  }

  let version: string | undefined;
  if (hasField("version")) {
    const trimmed = payload.fields.version.trim();
    if (!trimmed) {
      throw new ValidationError("Tool version cannot be empty.");
    }
    if (trimmed.length > 191) {
      throw new ValidationError("Tool version cannot exceed 191 characters.");
    }
    version = trimmed;
  }

  let description: string | undefined;
  if (hasField("description")) {
    const trimmed = payload.fields.description.trim();
    if (!trimmed) {
      throw new ValidationError("Tool description cannot be empty.");
    }
    description = trimmed;
  }

  let toolTypeId: string | undefined;
  if (hasField("toolTypeId")) {
    const trimmed = payload.fields.toolTypeId.trim();
    if (!trimmed) {
      throw new ValidationError("Tool type ID cannot be empty.");
    }
    if (trimmed.length > 191) {
      throw new ValidationError("Tool type ID cannot exceed 191 characters.");
    }
    toolTypeId = trimmed;
  }

  const imageFile = payload.files.image ?? null;
  let imageKey: string | undefined;
  const imageFieldName = hasField("image")
    ? "image"
    : hasField("imageKey")
      ? "imageKey"
      : null;

  if (!imageFile && imageFieldName !== null) {
    const trimmed = payload.fields[imageFieldName].trim();
    if (!trimmed) {
      throw new ValidationError("Tool image cannot be empty.");
    }
    if (trimmed.length > 191) {
      throw new ValidationError("Tool image key cannot exceed 191 characters.");
    }
    imageKey = trimmed;
  }

  if (
    title === undefined &&
    version === undefined &&
    description === undefined &&
    toolTypeId === undefined &&
    imageFile === null &&
    imageKey === undefined
  ) {
    throw new ValidationError("At least one field must be provided to update.");
  }

  return {
    title,
    version,
    description,
    toolTypeId,
    imageFile,
    imageKey,
  };
}
