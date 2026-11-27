import type { NextRequest } from "next/server";
import { featuredResearchController } from "@/server/modules/featuredResearch/featuredResearch.controller";

/**
 * GET /api/featured-research
 * Lists paginated featured research records with optional search filtering.
 */
export async function GET(request: NextRequest) {
  return featuredResearchController.listFeaturedResearch(request);
}

/**
 * POST /api/featured-research
 * Creates a new featured research record from a multipart FormData payload.
 */
export async function POST(request: NextRequest) {
  return featuredResearchController.createFeaturedResearch(request);
}
