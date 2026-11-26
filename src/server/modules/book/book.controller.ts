import type { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/server/middlewares/adminAuth";
import {
  handleControllerError,
  parseJsonBody,
  sendSuccess,
} from "@/server/utils/http/apiResponse";
import { bookService } from "./book.service";
import {
  validateCreateBookPayload,
  validateListBooksQuery,
  validateUpdateBookPayload,
} from "./book.validation";

const CONTROLLER_LABEL = "BookController";

/**
 * Controller handling HTTP translation, input validation, and role checks for Book APIs.
 */
export const bookController = {
  async listBooks(request: NextRequest): Promise<NextResponse> {
    try {
      const query = validateListBooksQuery(request.nextUrl.searchParams);
      const result = await bookService.listBooks(query);
      return sendSuccess(result, "Book publications retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async getBookById(bookId: string): Promise<NextResponse> {
    try {
      const book = await bookService.getBookById(bookId);
      return sendSuccess(book, "Book publication retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createBook(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const body = await parseJsonBody(request);
      const validated = validateCreateBookPayload(body);
      const created = await bookService.createBook(validated);
      return sendSuccess(created, "Book publication created successfully.", 201);
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async updateBook(
    request: NextRequest,
    bookId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const body = await parseJsonBody(request);
      const validated = validateUpdateBookPayload(body);
      const updated = await bookService.updateBook(bookId, validated);
      return sendSuccess(updated, "Book publication updated successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deleteBook(
    request: NextRequest,
    bookId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      await bookService.deleteBook(bookId);
      return sendSuccess({ id: bookId }, "Book publication deleted successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },
};
