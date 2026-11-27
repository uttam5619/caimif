import type { NextRequest } from "next/server";
import { authController } from "@/server/modules/auth/auth.controller";

/**
 * POST /api/auth/login
 * Authenticates admin credentials (Argon2id), creates a per-device DB session,
 * and sets HttpOnly `access_token` (5m) and `refresh_token` (30d) cookies.
 */
export async function POST(request: NextRequest) {
  return authController.login(request);
}
