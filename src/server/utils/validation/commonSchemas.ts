import { z } from "zod";

/**
 * Trims optional string inputs and converts empty strings to `null`
 * so nullable database columns stay clean.
 */
export function optionalNullableText(maxLen?: number) {
  return z
    .string()
    .trim()
    .refine((val) => (maxLen ? val.length <= maxLen : true), {
      message: maxLen ? `Value cannot exceed ${maxLen} characters.` : "Invalid value.",
    })
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional();
}

/**
 * Validates optional http(s) URLs while normalizing empty strings to `null`.
 */
export const optionalNullableUrl = z
  .string()
  .trim()
  .transform((val) => (val === "" ? null : val))
  .nullable()
  .optional()
  .refine(
    (val) => {
      if (val === null || val === undefined) return true;
      try {
        const parsed = new URL(val);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "weblink must be a valid http(s) URL." }
  );
