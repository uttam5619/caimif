import type { NextRequest } from "next/server";
import { researchDomainController } from "@/server/modules/researchDomain/researchDomain.controller";

interface FieldRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/research-domain-fields/[id]
 * Updates a Research Domain field configuration (SecurityAdmin only).
 */
export async function PATCH(request: NextRequest, context: FieldRouteContext) {
  const { id } = await context.params;
  return researchDomainController.updateField(request, id);
}

/**
 * DELETE /api/research-domain-fields/[id]
 * Deletes a non-system Research Domain field definition (SecurityAdmin only).
 */
export async function DELETE(request: NextRequest, context: FieldRouteContext) {
  const { id } = await context.params;
  return researchDomainController.deleteField(request, id);
}
