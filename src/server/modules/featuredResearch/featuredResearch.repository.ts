import { getPrisma } from "@/server/database/prisma";
import type {
  FeaturedResearch,
  Prisma,
} from "../../../../prisma/generated/prisma/client";
import type { ListFeaturedResearchQuery } from "./featuredResearch.types";

/**
 * Builds Prisma `where` filter clauses from validated query parameters.
 */
function buildFeaturedResearchWhereClause(
  query: ListFeaturedResearchQuery
): Prisma.FeaturedResearchWhereInput {
  const where: Prisma.FeaturedResearchWhereInput = {};

  if (query.search !== undefined) {
    where.OR = [
      { title: { contains: query.search } },
      { authorName: { contains: query.search } },
      { description: { contains: query.search } },
    ];
  }

  return where;
}

/**
 * Repository encapsulating all Prisma ORM operations for the `FeaturedResearch` model.
 * Contains zero business logic or HTTP request/response handling.
 */
export const featuredResearchRepository = {
  async findManyPaginated(
    query: ListFeaturedResearchQuery
  ): Promise<{ items: FeaturedResearch[]; total: number }> {
    const prisma = getPrisma();
    const where = buildFeaturedResearchWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.featuredResearch.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.featuredResearch.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id: string): Promise<FeaturedResearch | null> {
    const prisma = getPrisma();
    return prisma.featuredResearch.findUnique({ where: { id } });
  },

  async create(data: Prisma.FeaturedResearchCreateInput): Promise<FeaturedResearch> {
    const prisma = getPrisma();
    return prisma.featuredResearch.create({ data });
  },

  async update(
    id: string,
    data: Prisma.FeaturedResearchUpdateInput
  ): Promise<FeaturedResearch> {
    const prisma = getPrisma();
    return prisma.featuredResearch.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<FeaturedResearch> {
    const prisma = getPrisma();
    return prisma.featuredResearch.delete({ where: { id } });
  },
};
