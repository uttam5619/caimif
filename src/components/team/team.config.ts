import type { TeamCategory } from "../../../prisma/generated/prisma/client";
import type {
  TeamCardTabItem,
  TeamCategoryFilterOption,
  TeamCategorySectionConfig,
} from "./types";

/**
 * Static copy, tab definitions, and category configuration for the public Team page.
 * Decoupled from UI JSX to adhere to SRP and OCP.
 */
export const TEAM_PAGE_HEADER = {
  badge: "Expertise & Governance",
  title: "Our Scientific & Technical Team",
  subtitle:
    "Meet the faculty leadership, professors, doctoral scholars, and alumni driving interdisciplinary discovery and instrumentation excellence at CAIMIF.",
};

export const TEAM_CATEGORY_LABELS: Record<TeamCategory, string> = {
  HEAD: "Head",
  PROFESSOR: "Professor",
  PHD_SCHOLAR: "PhD Scholar",
  ALUMNI: "Alumni",
};

export const TEAM_CATEGORY_SECTIONS: TeamCategorySectionConfig[] = [
  { category: "HEAD", title: "Head" },
  { category: "PROFESSOR", title: "Professor" },
  { category: "PHD_SCHOLAR", title: "PhD Scholar" },
  { category: "ALUMNI", title: "Alumni" },
];

export const TEAM_CATEGORY_FILTERS: TeamCategoryFilterOption[] = [
  { key: "ALL", label: "All" },
  { key: "HEAD", label: "Head" },
  { key: "PROFESSOR", label: "Professor" },
  { key: "PHD_SCHOLAR", label: "PhD Scholar" },
  { key: "ALUMNI", label: "Alumni" },
];

export const TEAM_CARD_TABS: TeamCardTabItem[] = [
  { key: "profile", label: "Profile" },
  { key: "interests", label: "Area of Interest" },
  { key: "qualifications", label: "Qualifications" },
];
