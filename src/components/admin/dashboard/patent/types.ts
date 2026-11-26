/**
 * Identifiers for tabs inside the Patent dashboard view.
 */
export type PatentTabId = "list" | "add";

/**
 * Configuration item describing a single tab in the Patent switcher.
 */
export interface PatentTabItem {
  id: PatentTabId;
  label: string;
}

/**
 * Allowed patent statuses matching `PatentStatus` in `prisma/models/patents.prisma`.
 */
export type PatentStatus = "PUBLISHED" | "GRANTED";

/**
 * Serialized Patent entity matching `/api/patents` responses.
 */
export interface PatentRecord {
  id: string;
  year: number | null;
  domain: string | null;
  title: string;
  status: PatentStatus | null;
  nameOfInventors: string | null;
  patentAgency: string | null;
  country: string | null;
  grantNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Exact payload synchronized with `prisma/models/patents.prisma` for creating a Patent record
 * from the Add Patent form (`title` is the only required field; `id` is generated server-side).
 */
export interface CreatePatentPayload {
  domain: string | null;
  title: string;
  status: PatentStatus | null;
  nameOfInventors: string | null;
  patentAgency: string | null;
  country: string | null;
  grantNumber: string | null;
}

/**
 * Payload for updating an existing Patent record.
 */
export type UpdatePatentPayload = Partial<CreatePatentPayload>;

/**
 * Pagination metadata returned by `/api/patents`.
 */
export interface PatentPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Props for the PatentList component.
 */
export interface PatentListProps {
  patents: PatentRecord[];
  pagination: PatentPagination;
  search: string;
  isLoading: boolean;
  loadError?: string | null;
  onSearchChange: (value: string) => void;
  onPageChange: (nextPage: number) => void;
  onEdit: (patent: PatentRecord) => void;
  onDelete: (patent: PatentRecord) => void;
}

/**
 * Props for the EditPatentModal component.
 */
export interface EditPatentModalProps {
  isOpen: boolean;
  patent: PatentRecord | null;
  onClose: () => void;
  onSave: (
    patentId: string,
    payload: UpdatePatentPayload
  ) => Promise<void> | void;
}

/**
 * Props for the AddPatentForm component.
 */
export interface AddPatentFormProps {
  onSubmitPatent?: (payload: CreatePatentPayload) => Promise<PatentRecord>;
  onSuccess?: (createdPatent: PatentRecord) => void;
}
