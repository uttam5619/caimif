import type { NextRequest } from "next/server";
import { galleryController } from "@/server/modules/gallery/gallery.controller";

/**
 * GET /api/galleries
 * Lists paginated gallery albums along with their nested images.
 */
export async function GET(request: NextRequest) {
  return galleryController.listGalleries(request);
}

/**
 * POST /api/galleries
 * Creates a new gallery album from a JSON payload.
 */
export async function POST(request: NextRequest) {
  return galleryController.createGallery(request);
}
