/**
 * Identifier for the tab inside the Contact dashboard section.
 */
export type ContactTabId = "list";

export interface ContactTabItem {
  id: ContactTabId;
  label: string;
}

/**
 * Serialized ContactInquiry record matching `/api/contact-inquiries`.
 */
export interface ContactInquiryRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface ContactPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MessageListProps {
  items: ContactInquiryRecord[];
  pagination: ContactPagination;
  search: string;
  isLoading: boolean;
  loadError?: string | null;
  onSearchChange: (value: string) => void;
  onPageChange: (nextPage: number) => void;
  onRefresh?: () => void;
  onDelete: (inquiry: ContactInquiryRecord) => void;
}
