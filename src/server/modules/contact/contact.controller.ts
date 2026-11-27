import type { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/server/middlewares/adminAuth";
import { ValidationError } from "@/server/utils/errors/AppError";
import {
  handleControllerError,
  sendSuccess,
} from "@/server/utils/http/apiResponse";
import { contactService } from "./contact.service";
import {
  parseContactInquiryId,
  validateCreateContactInquiryPayload,
  validateListContactInquiriesQuery,
} from "./contact.validation";

const CONTROLLER_LABEL = "ContactController";

async function parseJsonBody(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ValidationError("Request body must be valid JSON.");
  }
}

/**
 * Controller handling HTTP translation, input validation, and admin auth guards
 * for `ContactInquiry` records.
 */
export const contactController = {
  async listInquiries(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const query = validateListContactInquiriesQuery(
        request.nextUrl.searchParams
      );
      const result = await contactService.listInquiries(query);
      return sendSuccess(result, "Contact inquiries retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createInquiry(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await parseJsonBody(request);
      const validated = validateCreateContactInquiryPayload(body);
      const created = await contactService.createInquiry(validated);
      return sendSuccess(created, "Contact inquiry submitted successfully.", 201);
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deleteInquiry(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseContactInquiryId(rawId);
      await contactService.deleteInquiry(id);
      return sendSuccess({ id }, "Contact inquiry deleted successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },
};
