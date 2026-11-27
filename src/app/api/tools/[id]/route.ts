import type { NextRequest } from "next/server";
import { toolController } from "@/server/modules/tool/tool.controller";

interface ToolRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/tools/[id]
 * Retrieves a single `Tool` record by ID.
 */
export async function GET(_request: NextRequest, context: ToolRouteContext) {
  const { id } = await context.params;
  return toolController.getToolById(id);
}

/**
 * PATCH /api/tools/[id]
 * Partially updates an existing `Tool` record via multipart FormData or JSON.
 */
export async function PATCH(request: NextRequest, context: ToolRouteContext) {
  const { id } = await context.params;
  return toolController.updateTool(request, id);
}

/**
 * DELETE /api/tools/[id]
 * Deletes a `Tool` record by ID and removes any stored S3 image asset.
 */
export async function DELETE(request: NextRequest, context: ToolRouteContext) {
  const { id } = await context.params;
  return toolController.deleteTool(request, id);
}
