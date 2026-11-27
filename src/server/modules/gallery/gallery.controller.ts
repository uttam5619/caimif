import type { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/server/middlewares/adminAuth";
import { parseMultipartWithMulter } from "@/server/middlewares/multerUpload";
import { ValidationError } from "@/server/utils/errors/AppError";
import {
  handleControllerError,
  sendSuccess,
} from "@/server/utils/http/apiResponse";
import { galleryService } from "./gallery.service";
import {
  parseGalleryEntityId,
  validateCreateGalleryPayload,
  validateListGalleriesQuery,
  validateListGalleryImagesQuery,
  validateUpdateGalleryPayload,
} from "./gallery.validation";

const CONTROLLER_LABEL = "GalleryController";

/**
 * Safely parses a JSON request body, throwing a structured 400 error on malformed JSON.
 */
async function parseJsonBody(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ValidationError("Request body must be valid JSON.");
  }
}

async function parseImageUpdatePayload(request: NextRequest) {
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
        throw new ValidationError(`Field "${key}" must be a string or null.`);
      }
    }
    return { fields, files: {} };
  }
  return parseMultipartWithMulter(request);
}

/**
 * Controller handling HTTP translation, multipart/JSON parsing, and admin role checks
 * for both `Gallery` albums and `GalleryImage` items.
 */
export const galleryController = {
  async listGalleries(request: NextRequest): Promise<NextResponse> {
    try {
      const query = validateListGalleriesQuery(request.nextUrl.searchParams);
      const result = await galleryService.listGalleries(query);
      return sendSuccess(result, "Gallery albums retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async getGalleryById(rawId: string): Promise<NextResponse> {
    try {
      const id = parseGalleryEntityId(rawId, "Gallery ID");
      const gallery = await galleryService.getGalleryById(id);
      return sendSuccess(gallery, "Gallery album retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createGallery(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const body = await parseJsonBody(request);
      const validated = validateCreateGalleryPayload(body);
      const created = await galleryService.createGallery(validated);
      return sendSuccess(created, "Gallery album created successfully.", 201);
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async updateGallery(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseGalleryEntityId(rawId, "Gallery ID");
      const body = await parseJsonBody(request);
      const validated = validateUpdateGalleryPayload(body);
      const updated = await galleryService.updateGallery(id, validated);
      return sendSuccess(updated, "Gallery album updated successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deleteGallery(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseGalleryEntityId(rawId, "Gallery ID");
      await galleryService.deleteGallery(id);
      return sendSuccess({ id }, "Gallery album deleted successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async listGalleryImages(
    request: NextRequest,
    rawGalleryId?: string
  ): Promise<NextResponse> {
    try {
      const boundGalleryId =
        rawGalleryId !== undefined
          ? parseGalleryEntityId(rawGalleryId, "Gallery ID")
          : undefined;
      const query = validateListGalleryImagesQuery(
        request.nextUrl.searchParams,
        boundGalleryId
      );
      const result = await galleryService.listGalleryImages(query);
      return sendSuccess(result, "Gallery images retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async getGalleryImageById(rawId: string): Promise<NextResponse> {
    try {
      const id = parseGalleryEntityId(rawId, "Gallery image ID");
      const image = await galleryService.getGalleryImageById(id);
      return sendSuccess(image, "Gallery image retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createGalleryImage(
    request: NextRequest,
    rawGalleryId?: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const boundGalleryId =
        rawGalleryId !== undefined
          ? parseGalleryEntityId(rawGalleryId, "Gallery ID")
          : undefined;
      const multipart = await parseMultipartWithMulter(request);
      const created = await galleryService.createGalleryImage(
        multipart,
        boundGalleryId
      );
      return sendSuccess(created, "Gallery image uploaded successfully.", 201);
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async updateGalleryImage(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseGalleryEntityId(rawId, "Gallery image ID");
      const payload = await parseImageUpdatePayload(request);
      const updated = await galleryService.updateGalleryImage(id, payload);
      return sendSuccess(updated, "Gallery image updated successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deleteGalleryImage(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseGalleryEntityId(rawId, "Gallery image ID");
      await galleryService.deleteGalleryImage(id);
      return sendSuccess({ id }, "Gallery image deleted successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },
};
