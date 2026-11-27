"use client";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_BOOTSTRAP_ENDPOINT = "/api/auth/csrf";
const AUTH_REFRESH_ENDPOINT = "/api/auth/refresh";
const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

let activeRefreshPromise: Promise<boolean> | null = null;

/**
 * Reads the readable `csrf_token` double-submit cookie from `document.cookie`.
 */
export function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const pairs = document.cookie.split(";");
  for (const pair of pairs) {
    const [rawKey, ...rawValue] = pair.split("=");
    if (rawKey?.trim() === CSRF_COOKIE_NAME) {
      const value = rawValue.join("=").trim();
      return value ? decodeURIComponent(value) : null;
    }
  }
  return null;
}

/**
 * Ensures the browser has a valid `csrf_token` cookie before issuing state-changing requests.
 */
export async function ensureCsrfToken(): Promise<string | null> {
  const existing = getCsrfTokenFromCookie();
  if (existing) {
    return existing;
  }

  await fetch(CSRF_BOOTSTRAP_ENDPOINT, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  }).catch(() => undefined);

  return getCsrfTokenFromCookie();
}

/**
 * Deduplicates concurrent client refresh attempts into a single `POST /api/auth/refresh` call
 * so parallel expiring requests never trigger concurrent rotation conflicts.
 */
async function performSingleFlightRefresh(): Promise<boolean> {
  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    try {
      const csrfToken = await ensureCsrfToken();
      const headers = new Headers();
      if (csrfToken) {
        headers.set("x-csrf-token", csrfToken);
      }

      const response = await fetch(AUTH_REFRESH_ENDPOINT, {
        method: "POST",
        credentials: "same-origin",
        headers,
      });

      return response.ok;
    } catch {
      return false;
    } finally {
      activeRefreshPromise = null;
    }
  })();

  return activeRefreshPromise;
}

/**
 * Client fetch wrapper for cookie-authenticated API endpoints:
 * - Never persists tokens in `localStorage` or `sessionStorage`
 * - Injects `X-CSRF-Token` automatically on state-changing HTTP methods
 * - Automatically attempts a single silent refresh-token rotation on `401` and retries once
 */
export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);

  if (STATE_CHANGING_METHODS.has(method)) {
    const csrfToken = await ensureCsrfToken();
    if (csrfToken && !headers.has("x-csrf-token")) {
      headers.set("x-csrf-token", csrfToken);
    }
  }

  const firstResponse = await fetch(input, {
    ...init,
    credentials: "same-origin",
    headers,
  });

  if (firstResponse.status !== 401) {
    return firstResponse;
  }

  // Attempt single-flight refresh rotation using HttpOnly `refresh_token`
  const refreshed = await performSingleFlightRefresh();
  if (!refreshed) {
    return firstResponse;
  }

  const retryHeaders = new Headers(init.headers);
  if (STATE_CHANGING_METHODS.has(method)) {
    const rotatedCsrf = getCsrfTokenFromCookie();
    if (rotatedCsrf) {
      retryHeaders.set("x-csrf-token", rotatedCsrf);
    }
  }

  return fetch(input, {
    ...init,
    credentials: "same-origin",
    headers: retryHeaders,
  });
}
