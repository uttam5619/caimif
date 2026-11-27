import { authenticatedFetch } from "./authFetch";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  BookChapterPagination,
  BookChapterRecord,
  CreateBookChapterPayload,
  UpdateBookChapterPayload,
} from "@/components/admin/dashboard/bookChapter/types";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface FetchBookChaptersParams {
  year?: number;
  domain?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedBookChaptersResponse {
  items: BookChapterRecord[];
  pagination: BookChapterPagination;
}

const BOOK_CHAPTERS_ENDPOINT = "/api/book-chapters";

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

function buildRoleHeaders(__userRole?: AdminRole): HeadersInit {
  void __userRole;
  return {};
}

/**
 * Fetches paginated book chapter publications from `/api/book-chapters` with optional filters.
 */
export async function fetchBookChapters(
  params: FetchBookChaptersParams = {}
): Promise<PaginatedBookChaptersResponse> {
  const searchParams = new URLSearchParams();
  if (params.year !== undefined) searchParams.set("year", String(params.year));
  if (params.domain) searchParams.set("domain", params.domain);
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs ? `${BOOK_CHAPTERS_ENDPOINT}?${qs}` : BOOK_CHAPTERS_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PaginatedBookChaptersResponse>(response);
}

/**
 * Submits a new Book Chapter payload to `POST /api/book-chapters`.
 * Explicitly forwards only `bookChapter.prisma` attributes (`id` is generated server-side).
 */
export async function createBookChapter(
  payload: CreateBookChapterPayload,
  _userRole?: AdminRole
): Promise<BookChapterRecord> {
  const sanitizedPayload: CreateBookChapterPayload = {
    year: payload.year,
    domain: payload.domain,
    chapterTitle: payload.chapterTitle,
    bookName: payload.bookName,
    authorFromCaimif: payload.authorFromCaimif,
    otherAuthors: payload.otherAuthors,
    publisher: payload.publisher,
    indexing: payload.indexing,
    quartile: payload.quartile,
    weblink: payload.weblink,
  };

  const response = await authenticatedFetch(BOOK_CHAPTERS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildRoleHeaders(_userRole),
    },
    body: JSON.stringify(sanitizedPayload),
  });

  return parseApiResponse<BookChapterRecord>(response);
}

/**
 * Partially updates an existing Book Chapter record via `PATCH /api/book-chapters/[id]`.
 */
export async function updateBookChapter(
  chapterId: string,
  payload: UpdateBookChapterPayload,
  _userRole?: AdminRole
): Promise<BookChapterRecord> {
  const response = await fetch(
    `${BOOK_CHAPTERS_ENDPOINT}/${encodeURIComponent(chapterId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...buildRoleHeaders(_userRole),
      },
      body: JSON.stringify(payload),
    }
  );

  return parseApiResponse<BookChapterRecord>(response);
}

/**
 * Deletes an existing Book Chapter record via `DELETE /api/book-chapters/[id]`.
 */
export async function deleteBookChapter(
  chapterId: string,
  _userRole?: AdminRole
): Promise<{ id: string }> {
  const response = await fetch(
    `${BOOK_CHAPTERS_ENDPOINT}/${encodeURIComponent(chapterId)}`,
    {
      method: "DELETE",
      headers: buildRoleHeaders(_userRole),
    }
  );

  return parseApiResponse<{ id: string }>(response);
}
