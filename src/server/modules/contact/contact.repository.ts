import { getPrisma } from "@/server/database/prisma";
import type {
  ContactInquiry,
  Prisma,
} from "../../../../prisma/generated/prisma/client";
import type {
  CreateContactInquiryInput,
  ListContactInquiriesQuery,
} from "./contact.types";

function buildContactWhereClause(
  query: ListContactInquiriesQuery
): Prisma.ContactInquiryWhereInput {
  if (!query.search) {
    return {};
  }

  return {
    OR: [
      { name: { contains: query.search } },
      { email: { contains: query.search } },
      { subject: { contains: query.search } },
      { message: { contains: query.search } },
    ],
  };
}

/**
 * Repository encapsulating all Prisma ORM operations for the `ContactInquiry` model.
 * Contains zero business logic or HTTP request/response handling.
 */
export const contactRepository = {
  async findManyPaginated(
    query: ListContactInquiriesQuery
  ): Promise<{ items: ContactInquiry[]; total: number }> {
    const prisma = getPrisma();
    const where = buildContactWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.contactInquiry.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.contactInquiry.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id: string): Promise<ContactInquiry | null> {
    const prisma = getPrisma();
    return prisma.contactInquiry.findUnique({ where: { id } });
  },

  async create(data: CreateContactInquiryInput): Promise<ContactInquiry> {
    const prisma = getPrisma();
    return prisma.contactInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      },
    });
  },

  async delete(id: string): Promise<ContactInquiry> {
    const prisma = getPrisma();
    return prisma.contactInquiry.delete({ where: { id } });
  },
};
