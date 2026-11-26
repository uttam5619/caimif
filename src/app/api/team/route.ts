import type { NextRequest } from "next/server";
import { teamController } from "@/server/modules/team/team.controller";

/**
 * GET /api/team
 * Lists paginated team members with optional category and search filters.
 */
export async function GET(request: NextRequest) {
  return teamController.listTeamMembers(request);
}

/**
 * POST /api/team
 * Creates a new team member from a multipart FormData payload.
 */
export async function POST(request: NextRequest) {
  return teamController.createTeamMember(request);
}
