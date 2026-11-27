import { NotFoundError } from "@/server/utils/errors/AppError";
import type { Collaboration } from "../../../../prisma/generated/prisma/client";
import { collaborationRepository } from "./collaboration.repository";
import type {
  CollaborationDto,
  CreateCollaborationInput,
  ListCollaborationsQuery,
  PaginatedCollaborationsDto,
  UpdateCollaborationInput,
} from "./collaboration.types";

/**
 * Converts a Prisma `Collaboration` entity into a serialized API DTO.
 */
function toCollaborationDto(record: Collaboration): CollaborationDto {
  return {
    id: record.id,
    firstParty: record.firstParty,
    secondParty: record.secondParty,
    date: record.date.toISOString(),
    leadingPerson: record.leadingPerson,
    type: record.type,
    content: record.content,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Service layer managing `Collaboration` workflows and domain rules.
 */
export const collaborationService = {
  async listCollaborations(
    query: ListCollaborationsQuery
  ): Promise<PaginatedCollaborationsDto> {
    const { items, total } =
      await collaborationRepository.findManyPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));

    return {
      items: items.map(toCollaborationDto),
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
      },
    };
  },

  async getCollaborationById(id: string): Promise<CollaborationDto> {
    const record = await collaborationRepository.findById(id);
    if (!record) {
      throw new NotFoundError("Collaboration record not found.");
    }
    return toCollaborationDto(record);
  },

  async createCollaboration(
    input: CreateCollaborationInput
  ): Promise<CollaborationDto> {
    const created = await collaborationRepository.create(input);
    return toCollaborationDto(created);
  },

  async updateCollaboration(
    id: string,
    input: UpdateCollaborationInput
  ): Promise<CollaborationDto> {
    const existing = await collaborationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Collaboration record not found.");
    }

    const updated = await collaborationRepository.update(id, input);
    return toCollaborationDto(updated);
  },

  async deleteCollaboration(id: string): Promise<void> {
    const existing = await collaborationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Collaboration record not found.");
    }

    await collaborationRepository.delete(id);
  },
};
