import type { NextRequest } from "next/server";
import { toolController } from "@/server/modules/tool/tool.controller";

interface ToolTypeRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/tool-types/[id]
 * Retrieves a single `ToolType` record by ID.
 */
export async function GET(
  _request: NextRequest,
  context: ToolTypeRouteContext
) {
  const { id } = await context.params;
  return toolController.getToolTypeById(id);
}

/**
 * PATCH /api/tool-types/[id]
 * Partially updates an existing `ToolType` record.
 */
export async function PATCH(
  request: NextRequest,
  context: ToolTypeRouteContext
) {
  const { id } = await context.params;
  return toolController.updateToolType(request, id);
}

/**
 * DELETE /api/tool-types/[id]
 * Deletes a `ToolType` record by ID when no child `Tool` records reference it.
 */
export async function DELETE(
  request: NextRequest,
  context: ToolTypeRouteContext
) {
  const { id } = await context.params;
  return toolController.deleteToolType(request, id);
}
