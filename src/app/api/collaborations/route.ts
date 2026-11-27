import type { NextRequest } from "next/server";
import { collaborationController } from "@/server/modules/collaboration/collaboration.controller";

/**
 * GET /api/collaborations
 * Lists paginated collaborations with optional type and search filters.
 */
export async function GET(request: NextRequest) {
  return collaborationController.listCollaborations(request);
}

/**
 * POST /api/collaborations
 * Creates a new collaboration record from a JSON payload.
 */
export async function POST(request: NextRequest) {
  return collaborationController.createCollaboration(request);
}
