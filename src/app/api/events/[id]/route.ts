import type { NextRequest } from "next/server";
import { eventController } from "@/server/modules/event/event.controller";

interface EventRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/events/[id]
 * Retrieves a single event by ID.
 */
export async function GET(
  _request: NextRequest,
  context: EventRouteContext
) {
  const { id } = await context.params;
  return eventController.getEventById(id);
}

/**
 * PATCH /api/events/[id]
 * Updates an existing event, including optional cover image replacement/removal.
 */
export async function PATCH(
  request: NextRequest,
  context: EventRouteContext
) {
  const { id } = await context.params;
  return eventController.updateEvent(request, id);
}

/**
 * DELETE /api/events/[id]
 * Deletes an event and cleans up its S3 image asset.
 */
export async function DELETE(
  request: NextRequest,
  context: EventRouteContext
) {
  const { id } = await context.params;
  return eventController.deleteEvent(request, id);
}
