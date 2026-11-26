/**
 * Serialized DTO representing a BookChapter publication record.
 */
export interface BookChapterDto {
  id: string;
  year: number;
  domain: string;
  chapterTitle: string;
  bookName: string;
  authorFromCaimif: string;
  otherAuthors: string | null;
  publisher: string | null;
  indexing: string | null;
  quartile: string | null;
  weblink: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input payload for creating a new BookChapter record.
 */
export interface CreateBookChapterInput {
  year: number;
  domain: string;
  chapterTitle: string;
  bookName: string;
  authorFromCaimif: string;
  otherAuthors?: string | null;
  publisher?: string | null;
  indexing?: string | null;
  quartile?: string | null;
  weblink?: string | null;
}

/**
 * Input payload for partially updating an existing BookChapter record.
 */
export type UpdateBookChapterInput = Partial<CreateBookChapterInput>;

/**
 * Validated query parameters for listing/filtering BookChapter records.
 */
export interface ListBookChaptersQuery {
  year?: number;
  domain?: string;
  search?: string;
  page: number;
  limit: number;
}

/**
 * Paginated list response returned by the BookChapter listing endpoint.
 */
export interface PaginatedBookChaptersDto {
  items: BookChapterDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
