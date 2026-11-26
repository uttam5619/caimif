import { ConflictError, NotFoundError } from "@/server/utils/errors/AppError";
import { isPrismaUniqueConstraintError } from "@/server/utils/errors/prismaErrors";
import type { Patent } from "../../../../prisma/generated/prisma/client";
import { patentsRepository } from "./patents.repository";
import type {
  CreatePatentInput,
  ListPatentsQuery,
  PaginatedPatentsDto,
  PatentDto,
  UpdatePatentInput,
} from "./patents.types";

/**
 * Converts a Prisma `Patent` entity into a serialized API DTO.
 */
function toPatentDto(record: Patent): PatentDto {
  return {
    id: record.id,
    year: record.year,
    domain: record.domain,
    title: record.title,
    status: record.status,
    nameOfInventors: record.nameOfInventors,
    patentAgency: record.patentAgency,
    country: record.country,
    grantNumber: record.grantNumber,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Service layer managing Patent workflows, unique grant-number conflicts, and DTO mapping.
 */
export const patentsService = {
  /**
   * Retrieves paginated patent records filtered by optional year, domain, status, or search text.
   */
  async listPatents(query: ListPatentsQuery): Promise<PaginatedPatentsDto> {
    const { items, total } = await patentsRepository.findManyPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));

    return {
      items: items.map(toPatentDto),
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
      },
    };
  },

  /**
   * Retrieves a single patent record by ID, throwing 404 if missing.
   */
  async getPatentById(id: string): Promise<PatentDto> {
    const record = await patentsRepository.findById(id);
    if (!record) {
      throw new NotFoundError("Patent record not found.");
    }
    return toPatentDto(record);
  },

  /**
   * Persists a new patent record, translating duplicate grant numbers into 409 Conflict.
   */
  async createPatent(input: CreatePatentInput): Promise<PatentDto> {
    try {
      const created = await patentsRepository.create(input);
      return toPatentDto(created);
    } catch (error: unknown) {
      if (isPrismaUniqueConstraintError(error)) {
        throw new ConflictError(
          `A patent with grant number "${input.grantNumber}" already exists.`
        );
      }
      throw error;
    }
  },

  /**
   * Verifies record existence and applies partial updates to a patent record.
   */
  async updatePatent(
    id: string,
    input: UpdatePatentInput
  ): Promise<PatentDto> {
    const existing = await patentsRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Patent record not found.");
    }

    try {
      const updated = await patentsRepository.update(id, input);
      return toPatentDto(updated);
    } catch (error: unknown) {
      if (isPrismaUniqueConstraintError(error)) {
        throw new ConflictError(
          `A patent with grant number "${input.grantNumber}" already exists.`
        );
      }
      throw error;
    }
  },

  /**
   * Verifies record existence and deletes the patent record.
   */
  async deletePatent(id: string): Promise<void> {
    const existing = await patentsRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Patent record not found.");
    }

    await patentsRepository.delete(id);
  },
};
