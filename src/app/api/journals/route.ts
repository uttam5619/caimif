import type { NextRequest } from "next/server";
import { journalController } from "@/server/modules/journal/journal.controller";

/**
 * GET /api/journals
 * Lists paginated journal publications with optional year, domain, and search filters.
 */
export async function GET(request: NextRequest) {
  return journalController.listJournals(request);
}

/**
 * POST /api/journals
 * Creates a new journal publication record.
 */
export async function POST(request: NextRequest) {
  return journalController.createJournal(request);
}
