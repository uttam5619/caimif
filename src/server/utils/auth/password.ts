import { argon2, randomBytes, timingSafeEqual } from "crypto";
import { ValidationError } from "@/server/utils/errors/AppError";

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

// OWASP-aligned Argon2id parameters
const ARGON2ID_MEMORY_KIB = 65536; // 64 MiB
const ARGON2ID_PASSES = 3;
const ARGON2ID_PARALLELISM = 1;
const ARGON2ID_SALT_BYTES = 16;
const ARGON2ID_TAG_BYTES = 32;

function toUnpaddedBase64(buffer: Buffer): string {
  return buffer.toString("base64").replace(/=+$/g, "");
}

function fromUnpaddedBase64(value: string): Buffer | null {
  if (!/^[A-Za-z0-9+/]+$/.test(value)) {
    return null;
  }
  const padLength = (4 - (value.length % 4)) % 4;
  return Buffer.from(value + "=".repeat(padLength), "base64");
}

function deriveArgon2idKey(params: {
  password: string;
  salt: Buffer;
  memory: number;
  passes: number;
  parallelism: number;
  tagLength: number;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    argon2(
      "argon2id",
      {
        message: params.password,
        nonce: params.salt,
        memory: params.memory,
        passes: params.passes,
        parallelism: params.parallelism,
        tagLength: params.tagLength,
      },
      (err, derivedKey) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(derivedKey);
      }
    );
  });
}

/**
 * Enforces server-side password policy on account creation and password updates.
 */
export function validatePasswordStrength(password: string): string {
  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    throw new ValidationError(
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`
    );
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    throw new ValidationError(
      `Password cannot exceed ${PASSWORD_MAX_LENGTH} characters.`
    );
  }
  return password;
}

/**
 * Hashes a plaintext password using Node's native Argon2id KDF and returns
 * a standard PHC-formatted string (`$argon2id$v=19$m=...,t=...,p=...$salt$hash`).
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const validated = validatePasswordStrength(plainPassword);
  const salt = randomBytes(ARGON2ID_SALT_BYTES);

  const derivedKey = await deriveArgon2idKey({
    password: validated,
    salt,
    memory: ARGON2ID_MEMORY_KIB,
    passes: ARGON2ID_PASSES,
    parallelism: ARGON2ID_PARALLELISM,
    tagLength: ARGON2ID_TAG_BYTES,
  });

  return `$argon2id$v=19$m=${ARGON2ID_MEMORY_KIB},t=${ARGON2ID_PASSES},p=${ARGON2ID_PARALLELISM}$${toUnpaddedBase64(
    salt
  )}$${toUnpaddedBase64(derivedKey)}`;
}

/**
 * Constant-time Argon2id password verification against a stored PHC hash string.
 * Returns `false` for malformed hashes or mismatched credentials without throwing.
 */
export async function verifyPassword(
  plainPassword: string,
  storedHash: string
): Promise<boolean> {
  if (
    typeof plainPassword !== "string" ||
    plainPassword.length === 0 ||
    plainPassword.length > PASSWORD_MAX_LENGTH ||
    typeof storedHash !== "string"
  ) {
    return false;
  }

  const parts = storedHash.split("$");
  // Expected PHC split: ["", "argon2id", "v=19", "m=...,t=...,p=...", "<salt>", "<hash>"]
  if (parts.length !== 6 || parts[0] !== "" || parts[1] !== "argon2id") {
    return false;
  }

  const versionMatch = /^v=(\d+)$/.exec(parts[2]);
  const paramMatch = /^m=(\d+),t=(\d+),p=(\d+)$/.exec(parts[3]);
  if (!versionMatch || versionMatch[1] !== "19" || !paramMatch) {
    return false;
  }

  const memory = Number(paramMatch[1]);
  const passes = Number(paramMatch[2]);
  const parallelism = Number(paramMatch[3]);

  // Guard against degenerate or DoS-sized parameters
  if (
    !Number.isInteger(memory) ||
    memory < 8192 ||
    memory > 262144 ||
    !Number.isInteger(passes) ||
    passes < 1 ||
    passes > 16 ||
    !Number.isInteger(parallelism) ||
    parallelism < 1 ||
    parallelism > 8
  ) {
    return false;
  }

  const salt = fromUnpaddedBase64(parts[4]);
  const expectedTag = fromUnpaddedBase64(parts[5]);
  if (!salt || !expectedTag || salt.length < 8 || expectedTag.length < 16) {
    return false;
  }

  try {
    const candidateTag = await deriveArgon2idKey({
      password: plainPassword,
      salt,
      memory,
      passes,
      parallelism,
      tagLength: expectedTag.length,
    });

    if (candidateTag.length !== expectedTag.length) {
      return false;
    }

    return timingSafeEqual(candidateTag, expectedTag);
  } catch {
    return false;
  }
}
