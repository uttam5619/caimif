import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AppError, ValidationError } from "@/server/utils/errors/AppError";

/**
 * Safely parses a JSON request body, throwing a structured 400 error on malformed JSON.
 */
export async function parseJsonBody(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ValidationError("Request body must be valid JSON.");
  }
}

export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details: unknown;
  };
}

/**
 * Returns a standardized JSON success response envelope.
 */
export function sendSuccess<T>(
  data: T,
  message: string,
  status = 200
): NextResponse<ApiSuccessEnvelope<T>> {
  return NextResponse.json({ success: true, data, message }, { status });
}

/**
 * Translates AppErrors and unexpected runtime failures into the standard
 * error response envelope without leaking internal database or stack details.
 */
export function handleControllerError(
  error: unknown,
  contextLabel: string
): NextResponse<ApiErrorEnvelope> {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  console.error(`[${contextLabel}] Unexpected error:`, error);
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected server error occurred.",
        details: null,
      },
    },
    { status: 500 }
  );
}
