import { randomUUID } from "crypto";
import path from "path";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client, getS3Config } from "@/server/config/s3.config";
import { ValidationError } from "@/server/utils/errors/AppError";

const S3_KEY_PREFIX = "research-domains/";
const PRESIGNED_URL_TTL_SECONDS = 3600;

/**
 * Sanitizes an uploaded filename so generated S3 keys are URL-safe and collision-free.
 */
function sanitizeFilename(originalName: string): string {
  const baseName = path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, "_");
  return baseName.slice(0, 80) || "asset";
}

/**
 * Uploads a Multer in-memory file buffer to Amazon S3 and returns its S3 object key.
 * Only the S3 object key is persisted in MySQL (`ResearchDomain.image`).
 */
export async function uploadMulterFileToS3(
  file: Express.Multer.File,
  keyPrefix: string = S3_KEY_PREFIX
): Promise<string> {
  if (!file.buffer || file.size <= 0) {
    throw new ValidationError(`Uploaded file "${file.originalname}" is empty.`);
  }

  const { bucketName } = getS3Config();
  const s3Client = getS3Client();
  const normalizedPrefix = keyPrefix.endsWith("/") ? keyPrefix : `${keyPrefix}/`;
  const objectKey = `${normalizedPrefix}${randomUUID()}-${sanitizeFilename(
    file.originalname
  )}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return objectKey;
}

/**
 * Deletes an object from Amazon S3 by its stored key.
 * Ignores empty values or legacy non-S3 references cleanly.
 */
export async function deleteFromS3(
  objectKey: string | null | undefined
): Promise<void> {
  if (!objectKey || objectKey.startsWith("/uploads/") || objectKey.startsWith("http")) {
    return;
  }

  try {
    const { bucketName } = getS3Config();
    const s3Client = getS3Client();

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
      })
    );
  } catch (error) {
    console.error("[S3Storage] Failed to delete object:", objectKey, error);
  }
}

/**
 * Resolves a stored S3 object key into a browser-readable image URL.
 * Uses `AWS_S3_PUBLIC_BASE_URL` if configured, otherwise generates a presigned GET URL.
 */
export async function resolveS3ReadUrl(
  storedKey: string | null | undefined
): Promise<string | undefined> {
  if (!storedKey) return undefined;

  // Preserve legacy local URLs or full external URLs as-is
  if (storedKey.startsWith("/") || storedKey.startsWith("http")) {
    return storedKey;
  }

  const { bucketName, publicBaseUrl } = getS3Config();
  if (publicBaseUrl) {
    const normalizedBase = publicBaseUrl.replace(/\/+$/, "");
    return `${normalizedBase}/${storedKey}`;
  }

  const s3Client = getS3Client();
  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: storedKey,
    }),
    { expiresIn: PRESIGNED_URL_TTL_SECONDS }
  );
}
