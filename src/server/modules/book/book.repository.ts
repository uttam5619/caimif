import { getPrisma } from "@/server/database/prisma";
import type { Book, Prisma } from "../../../../prisma/generated/prisma/client";
import type {
  CreateBookInput,
  ListBooksQuery,
  UpdateBookInput,
} from "./book.types";

/**
 * Builds Prisma `where` filter clauses from validated query parameters,
 * utilizing indexed `year` and `domain` columns before text matching.
 */
function buildBookWhereClause(query: ListBooksQuery): Prisma.BookWhereInput {
  const where: Prisma.BookWhereInput = {};

  if (query.year !== undefined) {
    where.year = query.year;
  }

  if (query.domain !== undefined) {
    where.domain = query.domain;
  }

  if (query.search !== undefined) {
    const orFilters: Prisma.BookWhereInput[] = [
      { domain: { contains: query.search } },
      { title: { contains: query.search } },
      { bookAuthor: { contains: query.search } },
      { authorFromCaimif: { contains: query.search } },
      { otherAuthors: { contains: query.search } },
      { publisher: { contains: query.search } },
      { indexing: { contains: query.search } },
      { quartile: { contains: query.search } },
      { weblink: { contains: query.search } },
    ];

    const numericSearch = Number(query.search);
    if (Number.isInteger(numericSearch) && query.search.trim().length === 4) {
      orFilters.push({ year: numericSearch });
    }

    where.OR = orFilters;
  }

  return where;
}

/**
 * Repository encapsulating all Prisma ORM operations for the `Book` model.
 * Contains zero business logic or HTTP request/response handling.
 */
export const bookRepository = {
  async findManyPaginated(
    query: ListBooksQuery
  ): Promise<{ items: Book[]; total: number }> {
    const prisma = getPrisma();
    const where = buildBookWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.book.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.book.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id: string): Promise<Book | null> {
    const prisma = getPrisma();
    return prisma.book.findUnique({ where: { id } });
  },

  async create(data: CreateBookInput): Promise<Book> {
    const prisma = getPrisma();
    return prisma.book.create({
      data: {
        year: data.year ?? null,
        domain: data.domain ?? null,
        title: data.title,
        bookAuthor: data.bookAuthor,
        authorFromCaimif: data.authorFromCaimif ?? null,
        otherAuthors: data.otherAuthors ?? null,
        publisher: data.publisher ?? null,
        indexing: data.indexing ?? null,
        quartile: data.quartile ?? null,
        weblink: data.weblink ?? null,
      },
    });
  },

  async update(id: string, data: UpdateBookInput): Promise<Book> {
    const prisma = getPrisma();
    return prisma.book.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<Book> {
    const prisma = getPrisma();
    return prisma.book.delete({ where: { id } });
  },
};
