/**
 * Identifiers for tabs inside the Collaboration dashboard section.
 */
export type CollaborationTabId = "list" | "add";

/**
 * Configuration item describing a single tab in CollaborationView.
 */
export interface CollaborationTabItem {
  id: CollaborationTabId;
  label: string;
}

/**
 * Serialized Collaboration entity matching `/api/collaborations` responses.
 */
export interface CollaborationRecord {
  id: string;
  firstParty: string;
  secondParty: string;
  date: string;
  leadingPerson: string;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request payload matching `Collaboration` attributes in `prisma/models/collaboration.prisma`.
 */
export interface CollaborationPayload {
  firstParty: string;
  secondParty: string;
  date: string;
  leadingPerson: string;
  type: string;
  content: string;
}

export interface CollaborationPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CollaborationListProps {
  items: CollaborationRecord[];
  pagination: CollaborationPagination;
  search: string;
  isLoading: boolean;
  loadError?: string | null;
  onSearchChange: (value: string) => void;
  onPageChange: (nextPage: number) => void;
  onEdit: (record: CollaborationRecord) => void;
  onDelete: (record: CollaborationRecord) => void;
}

export interface AddCollaborationFormProps {
  onSubmitCollaboration?: (
    payload: CollaborationPayload
  ) => Promise<CollaborationRecord>;
  onSuccess?: (createdRecord: CollaborationRecord) => void;
}

export interface EditCollaborationModalProps {
  isOpen: boolean;
  record: CollaborationRecord | null;
  onClose: () => void;
  onSave: (
    recordId: string,
    payload: Partial<CollaborationPayload>
  ) => Promise<void> | void;
}
