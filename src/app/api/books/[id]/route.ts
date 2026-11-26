import type { NextRequest } from "next/server";
import { bookController } from "@/server/modules/book/book.controller";

interface BookRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/books/[id]
 * Retrieves a single book publication by ID.
 */
export async function GET(_request: NextRequest, context: BookRouteContext) {
  const { id } = await context.params;
  return bookController.getBookById(id);
}

/**
 * PATCH /api/books/[id]
 * Partially updates an existing book publication record.
 */
export async function PATCH(request: NextRequest, context: BookRouteContext) {
  const { id } = await context.params;
  return bookController.updateBook(request, id);
}

/**
 * DELETE /api/books/[id]
 * Deletes a book publication record by ID.
 */
export async function DELETE(request: NextRequest, context: BookRouteContext) {
  const { id } = await context.params;
  return bookController.deleteBook(request, id);
}
