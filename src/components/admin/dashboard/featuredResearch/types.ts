/**
 * Identifiers for tabs inside the Featured Research dashboard view.
 */
export type FeaturedResearchTabId = "list" | "add";

/**
 * Configuration item describing a single tab in the Featured Research switcher.
 */
export interface FeaturedResearchTabItem {
  id: FeaturedResearchTabId;
  label: string;
}

/**
 * Serialized FeaturedResearch entity matching `/api/featured-research` responses.
 */
export interface FeaturedResearchRecord {
  id: string;
  imageKey: string;
  imageUrl?: string;
  authorName: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pagination metadata returned by `/api/featured-research`.
 */
export interface FeaturedResearchPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Props for the FeaturedResearchList component.
 */
export interface FeaturedResearchListProps {
  items: FeaturedResearchRecord[];
  pagination: FeaturedResearchPagination;
  search: string;
  isLoading: boolean;
  loadError?: string | null;
  onSearchChange: (value: string) => void;
  onPageChange: (nextPage: number) => void;
  onEdit: (record: FeaturedResearchRecord) => void;
  onDelete: (record: FeaturedResearchRecord) => void;
}

/**
 * Props for the EditFeaturedResearchModal component.
 */
export interface EditFeaturedResearchModalProps {
  isOpen: boolean;
  record: FeaturedResearchRecord | null;
  onClose: () => void;
  onSave: (recordId: string, payload: FormData) => Promise<void> | void;
}

/**
 * Props for the AddFeaturedResearchForm component.
 */
export interface AddFeaturedResearchFormProps {
  onSubmitFeaturedResearch?: (
    payload: FormData
  ) => Promise<FeaturedResearchRecord>;
  onSuccess?: (createdRecord: FeaturedResearchRecord) => void;
}
