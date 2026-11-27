import type { NextRequest } from "next/server";
import { authController } from "@/server/modules/auth/auth.controller";

/**
 * GET /api/auth/me
 * Returns the authenticated admin user's profile and active RBAC role.
 */
export async function GET(request: NextRequest) {
  return authController.getMe(request);
}
