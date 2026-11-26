/**
 * Serialized Journal Paper entity matching `/api/journals` responses.
 */
export interface JournalPaper {
  id: string;
  year: number;
  domain: string;
  title: string;
  authorFromCaimif: string;
  otherAuthors: string | null;
  journalName: string;
  publisher: string | null;
  indexing: string | null;
  quartile: string | null;
  weblink: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Exact payload synchronized with `prisma/models/journal.prisma` for creating a Journal record.
 * Excludes server-generated fields (`id`, `createdAt`, `updatedAt`).
 */
export interface CreateJournalPaperPayload {
  year: number;
  domain: string;
  title: string;
  authorFromCaimif: string;
  otherAuthors: string | null;
  journalName: string;
  publisher: string | null;
  indexing: string | null;
  quartile: string | null;
  weblink: string | null;
}

/**
 * Partial payload for updating an existing Journal Paper via `PATCH /api/journals/[id]`.
 */
export type UpdateJournalPaperPayload = Partial<CreateJournalPaperPayload>;

/**
 * Pagination metadata returned by `/api/journals`.
 */
export interface JournalPaperPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Props for the JournalPaperList component.
 */
export interface JournalPaperListProps {
  journals: JournalPaper[];
  pagination: JournalPaperPagination;
  search: string;
  isLoading: boolean;
  loadError?: string | null;
  onSearchChange: (value: string) => void;
  onPageChange: (nextPage: number) => void;
  onEdit: (paper: JournalPaper) => void;
  onDelete: (paper: JournalPaper) => void;
}

/**
 * Props for the EditJournalPaperModal component.
 */
export interface EditJournalPaperModalProps {
  isOpen: boolean;
  paper: JournalPaper | null;
  onClose: () => void;
  onSave: (
    journalId: string,
    payload: UpdateJournalPaperPayload
  ) => Promise<void> | void;
}

/**
 * Props for the AddJournalPaperForm component.
 */
export interface AddJournalPaperFormProps {
  onSubmitPaper?: (payload: CreateJournalPaperPayload) => Promise<JournalPaper>;
  onSuccess?: (createdPaper: JournalPaper) => void;
}
