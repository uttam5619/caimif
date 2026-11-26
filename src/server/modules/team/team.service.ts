import type { ParsedMultipartPayload } from "@/server/middlewares/multerUpload";
import { ConflictError, NotFoundError } from "@/server/utils/errors/AppError";
import { isPrismaUniqueConstraintError } from "@/server/utils/errors/prismaErrors";
import {
  deleteFromS3,
  resolveS3ReadUrl,
  uploadMulterFileToS3,
} from "@/server/utils/storage/s3Storage";
import { Prisma, type Team } from "../../../../prisma/generated/prisma/client";
import { TEAM_S3_KEY_PREFIX } from "./team.constants";
import { teamRepository } from "./team.repository";
import type {
  ListTeamQuery,
  PaginatedTeamDto,
  TeamDto,
} from "./team.types";
import {
  validateCreateTeamMultipart,
  validateUpdateTeamMultipart,
} from "./team.validation";

/**
 * Normalizes a Prisma Json value (`specializations` / `certifications`) into a clean `string[]`.
 */
function normalizeJsonStringArray(value: Prisma.JsonValue | null): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/**
 * Converts a Prisma `Team` entity into a serialized API DTO,
 * resolving any stored S3 photo key gracefully.
 */
async function toTeamDto(record: Team): Promise<TeamDto> {
  let imageUrl: string | undefined;
  try {
    imageUrl = await resolveS3ReadUrl(record.imageKey);
  } catch (error: unknown) {
    console.warn(
      "[TeamService] Unable to resolve S3 image URL:",
      record.id,
      error instanceof Error ? error.message : error
    );
  }

  return {
    id: record.id,
    imageKey: record.imageKey ?? undefined,
    imageUrl,
    category: record.category,
    name: record.name,
    designation: record.designation,
    about: record.about,
    school: record.school,
    department: record.department,
    email: record.email,
    qualification: record.qualification,
    specializations: normalizeJsonStringArray(record.specializations),
    certifications: normalizeJsonStringArray(record.certifications),
    areaOfInterest: record.areaOfInterest,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Service layer managing Team member workflows, Multer -> S3 photo uploads,
 * unique email conflict handling, and DTO serialization.
 */
export const teamService = {
  /**
   * Retrieves paginated team member records filtered by optional category or search text.
   */
  async listTeamMembers(query: ListTeamQuery): Promise<PaginatedTeamDto> {
    const { items, total } = await teamRepository.findManyPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));
    const dtos = await Promise.all(items.map((item) => toTeamDto(item)));

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
   * Retrieves a single team member record by ID, throwing 404 if missing.
   */
  async getTeamMemberById(id: string): Promise<TeamDto> {
    const record = await teamRepository.findById(id);
    if (!record) {
      throw new NotFoundError("Team member not found.");
    }
    return toTeamDto(record);
  },

  /**
   * Validates multipart form submission, uploads optional photo to S3,
   * and persists the team member in MySQL (rolling back S3 on DB failure).
   */
  async createTeamMember(multipart: ParsedMultipartPayload): Promise<TeamDto> {
    const validated = validateCreateTeamMultipart(multipart);

    let uploadedImageKey: string | null = null;
    try {
      if (validated.imageFile) {
        uploadedImageKey = await uploadMulterFileToS3(
          validated.imageFile,
          TEAM_S3_KEY_PREFIX
        );
      }

      const created = await teamRepository.create({
        imageKey: uploadedImageKey,
        category: validated.category,
        name: validated.name,
        designation: validated.designation,
        about: validated.about,
        school: validated.school,
        department: validated.department,
        email: validated.email,
        qualification: validated.qualification,
        specializations: validated.specializations ?? Prisma.DbNull,
        certifications: validated.certifications ?? Prisma.DbNull,
        areaOfInterest: validated.areaOfInterest,
      });

      return toTeamDto(created);
    } catch (error: unknown) {
      // Clean up orphaned S3 object if DB creation fails (e.g. duplicate email)
      if (uploadedImageKey) {
        await deleteFromS3(uploadedImageKey);
      }

      if (isPrismaUniqueConstraintError(error)) {
        throw new ConflictError(
          `A team member with email "${validated.email}" already exists.`
        );
      }
      throw error;
    }
  },

  /**
   * Updates an existing team member record, uploading replacement photos to S3
   * and cleaning up replaced or removed S3 assets only after DB persistence succeeds.
   */
  async updateTeamMember(
    id: string,
    multipart: ParsedMultipartPayload
  ): Promise<TeamDto> {
    const existing = await teamRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Team member not found.");
    }

    const validated = validateUpdateTeamMultipart(multipart);

    let newlyUploadedKey: string | null = null;
    let keyToCleanupAfterSave: string | null = null;

    try {
      let nextImageKey: string | null | undefined;
      if (validated.imageFile) {
        newlyUploadedKey = await uploadMulterFileToS3(
          validated.imageFile,
          TEAM_S3_KEY_PREFIX
        );
        nextImageKey = newlyUploadedKey;
        if (existing.imageKey) {
          keyToCleanupAfterSave = existing.imageKey;
        }
      } else if (validated.removeImage) {
        nextImageKey = null;
        if (existing.imageKey) {
          keyToCleanupAfterSave = existing.imageKey;
        }
      }

      const updated = await teamRepository.update(id, {
        ...(nextImageKey !== undefined ? { imageKey: nextImageKey } : {}),
        ...(validated.category !== undefined
          ? { category: validated.category }
          : {}),
        ...(validated.name !== undefined ? { name: validated.name } : {}),
        ...(validated.designation !== undefined
          ? { designation: validated.designation }
          : {}),
        ...(validated.about !== undefined ? { about: validated.about } : {}),
        ...(validated.school !== undefined ? { school: validated.school } : {}),
        ...(validated.department !== undefined
          ? { department: validated.department }
          : {}),
        ...(validated.email !== undefined ? { email: validated.email } : {}),
        ...(validated.qualification !== undefined
          ? { qualification: validated.qualification }
          : {}),
        ...(validated.specializations !== undefined
          ? { specializations: validated.specializations ?? Prisma.DbNull }
          : {}),
        ...(validated.certifications !== undefined
          ? { certifications: validated.certifications ?? Prisma.DbNull }
          : {}),
        ...(validated.areaOfInterest !== undefined
          ? { areaOfInterest: validated.areaOfInterest }
          : {}),
      });

      if (keyToCleanupAfterSave) {
        await deleteFromS3(keyToCleanupAfterSave);
      }

      return toTeamDto(updated);
    } catch (error: unknown) {
      if (newlyUploadedKey) {
        await deleteFromS3(newlyUploadedKey);
      }

      if (isPrismaUniqueConstraintError(error)) {
        throw new ConflictError(
          `A team member with email "${validated.email}" already exists.`
        );
      }
      throw error;
    }
  },

  /**
   * Verifies record existence, deletes the team member record, and removes its S3 photo.
   */
  async deleteTeamMember(id: string): Promise<void> {
    const existing = await teamRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Team member not found.");
    }

    await teamRepository.delete(id);
    await deleteFromS3(existing.imageKey);
  },
};
