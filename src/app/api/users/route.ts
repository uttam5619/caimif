import type { NextRequest } from "next/server";
import { authController } from "@/server/modules/auth/auth.controller";

/**
 * GET /api/users
 * Lists admin users (`SECURITY_ADMIN` & `SUB_ADMIN`). Strictly SecurityAdmin only.
 */
export async function GET(request: NextRequest) {
  return authController.listUsers(request);
}

/**
 * POST /api/users
 * Creates a new SecurityAdmin or SubAdmin account with Argon2id password hashing.
 */
export async function POST(request: NextRequest) {
  return authController.createUser(request);
}
