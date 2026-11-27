import { z } from "zod";
import type { ParsedMultipartPayload } from "@/server/middlewares/multerUpload";
import { ValidationError } from "@/server/utils/errors/AppError";
import {
  GALLERY_DEFAULT_LIMIT,
  GALLERY_DEFAULT_PAGE,
  GALLERY_MAX_LIMIT,
} from "./gallery.constants";
import type {
  CreateGalleryInput,
  ListGalleriesQuery,
  ListGalleryImagesQuery,
  UpdateGalleryInput,
  ValidatedCreateGalleryImageInput,
  ValidatedUpdateGalleryImageInput,
} from "./gallery.types";

const listGalleriesQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(GALLERY_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(GALLERY_MAX_LIMIT)
    .default(GALLERY_DEFAULT_LIMIT),
});

const listGalleryImagesQuerySchema = z.object({
  galleryId: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(GALLERY_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(GALLERY_MAX_LIMIT)
    .default(GALLERY_DEFAULT_LIMIT),
});

const createGallerySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Gallery title is required.")
    .max(191, "Gallery title cannot exceed 191 characters."),
  description: z
    .union([z.string(), z.null()])
    .optional()
    .transform((value) => {
      if (value === null || value === undefined) return null;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }),
});

const updateGallerySchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Gallery title cannot be empty.")
      .max(191, "Gallery title cannot exceed 191 characters.")
      .optional(),
    description: z
      .union([z.string(), z.null()])
      .optional()
      .transform((value) => {
        if (value === undefined) return undefined;
        if (value === null) return null;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
      }),
  })
  .refine(
    (data) => data.title !== undefined || data.description !== undefined,
    { message: "At least one field must be provided to update." }
  );

/**
 * Validates and trims a required entity ID parameter (`Gallery` or `GalleryImage`).
 */
export function parseGalleryEntityId(rawId: string, label = "ID"): string {
  const trimmed = (rawId ?? "").trim();
  if (!trimmed) {
    throw new ValidationError(`${label} is required.`);
  }
  return trimmed;
}

/**
 * Validates JSON body payload for creating a `Gallery` album.
 */
export function validateCreateGalleryPayload(body: unknown): CreateGalleryInput {
  const parsed = createGallerySchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid gallery payload.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates JSON body payload for partially updating a `Gallery` album.
 */
export function validateUpdateGalleryPayload(body: unknown): UpdateGalleryInput {
  const parsed = updateGallerySchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid gallery update payload.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates URL query parameters for listing `Gallery` albums.
 */
export function validateListGalleriesQuery(
  searchParams: URLSearchParams
): ListGalleriesQuery {
  const rawQuery = {
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listGalleriesQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid gallery query parameters.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates URL query parameters for listing `GalleryImage` records.
 */
export function validateListGalleryImagesQuery(
  searchParams: URLSearchParams,
  boundGalleryId?: string
): ListGalleryImagesQuery {
  const rawQuery = {
    galleryId: boundGalleryId ?? searchParams.get("galleryId") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = listGalleryImagesQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ??
        "Invalid gallery image query parameters.",
      parsed.error.issues
    );
  }
  return parsed.data;
}

/**
 * Validates a Multer-parsed multipart payload for uploading a new `GalleryImage`.
 */
export function validateCreateGalleryImageMultipart(
  multipart: ParsedMultipartPayload,
  boundGalleryId?: string
): ValidatedCreateGalleryImageInput {
  const galleryId = (boundGalleryId ?? multipart.fields.galleryId ?? "").trim();
  if (!galleryId) {
    throw new ValidationError("Gallery ID is required.");
  }

  const imageFile = multipart.files.image ?? null;
  if (!imageFile) {
    throw new ValidationError("Image file is required.");
  }

  const rawDescription = (multipart.fields.description ?? "").trim();

  return {
    galleryId,
    description: rawDescription || null,
    imageFile,
  };
}

/**
 * Validates a Multer-parsed multipart payload for updating an existing `GalleryImage`.
 */
export function validateUpdateGalleryImageMultipart(
  multipart: ParsedMultipartPayload
): ValidatedUpdateGalleryImageInput {
  const hasField = (name: string) =>
    Object.prototype.hasOwnProperty.call(multipart.fields, name);

  let galleryId: string | undefined;
  if (hasField("galleryId")) {
    const trimmed = multipart.fields.galleryId.trim();
    if (!trimmed) {
      throw new ValidationError("Gallery ID cannot be empty.");
    }
    galleryId = trimmed;
  }

  let description: string | null | undefined;
  if (hasField("description")) {
    const trimmed = multipart.fields.description.trim();
    description = trimmed || null;
  }

  const imageFile = multipart.files.image ?? null;

  if (
    galleryId === undefined &&
    description === undefined &&
    imageFile === null
  ) {
    throw new ValidationError("At least one field must be provided to update.");
  }

  return {
    galleryId,
    description,
    imageFile,
  };
}
