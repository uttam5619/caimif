import { authenticatedFetch } from "./authFetch";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  FeaturedResearchPagination,
  FeaturedResearchRecord,
} from "@/components/admin/dashboard/featuredResearch/types";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface FetchFeaturedResearchParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedFeaturedResearchResponse {
  items: FeaturedResearchRecord[];
  pagination: FeaturedResearchPagination;
}

const FEATURED_RESEARCH_ENDPOINT = "/api/featured-research";

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
 * Fetches paginated featured research records from `/api/featured-research`.
 */
export async function fetchFeaturedResearch(
  params: FetchFeaturedResearchParams = {}
): Promise<PaginatedFeaturedResearchResponse> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs
    ? `${FEATURED_RESEARCH_ENDPOINT}?${qs}`
    : FEATURED_RESEARCH_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PaginatedFeaturedResearchResponse>(response);
}

/**
 * Submits a new FeaturedResearch multipart FormData payload to `POST /api/featured-research`.
 */
export async function createFeaturedResearch(
  formData: FormData,
  _userRole?: AdminRole
): Promise<FeaturedResearchRecord> {
  const response = await authenticatedFetch(FEATURED_RESEARCH_ENDPOINT, {
    method: "POST",
    headers: buildRoleHeaders(_userRole),
    body: formData,
  });

  return parseApiResponse<FeaturedResearchRecord>(response);
}

/**
 * Partially updates an existing FeaturedResearch record via `PATCH /api/featured-research/[id]`.
 */
export async function updateFeaturedResearch(
  recordId: string,
  formData: FormData,
  _userRole?: AdminRole
): Promise<FeaturedResearchRecord> {
  const response = await fetch(
    `${FEATURED_RESEARCH_ENDPOINT}/${encodeURIComponent(recordId)}`,
    {
      method: "PATCH",
      headers: buildRoleHeaders(_userRole),
      body: formData,
    }
  );

  return parseApiResponse<FeaturedResearchRecord>(response);
}

/**
 * Deletes an existing FeaturedResearch record via `DELETE /api/featured-research/[id]`.
 */
export async function deleteFeaturedResearch(
  recordId: string,
  _userRole?: AdminRole
): Promise<{ id: string }> {
  const response = await fetch(
    `${FEATURED_RESEARCH_ENDPOINT}/${encodeURIComponent(recordId)}`,
    {
      method: "DELETE",
      headers: buildRoleHeaders(_userRole),
    }
  );

  return parseApiResponse<{ id: string }>(response);
}
