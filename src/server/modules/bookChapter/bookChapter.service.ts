import { NotFoundError } from "@/server/utils/errors/AppError";
import type { BookChapter } from "../../../../prisma/generated/prisma/client";
import { bookChapterRepository } from "./bookChapter.repository";
import type {
  BookChapterDto,
  CreateBookChapterInput,
  ListBookChaptersQuery,
  PaginatedBookChaptersDto,
  UpdateBookChapterInput,
} from "./bookChapter.types";

/**
 * Converts a Prisma `BookChapter` entity into a serialized API DTO.
 */
function toBookChapterDto(record: BookChapter): BookChapterDto {
  return {
    id: record.id,
    year: record.year,
    domain: record.domain,
    chapterTitle: record.chapterTitle,
    bookName: record.bookName,
    authorFromCaimif: record.authorFromCaimif,
    otherAuthors: record.otherAuthors,
    publisher: record.publisher,
    indexing: record.indexing,
    quartile: record.quartile,
    weblink: record.weblink,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Service layer managing BookChapter publication workflows and domain rules.
 */
export const bookChapterService = {
  /**
   * Retrieves paginated book chapter publications filtered by optional year, domain, or search text.
   */
  async listBookChapters(
    query: ListBookChaptersQuery
  ): Promise<PaginatedBookChaptersDto> {
    const { items, total } = await bookChapterRepository.findManyPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));

    return {
      items: items.map(toBookChapterDto),
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
      },
    };
  },

  /**
   * Retrieves a single book chapter publication by ID, throwing 404 if missing.
   */
  async getBookChapterById(id: string): Promise<BookChapterDto> {
    const record = await bookChapterRepository.findById(id);
    if (!record) {
      throw new NotFoundError("Book chapter publication not found.");
    }
    return toBookChapterDto(record);
  },

  /**
   * Persists a new book chapter publication record.
   */
  async createBookChapter(
    input: CreateBookChapterInput
  ): Promise<BookChapterDto> {
    const created = await bookChapterRepository.create(input);
    return toBookChapterDto(created);
  },

  /**
   * Verifies record existence and applies partial updates to a book chapter publication.
   */
  async updateBookChapter(
    id: string,
    input: UpdateBookChapterInput
  ): Promise<BookChapterDto> {
    const existing = await bookChapterRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Book chapter publication not found.");
    }

    const updated = await bookChapterRepository.update(id, input);
    return toBookChapterDto(updated);
  },

  /**
   * Verifies record existence and deletes the book chapter publication.
   */
  async deleteBookChapter(id: string): Promise<void> {
    const existing = await bookChapterRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Book chapter publication not found.");
    }

    await bookChapterRepository.delete(id);
  },
};
