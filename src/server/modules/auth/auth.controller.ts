import type { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/server/middlewares/adminAuth";
import { assertCsrfProtection } from "@/server/middlewares/csrf";
import {
  clearAuthCookies,
  readCsrfTokenCookie,
  readRefreshTokenCookie,
  setAuthCookies,
  setCsrfCookie,
} from "@/server/utils/auth/cookies";
import {
  handleControllerError,
  parseJsonBody,
  sendSuccess,
} from "@/server/utils/http/apiResponse";
import { authService } from "./auth.service";
import type { SessionRequestMetadata } from "./auth.types";
import {
  parseUserId,
  validateCreateUserPayload,
  validateListUsersQuery,
  validateLoginPayload,
  validateUpdateUserPayload,
} from "./auth.validation";

const CONTROLLER_LABEL = "AuthController";

function extractClientMetadata(request: NextRequest): SessionRequestMetadata {
  const userAgentHeader = request.headers.get("user-agent")?.trim() ?? null;
  const forwardedFor = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const ipAddress = forwardedFor || realIp || null;

  return {
    userAgent: userAgentHeader ? userAgentHeader.slice(0, 191) : null,
    ipAddress: ipAddress ? ipAddress.slice(0, 191) : null,
  };
}

/**
 * Controller handling HTTP auth session lifecycles (`login`, `refresh`, `logout`, `logout-all`, `me`, `csrf`)
 * and SecurityAdmin RBAC user account administration.
 */
export const authController = {
  /**
   * Ensures a double-submit CSRF cookie exists for browser login and state-changing flows.
   */
  async ensureCsrfToken(request: NextRequest): Promise<NextResponse> {
    try {
      const existingToken = readCsrfTokenCookie(request);
      const response = sendSuccess(
        { initialized: true },
        "CSRF protection initialized."
      );
      setCsrfCookie(response, existingToken ?? undefined);
      return response;
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  /**
   * Authenticates email + password (Argon2id), sets HttpOnly access/refresh cookies,
   * and returns only the sanitized user profile (never exposing tokens or password hashes).
   */
  async login(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await parseJsonBody(request);
      const validated = validateLoginPayload(body);
      const metadata = extractClientMetadata(request);

      const result = await authService.login(validated, metadata);

      const response = sendSuccess(
        { user: result.user },
        "Authentication successful."
      );
      setAuthCookies(response, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      return response;
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  /**
   * Validates CSRF and the HttpOnly refresh cookie, rotates both tokens + DB hash,
   * and clears auth cookies cleanly on invalid/revoked refresh attempts.
   */
  async refresh(request: NextRequest): Promise<NextResponse> {
    try {
      assertCsrfProtection(request);
      const rawRefreshToken = readRefreshTokenCookie(request);
      const metadata = extractClientMetadata(request);

      const result = await authService.refreshSession(rawRefreshToken, metadata);

      const response = sendSuccess(
        { user: result.user },
        "Session refreshed successfully."
      );
      setAuthCookies(response, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      return response;
    } catch (error) {
      const errorResponse = handleControllerError(error, CONTROLLER_LABEL);
      if (errorResponse.status === 401 || errorResponse.status === 403) {
        clearAuthCookies(errorResponse);
      }
      return errorResponse;
    }
  },

  /**
   * Revokes only the calling device's refresh session and clears cookies with matching attributes.
   */
  async logout(request: NextRequest): Promise<NextResponse> {
    try {
      assertCsrfProtection(request);
      const rawRefreshToken = readRefreshTokenCookie(request);
      await authService.logoutCurrentSession(rawRefreshToken);

      const response = sendSuccess(
        { loggedOut: true },
        "Signed out of current session."
      );
      clearAuthCookies(response);
      return response;
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  /**
   * Revokes all active sessions belonging to the authenticated user across all devices.
   */
  async logoutAll(request: NextRequest): Promise<NextResponse> {
    try {
      const authContext = await requireAdminRole(request, [
        "SecurityAdmin",
        "SubAdmin",
      ]);
      const result = await authService.logoutAllSessions(authContext.userId);

      const response = sendSuccess(
        result,
        "Signed out from all active sessions."
      );
      clearAuthCookies(response);
      return response;
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  /**
   * Returns the authenticated user's profile derived from the verified `access_token` + DB state.
   */
  async getMe(request: NextRequest): Promise<NextResponse> {
    try {
      const authContext = await requireAdminRole(request, [
        "SecurityAdmin",
        "SubAdmin",
      ]);
      const user = await authService.getCurrentUser(authContext.userId);
      return sendSuccess({ user }, "Authenticated user retrieved.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async listUsers(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin"]);
      const query = validateListUsersQuery(request.nextUrl.searchParams);
      const result = await authService.listUsers(query);
      return sendSuccess(result, "Admin users retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async getUserById(request: NextRequest, rawId: string): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin"]);
      const id = parseUserId(rawId);
      const user = await authService.getUserById(id);
      return sendSuccess(user, "Admin user retrieved successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async createUser(request: NextRequest): Promise<NextResponse> {
    try {
      await requireAdminRole(request, ["SecurityAdmin"]);
      const body = await parseJsonBody(request);
      const validated = validateCreateUserPayload(body);
      const created = await authService.createUser(validated);
      return sendSuccess(created, "Admin account created successfully.", 201);
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async updateUser(
    request: NextRequest,
    rawId: string
  ): Promise<NextResponse> {
    try {
      const authContext = await requireAdminRole(request, ["SecurityAdmin"]);
      const id = parseUserId(rawId);
      const body = await parseJsonBody(request);
      const validated = validateUpdateUserPayload(body);
      const updated = await authService.updateUser(
        id,
        validated,
        authContext.userId
      );
      return sendSuccess(updated, "Admin account updated successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },

  async deleteUser(request: NextRequest, rawId: string): Promise<NextResponse> {
    try {
      const authContext = await requireAdminRole(request, ["SecurityAdmin"]);
      const id = parseUserId(rawId);
      await authService.deleteUser(id, authContext.userId);
      return sendSuccess({ id }, "Admin account deleted successfully.");
    } catch (error) {
      return handleControllerError(error, CONTROLLER_LABEL);
    }
  },
};
