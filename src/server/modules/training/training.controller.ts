import type { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/server/middlewares/adminAuth";
import { parseMultipartWithMulter } from "@/server/middlewares/multerUpload";
import { handleControllerError, sendSuccess } from "@/server/utils/http/apiResponse";
import { trainingService } from "./training.service";
import {
  parseTrainingId,
  validateListTrainingsQuery,
} from "./training.validation";

const CONTROLLER_LABEL = "TrainingController";

/**
 * Controller handling HTTP translation, multipart parsing, and role checks for Training APIs.
 */
export const trainingController = {
  async listTrainings(request: NextRequest): Promise<NextResponse> {
    try {
      const query = validateListTrainingsQuery(request.nextUrl.searchParams);
      const result = await trainingService.listTrainings(query);
      return sendSuccess(result, "Trainings retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async getTrainingById(rawId: string): Promise<NextResponse> {
    try {
      const id = parseTrainingId(rawId);
      const training = await trainingService.getTrainingById(id);
      return sendSuccess(training, "Training retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createTraining(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const multipart = await parseMultipartWithMulter(request);
      const created = await trainingService.createTraining(multipart);
      return sendSuccess(created, "Training created successfully.", 201);
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async updateTraining(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseTrainingId(rawId);
      const multipart = await parseMultipartWithMulter(request);
      const updated = await trainingService.updateTraining(id, multipart);
      return sendSuccess(updated, "Training updated successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deleteTraining(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin", "SubAdmin"]);
      const id = parseTrainingId(rawId);
      await trainingService.deleteTraining(id);
      return sendSuccess({ id }, "Training deleted successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },
};
