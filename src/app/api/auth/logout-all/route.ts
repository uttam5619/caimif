import type { NextRequest } from "next/server";
import { authController } from "@/server/modules/auth/auth.controller";

/**
 * POST /api/auth/logout-all
 * Revokes all active AuthSessions for the authenticated user across all devices.
 */
export async function POST(request: NextRequest) {
  return authController.logoutAll(request);
}
