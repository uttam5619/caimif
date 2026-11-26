import type { NextRequest } from "next/server";
import { bookChapterController } from "@/server/modules/bookChapter/bookChapter.controller";

/**
 * GET /api/book-chapters
 * Lists paginated book chapter publications with optional year, domain, and search filters.
 */
export async function GET(request: NextRequest) {
  return bookChapterController.listBookChapters(request);
}

/**
 * POST /api/book-chapters
 * Creates a new book chapter publication record.
 */
export async function POST(request: NextRequest) {
  return bookChapterController.createBookChapter(request);
}
