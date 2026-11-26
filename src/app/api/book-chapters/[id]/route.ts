import type { NextRequest } from "next/server";
import { bookChapterController } from "@/server/modules/bookChapter/bookChapter.controller";

interface BookChapterRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/book-chapters/[id]
 * Retrieves a single book chapter publication by ID.
 */
export async function GET(
  _request: NextRequest,
  context: BookChapterRouteContext
) {
  const { id } = await context.params;
  return bookChapterController.getBookChapterById(id);
}

/**
 * PATCH /api/book-chapters/[id]
 * Partially updates an existing book chapter publication record.
 */
export async function PATCH(
  request: NextRequest,
  context: BookChapterRouteContext
) {
  const { id } = await context.params;
  return bookChapterController.updateBookChapter(request, id);
}

/**
 * DELETE /api/book-chapters/[id]
 * Deletes a book chapter publication record by ID.
 */
export async function DELETE(
  request: NextRequest,
  context: BookChapterRouteContext
) {
  const { id } = await context.params;
  return bookChapterController.deleteBookChapter(request, id);
}
