/**
 * Identifiers for tabs inside the Training dashboard view.
 */
export type TrainingTabId = "list" | "add";

/**
 * Configuration item describing a single tab in the Training switcher.
 */
export interface TrainingTabItem {
  id: TrainingTabId;
  label: string;
}

/**
 * Serialized Training entity matching `/api/trainings` responses.
 */
export interface TrainingRecord {
  id: number;
  title: string;
  shortDescription: string | null;
  description: string;
  imageKey?: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  isRegistrationOpen: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pagination metadata returned by `/api/trainings`.
 */
export interface TrainingPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Props for the TrainingList component.
 */
export interface TrainingListProps {
  trainings: TrainingRecord[];
  pagination: TrainingPagination;
  search: string;
  isLoading: boolean;
  loadError?: string | null;
  onSearchChange: (value: string) => void;
  onPageChange: (nextPage: number) => void;
  onEdit: (training: TrainingRecord) => void;
  onDelete: (training: TrainingRecord) => void;
}

/**
 * Props for the EditTrainingModal component.
 */
export interface EditTrainingModalProps {
  isOpen: boolean;
  training: TrainingRecord | null;
  onClose: () => void;
  onSave: (trainingId: number, payload: FormData) => Promise<void> | void;
}

/**
 * Props for the AddTrainingForm component.
 */
export interface AddTrainingFormProps {
  onSubmitTraining?: (payload: FormData) => Promise<TrainingRecord>;
  onSuccess?: (createdTraining: TrainingRecord) => void;
}
