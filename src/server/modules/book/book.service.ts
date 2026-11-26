import { NotFoundError } from "@/server/utils/errors/AppError";
import type { Book } from "../../../../prisma/generated/prisma/client";
import { bookRepository } from "./book.repository";
import type {
  BookDto,
  CreateBookInput,
  ListBooksQuery,
  PaginatedBooksDto,
  UpdateBookInput,
} from "./book.types";

/**
 * Converts a Prisma `Book` entity into a serialized API DTO.
 */
function toBookDto(record: Book): BookDto {
  return {
    id: record.id,
    year: record.year,
    domain: record.domain,
    title: record.title,
    bookAuthor: record.bookAuthor,
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
 * Service layer managing Book publication workflows and domain rules.
 */
export const bookService = {
  /**
   * Retrieves paginated book publications filtered by optional year, domain, or search text.
   */
  async listBooks(query: ListBooksQuery): Promise<PaginatedBooksDto> {
    const { items, total } = await bookRepository.findManyPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));

    return {
      items: items.map(toBookDto),
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
      },
    };
  },

  /**
   * Retrieves a single book publication by ID, throwing 404 if missing.
   */
  async getBookById(id: string): Promise<BookDto> {
    const record = await bookRepository.findById(id);
    if (!record) {
      throw new NotFoundError("Book publication not found.");
    }
    return toBookDto(record);
  },

  /**
   * Persists a new book publication record.
   */
  async createBook(input: CreateBookInput): Promise<BookDto> {
    const created = await bookRepository.create(input);
    return toBookDto(created);
  },

  /**
   * Verifies record existence and applies partial updates to a book publication.
   */
  async updateBook(id: string, input: UpdateBookInput): Promise<BookDto> {
    const existing = await bookRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Book publication not found.");
    }

    const updated = await bookRepository.update(id, input);
    return toBookDto(updated);
  },

  /**
   * Verifies record existence and deletes the book publication.
   */
  async deleteBook(id: string): Promise<void> {
    const existing = await bookRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Book publication not found.");
    }

    await bookRepository.delete(id);
  },
};
