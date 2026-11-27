import { z } from "zod";
import { ValidationError } from "@/server/utils/errors/AppError";
import {
  CONTACT_DEFAULT_LIMIT,
  CONTACT_DEFAULT_PAGE,
  CONTACT_MAX_LIMIT,
} from "./contact.constants";
import type {
  CreateContactInquiryInput,
  ListContactInquiriesQuery,
} from "./contact.types";

const listContactInquiriesQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(CONTACT_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(CONTACT_MAX_LIMIT)
    .default(CONTACT_DEFAULT_LIMIT),
});

const createContactInquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(191, "Name cannot exceed 191 characters."),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(191, "Email cannot exceed 191 characters."),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required.")
    .max(191, "Subject cannot exceed 191 characters."),
  message: z.string().trim().min(1, "Message is required."),
});

export function parseContactInquiryId(rawId: string): string {
  const trimmed = (rawId ?? "").trim();
  if (!trimmed) {
    throw new ValidationError("Contact inquiry ID is required.");
  }
  return trimmed;
}

export function validateCreateContactInquiryPayload(
  body: unknown
): CreateContactInquiryInput {
  const parsed = createContactInquirySchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid contact inquiry payload.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

export function validateListContactInquiriesQuery(
  searchParams: URLSearchParams
): ListContactInquiriesQuery {
  const rawQuery = {
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listContactInquiriesQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ??
        "Invalid contact inquiry query parameters.",
      parsed.error.issues
    );
  }
  return parsed.data;
}
