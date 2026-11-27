import type { NextRequest } from "next/server";
import { galleryController } from "@/server/modules/gallery/gallery.controller";

interface GalleryImagesByAlbumContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/galleries/[id]/images
 * Lists paginated images belonging to a specific gallery album.
 */
export async function GET(
  request: NextRequest,
  context: GalleryImagesByAlbumContext
) {
  const { id } = await context.params;
  return galleryController.listGalleryImages(request, id);
}

/**
 * POST /api/galleries/[id]/images
 * Uploads a new image into a specific gallery album via multipart FormData.
 */
export async function POST(
  request: NextRequest,
  context: GalleryImagesByAlbumContext
) {
  const { id } = await context.params;
  return galleryController.createGalleryImage(request, id);
}
