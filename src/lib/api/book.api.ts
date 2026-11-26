import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  BookPagination,
  BookRecord,
  CreateBookPayload,
  UpdateBookPayload,
} from "@/components/admin/dashboard/book/types";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface FetchBooksParams {
  year?: number;
  domain?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedBooksResponse {
  items: BookRecord[];
  pagination: BookPagination;
}

const BOOKS_ENDPOINT = "/api/books";

/**
 * Unwraps standard API responses and throws descriptive error messages on failure.
 */
async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.success) {
    const errorMessage =
      payload?.error?.message ||
      payload?.message ||
      `Request failed with status ${response.status}.`;
    throw new Error(errorMessage);
  }

  return payload.data as T;
}

function buildRoleHeaders(userRole?: AdminRole): HeadersInit {
  return userRole ? { "x-admin-role": userRole } : {};
}

/**
 * Fetches paginated book publications from `/api/books` with optional filters.
 */
export async function fetchBooks(
  params: FetchBooksParams = {}
): Promise<PaginatedBooksResponse> {
  const searchParams = new URLSearchParams();
  if (params.year !== undefined) searchParams.set("year", String(params.year));
  if (params.domain) searchParams.set("domain", params.domain);
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs ? `${BOOKS_ENDPOINT}?${qs}` : BOOKS_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PaginatedBooksResponse>(response);
}

/**
 * Submits a new Book payload to `POST /api/books`.
 * Explicitly forwards only `book.prisma` attributes (`id` is generated server-side).
 */
export async function createBook(
  payload: CreateBookPayload,
  userRole?: AdminRole
): Promise<BookRecord> {
  const sanitizedPayload: CreateBookPayload = {
    year: payload.year,
    domain: payload.domain,
    title: payload.title,
    bookAuthor: payload.bookAuthor,
    authorFromCaimif: payload.authorFromCaimif,
    otherAuthors: payload.otherAuthors,
    publisher: payload.publisher,
    indexing: payload.indexing,
    quartile: payload.quartile,
    weblink: payload.weblink,
  };

  const response = await fetch(BOOKS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildRoleHeaders(userRole),
    },
    body: JSON.stringify(sanitizedPayload),
  });

  return parseApiResponse<BookRecord>(response);
}

/**
 * Partially updates an existing Book record via `PATCH /api/books/[id]`.
 */
export async function updateBook(
  bookId: string,
  payload: UpdateBookPayload,
  userRole?: AdminRole
): Promise<BookRecord> {
  const response = await fetch(`${BOOKS_ENDPOINT}/${encodeURIComponent(bookId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...buildRoleHeaders(userRole),
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<BookRecord>(response);
}

/**
 * Deletes an existing Book record via `DELETE /api/books/[id]`.
 */
export async function deleteBook(
  bookId: string,
  userRole?: AdminRole
): Promise<{ id: string }> {
  const response = await fetch(`${BOOKS_ENDPOINT}/${encodeURIComponent(bookId)}`, {
    method: "DELETE",
    headers: buildRoleHeaders(userRole),
  });

  return parseApiResponse<{ id: string }>(response);
}
