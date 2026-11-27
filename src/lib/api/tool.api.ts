import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  ToolCategoryRecord,
  ToolPagination,
  ToolRecord,
} from "@/components/admin/dashboard/tool/types";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface FetchToolCategoriesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedToolCategoriesResponse {
  items: ToolCategoryRecord[];
  pagination: ToolPagination;
}

export interface FetchToolsParams {
  toolTypeId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedToolsResponse {
  items: ToolRecord[];
  pagination: ToolPagination;
}

const TOOL_TYPES_ENDPOINT = "/api/tool-types";
const TOOLS_ENDPOINT = "/api/tools";

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
 * Fetches paginated `ToolType` categories from `GET /api/tool-types`.
 */
export async function fetchToolCategories(
  params: FetchToolCategoriesParams = {}
): Promise<PaginatedToolCategoriesResponse> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs ? `${TOOL_TYPES_ENDPOINT}?${qs}` : TOOL_TYPES_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PaginatedToolCategoriesResponse>(response);
}

/**
 * Creates a new `ToolType` category via `POST /api/tool-types`.
 */
export async function createToolCategory(
  payload: { name: string },
  userRole?: AdminRole
): Promise<ToolCategoryRecord> {
  const response = await fetch(TOOL_TYPES_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildRoleHeaders(userRole),
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<ToolCategoryRecord>(response);
}

/**
 * Partially updates an existing `ToolType` category via `PATCH /api/tool-types/[id]`.
 */
export async function updateToolCategory(
  categoryId: string,
  payload: { name?: string },
  userRole?: AdminRole
): Promise<ToolCategoryRecord> {
  const response = await fetch(
    `${TOOL_TYPES_ENDPOINT}/${encodeURIComponent(categoryId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...buildRoleHeaders(userRole),
      },
      body: JSON.stringify(payload),
    }
  );

  return parseApiResponse<ToolCategoryRecord>(response);
}

/**
 * Deletes an existing `ToolType` category via `DELETE /api/tool-types/[id]`.
 */
export async function deleteToolCategory(
  categoryId: string,
  userRole?: AdminRole
): Promise<{ id: string }> {
  const response = await fetch(
    `${TOOL_TYPES_ENDPOINT}/${encodeURIComponent(categoryId)}`,
    {
      method: "DELETE",
      headers: buildRoleHeaders(userRole),
    }
  );

  return parseApiResponse<{ id: string }>(response);
}

/**
 * Fetches paginated `Tool` records from `GET /api/tools`.
 */
export async function fetchTools(
  params: FetchToolsParams = {}
): Promise<PaginatedToolsResponse> {
  const searchParams = new URLSearchParams();
  if (params.toolTypeId) searchParams.set("toolTypeId", params.toolTypeId);
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs ? `${TOOLS_ENDPOINT}?${qs}` : TOOLS_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PaginatedToolsResponse>(response);
}

/**
 * Creates a new `Tool` via multipart upload to `POST /api/tools`.
 */
export async function createTool(
  formData: FormData,
  userRole?: AdminRole
): Promise<ToolRecord> {
  const response = await fetch(TOOLS_ENDPOINT, {
    method: "POST",
    headers: buildRoleHeaders(userRole),
    body: formData,
  });

  return parseApiResponse<ToolRecord>(response);
}

/**
 * Partially updates an existing `Tool` via `PATCH /api/tools/[id]`.
 */
export async function updateTool(
  toolId: string,
  formData: FormData,
  userRole?: AdminRole
): Promise<ToolRecord> {
  const response = await fetch(
    `${TOOLS_ENDPOINT}/${encodeURIComponent(toolId)}`,
    {
      method: "PATCH",
      headers: buildRoleHeaders(userRole),
      body: formData,
    }
  );

  return parseApiResponse<ToolRecord>(response);
}

/**
 * Deletes an existing `Tool` via `DELETE /api/tools/[id]`.
 */
export async function deleteTool(
  toolId: string,
  userRole?: AdminRole
): Promise<{ id: string }> {
  const response = await fetch(
    `${TOOLS_ENDPOINT}/${encodeURIComponent(toolId)}`,
    {
      method: "DELETE",
      headers: buildRoleHeaders(userRole),
    }
  );

  return parseApiResponse<{ id: string }>(response);
}
