import type { NextRequest } from "next/server";
import { featuredResearchController } from "@/server/modules/featuredResearch/featuredResearch.controller";

interface FeaturedResearchRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/featured-research/[id]
 * Retrieves a single featured research record by ID.
 */
export async function GET(
  _request: NextRequest,
  context: FeaturedResearchRouteContext
) {
  const { id } = await context.params;
  return featuredResearchController.getFeaturedResearchById(id);
}

/**
 * PATCH /api/featured-research/[id]
 * Updates an existing featured research record, including optional image replacement.
 */
export async function PATCH(
  request: NextRequest,
  context: FeaturedResearchRouteContext
) {
  const { id } = await context.params;
  return featuredResearchController.updateFeaturedResearch(request, id);
}

/**
 * DELETE /api/featured-research/[id]
 * Deletes a featured research record and cleans up its S3 image asset.
 */
export async function DELETE(
  request: NextRequest,
  context: FeaturedResearchRouteContext
) {
  const { id } = await context.params;
  return featuredResearchController.deleteFeaturedResearch(request, id);
}
