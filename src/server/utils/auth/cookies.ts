import { randomBytes } from "crypto";
import type { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
} from "./jwt";

export const ACCESS_TOKEN_COOKIE_NAME = "access_token";
export const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
export const CSRF_TOKEN_COOKIE_NAME = "csrf_token";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

function getAccessCookieBaseOptions() {
  return {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax" as const,
    path: "/",
  };
}

function getRefreshCookieBaseOptions() {
  return {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax" as const,
    path: "/api/auth",
  };
}

function getCsrfCookieBaseOptions() {
  return {
    httpOnly: false,
    secure: IS_PRODUCTION,
    sameSite: "lax" as const,
    path: "/",
  };
}

/**
 * Generates a 256-bit cryptographically random CSRF double-submit token.
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Attaches rotated HttpOnly access & refresh cookies alongside the readable CSRF token cookie.
 * Raw JWT strings are strictly confined to cookies and never placed in JSON response payloads.
 */
export function setAuthCookies(
  response: NextResponse,
  tokens: {
    accessToken: string;
    refreshToken: string;
    csrfToken?: string;
  }
): string {
  const csrfToken = tokens.csrfToken ?? generateCsrfToken();

  response.cookies.set(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, {
    ...getAccessCookieBaseOptions(),
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
    ...getRefreshCookieBaseOptions(),
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });

  response.cookies.set(CSRF_TOKEN_COOKIE_NAME, csrfToken, {
    ...getCsrfCookieBaseOptions(),
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });

  return csrfToken;
}

/**
 * Clears only the CSRF cookie when refreshing or issuing a standalone CSRF token.
 */
export function setCsrfCookie(response: NextResponse, csrfToken?: string): string {
  const token = csrfToken ?? generateCsrfToken();
  response.cookies.set(CSRF_TOKEN_COOKIE_NAME, token, {
    ...getCsrfCookieBaseOptions(),
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });
  return token;
}

/**
 * Clears all authentication and CSRF cookies using matching attributes and paths (`/` and `/api/auth`).
 */
export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set(ACCESS_TOKEN_COOKIE_NAME, "", {
    ...getAccessCookieBaseOptions(),
    maxAge: 0,
    expires: new Date(0),
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, "", {
    ...getRefreshCookieBaseOptions(),
    maxAge: 0,
    expires: new Date(0),
  });

  response.cookies.set(CSRF_TOKEN_COOKIE_NAME, "", {
    ...getCsrfCookieBaseOptions(),
    maxAge: 0,
    expires: new Date(0),
  });
}

export function readAccessTokenCookie(request: NextRequest): string | null {
  const value = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value?.trim();
  return value || null;
}

export function readRefreshTokenCookie(request: NextRequest): string | null {
  const value = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value?.trim();
  return value || null;
}

export function readCsrfTokenCookie(request: NextRequest): string | null {
  const value = request.cookies.get(CSRF_TOKEN_COOKIE_NAME)?.value?.trim();
  return value || null;
}
