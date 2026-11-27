import type { NextRequest } from "next/server";
import { authController } from "@/server/modules/auth/auth.controller";

interface UserRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/users/[id]
 * Retrieves a single admin user profile (`SecurityAdmin` only).
 */
export async function GET(
  request: NextRequest,
  context: UserRouteContext
) {
  const { id } = await context.params;
  return authController.getUserById(request, id);
}

/**
 * PATCH /api/users/[id]
 * Updates an admin user's name, role, status, or password (`SecurityAdmin` only).
 */
export async function PATCH(
  request: NextRequest,
  context: UserRouteContext
) {
  const { id } = await context.params;
  return authController.updateUser(request, id);
}

/**
 * DELETE /api/users/[id]
 * Deletes an admin user (`SecurityAdmin` only).
 */
export async function DELETE(
  request: NextRequest,
  context: UserRouteContext
) {
  const { id } = await context.params;
  return authController.deleteUser(request, id);
}
