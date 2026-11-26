import { getPrisma } from "@/server/database/prisma";
import type { BookChapter, Prisma } from "../../../../prisma/generated/prisma/client";
import type {
  CreateBookChapterInput,
  ListBookChaptersQuery,
  UpdateBookChapterInput,
} from "./bookChapter.types";

/**
 * Builds Prisma `where` filter clauses from validated query parameters,
 * utilizing indexed `year` and `domain` columns before text matching.
 */
function buildBookChapterWhereClause(
  query: ListBookChaptersQuery
): Prisma.BookChapterWhereInput {
  const where: Prisma.BookChapterWhereInput = {};

  if (query.year !== undefined) {
    where.year = query.year;
  }

  if (query.domain !== undefined) {
    where.domain = query.domain;
  }

  if (query.search !== undefined) {
    const orFilters: Prisma.BookChapterWhereInput[] = [
      { domain: { contains: query.search } },
      { chapterTitle: { contains: query.search } },
      { bookName: { contains: query.search } },
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
 * Repository encapsulating all Prisma ORM operations for the `BookChapter` model.
 * Contains zero business logic or HTTP request/response handling.
 */
export const bookChapterRepository = {
  async findManyPaginated(
    query: ListBookChaptersQuery
  ): Promise<{ items: BookChapter[]; total: number }> {
    const prisma = getPrisma();
    const where = buildBookChapterWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.bookChapter.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.bookChapter.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id: string): Promise<BookChapter | null> {
    const prisma = getPrisma();
    return prisma.bookChapter.findUnique({ where: { id } });
  },

  async create(data: CreateBookChapterInput): Promise<BookChapter> {
    const prisma = getPrisma();
    return prisma.bookChapter.create({
      data: {
        year: data.year ?? null,
        domain: data.domain ?? null,
        chapterTitle: data.chapterTitle,
        bookName: data.bookName,
        authorFromCaimif: data.authorFromCaimif ?? null,
        otherAuthors: data.otherAuthors ?? null,
        publisher: data.publisher ?? null,
        indexing: data.indexing ?? null,
        quartile: data.quartile ?? null,
        weblink: data.weblink ?? null,
      },
    });
  },

  async update(id: string, data: UpdateBookChapterInput): Promise<BookChapter> {
    const prisma = getPrisma();
    return prisma.bookChapter.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<BookChapter> {
    const prisma = getPrisma();
    return prisma.bookChapter.delete({ where: { id } });
  },
};
