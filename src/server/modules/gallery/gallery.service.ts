import type { ParsedMultipartPayload } from "@/server/middlewares/multerUpload";
import { NotFoundError } from "@/server/utils/errors/AppError";
import {
  deleteFromS3,
  resolveS3ReadUrl,
  uploadMulterFileToS3,
} from "@/server/utils/storage/s3Storage";
import type { GalleryImage } from "../../../../prisma/generated/prisma/client";
import { GALLERY_S3_KEY_PREFIX } from "./gallery.constants";
import {
  galleryRepository,
  type GalleryWithImages,
} from "./gallery.repository";
import type {
  CreateGalleryInput,
  GalleryDto,
  GalleryImageDto,
  ListGalleriesQuery,
  ListGalleryImagesQuery,
  PaginatedGalleriesDto,
  PaginatedGalleryImagesDto,
  UpdateGalleryInput,
} from "./gallery.types";
import {
  validateCreateGalleryImageMultipart,
  validateUpdateGalleryImageMultipart,
} from "./gallery.validation";

/**
 * Serializes a Prisma `GalleryImage` entity into a DTO with resolved S3 URL.
 */
async function toGalleryImageDto(
  record: GalleryImage
): Promise<GalleryImageDto> {
  let imageUrl: string | undefined;
  try {
    imageUrl = await resolveS3ReadUrl(record.image);
  } catch (error: unknown) {
    console.warn(
      "[GalleryService] Unable to resolve S3 image URL:",
      record.id,
      error instanceof Error ? error.message : error
    );
  }

  return {
    id: record.id,
    imageKey: record.image,
    imageUrl,
    description: record.description,
    galleryId: record.galleryId,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Serializes a Prisma `Gallery` album with nested `GalleryImage` DTOs.
 */
async function toGalleryDto(record: GalleryWithImages): Promise<GalleryDto> {
  const images = await Promise.all(
    record.images.map((image) => toGalleryImageDto(image))
  );

  return {
    id: record.id,
    title: record.title,
    description: record.description,
    imageCount: images.length,
    images,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Service layer managing `Gallery` albums and `GalleryImage` S3 uploads,
 * cascade S3 cleanups, and domain validations.
 */
export const galleryService = {
  async listGalleries(
    query: ListGalleriesQuery
  ): Promise<PaginatedGalleriesDto> {
    const { items, total } =
      await galleryRepository.findGalleriesPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));
    const dtos = await Promise.all(items.map((item) => toGalleryDto(item)));

    return {
      items: dtos,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
      },
    };
  },

  async getGalleryById(id: string): Promise<GalleryDto> {
    const record = await galleryRepository.findGalleryById(id);
    if (!record) {
      throw new NotFoundError("Gallery album not found.");
    }
    return toGalleryDto(record);
  },

  async createGallery(input: CreateGalleryInput): Promise<GalleryDto> {
    const created = await galleryRepository.createGallery(input);
    return toGalleryDto(created);
  },

  async updateGallery(
    id: string,
    input: UpdateGalleryInput
  ): Promise<GalleryDto> {
    const existing = await galleryRepository.findGalleryById(id);
    if (!existing) {
      throw new NotFoundError("Gallery album not found.");
    }

    const updated = await galleryRepository.updateGallery(id, input);
    return toGalleryDto(updated);
  },

  /**
   * Deletes a gallery album and removes all cascaded child image objects from S3.
   */
  async deleteGallery(id: string): Promise<void> {
    const existing = await galleryRepository.findGalleryById(id);
    if (!existing) {
      throw new NotFoundError("Gallery album not found.");
    }

    const imageKeys = existing.images.map((img) => img.image);
    await galleryRepository.deleteGallery(id);

    if (imageKeys.length > 0) {
      await Promise.all(imageKeys.map((key) => deleteFromS3(key)));
    }
  },

  async listGalleryImages(
    query: ListGalleryImagesQuery
  ): Promise<PaginatedGalleryImagesDto> {
    if (query.galleryId) {
      const album = await galleryRepository.findGalleryById(query.galleryId);
      if (!album) {
        throw new NotFoundError("Gallery album not found.");
      }
    }

    const { items, total } = await galleryRepository.findImagesPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));
    const dtos = await Promise.all(
      items.map((item) => toGalleryImageDto(item))
    );

    return {
      items: dtos,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
      },
    };
  },

  async getGalleryImageById(id: string): Promise<GalleryImageDto> {
    const record = await galleryRepository.findImageById(id);
    if (!record) {
      throw new NotFoundError("Gallery image not found.");
    }
    return toGalleryImageDto(record);
  },

  /**
   * Validates multipart upload, confirms the target Gallery exists, uploads the
   * image to S3, and persists `GalleryImage` (rolling back S3 on DB failure).
   */
  async createGalleryImage(
    multipart: ParsedMultipartPayload,
    boundGalleryId?: string
  ): Promise<GalleryImageDto> {
    const validated = validateCreateGalleryImageMultipart(
      multipart,
      boundGalleryId
    );

    const album = await galleryRepository.findGalleryById(validated.galleryId);
    if (!album) {
      throw new NotFoundError("Gallery album not found.");
    }

    let uploadedImageKey: string | null = null;
    try {
      uploadedImageKey = await uploadMulterFileToS3(
        validated.imageFile,
        `${GALLERY_S3_KEY_PREFIX}${validated.galleryId}/`
      );

      const created = await galleryRepository.createImage({
        galleryId: validated.galleryId,
        image: uploadedImageKey,
        description: validated.description,
      });

      return toGalleryImageDto(created);
    } catch (error: unknown) {
      if (uploadedImageKey) {
        await deleteFromS3(uploadedImageKey);
      }
      throw error;
    }
  },

  /**
   * Updates an existing `GalleryImage`, uploading any replacement file to S3
   * and deleting the previous S3 asset only after DB persistence succeeds.
   */
  async updateGalleryImage(
    id: string,
    multipart: ParsedMultipartPayload
  ): Promise<GalleryImageDto> {
    const existing = await galleryRepository.findImageById(id);
    if (!existing) {
      throw new NotFoundError("Gallery image not found.");
    }

    const validated = validateUpdateGalleryImageMultipart(multipart);

    if (validated.galleryId && validated.galleryId !== existing.galleryId) {
      const targetAlbum = await galleryRepository.findGalleryById(
        validated.galleryId
      );
      if (!targetAlbum) {
        throw new NotFoundError("Target gallery album not found.");
      }
    }

    let newlyUploadedKey: string | null = null;
    try {
      const targetGalleryId = validated.galleryId ?? existing.galleryId;
      if (validated.imageFile) {
        newlyUploadedKey = await uploadMulterFileToS3(
          validated.imageFile,
          `${GALLERY_S3_KEY_PREFIX}${targetGalleryId}/`
        );
      }

      const updated = await galleryRepository.updateImage(id, {
        ...(validated.galleryId !== undefined
          ? { galleryId: validated.galleryId }
          : {}),
        ...(newlyUploadedKey !== null ? { image: newlyUploadedKey } : {}),
        ...(validated.description !== undefined
          ? { description: validated.description }
          : {}),
      });

      if (newlyUploadedKey && existing.image) {
        await deleteFromS3(existing.image);
      }

      return toGalleryImageDto(updated);
    } catch (error: unknown) {
      if (newlyUploadedKey) {
        await deleteFromS3(newlyUploadedKey);
      }
      throw error;
    }
  },

  /**
   * Verifies existence, deletes a `GalleryImage` record, and removes its S3 asset.
   */
  async deleteGalleryImage(id: string): Promise<void> {
    const existing = await galleryRepository.findImageById(id);
    if (!existing) {
      throw new NotFoundError("Gallery image not found.");
    }

    await galleryRepository.deleteImage(id);
    await deleteFromS3(existing.image);
  },
};
