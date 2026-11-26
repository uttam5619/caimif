import type { NextRequest } from "next/server";
import { trainingController } from "@/server/modules/training/training.controller";

interface TrainingRouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/trainings/[id]
 * Retrieves a single training program by ID.
 */
export async function GET(
  _request: NextRequest,
  context: TrainingRouteContext
) {
  const { id } = await context.params;
  return trainingController.getTrainingById(id);
}

/**
 * PATCH /api/trainings/[id]
 * Updates an existing training program, including optional cover image replacement/removal.
 */
export async function PATCH(
  request: NextRequest,
  context: TrainingRouteContext
) {
  const { id } = await context.params;
  return trainingController.updateTraining(request, id);
}

/**
 * DELETE /api/trainings/[id]
 * Deletes a training program and cleans up its S3 image asset.
 */
export async function DELETE(
  request: NextRequest,
  context: TrainingRouteContext
) {
  const { id } = await context.params;
  return trainingController.deleteTraining(request, id);
}
