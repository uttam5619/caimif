/**
 * Serialized DTO representing a `ContactInquiry` record.
 */
export interface ContactInquiryDto {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

/**
 * Validated payload for creating a `ContactInquiry` record.
 */
export interface CreateContactInquiryInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Validated query parameters for listing/filtering ContactInquiry records.
 */
export interface ListContactInquiriesQuery {
  search?: string;
  page: number;
  limit: number;
}

/**
 * Paginated response returned by `/api/contact-inquiries`.
 */
export interface PaginatedContactInquiriesDto {
  items: ContactInquiryDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
