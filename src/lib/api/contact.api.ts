import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  ContactInquiryRecord,
  ContactPagination,
} from "@/components/admin/dashboard/contact/types";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface FetchContactInquiriesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedContactInquiriesResponse {
  items: ContactInquiryRecord[];
  pagination: ContactPagination;
}

const CONTACT_INQUIRIES_ENDPOINT = "/api/contact-inquiries";

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
 * Fetches paginated contact inquiries from `GET /api/contact-inquiries`.
 */
export async function fetchContactInquiries(
  params: FetchContactInquiriesParams = {},
  userRole?: AdminRole
): Promise<PaginatedContactInquiriesResponse> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs
    ? `${CONTACT_INQUIRIES_ENDPOINT}?${qs}`
    : CONTACT_INQUIRIES_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    headers: buildRoleHeaders(userRole),
    cache: "no-store",
  });

  return parseApiResponse<PaginatedContactInquiriesResponse>(response);
}

/**
 * Submits a new visitor inquiry to `POST /api/contact-inquiries` (`contact_inquiries` table).
 */
export async function createContactInquiry(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ContactInquiryRecord> {
  const response = await fetch(CONTACT_INQUIRIES_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  const record = await parseApiResponse<ContactInquiryRecord>(response);
  if (!record?.id) {
    throw new Error("Server did not return a saved contact inquiry record.");
  }
  return record;
}

/**
 * Deletes an existing contact inquiry via `DELETE /api/contact-inquiries/[id]`.
 */
export async function deleteContactInquiry(
  inquiryId: string,
  userRole?: AdminRole
): Promise<{ id: string }> {
  const response = await fetch(
    `${CONTACT_INQUIRIES_ENDPOINT}/${encodeURIComponent(inquiryId)}`,
    {
      method: "DELETE",
      headers: buildRoleHeaders(userRole),
    }
  );

  return parseApiResponse<{ id: string }>(response);
}
