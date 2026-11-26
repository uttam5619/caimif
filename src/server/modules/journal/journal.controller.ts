import type { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/server/middlewares/adminAuth";
import { ValidationError } from "@/server/utils/errors/AppError";
import { handleControllerError, sendSuccess } from "@/server/utils/http/apiResponse";
import { journalService } from "./journal.service";
import {
  validateCreateJournalPayload,
  validateListJournalsQuery,
  validateUpdateJournalPayload,
} from "./journal.validation";

const CONTROLLER_LABEL = "JournalController";

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

/**
 * Controller handling HTTP translation, input validation, and role checks for Journal APIs.
 */
export const journalController = {
  async listJournals(request: NextRequest): Promise<NextResponse> {
    try {
      const query = validateListJournalsQuery(request.nextUrl.searchParams);
      const result = await journalService.listJournals(query);
      return sendSuccess(result, "Journal publications retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async getJournalById(journalId: string): Promise<NextResponse> {
    try {
      const journal = await journalService.getJournalById(journalId);
      return sendSuccess(journal, "Journal publication retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createJournal(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const body = await parseJsonBody(request);
      const validated = validateCreateJournalPayload(body);
      const created = await journalService.createJournal(validated);
      return sendSuccess(
        created,
        "Journal publication created successfully.",
        201
      );
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async updateJournal(
    request: NextRequest,
    journalId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const body = await parseJsonBody(request);
      const validated = validateUpdateJournalPayload(body);
      const updated = await journalService.updateJournal(journalId, validated);
      return sendSuccess(updated, "Journal publication updated successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deleteJournal(
    request: NextRequest,
    journalId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      await journalService.deleteJournal(journalId);
      return sendSuccess(
        { id: journalId },
        "Journal publication deleted successfully."
      );
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },
};
