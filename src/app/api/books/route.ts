import type { NextRequest } from "next/server";
import { bookController } from "@/server/modules/book/book.controller";

/**
 * GET /api/books
 * Lists paginated book publications with optional year, domain, and search filters.
 */
export async function GET(request: NextRequest) {
  return bookController.listBooks(request);
}

/**
 * POST /api/books
 * Creates a new book publication record.
 */
export async function POST(request: NextRequest) {
  return bookController.createBook(request);
}
