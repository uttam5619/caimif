import type { NextRequest } from "next/server";
import { authController } from "@/server/modules/auth/auth.controller";

/**
 * GET /api/auth/csrf
 * Ensures the `csrf_token` double-submit cookie is initialized for client requests.
 */
export async function GET(request: NextRequest) {
  return authController.ensureCsrfToken(request);
}
