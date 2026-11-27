import type { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/server/middlewares/adminAuth";
import { parseMultipartWithMulter } from "@/server/middlewares/multerUpload";
import { handleControllerError, sendSuccess } from "@/server/utils/http/apiResponse";
import { featuredResearchService } from "./featuredResearch.service";
import {
  parseFeaturedResearchId,
  validateListFeaturedResearchQuery,
} from "./featuredResearch.validation";

const CONTROLLER_LABEL = "FeaturedResearchController";

/**
 * Controller handling HTTP translation, multipart parsing, and role checks
 * for FeaturedResearch APIs.
 */
export const featuredResearchController = {
  async listFeaturedResearch(request: NextRequest): Promise<NextResponse> {
    try {
      const query = validateListFeaturedResearchQuery(
        request.nextUrl.searchParams
      );
      const result = await featuredResearchService.listFeaturedResearch(query);
      return sendSuccess(result, "Featured research records retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async getFeaturedResearchById(rawId: string): Promise<NextResponse> {
    try {
      const id = parseFeaturedResearchId(rawId);
      const record = await featuredResearchService.getFeaturedResearchById(id);
      return sendSuccess(record, "Featured research record retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createFeaturedResearch(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const multipart = await parseMultipartWithMulter(request);
      const created =
        await featuredResearchService.createFeaturedResearch(multipart);
      return sendSuccess(
        created,
        "Featured research record created successfully.",
        201
      );
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async updateFeaturedResearch(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseFeaturedResearchId(rawId);
      const multipart = await parseMultipartWithMulter(request);
      const updated = await featuredResearchService.updateFeaturedResearch(
        id,
        multipart
      );
      return sendSuccess(updated, "Featured research record updated successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deleteFeaturedResearch(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseFeaturedResearchId(rawId);
      await featuredResearchService.deleteFeaturedResearch(id);
      return sendSuccess(
        { id },
        "Featured research record deleted successfully."
      );
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },
};
