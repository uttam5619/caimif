/**
 * Serialized DTO representing a Training program record.
 */
export interface TrainingDto {
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
 * Validated multipart payload for creating a Training record.
 */
export interface ValidatedCreateTrainingInput {
  title: string;
  shortDescription: string | null;
  description: string;
  imageFile: Express.Multer.File | null;
  startDate: Date;
  endDate: Date;
  isRegistrationOpen: boolean;
}

/**
 * Validated multipart payload for updating an existing Training record.
 */
export interface ValidatedUpdateTrainingInput {
  title?: string;
  shortDescription?: string | null;
  description?: string;
  imageFile: Express.Multer.File | null;
  removeImage: boolean;
  startDate?: Date;
  endDate?: Date;
  isRegistrationOpen?: boolean;
}

/**
 * Validated query parameters for listing/filtering Training records.
 */
export interface ListTrainingsQuery {
  isRegistrationOpen?: boolean;
  search?: string;
  page: number;
  limit: number;
}

/**
 * Paginated list response returned by the Training listing endpoint.
 */
export interface PaginatedTrainingsDto {
  items: TrainingDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
