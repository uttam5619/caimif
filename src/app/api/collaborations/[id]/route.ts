import type { NextRequest } from "next/server";
import { collaborationController } from "@/server/modules/collaboration/collaboration.controller";

interface CollaborationRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/collaborations/[id]
 * Retrieves a single collaboration record by ID.
 */
export async function GET(
  _request: NextRequest,
  context: CollaborationRouteContext
) {
  const { id } = await context.params;
  return collaborationController.getCollaborationById(id);
}

/**
 * PATCH /api/collaborations/[id]
 * Partially updates an existing collaboration record.
 */
export async function PATCH(
  request: NextRequest,
  context: CollaborationRouteContext
) {
  const { id } = await context.params;
  return collaborationController.updateCollaboration(request, id);
}

/**
 * DELETE /api/collaborations/[id]
 * Deletes a collaboration record by ID.
 */
export async function DELETE(
  request: NextRequest,
  context: CollaborationRouteContext
) {
  const { id } = await context.params;
  return collaborationController.deleteCollaboration(request, id);
}
