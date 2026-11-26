import type { NextRequest } from "next/server";
import { conferenceController } from "@/server/modules/conference/conference.controller";

/**
 * GET /api/conferences
 * Lists paginated conference publications with optional year, domain, and search filters.
 */
export async function GET(request: NextRequest) {
  return conferenceController.listConferences(request);
}

/**
 * POST /api/conferences
 * Creates a new conference publication record.
 */
export async function POST(request: NextRequest) {
  return conferenceController.createConference(request);
}
