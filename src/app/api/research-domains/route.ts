import type { NextRequest } from "next/server";
import { researchDomainController } from "@/server/modules/researchDomain/researchDomain.controller";

/**
 * GET /api/research-domains
 * Lists all registered CAIMIF research domains.
 */
export async function GET() {
  return researchDomainController.listDomains();
}

/**
 * POST /api/research-domains
 * Registers a new research domain from a dynamic FormData payload.
 */
export async function POST(request: NextRequest) {
  return researchDomainController.createDomain(request);
}
