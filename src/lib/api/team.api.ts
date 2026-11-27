import { authenticatedFetch } from "./authFetch";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  TeamCategory,
  TeamMemberRecord,
  TeamPagination,
} from "@/components/admin/dashboard/team/types";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface FetchTeamMembersParams {
  category?: TeamCategory | "";
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedTeamResponse {
  items: TeamMemberRecord[];
  pagination: TeamPagination;
}

const TEAM_ENDPOINT = "/api/team";

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
 * Fetches paginated team member records from `/api/team` with optional filters.
 */
export async function fetchTeamMembers(
  params: FetchTeamMembersParams = {}
): Promise<PaginatedTeamResponse> {
  const searchParams = new URLSearchParams();
  if (params.category) searchParams.set("category", params.category);
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs ? `${TEAM_ENDPOINT}?${qs}` : TEAM_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PaginatedTeamResponse>(response);
}

/**
 * Submits a new Team member multipart FormData payload to `POST /api/team`.
 */
export async function createTeamMember(
  formData: FormData,
  _userRole?: AdminRole
): Promise<TeamMemberRecord> {
  const response = await authenticatedFetch(TEAM_ENDPOINT, {
    method: "POST",
    headers: buildRoleHeaders(_userRole),
    body: formData,
  });

  return parseApiResponse<TeamMemberRecord>(response);
}

/**
 * Partially updates an existing Team member record via `PATCH /api/team/[id]`.
 */
export async function updateTeamMember(
  memberId: string,
  formData: FormData,
  _userRole?: AdminRole
): Promise<TeamMemberRecord> {
  const response = await fetch(
    `${TEAM_ENDPOINT}/${encodeURIComponent(memberId)}`,
    {
      method: "PATCH",
      headers: buildRoleHeaders(_userRole),
      body: formData,
    }
  );

  return parseApiResponse<TeamMemberRecord>(response);
}

/**
 * Deletes an existing Team member record via `DELETE /api/team/[id]`.
 */
export async function deleteTeamMember(
  memberId: string,
  _userRole?: AdminRole
): Promise<{ id: string }> {
  const response = await fetch(
    `${TEAM_ENDPOINT}/${encodeURIComponent(memberId)}`,
    {
      method: "DELETE",
      headers: buildRoleHeaders(_userRole),
    }
  );

  return parseApiResponse<{ id: string }>(response);
}
