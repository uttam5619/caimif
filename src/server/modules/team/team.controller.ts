import type { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/server/middlewares/adminAuth";
import { parseMultipartWithMulter } from "@/server/middlewares/multerUpload";
import { handleControllerError, sendSuccess } from "@/server/utils/http/apiResponse";
import { teamService } from "./team.service";
import { parseTeamId, validateListTeamQuery } from "./team.validation";

const CONTROLLER_LABEL = "TeamController";

/**
 * Controller handling HTTP translation, multipart parsing, and role checks for Team APIs.
 */
export const teamController = {
  async listTeamMembers(request: NextRequest): Promise<NextResponse> {
    try {
      const query = validateListTeamQuery(request.nextUrl.searchParams);
      const result = await teamService.listTeamMembers(query);
      return sendSuccess(result, "Team members retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async getTeamMemberById(rawId: string): Promise<NextResponse> {
    try {
      const id = parseTeamId(rawId);
      const member = await teamService.getTeamMemberById(id);
      return sendSuccess(member, "Team member retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createTeamMember(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const multipart = await parseMultipartWithMulter(request);
      const created = await teamService.createTeamMember(multipart);
      return sendSuccess(created, "Team member created successfully.", 201);
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async updateTeamMember(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseTeamId(rawId);
      const multipart = await parseMultipartWithMulter(request);
      const updated = await teamService.updateTeamMember(id, multipart);
      return sendSuccess(updated, "Team member updated successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deleteTeamMember(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseTeamId(rawId);
      await teamService.deleteTeamMember(id);
      return sendSuccess({ id }, "Team member deleted successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },
};
