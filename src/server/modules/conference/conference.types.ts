/**
 * Serialized DTO representing a Conference publication record.
 */
export interface ConferenceDto {
  id: string;
  year: number;
  domain: string;
  title: string;
  authorFromCaimif: string;
  otherAuthors: string | null;
  conferenceName: string;
  publisher: string | null;
  indexing: string | null;
  quartile: string | null;
  weblink: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input payload for creating a new Conference record.
 */
export interface CreateConferenceInput {
  year: number;
  domain: string;
  title: string;
  authorFromCaimif: string;
  otherAuthors?: string | null;
  conferenceName: string;
  publisher?: string | null;
  indexing?: string | null;
  quartile?: string | null;
  weblink?: string | null;
}

/**
 * Input payload for partially updating an existing Conference record.
 */
export type UpdateConferenceInput = Partial<CreateConferenceInput>;

/**
 * Validated query parameters for listing/filtering Conference records.
 */
export interface ListConferencesQuery {
  year?: number;
  domain?: string;
  search?: string;
  page: number;
  limit: number;
}

/**
 * Paginated list response returned by the Conference listing endpoint.
 */
export interface PaginatedConferencesDto {
  items: ConferenceDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
