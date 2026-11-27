import type { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/server/middlewares/adminAuth";
import {
  handleControllerError,
  parseJsonBody,
  sendSuccess,
} from "@/server/utils/http/apiResponse";
import { collaborationService } from "./collaboration.service";
import {
  parseCollaborationId,
  validateCreateCollaborationPayload,
  validateListCollaborationsQuery,
  validateUpdateCollaborationPayload,
} from "./collaboration.validation";

const CONTROLLER_LABEL = "CollaborationController";

/**
 * Controller handling HTTP translation, payload validation, and role checks
 * for Collaboration CRUD APIs.
 */
export const collaborationController = {
  async listCollaborations(request: NextRequest): Promise<NextResponse> {
    try {
      const query = validateListCollaborationsQuery(
        request.nextUrl.searchParams
      );
      const result = await collaborationService.listCollaborations(query);
      return sendSuccess(result, "Collaborations retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async getCollaborationById(rawId: string): Promise<NextResponse> {
    try {
      const id = parseCollaborationId(rawId);
      const record = await collaborationService.getCollaborationById(id);
      return sendSuccess(record, "Collaboration retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createCollaboration(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const body = await parseJsonBody(request);
      const validated = validateCreateCollaborationPayload(body);
      const created =
        await collaborationService.createCollaboration(validated);
      return sendSuccess(
        created,
        "Collaboration created successfully.",
        201
      );
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async updateCollaboration(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseCollaborationId(rawId);
      const body = await parseJsonBody(request);
      const validated = validateUpdateCollaborationPayload(body);
      const updated = await collaborationService.updateCollaboration(
        id,
        validated
      );
      return sendSuccess(updated, "Collaboration updated successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deleteCollaboration(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseCollaborationId(rawId);
      await collaborationService.deleteCollaboration(id);
      return sendSuccess({ id }, "Collaboration deleted successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },
};
