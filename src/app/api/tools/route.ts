import type { NextRequest } from "next/server";
import { toolController } from "@/server/modules/tool/tool.controller";

/**
 * GET /api/tools
 * Lists paginated tools with optional `toolTypeId` and `search` filters.
 */
export async function GET(request: NextRequest) {
  return toolController.listTools(request);
}

/**
 * POST /api/tools
 * Creates a new `Tool` record from multipart FormData (with `image` file) or JSON.
 */
export async function POST(request: NextRequest) {
  return toolController.createTool(request);
}
