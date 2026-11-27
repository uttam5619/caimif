import { z } from "zod";
import { ValidationError } from "@/server/utils/errors/AppError";
import {
  COLLABORATION_DEFAULT_LIMIT,
  COLLABORATION_DEFAULT_PAGE,
  COLLABORATION_MAX_LIMIT,
} from "./collaboration.constants";
import type {
  CreateCollaborationInput,
  ListCollaborationsQuery,
  UpdateCollaborationInput,
} from "./collaboration.types";

const listCollaborationsQuerySchema = z.object({
  type: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(COLLABORATION_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(COLLABORATION_MAX_LIMIT)
    .default(COLLABORATION_DEFAULT_LIMIT),
});

const requiredBoundedText = (label: string) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)
    .max(191, `${label} cannot exceed 191 characters.`);

const validDateSchema = z
  .union([z.string().trim().min(1), z.date()])
  .transform((value, ctx) => {
    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      ctx.addIssue({
        code: "custom",
        message: "Date must be a valid date/time.",
      });
      return z.NEVER;
    }
    return parsed;
  });

const createCollaborationSchema = z.object({
  firstParty: requiredBoundedText("First party"),
  secondParty: requiredBoundedText("Second party"),
  date: validDateSchema,
  leadingPerson: requiredBoundedText("Leading person"),
  type: requiredBoundedText("Collaboration type"),
  content: z
    .string({ error: "Content is required." })
    .trim()
    .min(1, "Content is required."),
});

const updateCollaborationSchema = z
  .object({
    firstParty: requiredBoundedText("First party").optional(),
    secondParty: requiredBoundedText("Second party").optional(),
    date: validDateSchema.optional(),
    leadingPerson: requiredBoundedText("Leading person").optional(),
    type: requiredBoundedText("Collaboration type").optional(),
    content: z
      .string()
      .trim()
      .min(1, "Content cannot be empty.")
      .optional(),
  })
  .refine(
    (data) =>
      data.firstParty !== undefined ||
      data.secondParty !== undefined ||
      data.date !== undefined ||
      data.leadingPerson !== undefined ||
      data.type !== undefined ||
      data.content !== undefined,
    { message: "At least one field must be provided to update." }
  );

/**
 * Validates and trims a required Collaboration record ID route parameter.
 */
export function parseCollaborationId(rawId: string): string {
  const trimmed = (rawId ?? "").trim();
  if (!trimmed) {
    throw new ValidationError("Collaboration ID is required.");
  }
  return trimmed;
}

/**
 * Validates JSON body payload for creating a `Collaboration` record.
 */
export function validateCreateCollaborationPayload(
  body: unknown
): CreateCollaborationInput {
  const parsed = createCollaborationSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid collaboration payload.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates JSON body payload for partially updating a `Collaboration` record.
 */
export function validateUpdateCollaborationPayload(
  body: unknown
): UpdateCollaborationInput {
  const parsed = updateCollaborationSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ??
        "Invalid collaboration update payload.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates URL query parameters for listing Collaboration records.
 */
export function validateListCollaborationsQuery(
  searchParams: URLSearchParams
): ListCollaborationsQuery {
  const rawQuery = {
    type: searchParams.get("type") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listCollaborationsQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ??
        "Invalid collaboration query parameters.",
      parsed.error.issues
    );
  }
  return parsed.data;
}
