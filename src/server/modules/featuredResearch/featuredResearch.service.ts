import type { ParsedMultipartPayload } from "@/server/middlewares/multerUpload";
import { NotFoundError } from "@/server/utils/errors/AppError";
import {
  deleteFromS3,
  resolveS3ReadUrl,
  uploadMulterFileToS3,
} from "@/server/utils/storage/s3Storage";
import type { FeaturedResearch } from "../../../../prisma/generated/prisma/client";
import { FEATURED_RESEARCH_S3_KEY_PREFIX } from "./featuredResearch.constants";
import { featuredResearchRepository } from "./featuredResearch.repository";
import type {
  FeaturedResearchDto,
  ListFeaturedResearchQuery,
  PaginatedFeaturedResearchDto,
} from "./featuredResearch.types";
import {
  validateCreateFeaturedResearchMultipart,
  validateUpdateFeaturedResearchMultipart,
} from "./featuredResearch.validation";

/**
 * Converts a Prisma `FeaturedResearch` entity into a serialized API DTO,
 * resolving its stored S3 `imageKey` into a readable URL gracefully.
 */
async function toFeaturedResearchDto(
  record: FeaturedResearch
): Promise<FeaturedResearchDto> {
  let imageUrl: string | undefined;
  try {
    imageUrl = await resolveS3ReadUrl(record.imageKey);
  } catch (error: unknown) {
    console.warn(
      "[FeaturedResearchService] Unable to resolve S3 image URL:",
      record.id,
      error instanceof Error ? error.message : error
    );
  }

  return {
    id: record.id,
    imageKey: record.imageKey,
    imageUrl,
    authorName: record.authorName,
    title: record.title,
    description: record.description,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Service layer managing FeaturedResearch workflows, Multer -> S3 image uploads,
 * S3 rollback/cleanup, and DTO serialization.
 */
export const featuredResearchService = {
  /**
   * Retrieves paginated featured research records filtered by optional search text.
   */
  async listFeaturedResearch(
    query: ListFeaturedResearchQuery
  ): Promise<PaginatedFeaturedResearchDto> {
    const { items, total } =
      await featuredResearchRepository.findManyPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));
    const dtos = await Promise.all(
      items.map((item) => toFeaturedResearchDto(item))
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

  /**
   * Retrieves a single featured research record by ID, throwing 404 if missing.
   */
  async getFeaturedResearchById(id: string): Promise<FeaturedResearchDto> {
    const record = await featuredResearchRepository.findById(id);
    if (!record) {
      throw new NotFoundError("Featured research record not found.");
    }
    return toFeaturedResearchDto(record);
  },

  /**
   * Validates multipart form submission, uploads the required image to S3,
   * and persists the record in MySQL (rolling back S3 on DB failure).
   */
  async createFeaturedResearch(
    multipart: ParsedMultipartPayload
  ): Promise<FeaturedResearchDto> {
    const validated = validateCreateFeaturedResearchMultipart(multipart);

    let uploadedImageKey = "";
    try {
      if (validated.imageFile) {
        uploadedImageKey = await uploadMulterFileToS3(
          validated.imageFile,
          FEATURED_RESEARCH_S3_KEY_PREFIX
        );
      }

      const created = await featuredResearchRepository.create({
        imageKey: uploadedImageKey,
        authorName: validated.authorName,
        title: validated.title,
        description: validated.description,
      });

      return toFeaturedResearchDto(created);
    } catch (error: unknown) {
      // Clean up orphaned S3 object if database persistence fails
      if (uploadedImageKey) {
        await deleteFromS3(uploadedImageKey);
      }
      throw error;
    }
  },

  /**
   * Updates an existing featured research record, uploading a replacement image to S3
   * when provided and cleaning up the previous S3 object after DB persistence succeeds.
   */
  async updateFeaturedResearch(
    id: string,
    multipart: ParsedMultipartPayload
  ): Promise<FeaturedResearchDto> {
    const existing = await featuredResearchRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Featured research record not found.");
    }

    const validated = validateUpdateFeaturedResearchMultipart(multipart);

    let newlyUploadedKey: string | null = null;
    let keyToCleanupAfterSave: string | null = null;

    try {
      if (validated.imageFile) {
        newlyUploadedKey = await uploadMulterFileToS3(
          validated.imageFile,
          FEATURED_RESEARCH_S3_KEY_PREFIX
        );
        if (existing.imageKey) {
          keyToCleanupAfterSave = existing.imageKey;
        }
      }

      const updated = await featuredResearchRepository.update(id, {
        ...(newlyUploadedKey !== null ? { imageKey: newlyUploadedKey } : {}),
        ...(validated.authorName !== undefined
          ? { authorName: validated.authorName }
          : {}),
        ...(validated.title !== undefined ? { title: validated.title } : {}),
        ...(validated.description !== undefined
          ? { description: validated.description }
          : {}),
      });

      if (keyToCleanupAfterSave) {
        await deleteFromS3(keyToCleanupAfterSave);
      }

      return toFeaturedResearchDto(updated);
    } catch (error: unknown) {
      if (newlyUploadedKey) {
        await deleteFromS3(newlyUploadedKey);
      }
      throw error;
    }
  },

  /**
   * Verifies record existence, deletes the featured research record, and removes its S3 image.
   */
  async deleteFeaturedResearch(id: string): Promise<void> {
    const existing = await featuredResearchRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Featured research record not found.");
    }

    await featuredResearchRepository.delete(id);
    await deleteFromS3(existing.imageKey);
  },
};
