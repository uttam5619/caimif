import { authenticatedFetch } from "./authFetch";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  DomainFieldDefinition,
  HandleFieldFormData,
  ResearchDomain,
} from "@/components/admin/dashboard/researchDomain/types";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

const DOMAINS_ENDPOINT = "/api/research-domains";
const FIELDS_ENDPOINT = "/api/research-domain-fields";

/**
 * Unwraps the standard backend API response envelope and raises descriptive errors.
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
 * Builds role headers for local pre-session environments while preserving cookie/JWT credentials.
 */
function buildRoleHeaders(__userRole?: AdminRole): HeadersInit {
  void __userRole;
  return {};
}

export async function fetchResearchDomains(): Promise<ResearchDomain[]> {
  const response = await fetch(DOMAINS_ENDPOINT, {
    method: "GET",
    cache: "no-store",
  });
  return parseApiResponse<ResearchDomain[]>(response);
}

export async function createResearchDomain(
  formData: FormData,
  _userRole?: AdminRole
): Promise<ResearchDomain> {
  const response = await authenticatedFetch(DOMAINS_ENDPOINT, {
    method: "POST",
    headers: buildRoleHeaders(_userRole),
    body: formData,
  });
  return parseApiResponse<ResearchDomain>(response);
}

export async function updateResearchDomain(
  domainId: string,
  formData: FormData,
  _userRole?: AdminRole
): Promise<ResearchDomain> {
  const response = await authenticatedFetch(`${DOMAINS_ENDPOINT}/${encodeURIComponent(domainId)}`, {
    method: "PATCH",
    headers: buildRoleHeaders(_userRole),
    body: formData,
  });
  return parseApiResponse<ResearchDomain>(response);
}

export async function deleteResearchDomain(
  domainId: string,
  _userRole?: AdminRole
): Promise<{ id: string }> {
  const response = await authenticatedFetch(`${DOMAINS_ENDPOINT}/${encodeURIComponent(domainId)}`, {
    method: "DELETE",
    headers: buildRoleHeaders(_userRole),
  });
  return parseApiResponse<{ id: string }>(response);
}

export async function fetchResearchDomainFields(): Promise<DomainFieldDefinition[]> {
  const response = await fetch(FIELDS_ENDPOINT, {
    method: "GET",
    cache: "no-store",
  });
  return parseApiResponse<DomainFieldDefinition[]>(response);
}

export async function createResearchDomainField(
  fieldData: HandleFieldFormData,
  _userRole?: AdminRole
): Promise<DomainFieldDefinition> {
  const response = await authenticatedFetch(FIELDS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildRoleHeaders(_userRole),
    },
    body: JSON.stringify(fieldData),
  });
  return parseApiResponse<DomainFieldDefinition>(response);
}

export async function updateResearchDomainField(
  fieldId: string,
  fieldData: HandleFieldFormData,
  _userRole?: AdminRole
): Promise<DomainFieldDefinition> {
  const response = await authenticatedFetch(`${FIELDS_ENDPOINT}/${encodeURIComponent(fieldId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...buildRoleHeaders(_userRole),
    },
    body: JSON.stringify(fieldData),
  });
  return parseApiResponse<DomainFieldDefinition>(response);
}

export async function deleteResearchDomainField(
  fieldId: string,
  _userRole?: AdminRole
): Promise<{ id: string }> {
  const response = await authenticatedFetch(`${FIELDS_ENDPOINT}/${encodeURIComponent(fieldId)}`, {
    method: "DELETE",
    headers: buildRoleHeaders(_userRole),
  });
  return parseApiResponse<{ id: string }>(response);
}
