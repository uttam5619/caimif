import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  CreatePatentPayload,
  PatentPagination,
  PatentRecord,
  PatentStatus,
  UpdatePatentPayload,
} from "@/components/admin/dashboard/patent/types";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface FetchPatentsParams {
  year?: number;
  domain?: string;
  status?: PatentStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedPatentsResponse {
  items: PatentRecord[];
  pagination: PatentPagination;
}

const PATENTS_ENDPOINT = "/api/patents";

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
 * Fetches paginated patent records from `/api/patents` with optional filters.
 */
export async function fetchPatents(
  params: FetchPatentsParams = {}
): Promise<PaginatedPatentsResponse> {
  const searchParams = new URLSearchParams();
  if (params.year !== undefined) searchParams.set("year", String(params.year));
  if (params.domain) searchParams.set("domain", params.domain);
  if (params.status) searchParams.set("status", params.status);
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs ? `${PATENTS_ENDPOINT}?${qs}` : PATENTS_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PaginatedPatentsResponse>(response);
}

/**
 * Submits a new Patent payload to `POST /api/patents`.
 * Explicitly forwards only `patents.prisma` attributes (`id` is generated server-side).
 */
export async function createPatent(
  payload: CreatePatentPayload,
  userRole?: AdminRole
): Promise<PatentRecord> {
  const sanitizedPayload: CreatePatentPayload = {
    domain: payload.domain,
    title: payload.title,
    status: payload.status,
    nameOfInventors: payload.nameOfInventors,
    patentAgency: payload.patentAgency,
    country: payload.country,
    grantNumber: payload.grantNumber,
  };

  const response = await fetch(PATENTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildRoleHeaders(userRole),
    },
    body: JSON.stringify(sanitizedPayload),
  });

  return parseApiResponse<PatentRecord>(response);
}

/**
 * Partially updates an existing Patent record via `PATCH /api/patents/[id]`.
 */
export async function updatePatent(
  patentId: string,
  payload: UpdatePatentPayload,
  userRole?: AdminRole
): Promise<PatentRecord> {
  const response = await fetch(
    `${PATENTS_ENDPOINT}/${encodeURIComponent(patentId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...buildRoleHeaders(userRole),
      },
      body: JSON.stringify(payload),
    }
  );

  return parseApiResponse<PatentRecord>(response);
}

/**
 * Deletes an existing Patent record via `DELETE /api/patents/[id]`.
 */
export async function deletePatent(
  patentId: string,
  userRole?: AdminRole
): Promise<{ id: string }> {
  const response = await fetch(
    `${PATENTS_ENDPOINT}/${encodeURIComponent(patentId)}`,
    {
      method: "DELETE",
      headers: buildRoleHeaders(userRole),
    }
  );

  return parseApiResponse<{ id: string }>(response);
}
