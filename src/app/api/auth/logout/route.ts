import type { NextRequest } from "next/server";
import { authController } from "@/server/modules/auth/auth.controller";

/**
 * POST /api/auth/logout
 * Enforces CSRF check, revokes only the current device's AuthSession, and clears cookies.
 */
export async function POST(request: NextRequest) {
  return authController.logout(request);
}
