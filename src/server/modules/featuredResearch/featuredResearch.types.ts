/**
 * Serialized DTO representing a FeaturedResearch record.
 */
export interface FeaturedResearchDto {
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
 * Validated multipart payload for creating a FeaturedResearch record.
 */
export interface ValidatedCreateFeaturedResearchInput {
  imageFile: Express.Multer.File | null;
  authorName: string;
  title: string;
  description: string;
}

/**
 * Validated multipart payload for updating an existing FeaturedResearch record.
 */
export interface ValidatedUpdateFeaturedResearchInput {
  imageFile: Express.Multer.File | null;
  authorName?: string;
  title?: string;
  description?: string;
}

/**
 * Validated query parameters for listing/filtering FeaturedResearch records.
 */
export interface ListFeaturedResearchQuery {
  search?: string;
  page: number;
  limit: number;
}

/**
 * Paginated list response returned by the FeaturedResearch listing endpoint.
 */
export interface PaginatedFeaturedResearchDto {
  items: FeaturedResearchDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
