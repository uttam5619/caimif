import type { ParsedMultipartPayload } from "@/server/middlewares/multerUpload";
import { NotFoundError } from "@/server/utils/errors/AppError";
import {
  deleteFromS3,
  resolveS3ReadUrl,
  uploadMulterFileToS3,
} from "@/server/utils/storage/s3Storage";
import type { Training } from "../../../../prisma/generated/prisma/client";
import { TRAINING_S3_KEY_PREFIX } from "./training.constants";
import { trainingRepository } from "./training.repository";
import type {
  ListTrainingsQuery,
  PaginatedTrainingsDto,
  TrainingDto,
} from "./training.types";
import {
  validateCreateTrainingMultipart,
  validateUpdateTrainingMultipart,
} from "./training.validation";

/**
 * Converts a Prisma `Training` entity into a serialized API DTO,
 * resolving any stored S3 object key gracefully.
 */
async function toTrainingDto(record: Training): Promise<TrainingDto> {
  let imageUrl: string | undefined;
  try {
    imageUrl = await resolveS3ReadUrl(record.image);
  } catch (error: unknown) {
    console.warn(
      "[TrainingService] Unable to resolve S3 image URL:",
      record.id,
      error instanceof Error ? error.message : error
    );
  }

  return {
    id: record.id,
    title: record.title,
    shortDescription: record.shortDescription,
    description: record.description,
    imageKey: record.image ?? undefined,
    imageUrl,
    startDate: record.startDate.toISOString(),
    endDate: record.endDate.toISOString(),
    isRegistrationOpen: record.isRegistrationOpen,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Service layer managing Training workflows, Multer -> S3 image uploads, and DTO mapping.
 */
export const trainingService = {
  /**
   * Retrieves paginated training records filtered by optional registration status or search text.
   */
  async listTrainings(
    query: ListTrainingsQuery
  ): Promise<PaginatedTrainingsDto> {
    const { items, total } = await trainingRepository.findManyPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));
    const dtos = await Promise.all(items.map((item) => toTrainingDto(item)));

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
   * Retrieves a single training record by ID, throwing 404 if missing.
   */
  async getTrainingById(id: number): Promise<TrainingDto> {
    const record = await trainingRepository.findById(id);
    if (!record) {
      throw new NotFoundError("Training record not found.");
    }
    return toTrainingDto(record);
  },

  /**
   * Validates multipart form submission, uploads optional cover image to S3,
   * and persists the training record in MySQL (rolling back S3 on DB failure).
   */
  async createTraining(multipart: ParsedMultipartPayload): Promise<TrainingDto> {
    const validated = validateCreateTrainingMultipart(multipart);

    let imageS3Key: string | null = null;
    try {
      if (validated.imageFile) {
        imageS3Key = await uploadMulterFileToS3(
          validated.imageFile,
          TRAINING_S3_KEY_PREFIX
        );
      }

      const created = await trainingRepository.create({
        title: validated.title,
        shortDescription: validated.shortDescription,
        description: validated.description,
        image: imageS3Key,
        startDate: validated.startDate,
        endDate: validated.endDate,
        isRegistrationOpen: validated.isRegistrationOpen,
      });

      return toTrainingDto(created);
    } catch (error: unknown) {
      if (imageS3Key) {
        await deleteFromS3(imageS3Key);
      }
      throw error;
    }
  },

  /**
   * Updates an existing training record, uploading replacement images to S3
   * and cleaning up replaced or removed S3 objects after DB persistence succeeds.
   */
  async updateTraining(
    id: number,
    multipart: ParsedMultipartPayload
  ): Promise<TrainingDto> {
    const existing = await trainingRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Training record not found.");
    }

    const validated = validateUpdateTrainingMultipart(multipart, {
      startDate: existing.startDate,
      endDate: existing.endDate,
    });

    let newlyUploadedKey: string | null = null;
    let keyToCleanupAfterSave: string | null = null;

    try {
      let nextImageKey: string | null | undefined;
      if (validated.imageFile) {
        newlyUploadedKey = await uploadMulterFileToS3(
          validated.imageFile,
          TRAINING_S3_KEY_PREFIX
        );
        nextImageKey = newlyUploadedKey;
        if (existing.image) {
          keyToCleanupAfterSave = existing.image;
        }
      } else if (validated.removeImage) {
        nextImageKey = null;
        if (existing.image) {
          keyToCleanupAfterSave = existing.image;
        }
      }

      const updated = await trainingRepository.update(id, {
        ...(validated.title !== undefined ? { title: validated.title } : {}),
        ...(validated.shortDescription !== undefined
          ? { shortDescription: validated.shortDescription }
          : {}),
        ...(validated.description !== undefined
          ? { description: validated.description }
          : {}),
        ...(nextImageKey !== undefined ? { image: nextImageKey } : {}),
        ...(validated.startDate !== undefined
          ? { startDate: validated.startDate }
          : {}),
        ...(validated.endDate !== undefined
          ? { endDate: validated.endDate }
          : {}),
        ...(validated.isRegistrationOpen !== undefined
          ? { isRegistrationOpen: validated.isRegistrationOpen }
          : {}),
      });

      if (keyToCleanupAfterSave) {
        await deleteFromS3(keyToCleanupAfterSave);
      }

      return toTrainingDto(updated);
    } catch (error: unknown) {
      if (newlyUploadedKey) {
        await deleteFromS3(newlyUploadedKey);
      }
      throw error;
    }
  },

  /**
   * Verifies record existence, deletes the training record, and removes its S3 asset.
   */
  async deleteTraining(id: number): Promise<void> {
    const existing = await trainingRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Training record not found.");
    }

    await trainingRepository.delete(id);
    await deleteFromS3(existing.image);
  },
};
