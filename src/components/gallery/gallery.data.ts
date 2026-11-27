import { connection } from "next/server";
import { galleryService } from "@/server/modules/gallery/gallery.service";
import type { GalleryDto } from "@/server/modules/gallery/gallery.types";
import { NotFoundError } from "@/server/utils/errors/AppError";
import type { GalleryAlbumsDataResult } from "./types";

const MAX_PUBLIC_GALLERY_ALBUMS = 100;

/**
 * Fetches all `Gallery` albums with nested images and resolved S3 URLs
 * via `galleryService` for `/gallery`.
 */
export async function getAllGalleryAlbums(): Promise<GalleryAlbumsDataResult> {
  // Opt into per-request dynamic rendering under Next.js 16 `cacheComponents`.
  await connection();

  try {
    const result = await galleryService.listGalleries({
      page: 1,
      limit: MAX_PUBLIC_GALLERY_ALBUMS,
    });

    return { items: result.items, loadFailed: false };
  } catch (error: unknown) {
    console.warn(
      "[GalleryData] Unable to load gallery albums from database:",
      error instanceof Error ? error.message : error
    );
    return { items: [], loadFailed: true };
  }
}

/**
 * Fetches a single `Gallery` album with its photos for `/gallery/[id]`.
 */
export async function getGalleryAlbumById(
  id: string
): Promise<GalleryDto | null> {
  await connection();

  try {
    return await galleryService.getGalleryById(id);
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return null;
    }
    console.warn(
      "[GalleryData] Unable to load gallery album:",
      id,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
