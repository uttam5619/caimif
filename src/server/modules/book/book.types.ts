/**
 * Serialized DTO representing a Book publication record.
 */
export interface BookDto {
  id: string;
  year: number | null;
  domain: string | null;
  title: string;
  bookAuthor: string;
  authorFromCaimif: string | null;
  otherAuthors: string | null;
  publisher: string | null;
  indexing: string | null;
  quartile: string | null;
  weblink: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input payload for creating a new Book record.
 * Only `title` (book title) and `bookAuthor` (book author) are mandatory.
 */
export interface CreateBookInput {
  year?: number | null;
  domain?: string | null;
  title: string;
  bookAuthor: string;
  authorFromCaimif?: string | null;
  otherAuthors?: string | null;
  publisher?: string | null;
  indexing?: string | null;
  quartile?: string | null;
  weblink?: string | null;
}

/**
 * Input payload for partially updating an existing Book record.
 */
export type UpdateBookInput = Partial<CreateBookInput>;

/**
 * Validated query parameters for listing/filtering Book records.
 */
export interface ListBooksQuery {
  year?: number;
  domain?: string;
  search?: string;
  page: number;
  limit: number;
}

/**
 * Paginated list response returned by the Book listing endpoint.
 */
export interface PaginatedBooksDto {
  items: BookDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
