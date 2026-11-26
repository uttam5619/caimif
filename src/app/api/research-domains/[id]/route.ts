import type { NextRequest } from "next/server";
import { researchDomainController } from "@/server/modules/researchDomain/researchDomain.controller";

interface DomainRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/research-domains/[id]
 * Updates an existing research domain, including optional cover image and customFields.
 */
export async function PATCH(request: NextRequest, context: DomainRouteContext) {
  const { id } = await context.params;
  return researchDomainController.updateDomain(request, id);
}

/**
 * DELETE /api/research-domains/[id]
 * Deletes a research domain record and cleans up associated uploaded files.
 */
export async function DELETE(request: NextRequest, context: DomainRouteContext) {
  const { id } = await context.params;
  return researchDomainController.deleteDomain(request, id);
}
