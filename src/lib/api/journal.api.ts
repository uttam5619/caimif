import { authenticatedFetch } from "./authFetch";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  CreateJournalPaperPayload,
  JournalPaper,
  JournalPaperPagination,
  UpdateJournalPaperPayload,
} from "@/components/admin/dashboard/journalPaper/types";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface FetchJournalsParams {
  year?: number;
  domain?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedJournalsResponse {
  items: JournalPaper[];
  pagination: JournalPaperPagination;
}

const JOURNALS_ENDPOINT = "/api/journals";

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

/**
 * Fetches paginated journal publications from `/api/journals` with optional filters.
 */
export async function fetchJournals(
  params: FetchJournalsParams = {}
): Promise<PaginatedJournalsResponse> {
  const searchParams = new URLSearchParams();
  if (params.year !== undefined) searchParams.set("year", String(params.year));
  if (params.domain) searchParams.set("domain", params.domain);
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs ? `${JOURNALS_ENDPOINT}?${qs}` : JOURNALS_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PaginatedJournalsResponse>(response);
}

/**
 * Submits a new Journal Paper payload to `POST /api/journals`.
 * Explicitly forwards only `journal.prisma` attributes (`id` is generated server-side).
 */
export async function createJournal(
  payload: CreateJournalPaperPayload,
  _userRole?: AdminRole
): Promise<JournalPaper> {
  void _userRole;
  const sanitizedPayload: CreateJournalPaperPayload = {
    year: payload.year,
    domain: payload.domain,
    title: payload.title,
    authorFromCaimif: payload.authorFromCaimif,
    otherAuthors: payload.otherAuthors,
    journalName: payload.journalName,
    publisher: payload.publisher,
    indexing: payload.indexing,
    quartile: payload.quartile,
    weblink: payload.weblink,
  };

  const response = await authenticatedFetch(JOURNALS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sanitizedPayload),
  });

  return parseApiResponse<JournalPaper>(response);
}

/**
 * Partially updates an existing Journal Paper record via `PATCH /api/journals/[id]`.
 */
export async function updateJournal(
  journalId: string,
  payload: UpdateJournalPaperPayload,
  _userRole?: AdminRole
): Promise<JournalPaper> {
  void _userRole;
  const response = await authenticatedFetch(
    `${JOURNALS_ENDPOINT}/${encodeURIComponent(journalId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return parseApiResponse<JournalPaper>(response);
}

/**
 * Deletes an existing Journal Paper record via `DELETE /api/journals/[id]`.
 */
export async function deleteJournal(
  journalId: string,
  _userRole?: AdminRole
): Promise<{ id: string }> {
  void _userRole;
  const response = await authenticatedFetch(
    `${JOURNALS_ENDPOINT}/${encodeURIComponent(journalId)}`,
    {
      method: "DELETE",
    }
  );

  return parseApiResponse<{ id: string }>(response);
}
