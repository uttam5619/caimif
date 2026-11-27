import { createHash, randomUUID } from "crypto";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { AppError, UnauthorizedError } from "@/server/utils/errors/AppError";

export const ACCESS_TOKEN_TTL_SECONDS = 5 * 60; // 5 minutes
export const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days
export const JWT_ALGORITHM = "HS256" as const;

export const ALLOWED_AUTH_ROLES = ["SECURITY_ADMIN", "SUB_ADMIN"] as const;
export type AuthUserRole = (typeof ALLOWED_AUTH_ROLES)[number];

export interface VerifiedAccessTokenClaims {
  sub: string;
  role: AuthUserRole;
  type: "access";
  iat: number;
  exp: number;
}

export interface VerifiedRefreshTokenClaims {
  sub: string;
  sid: string;
  type: "refresh";
  jti: string;
  iat: number;
  exp: number;
}

const MIN_SECRET_LENGTH = 32;

function getRequiredSecret(envName: "ACCESS_TOKEN_SECRET" | "REFRESH_TOKEN_SECRET"): Uint8Array {
  const secret = process.env[envName];
  if (!secret || secret.trim().length < MIN_SECRET_LENGTH) {
    throw new AppError(
      `Authentication configuration error: ${envName} must be configured with at least ${MIN_SECRET_LENGTH} characters.`,
      500,
      "AUTH_CONFIGURATION_ERROR"
    );
  }

  if (
    process.env.ACCESS_TOKEN_SECRET &&
    process.env.REFRESH_TOKEN_SECRET &&
    process.env.ACCESS_TOKEN_SECRET === process.env.REFRESH_TOKEN_SECRET
  ) {
    throw new AppError(
      "Authentication configuration error: ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be distinct.",
      500,
      "AUTH_CONFIGURATION_ERROR"
    );
  }

  return new TextEncoder().encode(secret);
}

function isAllowedAuthRole(value: unknown): value is AuthUserRole {
  return (
    typeof value === "string" &&
    (ALLOWED_AUTH_ROLES as readonly string[]).includes(value)
  );
}

function assertBaseJwtClaims(payload: JWTPayload): {
  sub: string;
  iat: number;
  exp: number;
} {
  if (typeof payload.sub !== "string" || payload.sub.trim().length === 0) {
    throw new UnauthorizedError("Token is missing a valid subject claim.");
  }
  if (typeof payload.iat !== "number" || !Number.isFinite(payload.iat)) {
    throw new UnauthorizedError("Token is missing a valid issued-at claim.");
  }
  if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) {
    throw new UnauthorizedError("Token is missing a valid expiration claim.");
  }

  return {
    sub: payload.sub,
    iat: payload.iat,
    exp: payload.exp,
  };
}

/**
 * Generates a short-lived (5-minute) HS256 access JWT containing `sub`, `role`, `type: "access"`, `iat`, and `exp`.
 */
export async function signAccessToken(input: {
  userId: string;
  role: AuthUserRole;
}): Promise<string> {
  const secretKey = getRequiredSecret("ACCESS_TOKEN_SECRET");

  return new SignJWT({
    role: input.role,
    type: "access",
  })
    .setProtectedHeader({ alg: JWT_ALGORITHM, typ: "JWT" })
    .setSubject(input.userId)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(secretKey);
}

/**
 * Generates a long-lived (30-day) HS256 refresh JWT containing `sub`, `sid`, `type: "refresh"`, `jti`, `iat`, and `exp`.
 */
export async function signRefreshToken(input: {
  userId: string;
  sessionId: string;
}): Promise<string> {
  const secretKey = getRequiredSecret("REFRESH_TOKEN_SECRET");

  return new SignJWT({
    sid: input.sessionId,
    type: "refresh",
  })
    .setProtectedHeader({ alg: JWT_ALGORITHM, typ: "JWT" })
    .setSubject(input.userId)
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TOKEN_TTL_SECONDS}s`)
    .sign(secretKey);
}

/**
 * Verifies an HS256 access token signature, expiration, `type === "access"`, and required claims.
 * Rejects refresh tokens or malformed payloads.
 */
export async function verifyAccessToken(
  token: string
): Promise<VerifiedAccessTokenClaims> {
  if (!token || typeof token !== "string") {
    throw new UnauthorizedError("Access token is required.");
  }

  const secretKey = getRequiredSecret("ACCESS_TOKEN_SECRET");

  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: [JWT_ALGORITHM],
    });

    if (payload.type !== "access") {
      throw new UnauthorizedError("Invalid token type; access token required.");
    }

    const base = assertBaseJwtClaims(payload);
    if (!isAllowedAuthRole(payload.role)) {
      throw new UnauthorizedError("Access token contains an invalid role.");
    }

    return {
      sub: base.sub,
      role: payload.role,
      type: "access",
      iat: base.iat,
      exp: base.exp,
    };
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new UnauthorizedError("Invalid or expired access token.");
  }
}

/**
 * Verifies an HS256 refresh token signature, expiration, `type === "refresh"`, and required `sid` claim.
 * Rejects access tokens or malformed payloads.
 */
export async function verifyRefreshToken(
  token: string
): Promise<VerifiedRefreshTokenClaims> {
  if (!token || typeof token !== "string") {
    throw new UnauthorizedError("Refresh token is required.");
  }

  const secretKey = getRequiredSecret("REFRESH_TOKEN_SECRET");

  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: [JWT_ALGORITHM],
    });

    if (payload.type !== "refresh") {
      throw new UnauthorizedError("Invalid token type; refresh token required.");
    }

    const base = assertBaseJwtClaims(payload);
    if (typeof payload.sid !== "string" || payload.sid.trim().length === 0) {
      throw new UnauthorizedError("Refresh token is missing a valid session ID.");
    }
    if (typeof payload.jti !== "string" || payload.jti.trim().length === 0) {
      throw new UnauthorizedError("Refresh token is missing a valid token ID.");
    }

    return {
      sub: base.sub,
      sid: payload.sid,
      type: "refresh",
      jti: payload.jti,
      iat: base.iat,
      exp: base.exp,
    };
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new UnauthorizedError("Invalid or expired refresh token.");
  }
}

/**
 * Computes a deterministic cryptographic SHA-256 hex digest of a raw refresh token
 * so raw refresh JWTs are never persisted in MySQL `auth_sessions`.
 */
export function hashRefreshToken(rawRefreshToken: string): string {
  return createHash("sha256").update(rawRefreshToken, "utf8").digest("hex");
}
