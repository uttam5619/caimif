import { getPrisma } from "@/server/database/prisma";
import type { Patent, Prisma } from "../../../../prisma/generated/prisma/client";
import type {
  CreatePatentInput,
  ListPatentsQuery,
  UpdatePatentInput,
} from "./patents.types";

/**
 * Builds Prisma `where` filter clauses from validated query parameters,
 * utilizing indexed `year`, `domain`, and `status` columns before text matching.
 */
function buildPatentWhereClause(query: ListPatentsQuery): Prisma.PatentWhereInput {
  const where: Prisma.PatentWhereInput = {};

  if (query.year !== undefined) {
    where.year = query.year;
  }

  if (query.domain !== undefined) {
    where.domain = query.domain;
  }

  if (query.status !== undefined) {
    where.status = query.status;
  }

  if (query.search !== undefined) {
    const orFilters: Prisma.PatentWhereInput[] = [
      { domain: { contains: query.search } },
      { title: { contains: query.search } },
      { nameOfInventors: { contains: query.search } },
      { patentAgency: { contains: query.search } },
      { country: { contains: query.search } },
      { grantNumber: { contains: query.search } },
    ];

    const normalizedUpper = query.search.trim().toUpperCase();
    if (normalizedUpper === "PUBLISHED" || normalizedUpper === "GRANTED") {
      orFilters.push({ status: normalizedUpper });
    }

    where.OR = orFilters;
  }

  return where;
}

/**
 * Repository encapsulating all Prisma ORM operations for the `Patent` model.
 * Contains zero business logic or HTTP request/response handling.
 */
export const patentsRepository = {
  async findManyPaginated(
    query: ListPatentsQuery
  ): Promise<{ items: Patent[]; total: number }> {
    const prisma = getPrisma();
    const where = buildPatentWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.patent.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.patent.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id: string): Promise<Patent | null> {
    const prisma = getPrisma();
    return prisma.patent.findUnique({ where: { id } });
  },

  async create(data: CreatePatentInput): Promise<Patent> {
    const prisma = getPrisma();
    return prisma.patent.create({
      data: {
        year: data.year ?? null,
        domain: data.domain ?? null,
        title: data.title,
        status: data.status ?? null,
        nameOfInventors: data.nameOfInventors ?? null,
        patentAgency: data.patentAgency ?? null,
        country: data.country ?? null,
        grantNumber: data.grantNumber ?? null,
      },
    });
  },

  async update(id: string, data: UpdatePatentInput): Promise<Patent> {
    const prisma = getPrisma();
    return prisma.patent.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<Patent> {
    const prisma = getPrisma();
    return prisma.patent.delete({ where: { id } });
  },
};
