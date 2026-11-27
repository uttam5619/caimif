import { NotFoundError } from "@/server/utils/errors/AppError";
import type { ContactInquiry } from "../../../../prisma/generated/prisma/client";
import { contactRepository } from "./contact.repository";
import type {
  ContactInquiryDto,
  CreateContactInquiryInput,
  ListContactInquiriesQuery,
  PaginatedContactInquiriesDto,
} from "./contact.types";

function toContactInquiryDto(record: ContactInquiry): ContactInquiryDto {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    subject: record.subject,
    message: record.message,
    createdAt: record.createdAt.toISOString(),
  };
}

/**
 * Service layer managing `ContactInquiry` workflows and DTO mapping.
 */
export const contactService = {
  async listInquiries(
    query: ListContactInquiriesQuery
  ): Promise<PaginatedContactInquiriesDto> {
    const { items, total } = await contactRepository.findManyPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));

    return {
      items: items.map(toContactInquiryDto),
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
      },
    };
  },

  async createInquiry(
    input: CreateContactInquiryInput
  ): Promise<ContactInquiryDto> {
    const created = await contactRepository.create(input);
    return toContactInquiryDto(created);
  },

  async deleteInquiry(id: string): Promise<void> {
    const existing = await contactRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Contact inquiry not found.");
    }
    await contactRepository.delete(id);
  },
};
