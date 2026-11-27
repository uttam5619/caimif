import type { NextRequest } from "next/server";
import { galleryController } from "@/server/modules/gallery/gallery.controller";

interface GalleryImageRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/gallery-images/[id]
 * Retrieves a single gallery image record by ID.
 */
export async function GET(
  _request: NextRequest,
  context: GalleryImageRouteContext
) {
  const { id } = await context.params;
  return galleryController.getGalleryImageById(id);
}

/**
 * PATCH /api/gallery-images/[id]
 * Updates a gallery image record (file replacement, description, or album reassignment).
 */
export async function PATCH(
  request: NextRequest,
  context: GalleryImageRouteContext
) {
  const { id } = await context.params;
  return galleryController.updateGalleryImage(request, id);
}

/**
 * DELETE /api/gallery-images/[id]
 * Deletes a gallery image record and removes its S3 image asset.
 */
export async function DELETE(
  request: NextRequest,
  context: GalleryImageRouteContext
) {
  const { id } = await context.params;
  return galleryController.deleteGalleryImage(request, id);
}
