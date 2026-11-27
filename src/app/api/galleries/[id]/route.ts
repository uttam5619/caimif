import type { NextRequest } from "next/server";
import { galleryController } from "@/server/modules/gallery/gallery.controller";

interface GalleryRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/galleries/[id]
 * Retrieves a single gallery album with its nested images.
 */
export async function GET(
  _request: NextRequest,
  context: GalleryRouteContext
) {
  const { id } = await context.params;
  return galleryController.getGalleryById(id);
}

/**
 * PATCH /api/galleries/[id]
 * Updates an existing gallery album's title or description.
 */
export async function PATCH(
  request: NextRequest,
  context: GalleryRouteContext
) {
  const { id } = await context.params;
  return galleryController.updateGallery(request, id);
}

/**
 * DELETE /api/galleries/[id]
 * Deletes a gallery album and cleans up all cascaded child image assets from S3.
 */
export async function DELETE(
  request: NextRequest,
  context: GalleryRouteContext
) {
  const { id } = await context.params;
  return galleryController.deleteGallery(request, id);
}
