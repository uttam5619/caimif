import type { NextRequest } from "next/server";
import { patentsController } from "@/server/modules/patents/patents.controller";

/**
 * GET /api/patents
 * Lists paginated patent records with optional year, domain, status, and search filters.
 */
export async function GET(request: NextRequest) {
  return patentsController.listPatents(request);
}

/**
 * POST /api/patents
 * Creates a new patent record.
 */
export async function POST(request: NextRequest) {
  return patentsController.createPatent(request);
}
