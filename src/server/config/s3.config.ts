import { S3Client } from "@aws-sdk/client-s3";

export interface S3Config {
  region: string;
  bucketName: string;
  publicBaseUrl?: string;
}

const globalForS3 = globalThis as unknown as {
  s3Client?: S3Client;
};

/**
 * Validates and returns AWS S3 configuration from environment variables.
 * Throws an explicit error if required S3 credentials or bucket settings are missing.
 */
export function getS3Config(): S3Config {
  const region = process.env.AWS_REGION?.trim();
  const bucketName = process.env.AWS_S3_BUCKET_NAME?.trim();
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();

  if (!region || !bucketName || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "AWS S3 is not configured. Set AWS_REGION, AWS_S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY in .env."
    );
  }

  return {
    region,
    bucketName,
    publicBaseUrl: process.env.AWS_S3_PUBLIC_BASE_URL?.trim() || undefined,
  };
}

/**
 * Returns a singleton S3Client instance configured from environment variables.
 */
export function getS3Client(): S3Client {
  const config = getS3Config();

  if (!globalForS3.s3Client) {
    globalForS3.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!.trim(),
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!.trim(),
      },
    });
  }

  return globalForS3.s3Client;
}
