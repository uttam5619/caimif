import type { NextRequest } from "next/server";
import { toolController } from "@/server/modules/tool/tool.controller";

/**
 * GET /api/tool-types
 * Lists paginated tool types with optional search filtering and linked tool counts.
 */
export async function GET(request: NextRequest) {
  return toolController.listToolTypes(request);
}

/**
 * POST /api/tool-types
 * Creates a new `ToolType` category from a JSON payload.
 */
export async function POST(request: NextRequest) {
  return toolController.createToolType(request);
}
