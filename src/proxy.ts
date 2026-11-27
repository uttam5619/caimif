import { NextResponse, type NextRequest } from "next/server";
import { assertCsrfProtection } from "@/server/middlewares/csrf";
import { readAccessTokenCookie } from "@/server/utils/auth/cookies";
import {
  verifyAccessToken,
  type AuthUserRole,
} from "@/server/utils/auth/jwt";
import { AppError } from "@/server/utils/errors/AppError";

const PUBLIC_READ_API_PREFIXES = [
  "/api/research-domains",
  "/api/research-domain-fields",
  "/api/featured-research",
  "/api/journals",
  "/api/conferences",
  "/api/patents",
  "/api/books",
  "/api/book-chapters",
  "/api/trainings",
  "/api/team",
  "/api/events",
  "/api/collaborations",
  "/api/galleries",
  "/api/gallery-images",
  "/api/tool-types",
  "/api/tools",
];

const SECURITY_ADMIN_ONLY_API_PREFIXES = [
  "/api/users",
  "/api/research-domain-fields",
];

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function apiErrorResponse(
  status: number,
  code: string,
  message: string
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details: null,
      },
    },
    { status }
  );
}

function isPrefixMatch(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function extractRequestAccessToken(request: NextRequest): {
  token: string | null;
  fromCookie: boolean;
} {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const bearer = authHeader.slice(7).trim();
    if (bearer) {
      return { token: bearer, fromCookie: false };
    }
  }

  const cookieToken = readAccessTokenCookie(request);
  return { token: cookieToken, fromCookie: Boolean(cookieToken) };
}

function getRequiredRolesForApiPath(
  pathname: string
): readonly AuthUserRole[] {
  if (isPrefixMatch(pathname, SECURITY_ADMIN_ONLY_API_PREFIXES)) {
    return ["SECURITY_ADMIN"];
  }
  return ["SECURITY_ADMIN", "SUB_ADMIN"];
}

/**
 * Next.js 16 Proxy (Middleware replacement) enforcing RBAC, JWT access verification,
 * and CSRF checks across `/admin/*` pages and `/api/*` endpoints.
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // Strip any client-supplied internal verification headers before processing
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("x-verified-user-id");
  requestHeaders.delete("x-verified-user-role");

  // 1. Handle Authentication Page (`/admin`)
  if (pathname === "/admin") {
    const { token } = extractRequestAccessToken(request);
    if (token) {
      try {
        await verifyAccessToken(token);
        return NextResponse.redirect(
          new URL("/admin/dashboard", request.url)
        );
      } catch {
        // Invalid or expired access token: allow login screen (which may attempt silent refresh)
      }
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // 2. Protect Admin Dashboard UI routes (`/admin/dashboard/*`)
  if (pathname.startsWith("/admin/dashboard")) {
    const { token } = extractRequestAccessToken(request);
    if (!token) {
      const loginUrl = new URL("/admin", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const claims = await verifyAccessToken(token);
      requestHeaders.set("x-verified-user-id", claims.sub);
      requestHeaders.set("x-verified-user-role", claims.role);
      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch {
      const loginUrl = new URL("/admin", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Handle API routes (`/api/*`)
  if (pathname.startsWith("/api/")) {
    // Public auth bootstrap endpoints
    if (pathname === "/api/auth/login" || pathname === "/api/auth/csrf") {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // Cookie-authenticated auth lifecycle endpoints using `refresh_token`
    if (pathname === "/api/auth/refresh" || pathname === "/api/auth/logout") {
      try {
        assertCsrfProtection(request);
      } catch (error: unknown) {
        if (error instanceof AppError) {
          return apiErrorResponse(error.statusCode, error.code, error.message);
        }
        return apiErrorResponse(403, "FORBIDDEN", "CSRF verification failed.");
      }
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // Public contact inquiry form submission (`POST /api/contact-inquiries`)
    if (pathname === "/api/contact-inquiries" && method === "POST") {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // Public read-only catalog APIs (`GET`/`HEAD`/`OPTIONS`)
    if (
      SAFE_METHODS.has(method) &&
      isPrefixMatch(pathname, PUBLIC_READ_API_PREFIXES)
    ) {
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // Every other API route requires a valid access token + RBAC + CSRF (if cookie-based)
    const { token, fromCookie } = extractRequestAccessToken(request);
    if (!token) {
      return apiErrorResponse(
        401,
        "UNAUTHORIZED",
        "Authentication is required."
      );
    }

    if (fromCookie && !SAFE_METHODS.has(method)) {
      try {
        assertCsrfProtection(request);
      } catch (error: unknown) {
        if (error instanceof AppError) {
          return apiErrorResponse(error.statusCode, error.code, error.message);
        }
        return apiErrorResponse(403, "FORBIDDEN", "CSRF verification failed.");
      }
    }

    try {
      const claims = await verifyAccessToken(token);
      const allowedRoles = getRequiredRolesForApiPath(pathname);

      if (!allowedRoles.includes(claims.role)) {
        return apiErrorResponse(
          403,
          "FORBIDDEN",
          "You do not have sufficient role permissions to perform this action."
        );
      }

      requestHeaders.set("x-verified-user-id", claims.sub);
      requestHeaders.set("x-verified-user-role", claims.role);
      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return apiErrorResponse(error.statusCode, error.code, error.message);
      }
      return apiErrorResponse(
        401,
        "UNAUTHORIZED",
        "Invalid or expired access token."
      );
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
