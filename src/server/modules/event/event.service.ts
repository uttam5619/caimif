import type { ParsedMultipartPayload } from "@/server/middlewares/multerUpload";
import { NotFoundError } from "@/server/utils/errors/AppError";
import {
  deleteFromS3,
  resolveS3ReadUrl,
  uploadMulterFileToS3,
} from "@/server/utils/storage/s3Storage";
import type { Event } from "../../../../prisma/generated/prisma/client";
import { EVENT_S3_KEY_PREFIX } from "./event.constants";
import { eventRepository } from "./event.repository";
import type {
  EventDto,
  ListEventsQuery,
  PaginatedEventsDto,
} from "./event.types";
import {
  validateCreateEventMultipart,
  validateUpdateEventMultipart,
} from "./event.validation";

/**
 * Converts a Prisma `Event` entity into a serialized API DTO,
 * resolving any stored S3 object key gracefully.
 */
async function toEventDto(record: Event): Promise<EventDto> {
  let imageUrl: string | undefined;
  try {
    imageUrl = await resolveS3ReadUrl(record.image);
  } catch (error: unknown) {
    console.warn(
      "[EventService] Unable to resolve S3 image URL:",
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
    location: record.location,
    venue: record.venue,
    isRegistrationOpen: record.isRegistrationOpen,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Service layer managing Event workflows, Multer -> S3 image uploads, and DTO mapping.
 */
export const eventService = {
  /**
   * Retrieves paginated event records filtered by optional registration status or search text.
   */
  async listEvents(query: ListEventsQuery): Promise<PaginatedEventsDto> {
    const { items, total } = await eventRepository.findManyPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));
    const dtos = await Promise.all(items.map((item) => toEventDto(item)));

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
   * Retrieves a single event record by ID, throwing 404 if missing.
   */
  async getEventById(id: number): Promise<EventDto> {
    const record = await eventRepository.findById(id);
    if (!record) {
      throw new NotFoundError("Event record not found.");
    }
    return toEventDto(record);
  },

  /**
   * Validates multipart form submission, uploads optional cover image to S3,
   * and persists the event record in MySQL (rolling back S3 on DB failure).
   */
  async createEvent(multipart: ParsedMultipartPayload): Promise<EventDto> {
    const validated = validateCreateEventMultipart(multipart);

    let imageS3Key: string | null = null;
    try {
      if (validated.imageFile) {
        imageS3Key = await uploadMulterFileToS3(
          validated.imageFile,
          EVENT_S3_KEY_PREFIX
        );
      }

      const created = await eventRepository.create({
        title: validated.title,
        shortDescription: validated.shortDescription,
        description: validated.description,
        image: imageS3Key,
        startDate: validated.startDate,
        endDate: validated.endDate,
        location: validated.location,
        venue: validated.venue,
        isRegistrationOpen: validated.isRegistrationOpen,
      });

      return toEventDto(created);
    } catch (error: unknown) {
      if (imageS3Key) {
        await deleteFromS3(imageS3Key);
      }
      throw error;
    }
  },

  /**
   * Updates an existing event record, uploading replacement images to S3
   * and cleaning up replaced or removed S3 objects after DB persistence succeeds.
   */
  async updateEvent(
    id: number,
    multipart: ParsedMultipartPayload
  ): Promise<EventDto> {
    const existing = await eventRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Event record not found.");
    }

    const validated = validateUpdateEventMultipart(multipart, {
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
          EVENT_S3_KEY_PREFIX
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

      const updated = await eventRepository.update(id, {
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
        ...(validated.location !== undefined
          ? { location: validated.location }
          : {}),
        ...(validated.venue !== undefined ? { venue: validated.venue } : {}),
        ...(validated.isRegistrationOpen !== undefined
          ? { isRegistrationOpen: validated.isRegistrationOpen }
          : {}),
      });

      if (keyToCleanupAfterSave) {
        await deleteFromS3(keyToCleanupAfterSave);
      }

      return toEventDto(updated);
    } catch (error: unknown) {
      if (newlyUploadedKey) {
        await deleteFromS3(newlyUploadedKey);
      }
      throw error;
    }
  },

  /**
   * Verifies record existence, deletes the event record, and removes its S3 asset.
   */
  async deleteEvent(id: number): Promise<void> {
    const existing = await eventRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Event record not found.");
    }

    await eventRepository.delete(id);
    await deleteFromS3(existing.image);
  },
};
