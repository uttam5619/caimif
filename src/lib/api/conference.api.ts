import { authenticatedFetch } from "./authFetch";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  ConferencePaper,
  ConferencePaperPagination,
  CreateConferencePaperPayload,
  UpdateConferencePaperPayload,
} from "@/components/admin/dashboard/conferencePaper/types";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface FetchConferencesParams {
  year?: number;
  domain?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedConferencesResponse {
  items: ConferencePaper[];
  pagination: ConferencePaperPagination;
}

const CONFERENCES_ENDPOINT = "/api/conferences";

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
 * Fetches paginated conference publications from `/api/conferences` with optional filters.
 */
export async function fetchConferences(
  params: FetchConferencesParams = {}
): Promise<PaginatedConferencesResponse> {
  const searchParams = new URLSearchParams();
  if (params.year !== undefined) searchParams.set("year", String(params.year));
  if (params.domain) searchParams.set("domain", params.domain);
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs ? `${CONFERENCES_ENDPOINT}?${qs}` : CONFERENCES_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PaginatedConferencesResponse>(response);
}

/**
 * Submits a new Conference Paper payload to `POST /api/conferences`.
 * Explicitly forwards only `conference.prisma` attributes (`id` is generated server-side).
 */
export async function createConference(
  payload: CreateConferencePaperPayload,
  _userRole?: AdminRole
): Promise<ConferencePaper> {
  const sanitizedPayload: CreateConferencePaperPayload = {
    year: payload.year,
    domain: payload.domain,
    title: payload.title,
    authorFromCaimif: payload.authorFromCaimif,
    otherAuthors: payload.otherAuthors,
    conferenceName: payload.conferenceName,
    publisher: payload.publisher,
    indexing: payload.indexing,
    quartile: payload.quartile,
    weblink: payload.weblink,
  };

  const response = await authenticatedFetch(CONFERENCES_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildRoleHeaders(_userRole),
    },
    body: JSON.stringify(sanitizedPayload),
  });

  return parseApiResponse<ConferencePaper>(response);
}

/**
 * Partially updates an existing Conference Paper via `PATCH /api/conferences/[id]`.
 */
export async function updateConference(
  conferenceId: string,
  payload: UpdateConferencePaperPayload,
  _userRole?: AdminRole
): Promise<ConferencePaper> {
  const response = await fetch(
    `${CONFERENCES_ENDPOINT}/${encodeURIComponent(conferenceId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...buildRoleHeaders(_userRole),
      },
      body: JSON.stringify(payload),
    }
  );

  return parseApiResponse<ConferencePaper>(response);
}

/**
 * Deletes an existing Conference Paper via `DELETE /api/conferences/[id]`.
 */
export async function deleteConference(
  conferenceId: string,
  _userRole?: AdminRole
): Promise<{ id: string }> {
  const response = await fetch(
    `${CONFERENCES_ENDPOINT}/${encodeURIComponent(conferenceId)}`,
    {
      method: "DELETE",
      headers: buildRoleHeaders(_userRole),
    }
  );

  return parseApiResponse<{ id: string }>(response);
}
