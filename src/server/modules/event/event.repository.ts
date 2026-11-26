import { getPrisma } from "@/server/database/prisma";
import type { Event, Prisma } from "../../../../prisma/generated/prisma/client";
import type { ListEventsQuery } from "./event.types";

/**
 * Builds Prisma `where` filter clauses from validated query parameters.
 */
function buildEventWhereClause(query: ListEventsQuery): Prisma.EventWhereInput {
  const where: Prisma.EventWhereInput = {};

  if (query.isRegistrationOpen !== undefined) {
    where.isRegistrationOpen = query.isRegistrationOpen;
  }

  if (query.search !== undefined) {
    where.OR = [
      { title: { contains: query.search } },
      { shortDescription: { contains: query.search } },
      { description: { contains: query.search } },
      { location: { contains: query.search } },
      { venue: { contains: query.search } },
    ];
  }

  return where;
}

/**
 * Repository encapsulating all Prisma ORM operations for the `Event` model.
 * Contains zero business logic or HTTP request/response handling.
 */
export const eventRepository = {
  async findManyPaginated(
    query: ListEventsQuery
  ): Promise<{ items: Event[]; total: number }> {
    const prisma = getPrisma();
    const where = buildEventWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.event.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id: number): Promise<Event | null> {
    const prisma = getPrisma();
    return prisma.event.findUnique({ where: { id } });
  },

  async create(data: {
    title: string;
    shortDescription: string | null;
    description: string;
    image: string | null;
    startDate: Date;
    endDate: Date;
    location: string | null;
    venue: string | null;
    isRegistrationOpen: boolean;
  }): Promise<Event> {
    const prisma = getPrisma();
    return prisma.event.create({ data });
  },

  async update(id: number, data: Prisma.EventUpdateInput): Promise<Event> {
    const prisma = getPrisma();
    return prisma.event.update({
      where: { id },
      data,
    });
  },

  async delete(id: number): Promise<Event> {
    const prisma = getPrisma();
    return prisma.event.delete({ where: { id } });
  },
};
