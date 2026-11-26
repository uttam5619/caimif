import { getPrisma } from "@/server/database/prisma";
import type { Prisma, Training } from "../../../../prisma/generated/prisma/client";
import type { ListTrainingsQuery } from "./training.types";

/**
 * Builds Prisma `where` filter clauses from validated query parameters.
 */
function buildTrainingWhereClause(
  query: ListTrainingsQuery
): Prisma.TrainingWhereInput {
  const where: Prisma.TrainingWhereInput = {};

  if (query.isRegistrationOpen !== undefined) {
    where.isRegistrationOpen = query.isRegistrationOpen;
  }

  if (query.search !== undefined) {
    where.OR = [
      { title: { contains: query.search } },
      { shortDescription: { contains: query.search } },
      { description: { contains: query.search } },
    ];
  }

  return where;
}

/**
 * Repository encapsulating all Prisma ORM operations for the `Training` model.
 * Contains zero business logic or HTTP request/response handling.
 */
export const trainingRepository = {
  async findManyPaginated(
    query: ListTrainingsQuery
  ): Promise<{ items: Training[]; total: number }> {
    const prisma = getPrisma();
    const where = buildTrainingWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.training.findMany({
        where,
        orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.training.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id: number): Promise<Training | null> {
    const prisma = getPrisma();
    return prisma.training.findUnique({ where: { id } });
  },

  async create(data: {
    title: string;
    shortDescription: string | null;
    description: string;
    image: string | null;
    startDate: Date;
    endDate: Date;
    isRegistrationOpen: boolean;
  }): Promise<Training> {
    const prisma = getPrisma();
    return prisma.training.create({ data });
  },

  async update(
    id: number,
    data: Prisma.TrainingUpdateInput
  ): Promise<Training> {
    const prisma = getPrisma();
    return prisma.training.update({
      where: { id },
      data,
    });
  },

  async delete(id: number): Promise<Training> {
    const prisma = getPrisma();
    return prisma.training.delete({ where: { id } });
  },
};
