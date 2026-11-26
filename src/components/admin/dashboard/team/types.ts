/**
 * Identifiers for tabs inside the Team dashboard view.
 */
export type TeamTabId = "list" | "add";

/**
 * Configuration item describing a single tab in the Team switcher.
 */
export interface TeamTabItem {
  id: TeamTabId;
  label: string;
}

/**
 * Team member category enum synchronized with `TeamCategory` in `prisma/models/team.prisma`.
 */
export type TeamCategory = "HEAD" | "PROFESSOR" | "PHD_SCHOLAR" | "ALUMNI";

/**
 * Select option representing a TeamCategory enum value and its display label.
 */
export interface TeamCategoryOption {
  value: TeamCategory;
  label: string;
}

/**
 * Serialized Team member entity matching `/api/team` responses.
 */
export interface TeamMemberRecord {
  id: string;
  imageKey?: string;
  imageUrl?: string;
  category: TeamCategory;
  name: string;
  designation: string | null;
  about: string | null;
  school: string | null;
  department: string | null;
  email: string | null;
  qualification: string | null;
  specializations: string[];
  certifications: string[];
  areaOfInterest: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pagination metadata returned by `/api/team`.
 */
export interface TeamPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Props for the MemberList component.
 */
export interface MemberListProps {
  members: TeamMemberRecord[];
  pagination: TeamPagination;
  search: string;
  categoryFilter: TeamCategory | "";
  isLoading: boolean;
  loadError?: string | null;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: TeamCategory | "") => void;
  onPageChange: (nextPage: number) => void;
  onEdit: (member: TeamMemberRecord) => void;
  onDelete: (member: TeamMemberRecord) => void;
}

/**
 * Props for the EditMemberModal component.
 */
export interface EditMemberModalProps {
  isOpen: boolean;
  member: TeamMemberRecord | null;
  onClose: () => void;
  onSave: (memberId: string, payload: FormData) => Promise<void> | void;
}

/**
 * Props for the AddMemberForm component.
 */
export interface AddMemberFormProps {
  onSubmitMember?: (payload: FormData) => Promise<TeamMemberRecord>;
  onSuccess?: (createdMember: TeamMemberRecord) => void;
}

/**
 * Props for the reusable StringListField tag-input component.
 */
export interface StringListFieldProps {
  id: string;
  label: string;
  hint: string;
  items: string[];
  draftValue: string;
  onDraftChange: (value: string) => void;
  onItemsChange: (items: string[]) => void;
}
