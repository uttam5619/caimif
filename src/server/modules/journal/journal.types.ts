/**
 * Serialized DTO representing a Journal publication record.
 */
export interface JournalDto {
  id: string;
  year: number;
  domain: string;
  title: string;
  authorFromCaimif: string;
  otherAuthors: string | null;
  journalName: string;
  publisher: string | null;
  indexing: string | null;
  quartile: string | null;
  weblink: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input payload for creating a new Journal record.
 */
export interface CreateJournalInput {
  year: number;
  domain: string;
  title: string;
  authorFromCaimif: string;
  otherAuthors?: string | null;
  journalName: string;
  publisher?: string | null;
  indexing?: string | null;
  quartile?: string | null;
  weblink?: string | null;
}

/**
 * Input payload for partially updating an existing Journal record.
 */
export type UpdateJournalInput = Partial<CreateJournalInput>;

/**
 * Validated query parameters for listing/filtering Journal records.
 */
export interface ListJournalsQuery {
  year?: number;
  domain?: string;
  search?: string;
  page: number;
  limit: number;
}

/**
 * Paginated list response returned by the Journal listing endpoint.
 */
export interface PaginatedJournalsDto {
  items: JournalDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
