import type { TeamCategory, TeamCategoryOption, TeamTabItem } from "./types";

/**
 * Tab definitions for the Team dashboard section.
 * Decoupled from TeamView to separate presentation data from UI JSX.
 */
export const TEAM_TABS: TeamTabItem[] = [
  {
    id: "list",
    label: "List of Members",
  },
  {
    id: "add",
    label: "Add Members",
  },
];

/**
 * Category options synchronized with `enum TeamCategory` in `prisma/models/team.prisma`.
 */
export const TEAM_CATEGORY_OPTIONS: TeamCategoryOption[] = [
  { value: "HEAD", label: "Head" },
  { value: "PROFESSOR", label: "Professor" },
  { value: "PHD_SCHOLAR", label: "PhD Scholar" },
  { value: "ALUMNI", label: "Alumni" },
];

/**
 * Human-readable display labels keyed by `TeamCategory`.
 */
export const TEAM_CATEGORY_LABELS: Record<TeamCategory, string> = {
  HEAD: "Head",
  PROFESSOR: "Professor",
  PHD_SCHOLAR: "PhD Scholar",
  ALUMNI: "Alumni",
};
