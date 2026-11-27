import type { NextRequest } from "next/server";
import { authController } from "@/server/modules/auth/auth.controller";

/**
 * POST /api/auth/refresh
 * Validates CSRF and the HttpOnly `refresh_token` cookie, detects replay/revocation,
 * and atomically rotates both access and refresh tokens.
 */
export async function POST(request: NextRequest) {
  return authController.refresh(request);
}
