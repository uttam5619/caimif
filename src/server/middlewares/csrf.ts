import { timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";
import { readCsrfTokenCookie } from "@/server/utils/auth/cookies";
import { ForbiddenError } from "@/server/utils/errors/AppError";

const SAFE_HTTP_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function resolveExpectedOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host")?.trim();
  if (!host) {
    return request.nextUrl.origin;
  }

  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto || request.nextUrl.protocol.replace(":", "") || "http";
  return `${protocol}://${host}`;
}

function safeCompareTokens(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length === 0 || bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

/**
 * Defense-in-depth CSRF protection for cookie-authenticated state-changing requests.
 * Combines:
 * 1. Fetch-Metadata (`Sec-Fetch-Site` cross-site block)
 * 2. Strict Same-Origin (`Origin` / `Referer` verification)
 * 3. Double-Submit Token (`X-CSRF-Token` header === `csrf_token` cookie)
 */
export function assertCsrfProtection(request: NextRequest): void {
  if (SAFE_HTTP_METHODS.has(request.method.toUpperCase())) {
    return;
  }

  // 1. Block explicit cross-site requests signaled by browser Fetch Metadata
  const fetchSite = request.headers.get("sec-fetch-site")?.toLowerCase().trim();
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    throw new ForbiddenError("Cross-site state-changing request rejected by CSRF policy.");
  }

  // 2. Verify Origin or Referer matches expected application origin
  const expectedOrigin = resolveExpectedOrigin(request);
  const originHeader = request.headers.get("origin")?.trim();
  const refererHeader = request.headers.get("referer")?.trim();

  if (originHeader) {
    if (originHeader !== expectedOrigin) {
      throw new ForbiddenError("Request Origin header failed CSRF verification.");
    }
  } else if (refererHeader) {
    let refererOrigin: string | null = null;
    try {
      refererOrigin = new URL(refererHeader).origin;
    } catch {
      refererOrigin = null;
    }
    if (!refererOrigin || refererOrigin !== expectedOrigin) {
      throw new ForbiddenError("Request Referer header failed CSRF verification.");
    }
  } else {
    throw new ForbiddenError("Missing Origin or Referer header on cookie-authenticated request.");
  }

  // 3. Enforce Double-Submit CSRF token header matching readable csrf_token cookie
  const csrfCookie = readCsrfTokenCookie(request);
  const csrfHeader = request.headers.get("x-csrf-token")?.trim() ?? "";

  if (!csrfCookie || !csrfHeader || !safeCompareTokens(csrfCookie, csrfHeader)) {
    throw new ForbiddenError("Invalid or missing CSRF token.");
  }
}
