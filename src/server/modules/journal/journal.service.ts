import { NotFoundError } from "@/server/utils/errors/AppError";
import type { Journal } from "../../../../prisma/generated/prisma/client";
import { journalRepository } from "./journal.repository";
import type {
  CreateJournalInput,
  JournalDto,
  ListJournalsQuery,
  PaginatedJournalsDto,
  UpdateJournalInput,
} from "./journal.types";

/**
 * Converts a Prisma `Journal` entity into a serialized API DTO.
 */
function toJournalDto(record: Journal): JournalDto {
  return {
    id: record.id,
    year: record.year,
    domain: record.domain,
    title: record.title,
    authorFromCaimif: record.authorFromCaimif,
    otherAuthors: record.otherAuthors,
    journalName: record.journalName,
    publisher: record.publisher,
    indexing: record.indexing,
    quartile: record.quartile,
    weblink: record.weblink,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Service layer managing Journal publication workflows and domain rules.
 */
export const journalService = {
  /**
   * Retrieves paginated journal publications filtered by optional year, domain, or search text.
   */
  async listJournals(query: ListJournalsQuery): Promise<PaginatedJournalsDto> {
    const { items, total } = await journalRepository.findManyPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));

    return {
      items: items.map(toJournalDto),
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
      },
    };
  },

  /**
   * Retrieves a single journal publication by ID, throwing 404 if missing.
   */
  async getJournalById(id: string): Promise<JournalDto> {
    const record = await journalRepository.findById(id);
    if (!record) {
      throw new NotFoundError("Journal publication not found.");
    }
    return toJournalDto(record);
  },

  /**
   * Persists a new journal publication record.
   */
  async createJournal(input: CreateJournalInput): Promise<JournalDto> {
    const created = await journalRepository.create(input);
    return toJournalDto(created);
  },

  /**
   * Verifies record existence and applies partial updates to a journal publication.
   */
  async updateJournal(
    id: string,
    input: UpdateJournalInput
  ): Promise<JournalDto> {
    const existing = await journalRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Journal publication not found.");
    }

    const updated = await journalRepository.update(id, input);
    return toJournalDto(updated);
  },

  /**
   * Verifies record existence and deletes the journal publication.
   */
  async deleteJournal(id: string): Promise<void> {
    const existing = await journalRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Journal publication not found.");
    }

    await journalRepository.delete(id);
  },
};
