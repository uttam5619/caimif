import type { NextRequest } from "next/server";
import { patentsController } from "@/server/modules/patents/patents.controller";

interface PatentRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/patents/[id]
 * Retrieves a single patent record by ID.
 */
export async function GET(_request: NextRequest, context: PatentRouteContext) {
  const { id } = await context.params;
  return patentsController.getPatentById(id);
}

/**
 * PATCH /api/patents/[id]
 * Partially updates an existing patent record.
 */
export async function PATCH(request: NextRequest, context: PatentRouteContext) {
  const { id } = await context.params;
  return patentsController.updatePatent(request, id);
}

/**
 * DELETE /api/patents/[id]
 * Deletes a patent record by ID.
 */
export async function DELETE(request: NextRequest, context: PatentRouteContext) {
  const { id } = await context.params;
  return patentsController.deletePatent(request, id);
}
