import { authenticatedFetch } from "./authFetch";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  EventPagination,
  EventRecord,
} from "@/components/admin/dashboard/events/types";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface FetchEventsParams {
  isRegistrationOpen?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedEventsResponse {
  items: EventRecord[];
  pagination: EventPagination;
}

const EVENTS_ENDPOINT = "/api/events";

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
 * Fetches paginated event records from `/api/events` with optional filters.
 */
export async function fetchEvents(
  params: FetchEventsParams = {}
): Promise<PaginatedEventsResponse> {
  const searchParams = new URLSearchParams();
  if (params.isRegistrationOpen !== undefined) {
    searchParams.set("isRegistrationOpen", String(params.isRegistrationOpen));
  }
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs ? `${EVENTS_ENDPOINT}?${qs}` : EVENTS_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PaginatedEventsResponse>(response);
}

/**
 * Submits a new Event multipart FormData payload to `POST /api/events`.
 */
export async function createEvent(
  formData: FormData,
  _userRole?: AdminRole
): Promise<EventRecord> {
  const response = await authenticatedFetch(EVENTS_ENDPOINT, {
    method: "POST",
    headers: buildRoleHeaders(_userRole),
    body: formData,
  });

  return parseApiResponse<EventRecord>(response);
}

/**
 * Partially updates an existing Event record via `PATCH /api/events/[id]`.
 */
export async function updateEvent(
  eventId: number,
  formData: FormData,
  _userRole?: AdminRole
): Promise<EventRecord> {
  const response = await fetch(
    `${EVENTS_ENDPOINT}/${encodeURIComponent(String(eventId))}`,
    {
      method: "PATCH",
      headers: buildRoleHeaders(_userRole),
      body: formData,
    }
  );

  return parseApiResponse<EventRecord>(response);
}

/**
 * Deletes an existing Event record via `DELETE /api/events/[id]`.
 */
export async function deleteEvent(
  eventId: number,
  _userRole?: AdminRole
): Promise<{ id: number }> {
  const response = await fetch(
    `${EVENTS_ENDPOINT}/${encodeURIComponent(String(eventId))}`,
    {
      method: "DELETE",
      headers: buildRoleHeaders(_userRole),
    }
  );

  return parseApiResponse<{ id: number }>(response);
}
