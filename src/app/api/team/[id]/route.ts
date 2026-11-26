import type { NextRequest } from "next/server";
import { teamController } from "@/server/modules/team/team.controller";

interface TeamRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/team/[id]
 * Retrieves a single team member by ID.
 */
export async function GET(
  _request: NextRequest,
  context: TeamRouteContext
) {
  const { id } = await context.params;
  return teamController.getTeamMemberById(id);
}

/**
 * PATCH /api/team/[id]
 * Updates an existing team member, including optional photo replacement/removal.
 */
export async function PATCH(
  request: NextRequest,
  context: TeamRouteContext
) {
  const { id } = await context.params;
  return teamController.updateTeamMember(request, id);
}

/**
 * DELETE /api/team/[id]
 * Deletes a team member and cleans up its S3 photo asset.
 */
export async function DELETE(
  request: NextRequest,
  context: TeamRouteContext
) {
  const { id } = await context.params;
  return teamController.deleteTeamMember(request, id);
}
