import { getPrisma } from "@/server/database/prisma";
import type { Prisma, Team, TeamCategory } from "../../../../prisma/generated/prisma/client";
import { TEAM_CATEGORIES } from "./team.constants";
import type { ListTeamQuery } from "./team.types";

/**
 * Builds Prisma `where` filter clauses from validated query parameters,
 * leveraging indexed `category` and `name` columns before text search.
 */
function buildTeamWhereClause(query: ListTeamQuery): Prisma.TeamWhereInput {
  const where: Prisma.TeamWhereInput = {};

  if (query.category !== undefined) {
    where.category = query.category;
  }

  if (query.search !== undefined) {
    const orFilters: Prisma.TeamWhereInput[] = [
      { name: { contains: query.search } },
      { designation: { contains: query.search } },
      { school: { contains: query.search } },
      { department: { contains: query.search } },
      { email: { contains: query.search } },
      { qualification: { contains: query.search } },
      { areaOfInterest: { contains: query.search } },
      { about: { contains: query.search } },
    ];

    // Allow text search queries like "professor" or "phd_scholar" to match category enums
    const normalizedCategory = query.search.trim().toUpperCase().replace(/\s+/g, "_");
    if (TEAM_CATEGORIES.includes(normalizedCategory as TeamCategory)) {
      orFilters.push({ category: normalizedCategory as TeamCategory });
    }

    where.OR = orFilters;
  }

  return where;
}

/**
 * Repository encapsulating all Prisma ORM operations for the `Team` model.
 * Contains zero business logic or HTTP request/response handling.
 */
export const teamRepository = {
  async findManyPaginated(
    query: ListTeamQuery
  ): Promise<{ items: Team[]; total: number }> {
    const prisma = getPrisma();
    const where = buildTeamWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.team.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.team.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id: string): Promise<Team | null> {
    const prisma = getPrisma();
    return prisma.team.findUnique({ where: { id } });
  },

  async create(data: Prisma.TeamCreateInput): Promise<Team> {
    const prisma = getPrisma();
    return prisma.team.create({ data });
  },

  async update(id: string, data: Prisma.TeamUpdateInput): Promise<Team> {
    const prisma = getPrisma();
    return prisma.team.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<Team> {
    const prisma = getPrisma();
    return prisma.team.delete({ where: { id } });
  },
};
