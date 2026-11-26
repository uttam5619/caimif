import type { NextRequest } from "next/server";
import { researchDomainController } from "@/server/modules/researchDomain/researchDomain.controller";

/**
 * GET /api/research-domain-fields
 * Retrieves the active Research Domain field schema (bootstrapping defaults on first access).
 */
export async function GET() {
  return researchDomainController.listFields();
}

/**
 * POST /api/research-domain-fields
 * Creates a new custom field definition (SecurityAdmin only).
 */
export async function POST(request: NextRequest) {
  return researchDomainController.createField(request);
}
