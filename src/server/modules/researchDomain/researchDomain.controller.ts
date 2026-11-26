import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/server/middlewares/adminAuth";
import { parseMultipartWithMulter } from "@/server/middlewares/multerUpload";
import { AppError } from "@/server/utils/errors/AppError";
import { researchDomainService } from "./researchDomain.service";
import type { ApiErrorResponse, ApiSuccessResponse } from "./researchDomain.types";
import {
  validateCreateFieldPayload,
  validateUpdateFieldPayload,
} from "./researchDomain.validation";

function ok<T>(
  data: T,
  message: string,
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, data, message }, { status });
}

/**
 * Translates thrown AppErrors and unexpected runtime failures into the
 * project's standard JSON error envelope without leaking internal details.
 */
function handleControllerError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  console.error("[ResearchDomainController] Unexpected error:", error);
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected server error occurred.",
        details: null,
      },
    },
    { status: 500 }
  );
}

/**
 * Controller coordinating HTTP requests for Research Domains and their dynamic schema fields.
 */
export const researchDomainController = {
  async listDomains(): Promise<NextResponse> {
    try {
      const domains = await researchDomainService.listDomains();
      return ok(domains, "Research domains retrieved successfully.");
    } catch (error) {
      return handleControllerError(error);
    }
  },

  async createDomain(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const multipart = await parseMultipartWithMulter(request);
      const created = await researchDomainService.createDomain(multipart);
      return ok(created, "Research domain registered successfully.", 201);
    } catch (error) {
      return handleControllerError(error);
    }
  },

  async updateDomain(
    request: NextRequest,
    domainId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const multipart = await parseMultipartWithMulter(request);
      const updated = await researchDomainService.updateDomain(domainId, multipart);
      return ok(updated, "Research domain updated successfully.");
    } catch (error) {
      return handleControllerError(error);
    }
  },

  async deleteDomain(
    request: NextRequest,
    domainId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      await researchDomainService.deleteDomain(domainId);
      return ok({ id: domainId }, "Research domain deleted successfully.");
    } catch (error) {
      return handleControllerError(error);
    }
  },

  async listFields(): Promise<NextResponse> {
    try {
      const fields = await researchDomainService.listFields();
      return ok(fields, "Research domain fields retrieved successfully.");
    } catch (error) {
      return handleControllerError(error);
    }
  },

  async createField(request: NextRequest): Promise<NextResponse> {
    try {
      // Strictly restricted to SecurityAdmin
      await requireAdminRole(request, ["SecurityAdmin"]);
      const body: unknown = await request.json();
      const validated = validateCreateFieldPayload(body);
      const created = await researchDomainService.createField(validated);
      return ok(created, "Research domain field created successfully.", 201);
    } catch (error) {
      return handleControllerError(error);
    }
  },

  async updateField(
    request: NextRequest,
    fieldId: string
  ): Promise<NextResponse> {
    try {
      // Strictly restricted to SecurityAdmin
      await requireAdminRole(request, ["SecurityAdmin"]);
      const body: unknown = await request.json();
      const validated = validateUpdateFieldPayload(body);
      const updated = await researchDomainService.updateField(fieldId, validated);
      return ok(updated, "Research domain field updated successfully.");
    } catch (error) {
      return handleControllerError(error);
    }
  },

  async deleteField(
    request: NextRequest,
    fieldId: string
  ): Promise<NextResponse> {
    try {
      // Strictly restricted to SecurityAdmin
      await requireAdminRole(request, ["SecurityAdmin"]);
      await researchDomainService.deleteField(fieldId);
      return ok({ id: fieldId }, "Research domain field deleted successfully.");
    } catch (error) {
      return handleControllerError(error);
    }
  },
};
