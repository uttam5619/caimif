import { getPrisma } from "@/server/database/prisma";
import type { Conference, Prisma } from "../../../../prisma/generated/prisma/client";
import type {
  CreateConferenceInput,
  ListConferencesQuery,
  UpdateConferenceInput,
} from "./conference.types";

/**
 * Builds Prisma `where` filter clauses from validated query parameters,
 * utilizing indexed `year` and `domain` columns before text matching.
 */
function buildConferenceWhereClause(
  query: ListConferencesQuery
): Prisma.ConferenceWhereInput {
  const where: Prisma.ConferenceWhereInput = {};

  if (query.year !== undefined) {
    where.year = query.year;
  }

  if (query.domain !== undefined) {
    where.domain = query.domain;
  }

  if (query.search !== undefined) {
    const orFilters: Prisma.ConferenceWhereInput[] = [
      { domain: { contains: query.search } },
      { title: { contains: query.search } },
      { authorFromCaimif: { contains: query.search } },
      { otherAuthors: { contains: query.search } },
      { conferenceName: { contains: query.search } },
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
 * Repository encapsulating all Prisma ORM operations for the `Conference` model.
 * Contains zero business logic or HTTP request/response handling.
 */
export const conferenceRepository = {
  async findManyPaginated(
    query: ListConferencesQuery
  ): Promise<{ items: Conference[]; total: number }> {
    const prisma = getPrisma();
    const where = buildConferenceWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.conference.findMany({
        where,
        orderBy: [{ year: "desc" }, { createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.conference.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id: string): Promise<Conference | null> {
    const prisma = getPrisma();
    return prisma.conference.findUnique({ where: { id } });
  },

  async create(data: CreateConferenceInput): Promise<Conference> {
    const prisma = getPrisma();
    return prisma.conference.create({
      data: {
        year: data.year,
        domain: data.domain,
        title: data.title,
        authorFromCaimif: data.authorFromCaimif,
        otherAuthors: data.otherAuthors ?? null,
        conferenceName: data.conferenceName,
        publisher: data.publisher ?? null,
        indexing: data.indexing ?? null,
        quartile: data.quartile ?? null,
        weblink: data.weblink ?? null,
      },
    });
  },

  async update(id: string, data: UpdateConferenceInput): Promise<Conference> {
    const prisma = getPrisma();
    return prisma.conference.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<Conference> {
    const prisma = getPrisma();
    return prisma.conference.delete({ where: { id } });
  },
};
