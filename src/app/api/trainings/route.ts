import type { NextRequest } from "next/server";
import { trainingController } from "@/server/modules/training/training.controller";

/**
 * GET /api/trainings
 * Lists paginated training programs with optional registration status and search filters.
 */
export async function GET(request: NextRequest) {
  return trainingController.listTrainings(request);
}

/**
 * POST /api/trainings
 * Creates a new training program from a multipart FormData payload.
 */
export async function POST(request: NextRequest) {
  return trainingController.createTraining(request);
}
