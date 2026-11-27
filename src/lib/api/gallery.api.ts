import type { AdminRole } from "@/components/admin/authenticationForm/types";
import type {
  GalleryAlbumRecord,
  GalleryImageRecord,
  GalleryPagination,
} from "@/components/admin/dashboard/gallery/types";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface FetchGalleriesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedGalleriesResponse {
  items: GalleryAlbumRecord[];
  pagination: GalleryPagination;
}

export interface FetchGalleryImagesParams {
  galleryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedGalleryImagesResponse {
  items: GalleryImageRecord[];
  pagination: GalleryPagination;
}

const GALLERIES_ENDPOINT = "/api/galleries";
const GALLERY_IMAGES_ENDPOINT = "/api/gallery-images";

/**
 * Unwraps standard API responses and throws descriptive error messages on failure.
 */
async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.success) {
    const errorMessage =
      payload?.error?.message ||
      payload?.message ||
      `Request failed with status ${response.status}.`;
    throw new Error(errorMessage);
  }

  return payload.data as T;
}

function buildRoleHeaders(userRole?: AdminRole): HeadersInit {
  return userRole ? { "x-admin-role": userRole } : {};
}

/**
 * Fetches paginated Gallery albums from `GET /api/galleries`.
 */
export async function fetchGalleries(
  params: FetchGalleriesParams = {}
): Promise<PaginatedGalleriesResponse> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs ? `${GALLERIES_ENDPOINT}?${qs}` : GALLERIES_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PaginatedGalleriesResponse>(response);
}

/**
 * Creates a new Gallery album via `POST /api/galleries`.
 */
export async function createGalleryAlbum(
  payload: { title: string; description: string | null },
  userRole?: AdminRole
): Promise<GalleryAlbumRecord> {
  const response = await fetch(GALLERIES_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildRoleHeaders(userRole),
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<GalleryAlbumRecord>(response);
}

/**
 * Partially updates an existing Gallery album via `PATCH /api/galleries/[id]`.
 */
export async function updateGalleryAlbum(
  albumId: string,
  payload: { title?: string; description?: string | null },
  userRole?: AdminRole
): Promise<GalleryAlbumRecord> {
  const response = await fetch(
    `${GALLERIES_ENDPOINT}/${encodeURIComponent(albumId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...buildRoleHeaders(userRole),
      },
      body: JSON.stringify(payload),
    }
  );

  return parseApiResponse<GalleryAlbumRecord>(response);
}

/**
 * Deletes an existing Gallery album via `DELETE /api/galleries/[id]`.
 */
export async function deleteGalleryAlbum(
  albumId: string,
  userRole?: AdminRole
): Promise<{ id: string }> {
  const response = await fetch(
    `${GALLERIES_ENDPOINT}/${encodeURIComponent(albumId)}`,
    {
      method: "DELETE",
      headers: buildRoleHeaders(userRole),
    }
  );

  return parseApiResponse<{ id: string }>(response);
}

/**
 * Fetches paginated GalleryImage records from `GET /api/gallery-images`.
 */
export async function fetchGalleryImages(
  params: FetchGalleryImagesParams = {}
): Promise<PaginatedGalleryImagesResponse> {
  const searchParams = new URLSearchParams();
  if (params.galleryId) searchParams.set("galleryId", params.galleryId);
  if (params.search) searchParams.set("search", params.search);
  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));

  const qs = searchParams.toString();
  const url = qs
    ? `${GALLERY_IMAGES_ENDPOINT}?${qs}`
    : GALLERY_IMAGES_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PaginatedGalleryImagesResponse>(response);
}

/**
 * Uploads a new GalleryImage multipart payload to `POST /api/gallery-images`.
 */
export async function createGalleryPhoto(
  formData: FormData,
  userRole?: AdminRole
): Promise<GalleryImageRecord> {
  const response = await fetch(GALLERY_IMAGES_ENDPOINT, {
    method: "POST",
    headers: buildRoleHeaders(userRole),
    body: formData,
  });

  return parseApiResponse<GalleryImageRecord>(response);
}

/**
 * Partially updates an existing GalleryImage via `PATCH /api/gallery-images/[id]`.
 */
export async function updateGalleryPhoto(
  photoId: string,
  formData: FormData,
  userRole?: AdminRole
): Promise<GalleryImageRecord> {
  const response = await fetch(
    `${GALLERY_IMAGES_ENDPOINT}/${encodeURIComponent(photoId)}`,
    {
      method: "PATCH",
      headers: buildRoleHeaders(userRole),
      body: formData,
    }
  );

  return parseApiResponse<GalleryImageRecord>(response);
}

/**
 * Deletes an existing GalleryImage via `DELETE /api/gallery-images/[id]`.
 */
export async function deleteGalleryPhoto(
  photoId: string,
  userRole?: AdminRole
): Promise<{ id: string }> {
  const response = await fetch(
    `${GALLERY_IMAGES_ENDPOINT}/${encodeURIComponent(photoId)}`,
    {
      method: "DELETE",
      headers: buildRoleHeaders(userRole),
    }
  );

  return parseApiResponse<{ id: string }>(response);
}
