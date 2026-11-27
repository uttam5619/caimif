/**
 * Identifiers for the four tabs inside the Gallery dashboard section.
 */
export type GalleryTabId = "albums" | "photos" | "add-album" | "add-photo";

/**
 * Configuration item describing a single tab in the Gallery view switcher.
 */
export interface GalleryTabItem {
  id: GalleryTabId;
  label: string;
}

/**
 * Serialized GalleryImage record matching `/api/gallery-images` responses.
 */
export interface GalleryImageRecord {
  id: string;
  imageKey: string;
  imageUrl?: string;
  description: string | null;
  galleryId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Serialized Gallery album record matching `/api/galleries` responses.
 */
export interface GalleryAlbumRecord {
  id: string;
  title: string;
  description: string | null;
  imageCount: number;
  images: GalleryImageRecord[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Shared pagination metadata returned by `/api/galleries` and `/api/gallery-images`.
 */
export interface GalleryPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AlbumListProps {
  albums: GalleryAlbumRecord[];
  pagination: GalleryPagination;
  search: string;
  isLoading: boolean;
  loadError?: string | null;
  onSearchChange: (value: string) => void;
  onPageChange: (nextPage: number) => void;
  onEdit: (album: GalleryAlbumRecord) => void;
  onDelete: (album: GalleryAlbumRecord) => void;
}

export interface PhotoListProps {
  photos: GalleryImageRecord[];
  albums: GalleryAlbumRecord[];
  pagination: GalleryPagination;
  search: string;
  albumFilter: string;
  isLoading: boolean;
  loadError?: string | null;
  onSearchChange: (value: string) => void;
  onAlbumFilterChange: (galleryId: string) => void;
  onPageChange: (nextPage: number) => void;
  onEdit: (photo: GalleryImageRecord) => void;
  onDelete: (photo: GalleryImageRecord) => void;
}

export interface AddAlbumFormProps {
  onSubmitAlbum?: (payload: {
    title: string;
    description: string | null;
  }) => Promise<GalleryAlbumRecord>;
  onSuccess?: (createdAlbum: GalleryAlbumRecord) => void;
}

export interface AddPhotoFormProps {
  albums: GalleryAlbumRecord[];
  onSubmitPhoto?: (payload: FormData) => Promise<GalleryImageRecord>;
  onSuccess?: (createdPhoto: GalleryImageRecord) => void;
  onRequestAddAlbum?: () => void;
}

export interface EditAlbumModalProps {
  isOpen: boolean;
  album: GalleryAlbumRecord | null;
  onClose: () => void;
  onSave: (
    albumId: string,
    payload: { title?: string; description?: string | null }
  ) => Promise<void> | void;
}

export interface EditPhotoModalProps {
  isOpen: boolean;
  photo: GalleryImageRecord | null;
  albums: GalleryAlbumRecord[];
  onClose: () => void;
  onSave: (photoId: string, payload: FormData) => Promise<void> | void;
}
