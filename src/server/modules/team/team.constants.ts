/**
 * Default and boundary pagination values for team member collection queries.
 */
export const TEAM_DEFAULT_PAGE = 1;
export const TEAM_DEFAULT_LIMIT = 20;
export const TEAM_MAX_LIMIT = 100;

/**
 * S3 folder prefix for team member profile photos.
 */
export const TEAM_S3_KEY_PREFIX = "team/";

/**
 * Canonical TeamCategory enum values synchronized with `prisma/models/team.prisma`.
 */
export const TEAM_CATEGORIES = [
  "HEAD",
  "PROFESSOR",
  "PHD_SCHOLAR",
  "ALUMNI",
] as const;
