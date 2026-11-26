import type { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/server/middlewares/adminAuth";
import {
  handleControllerError,
  parseJsonBody,
  sendSuccess,
} from "@/server/utils/http/apiResponse";
import { patentsService } from "./patents.service";
import {
  validateCreatePatentPayload,
  validateListPatentsQuery,
  validateUpdatePatentPayload,
} from "./patents.validation";

const CONTROLLER_LABEL = "PatentsController";

/**
 * Controller handling HTTP translation, input validation, and role checks for Patent APIs.
 */
export const patentsController = {
  async listPatents(request: NextRequest): Promise<NextResponse> {
    try {
      const query = validateListPatentsQuery(request.nextUrl.searchParams);
      const result = await patentsService.listPatents(query);
      return sendSuccess(result, "Patent records retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async getPatentById(patentId: string): Promise<NextResponse> {
    try {
      const patent = await patentsService.getPatentById(patentId);
      return sendSuccess(patent, "Patent record retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createPatent(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const body = await parseJsonBody(request);
      const validated = validateCreatePatentPayload(body);
      const created = await patentsService.createPatent(validated);
      return sendSuccess(created, "Patent record created successfully.", 201);
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async updatePatent(
    request: NextRequest,
    patentId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const body = await parseJsonBody(request);
      const validated = validateUpdatePatentPayload(body);
      const updated = await patentsService.updatePatent(patentId, validated);
      return sendSuccess(updated, "Patent record updated successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deletePatent(
    request: NextRequest,
    patentId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      await patentsService.deletePatent(patentId);
      return sendSuccess({ id: patentId }, "Patent record deleted successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },
};
