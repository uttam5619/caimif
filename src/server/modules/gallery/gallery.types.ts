/**
 * Serialized DTO representing an individual `GalleryImage` record.
 */
export interface GalleryImageDto {
  id: string;
  imageKey: string;
  imageUrl?: string;
  description: string | null;
  galleryId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Serialized DTO representing a `Gallery` album record with its images.
 */
export interface GalleryDto {
  id: string;
  title: string;
  description: string | null;
  imageCount: number;
  images: GalleryImageDto[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Validated payload for creating a `Gallery` album.
 */
export interface CreateGalleryInput {
  title: string;
  description?: string | null;
}

/**
 * Validated payload for partially updating a `Gallery` album.
 */
export type UpdateGalleryInput = Partial<CreateGalleryInput>;

/**
 * Validated query parameters for listing/filtering `Gallery` albums.
 */
export interface ListGalleriesQuery {
  search?: string;
  page: number;
  limit: number;
}

/**
 * Paginated response returned by the Gallery listing endpoint.
 */
export interface PaginatedGalleriesDto {
  items: GalleryDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Validated multipart payload for uploading a new `GalleryImage`.
 */
export interface ValidatedCreateGalleryImageInput {
  galleryId: string;
  description: string | null;
  imageFile: Express.Multer.File;
}

/**
 * Validated payload for updating an existing `GalleryImage`.
 */
export interface ValidatedUpdateGalleryImageInput {
  galleryId?: string;
  description?: string | null;
  imageFile: Express.Multer.File | null;
}

/**
 * Validated query parameters for listing/filtering `GalleryImage` records.
 */
export interface ListGalleryImagesQuery {
  galleryId?: string;
  search?: string;
  page: number;
  limit: number;
}

/**
 * Paginated response returned by the GalleryImage listing endpoint.
 */
export interface PaginatedGalleryImagesDto {
  items: GalleryImageDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
