import { Readable } from "stream";
import multer, { MulterError } from "multer";
import type { NextRequest } from "next/server";
import { ValidationError } from "@/server/utils/errors/AppError";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);

const ALLOWED_DOCUMENT_MIME_TYPES = new Set([
  ...ALLOWED_IMAGE_MIME_TYPES,
  "application/pdf",
]);

export interface ParsedMultipartPayload {
  fields: Record<string, string>;
  files: Record<string, Express.Multer.File>;
}

interface MulterAugmentedRequest extends Readable {
  headers: Record<string, string>;
  method: string;
  body?: Record<string, unknown>;
  files?: Express.Multer.File[];
}

/**
 * Multer instance configured with memory storage so uploaded file buffers
 * can be streamed directly to Amazon S3 after validation.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_BYTES,
    files: 10,
  },
  fileFilter: (_req, file, cb) => {
    const isCoverImage = file.fieldname === "image";
    const allowedSet = isCoverImage
      ? ALLOWED_IMAGE_MIME_TYPES
      : ALLOWED_DOCUMENT_MIME_TYPES;

    if (!allowedSet.has(file.mimetype)) {
      cb(
        new ValidationError(
          isCoverImage
            ? `Unsupported image format "${file.mimetype}". Allowed: PNG, JPG, WebP, GIF.`
            : `Unsupported file format "${file.mimetype}".`
        )
      );
      return;
    }

    cb(null, true);
  },
});

const parseAnyFields = upload.any();
type MulterReqArg = Parameters<typeof parseAnyFields>[0];
type MulterResArg = Parameters<typeof parseAnyFields>[1];

/**
 * Adapts a Next.js App Router Web `NextRequest` into a Node stream compatible
 * with Multer, parses all text fields and uploaded files, and maps Multer errors
 * into structured `ValidationError` instances.
 */
export async function parseMultipartWithMulter(
  request: NextRequest
): Promise<ParsedMultipartPayload> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    throw new ValidationError("Request must use multipart/form-data.");
  }

  // Buffer request body so Multer/type-is always receives an explicit content-length
  const bodyBuffer = Buffer.from(await request.arrayBuffer());
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  if (!headers["content-length"] && !headers["transfer-encoding"]) {
    headers["content-length"] = String(bodyBuffer.byteLength);
  }

  const nodeStream = Readable.from(bodyBuffer) as MulterAugmentedRequest;
  nodeStream.headers = headers;
  nodeStream.method = request.method;

  await new Promise<void>((resolve, reject) => {
    parseAnyFields(
      nodeStream as unknown as MulterReqArg,
      {} as MulterResArg,
      (error: unknown) => {
        if (!error) {
          resolve();
          return;
        }

        if (error instanceof ValidationError) {
          reject(error);
          return;
        }

        if (error instanceof MulterError) {
          if (error.code === "LIMIT_FILE_SIZE") {
            reject(new ValidationError("Uploaded file exceeds the 5 MB size limit."));
            return;
          }
          reject(new ValidationError(`File upload error: ${error.message}`));
          return;
        }

        reject(error);
      }
    );
  });

  // Normalize parsed scalar text fields
  const fields: Record<string, string> = {};
  if (nodeStream.body && typeof nodeStream.body === "object") {
    for (const [key, value] of Object.entries(nodeStream.body)) {
      if (typeof value === "string") {
        fields[key] = value;
      } else if (Array.isArray(value) && typeof value[0] === "string") {
        fields[key] = value[0];
      }
    }
  }

  // Index uploaded files by their field name (`image` or custom file field name)
  const files: Record<string, Express.Multer.File> = {};
  if (Array.isArray(nodeStream.files)) {
    for (const file of nodeStream.files) {
      if (file.size > 0) {
        files[file.fieldname] = file;
      }
    }
  }

  return { fields, files };
}
