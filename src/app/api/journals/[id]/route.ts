import type { NextRequest } from "next/server";
import { journalController } from "@/server/modules/journal/journal.controller";

interface JournalRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/journals/[id]
 * Retrieves a single journal publication by ID.
 */
export async function GET(_request: NextRequest, context: JournalRouteContext) {
  const { id } = await context.params;
  return journalController.getJournalById(id);
}

/**
 * PATCH /api/journals/[id]
 * Partially updates an existing journal publication record.
 */
export async function PATCH(request: NextRequest, context: JournalRouteContext) {
  const { id } = await context.params;
  return journalController.updateJournal(request, id);
}

/**
 * DELETE /api/journals/[id]
 * Deletes a journal publication record by ID.
 */
export async function DELETE(request: NextRequest, context: JournalRouteContext) {
  const { id } = await context.params;
  return journalController.deleteJournal(request, id);
}
