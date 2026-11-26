import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  TrainingPagination,
  TrainingRecord,
} from "@/components/admin/dashboard/training/types";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface FetchTrainingsParams {
  isRegistrationOpen?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedTrainingsResponse {
  items: TrainingRecord[];
  pagination: TrainingPagination;
}

const TRAININGS_ENDPOINT = "/api/trainings";

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
 * Fetches paginated training records from `/api/trainings` with optional filters.
 */
export async function fetchTrainings(
  params: FetchTrainingsParams = {}
): Promise<PaginatedTrainingsResponse> {
  const searchParams = new URLSearchParams();
  if (params.isRegistrationOpen !== undefined) {
    searchParams.set("isRegistrationOpen", String(params.isRegistrationOpen));
  }
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs ? `${TRAININGS_ENDPOINT}?${qs}` : TRAININGS_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PaginatedTrainingsResponse>(response);
}

/**
 * Submits a new Training multipart FormData payload to `POST /api/trainings`.
 */
export async function createTraining(
  formData: FormData,
  userRole?: AdminRole
): Promise<TrainingRecord> {
  const response = await fetch(TRAININGS_ENDPOINT, {
    method: "POST",
    headers: buildRoleHeaders(userRole),
    body: formData,
  });

  return parseApiResponse<TrainingRecord>(response);
}

/**
 * Partially updates an existing Training record via `PATCH /api/trainings/[id]`.
 */
export async function updateTraining(
  trainingId: number,
  formData: FormData,
  userRole?: AdminRole
): Promise<TrainingRecord> {
  const response = await fetch(
    `${TRAININGS_ENDPOINT}/${encodeURIComponent(String(trainingId))}`,
    {
      method: "PATCH",
      headers: buildRoleHeaders(userRole),
      body: formData,
    }
  );

  return parseApiResponse<TrainingRecord>(response);
}

/**
 * Deletes an existing Training record via `DELETE /api/trainings/[id]`.
 */
export async function deleteTraining(
  trainingId: number,
  userRole?: AdminRole
): Promise<{ id: number }> {
  const response = await fetch(
    `${TRAININGS_ENDPOINT}/${encodeURIComponent(String(trainingId))}`,
    {
      method: "DELETE",
      headers: buildRoleHeaders(userRole),
    }
  );

  return parseApiResponse<{ id: number }>(response);
}
