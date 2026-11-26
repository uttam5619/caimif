/**
 * Identifiers for tabs inside the Conference Paper dashboard view.
 */
export type ConferencePaperTabId = "list" | "add";

/**
 * Configuration item describing a single tab in the Conference Paper switcher.
 */
export interface ConferencePaperTabItem {
  id: ConferencePaperTabId;
  label: string;
}

/**
 * Serialized Conference Paper entity matching `/api/conferences` responses.
 */
export interface ConferencePaper {
  id: string;
  year: number;
  domain: string;
  title: string;
  authorFromCaimif: string;
  otherAuthors: string | null;
  conferenceName: string;
  publisher: string | null;
  indexing: string | null;
  quartile: string | null;
  weblink: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Exact payload synchronized with `prisma/models/conference.prisma` for creating a Conference record.
 * Excludes server-generated fields (`id`, `createdAt`, `updatedAt`).
 */
export interface CreateConferencePaperPayload {
  year: number;
  domain: string;
  title: string;
  authorFromCaimif: string;
  otherAuthors: string | null;
  conferenceName: string;
  publisher: string | null;
  indexing: string | null;
  quartile: string | null;
  weblink: string | null;
}

/**
 * Payload for updating an existing Conference record.
 */
export type UpdateConferencePaperPayload = Partial<CreateConferencePaperPayload>;

/**
 * Pagination metadata returned by `/api/conferences`.
 */
export interface ConferencePaperPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Props for the ConferencePaperList component.
 */
export interface ConferencePaperListProps {
  conferences: ConferencePaper[];
  pagination: ConferencePaperPagination;
  search: string;
  isLoading: boolean;
  loadError?: string | null;
  onSearchChange: (value: string) => void;
  onPageChange: (nextPage: number) => void;
  onEdit: (conference: ConferencePaper) => void;
  onDelete: (conference: ConferencePaper) => void;
}

/**
 * Props for the EditConferenceModal component.
 */
export interface EditConferenceModalProps {
  isOpen: boolean;
  conference: ConferencePaper | null;
  onClose: () => void;
  onSave: (
    conferenceId: string,
    payload: UpdateConferencePaperPayload
  ) => Promise<void> | void;
}

/**
 * Props for the AddConferencePaperForm component.
 */
export interface AddConferencePaperFormProps {
  onSubmitPaper?: (
    payload: CreateConferencePaperPayload
  ) => Promise<ConferencePaper>;
  onSuccess?: (createdPaper: ConferencePaper) => void;
}
