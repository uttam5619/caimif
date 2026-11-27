import { getPrisma } from "@/server/database/prisma";
import type {
  Collaboration,
  Prisma,
} from "../../../../prisma/generated/prisma/client";
import type {
  CreateCollaborationInput,
  ListCollaborationsQuery,
  UpdateCollaborationInput,
} from "./collaboration.types";

function buildCollaborationWhereClause(
  query: ListCollaborationsQuery
): Prisma.CollaborationWhereInput {
  const where: Prisma.CollaborationWhereInput = {};

  if (query.type !== undefined) {
    where.type = query.type;
  }

  if (query.search !== undefined) {
    where.OR = [
      { firstParty: { contains: query.search } },
      { secondParty: { contains: query.search } },
      { leadingPerson: { contains: query.search } },
      { type: { contains: query.search } },
      { content: { contains: query.search } },
    ];
  }

  return where;
}

/**
 * Repository encapsulating all Prisma ORM operations for the `Collaboration` model.
 * Contains zero business logic or HTTP request/response handling.
 */
export const collaborationRepository = {
  async findManyPaginated(
    query: ListCollaborationsQuery
  ): Promise<{ items: Collaboration[]; total: number }> {
    const prisma = getPrisma();
    const where = buildCollaborationWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.collaboration.findMany({
        where,
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.collaboration.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id: string): Promise<Collaboration | null> {
    const prisma = getPrisma();
    return prisma.collaboration.findUnique({ where: { id } });
  },

  async create(data: CreateCollaborationInput): Promise<Collaboration> {
    const prisma = getPrisma();
    return prisma.collaboration.create({
      data: {
        firstParty: data.firstParty,
        secondParty: data.secondParty,
        date: data.date,
        leadingPerson: data.leadingPerson,
        type: data.type,
        content: data.content,
      },
    });
  },

  async update(
    id: string,
    data: UpdateCollaborationInput
  ): Promise<Collaboration> {
    const prisma = getPrisma();
    return prisma.collaboration.update({
      where: { id },
      data: {
        ...(data.firstParty !== undefined
          ? { firstParty: data.firstParty }
          : {}),
        ...(data.secondParty !== undefined
          ? { secondParty: data.secondParty }
          : {}),
        ...(data.date !== undefined ? { date: data.date } : {}),
        ...(data.leadingPerson !== undefined
          ? { leadingPerson: data.leadingPerson }
          : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.content !== undefined ? { content: data.content } : {}),
      },
    });
  },

  async delete(id: string): Promise<Collaboration> {
    const prisma = getPrisma();
    return prisma.collaboration.delete({ where: { id } });
  },
};
