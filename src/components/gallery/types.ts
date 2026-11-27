import type {
  GalleryDto,
  GalleryImageDto,
} from "@/server/modules/gallery/gallery.types";

/**
 * Data contracts for the public Gallery page component ecosystem.
 */

export interface GalleryAlbumCardProps {
  album: GalleryDto;
}

export interface GalleryPhotoCardProps {
  photo: GalleryImageDto;
  albumTitle: string;
}

export interface GalleryAlbumsDataResult {
  items: GalleryDto[];
  loadFailed: boolean;
}

export interface GalleryAlbumDetailViewProps {
  album: GalleryDto;
}
