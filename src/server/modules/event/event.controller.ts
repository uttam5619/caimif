import type { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/server/middlewares/adminAuth";
import { parseMultipartWithMulter } from "@/server/middlewares/multerUpload";
import { handleControllerError, sendSuccess } from "@/server/utils/http/apiResponse";
import { eventService } from "./event.service";
import {
  parseEventId,
  validateListEventsQuery,
} from "./event.validation";

const CONTROLLER_LABEL = "EventController";

/**
 * Controller handling HTTP translation, multipart parsing, and role checks for Event APIs.
 */
export const eventController = {
  async listEvents(request: NextRequest): Promise<NextResponse> {
    try {
      const query = validateListEventsQuery(request.nextUrl.searchParams);
      const result = await eventService.listEvents(query);
      return sendSuccess(result, "Events retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async getEventById(rawId: string): Promise<NextResponse> {
    try {
      const id = parseEventId(rawId);
      const event = await eventService.getEventById(id);
      return sendSuccess(event, "Event retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createEvent(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const multipart = await parseMultipartWithMulter(request);
      const created = await eventService.createEvent(multipart);
      return sendSuccess(created, "Event created successfully.", 201);
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async updateEvent(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseEventId(rawId);
      const multipart = await parseMultipartWithMulter(request);
      const updated = await eventService.updateEvent(id, multipart);
      return sendSuccess(updated, "Event updated successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deleteEvent(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseEventId(rawId);
      await eventService.deleteEvent(id);
      return sendSuccess({ id }, "Event deleted successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },
};
