/**
 * Serialized DTO representing an Event record.
 */
export interface EventDto {
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
 * Validated multipart payload for creating an Event record.
 */
export interface ValidatedCreateEventInput {
  title: string;
  shortDescription: string | null;
  description: string;
  imageFile: Express.Multer.File | null;
  startDate: Date;
  endDate: Date;
  location: string | null;
  venue: string | null;
  isRegistrationOpen: boolean;
}

/**
 * Validated multipart payload for updating an existing Event record.
 */
export interface ValidatedUpdateEventInput {
  title?: string;
  shortDescription?: string | null;
  description?: string;
  imageFile: Express.Multer.File | null;
  removeImage: boolean;
  startDate?: Date;
  endDate?: Date;
  location?: string | null;
  venue?: string | null;
  isRegistrationOpen?: boolean;
}

/**
 * Validated query parameters for listing/filtering Event records.
 */
export interface ListEventsQuery {
  isRegistrationOpen?: boolean;
  search?: string;
  page: number;
  limit: number;
}

/**
 * Paginated list response returned by the Event listing endpoint.
 */
export interface PaginatedEventsDto {
  items: EventDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
