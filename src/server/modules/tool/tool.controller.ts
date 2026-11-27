import type { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/server/middlewares/adminAuth";
import {
  parseMultipartWithMulter,
  type ParsedMultipartPayload,
} from "@/server/middlewares/multerUpload";
import { ValidationError } from "@/server/utils/errors/AppError";
import {
  handleControllerError,
  parseJsonBody,
  sendSuccess,
} from "@/server/utils/http/apiResponse";
import { toolService } from "./tool.service";
import {
  parseToolEntityId,
  validateCreateToolTypePayload,
  validateListToolsQuery,
  validateListToolTypesQuery,
  validateUpdateToolTypePayload,
} from "./tool.validation";

const CONTROLLER_LABEL = "ToolController";

/**
 * Normalizes either a `multipart/form-data` request or a plain `application/json`
 * request into a unified `ParsedMultipartPayload` structure for the service layer.
 */
async function parseToolRequestPayload(
  request: NextRequest
): Promise<ParsedMultipartPayload> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.toLowerCase().includes("application/json")) {
    const body = await parseJsonBody(request);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new ValidationError("Request body must be a JSON object.");
    }

    const fields: Record<string, string> = {};
    for (const [key, value] of Object.entries(body)) {
      if (value === null) {
        fields[key] = "";
      } else if (typeof value === "string") {
        fields[key] = value;
      } else if (value !== undefined) {
        throw new ValidationError(`Field "${key}" must be a string.`);
      }
    }

    return { fields, files: {} };
  }

  return parseMultipartWithMulter(request);
}

/**
 * Controller handling HTTP translation, multipart/JSON parsing, and admin role checks
 * for both `ToolType` categories and `Tool` items.
 */
export const toolController = {
  async listToolTypes(request: NextRequest): Promise<NextResponse> {
    try {
      const query = validateListToolTypesQuery(request.nextUrl.searchParams);
      const result = await toolService.listToolTypes(query);
      return sendSuccess(result, "Tool types retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async getToolTypeById(rawId: string): Promise<NextResponse> {
    try {
      const id = parseToolEntityId(rawId, "Tool type ID");
      const toolType = await toolService.getToolTypeById(id);
      return sendSuccess(toolType, "Tool type retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createToolType(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const body = await parseJsonBody(request);
      const validated = validateCreateToolTypePayload(body);
      const created = await toolService.createToolType(validated);
      return sendSuccess(created, "Tool type created successfully.", 201);
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async updateToolType(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseToolEntityId(rawId, "Tool type ID");
      const body = await parseJsonBody(request);
      const validated = validateUpdateToolTypePayload(body);
      const updated = await toolService.updateToolType(id, validated);
      return sendSuccess(updated, "Tool type updated successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deleteToolType(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseToolEntityId(rawId, "Tool type ID");
      await toolService.deleteToolType(id);
      return sendSuccess({ id }, "Tool type deleted successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async listTools(request: NextRequest): Promise<NextResponse> {
    try {
      const query = validateListToolsQuery(request.nextUrl.searchParams);
      const result = await toolService.listTools(query);
      return sendSuccess(result, "Tools retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async getToolById(rawId: string): Promise<NextResponse> {
    try {
      const id = parseToolEntityId(rawId, "Tool ID");
      const tool = await toolService.getToolById(id);
      return sendSuccess(tool, "Tool retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createTool(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const payload = await parseToolRequestPayload(request);
      const created = await toolService.createTool(payload);
      return sendSuccess(created, "Tool created successfully.", 201);
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async updateTool(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseToolEntityId(rawId, "Tool ID");
      const payload = await parseToolRequestPayload(request);
      const updated = await toolService.updateTool(id, payload);
      return sendSuccess(updated, "Tool updated successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deleteTool(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseToolEntityId(rawId, "Tool ID");
      await toolService.deleteTool(id);
      return sendSuccess({ id }, "Tool deleted successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },
};
