/**
 * Identifiers for tabs inside the Event dashboard view.
 */
export type EventTabId = "list" | "add";

/**
 * Configuration item describing a single tab in the Event switcher.
 */
export interface EventTabItem {
  id: EventTabId;
  label: string;
}

/**
 * Serialized Event entity matching `/api/events` responses.
 */
export interface EventRecord {
  id: number;
  title: string;
  shortDescription: string | null;
  description: string;
  imageKey?: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  location: string | null;
  venue: string | null;
  isRegistrationOpen: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pagination metadata returned by `/api/events`.
 */
export interface EventPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Props for the EventList component.
 */
export interface EventListProps {
  events: EventRecord[];
  pagination: EventPagination;
  search: string;
  isLoading: boolean;
  loadError?: string | null;
  onSearchChange: (value: string) => void;
  onPageChange: (nextPage: number) => void;
  onEdit: (event: EventRecord) => void;
  onDelete: (event: EventRecord) => void;
}

/**
 * Props for the EditEventModal component.
 */
export interface EditEventModalProps {
  isOpen: boolean;
  event: EventRecord | null;
  onClose: () => void;
  onSave: (eventId: number, payload: FormData) => Promise<void> | void;
}

/**
 * Props for the AddEventForm component.
 */
export interface AddEventFormProps {
  onSubmitEvent?: (payload: FormData) => Promise<EventRecord>;
  onSuccess?: (createdEvent: EventRecord) => void;
}
