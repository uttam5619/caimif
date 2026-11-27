import type { PatentDto } from "@/server/modules/patents/patents.types";

/**
 * Truncates long strings to a maximum character count for compact table rendering
 * while preserving full values for the detail modal.
 */
export function truncateChars(value: string, maxChars: number): string {
  if (value.length <= maxChars) {
    return value;
  }
  return `${value.slice(0, maxChars).trimEnd()}...`;
}

/**
 * Sanitizes external URLs and rejects unsafe URI schemes such as `javascript:`.
 */
export function resolveSafeWeblink(
  rawUrl: string | number | null | undefined
): string | null {
  if (typeof rawUrl !== "string") {
    return null;
  }
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  // Allow scheme-less domain entries like `www.example.com/...` while blocking other schemes.
  if (!trimmed.includes(":") && trimmed.includes(".") && !/\s/.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return null;
}

/**
 * Converts enum-style patent status strings into readable title case.
 */
export function formatPatentStatus(status: PatentDto["status"]): string | null {
  if (!status) {
    return null;
  }
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}
