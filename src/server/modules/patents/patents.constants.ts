/**
 * Default and boundary pagination values for patent collection queries.
 */
export const PATENT_DEFAULT_PAGE = 1;
export const PATENT_DEFAULT_LIMIT = 20;
export const PATENT_MAX_LIMIT = 100;

/**
 * Publication/grant year bounds accepted for patent records.
 */
export const PATENT_MIN_YEAR = 1900;
export const PATENT_MAX_YEAR = 2100;

/**
 * Allowed PatentStatus enum values matching `prisma/models/patents.prisma`.
 */
export const PATENT_STATUSES = ["PUBLISHED", "GRANTED"] as const;
