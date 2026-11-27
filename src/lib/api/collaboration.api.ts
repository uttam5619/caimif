import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  CollaborationPagination,
  CollaborationPayload,
  CollaborationRecord,
} from "@/components/admin/dashboard/collaboration/types";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface FetchCollaborationsParams {
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedCollaborationsResponse {
  items: CollaborationRecord[];
  pagination: CollaborationPagination;
}

const COLLABORATIONS_ENDPOINT = "/api/collaborations";

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
 * Fetches paginated collaboration records from `GET /api/collaborations`.
 */
export async function fetchCollaborations(
  params: FetchCollaborationsParams = {}
): Promise<PaginatedCollaborationsResponse> {
  const searchParams = new URLSearchParams();
  if (params.type) searchParams.set("type", params.type);
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs
    ? `${COLLABORATIONS_ENDPOINT}?${qs}`
    : COLLABORATIONS_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PaginatedCollaborationsResponse>(response);
}

/**
 * Creates a new collaboration record via `POST /api/collaborations`.
 */
export async function createCollaboration(
  payload: CollaborationPayload,
  userRole?: AdminRole
): Promise<CollaborationRecord> {
  const response = await fetch(COLLABORATIONS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildRoleHeaders(userRole),
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<CollaborationRecord>(response);
}

/**
 * Partially updates an existing collaboration record via `PATCH /api/collaborations/[id]`.
 */
export async function updateCollaboration(
  recordId: string,
  payload: Partial<CollaborationPayload>,
  userRole?: AdminRole
): Promise<CollaborationRecord> {
  const response = await fetch(
    `${COLLABORATIONS_ENDPOINT}/${encodeURIComponent(recordId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...buildRoleHeaders(userRole),
      },
      body: JSON.stringify(payload),
    }
  );

  return parseApiResponse<CollaborationRecord>(response);
}

/**
 * Deletes an existing collaboration record via `DELETE /api/collaborations/[id]`.
 */
export async function deleteCollaboration(
  recordId: string,
  userRole?: AdminRole
): Promise<{ id: string }> {
  const response = await fetch(
    `${COLLABORATIONS_ENDPOINT}/${encodeURIComponent(recordId)}`,
    {
      method: "DELETE",
      headers: buildRoleHeaders(userRole),
    }
  );

  return parseApiResponse<{ id: string }>(response);
}
