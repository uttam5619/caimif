import type { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/server/middlewares/adminAuth";
import {
  handleControllerError,
  parseJsonBody,
  sendSuccess,
} from "@/server/utils/http/apiResponse";
import { bookChapterService } from "./bookChapter.service";
import {
  validateCreateBookChapterPayload,
  validateListBookChaptersQuery,
  validateUpdateBookChapterPayload,
} from "./bookChapter.validation";

const CONTROLLER_LABEL = "BookChapterController";

/**
 * Controller handling HTTP translation, input validation, and role checks for BookChapter APIs.
 */
export const bookChapterController = {
  async listBookChapters(request: NextRequest): Promise<NextResponse> {
    try {
      const query = validateListBookChaptersQuery(request.nextUrl.searchParams);
      const result = await bookChapterService.listBookChapters(query);
      return sendSuccess(
        result,
        "Book chapter publications retrieved successfully."
      );
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async getBookChapterById(bookChapterId: string): Promise<NextResponse> {
    try {
      const chapter = await bookChapterService.getBookChapterById(bookChapterId);
      return sendSuccess(
        chapter,
        "Book chapter publication retrieved successfully."
      );
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createBookChapter(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const body = await parseJsonBody(request);
      const validated = validateCreateBookChapterPayload(body);
      const created = await bookChapterService.createBookChapter(validated);
      return sendSuccess(
        created,
        "Book chapter publication created successfully.",
        201
      );
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async updateBookChapter(
    request: NextRequest,
    bookChapterId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const body = await parseJsonBody(request);
      const validated = validateUpdateBookChapterPayload(body);
      const updated = await bookChapterService.updateBookChapter(
        bookChapterId,
        validated
      );
      return sendSuccess(
        updated,
        "Book chapter publication updated successfully."
      );
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deleteBookChapter(
    request: NextRequest,
    bookChapterId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      await bookChapterService.deleteBookChapter(bookChapterId);
      return sendSuccess(
        { id: bookChapterId },
        "Book chapter publication deleted successfully."
      );
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },
};
