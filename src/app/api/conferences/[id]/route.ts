import type { NextRequest } from "next/server";
import { conferenceController } from "@/server/modules/conference/conference.controller";

interface ConferenceRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/conferences/[id]
 * Retrieves a single conference publication by ID.
 */
export async function GET(
  _request: NextRequest,
  context: ConferenceRouteContext
) {
  const { id } = await context.params;
  return conferenceController.getConferenceById(id);
}

/**
 * PATCH /api/conferences/[id]
 * Partially updates an existing conference publication record.
 */
export async function PATCH(
  request: NextRequest,
  context: ConferenceRouteContext
) {
  const { id } = await context.params;
  return conferenceController.updateConference(request, id);
}

/**
 * DELETE /api/conferences/[id]
 * Deletes a conference publication record by ID.
 */
export async function DELETE(
  request: NextRequest,
  context: ConferenceRouteContext
) {
  const { id } = await context.params;
  return conferenceController.deleteConference(request, id);
}
