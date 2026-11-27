import type { NextRequest } from "next/server";
import { galleryController } from "@/server/modules/gallery/gallery.controller";

/**
 * GET /api/gallery-images
 * Lists paginated gallery images, optionally filtered by `galleryId` or `search`.
 */
export async function GET(request: NextRequest) {
  return galleryController.listGalleryImages(request);
}

/**
 * POST /api/gallery-images
 * Uploads a new gallery image (`galleryId`, `image`, optional `description`) via multipart FormData.
 */
export async function POST(request: NextRequest) {
  return galleryController.createGalleryImage(request);
}
