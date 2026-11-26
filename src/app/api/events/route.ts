import type { NextRequest } from "next/server";
import { eventController } from "@/server/modules/event/event.controller";

/**
 * GET /api/events
 * Lists paginated events with optional registration status and search filters.
 */
export async function GET(request: NextRequest) {
  return eventController.listEvents(request);
}

/**
 * POST /api/events
 * Creates a new event from a multipart FormData payload.
 */
export async function POST(request: NextRequest) {
  return eventController.createEvent(request);
}
