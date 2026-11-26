import { getPrisma } from "@/server/database/prisma";
import type { Journal, Prisma } from "../../../../prisma/generated/prisma/client";
import type {
  CreateJournalInput,
  ListJournalsQuery,
  UpdateJournalInput,
} from "./journal.types";

/**
 * Builds Prisma `where` filter clauses from validated query parameters,
 * leveraging indexed `year` and `domain` columns before text matching.
 */

function buildJournalWhereClause(
  query: ListJournalsQuery
): Prisma.JournalWhereInput {
  const where: Prisma.JournalWhereInput = {};

  if (query.year !== undefined) {
    where.year = query.year;
  }

  if (query.domain !== undefined) {
    where.domain = query.domain;
  }

  if (query.search !== undefined) {
    where.OR = [
      { title: { contains: query.search } },
      { authorFromCaimif: { contains: query.search } },
      { journalName: { contains: query.search } },
      { publisher: { contains: query.search } },
    ];
  }

  return where;
}

/**
 * Repository encapsulating all Prisma ORM operations for the `Journal` model.
 * Contains zero business logic or HTTP request/response handling.
 */

export const journalRepository = {
  async findManyPaginated(
    query: ListJournalsQuery
  ): Promise<{ items: Journal[]; total: number }> {
    const prisma = getPrisma();
    const where = buildJournalWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.journal.findMany({
        where,
        orderBy: [{ year: "desc" }, { createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.journal.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id: string): Promise<Journal | null> {
    const prisma = getPrisma();
    return prisma.journal.findUnique({ where: { id } });
  },

  async create(data: CreateJournalInput): Promise<Journal> {
    const prisma = getPrisma();
    return prisma.journal.create({
      data: {
        year: data.year,
        domain: data.domain,
        title: data.title,
        authorFromCaimif: data.authorFromCaimif,
        otherAuthors: data.otherAuthors ?? null,
        journalName: data.journalName,
        publisher: data.publisher ?? null,
        indexing: data.indexing ?? null,
        quartile: data.quartile ?? null,
        weblink: data.weblink ?? null,
      },
    });
  },

  async update(id: string, data: UpdateJournalInput): Promise<Journal> {
    const prisma = getPrisma();
    return prisma.journal.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<Journal> {
    const prisma = getPrisma();
    return prisma.journal.delete({ where: { id } });
  },
};
