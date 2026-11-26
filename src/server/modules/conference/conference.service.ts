import { NotFoundError } from "@/server/utils/errors/AppError";
import type { Conference } from "../../../../prisma/generated/prisma/client";
import { conferenceRepository } from "./conference.repository";
import type {
  ConferenceDto,
  CreateConferenceInput,
  ListConferencesQuery,
  PaginatedConferencesDto,
  UpdateConferenceInput,
} from "./conference.types";

/**
 * Converts a Prisma `Conference` entity into a serialized API DTO.
 */
function toConferenceDto(record: Conference): ConferenceDto {
  return {
    id: record.id,
    year: record.year,
    domain: record.domain,
    title: record.title,
    authorFromCaimif: record.authorFromCaimif,
    otherAuthors: record.otherAuthors,
    conferenceName: record.conferenceName,
    publisher: record.publisher,
    indexing: record.indexing,
    quartile: record.quartile,
    weblink: record.weblink,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Service layer managing Conference publication workflows and domain rules.
 */
export const conferenceService = {
  /**
   * Retrieves paginated conference publications filtered by optional year, domain, or search text.
   */
  async listConferences(
    query: ListConferencesQuery
  ): Promise<PaginatedConferencesDto> {
    const { items, total } = await conferenceRepository.findManyPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));

    return {
      items: items.map(toConferenceDto),
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
      },
    };
  },

  /**
   * Retrieves a single conference publication by ID, throwing 404 if missing.
   */
  async getConferenceById(id: string): Promise<ConferenceDto> {
    const record = await conferenceRepository.findById(id);
    if (!record) {
      throw new NotFoundError("Conference publication not found.");
    }
    return toConferenceDto(record);
  },

  /**
   * Persists a new conference publication record.
   */
  async createConference(input: CreateConferenceInput): Promise<ConferenceDto> {
    const created = await conferenceRepository.create(input);
    return toConferenceDto(created);
  },

  /**
   * Verifies record existence and applies partial updates to a conference publication.
   */
  async updateConference(
    id: string,
    input: UpdateConferenceInput
  ): Promise<ConferenceDto> {
    const existing = await conferenceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Conference publication not found.");
    }

    const updated = await conferenceRepository.update(id, input);
    return toConferenceDto(updated);
  },

  /**
   * Verifies record existence and deletes the conference publication.
   */
  async deleteConference(id: string): Promise<void> {
    const existing = await conferenceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Conference publication not found.");
    }

    await conferenceRepository.delete(id);
  },
};
