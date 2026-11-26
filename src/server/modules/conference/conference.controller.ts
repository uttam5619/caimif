import type { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/server/middlewares/adminAuth";
import {
  handleControllerError,
  parseJsonBody,
  sendSuccess,
} from "@/server/utils/http/apiResponse";
import { conferenceService } from "./conference.service";
import {
  validateCreateConferencePayload,
  validateListConferencesQuery,
  validateUpdateConferencePayload,
} from "./conference.validation";

const CONTROLLER_LABEL = "ConferenceController";

/**
 * Controller handling HTTP translation, input validation, and role checks for Conference APIs.
 */
export const conferenceController = {
  async listConferences(request: NextRequest): Promise<NextResponse> {
    try {
      const query = validateListConferencesQuery(request.nextUrl.searchParams);
      const result = await conferenceService.listConferences(query);
      return sendSuccess(
        result,
        "Conference publications retrieved successfully."
      );
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async getConferenceById(conferenceId: string): Promise<NextResponse> {
    try {
      const conference = await conferenceService.getConferenceById(conferenceId);
      return sendSuccess(
        conference,
        "Conference publication retrieved successfully."
      );
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createConference(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const body = await parseJsonBody(request);
      const validated = validateCreateConferencePayload(body);
      const created = await conferenceService.createConference(validated);
      return sendSuccess(
        created,
        "Conference publication created successfully.",
        201
      );
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async updateConference(
    request: NextRequest,
    conferenceId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const body = await parseJsonBody(request);
      const validated = validateUpdateConferencePayload(body);
      const updated = await conferenceService.updateConference(
        conferenceId,
        validated
      );
      return sendSuccess(
        updated,
        "Conference publication updated successfully."
      );
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deleteConference(
    request: NextRequest,
    conferenceId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      await conferenceService.deleteConference(conferenceId);
      return sendSuccess(
        { id: conferenceId },
        "Conference publication deleted successfully."
      );
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },
};
