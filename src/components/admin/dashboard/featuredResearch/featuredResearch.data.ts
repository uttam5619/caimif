import type { FeaturedResearchTabItem } from "./types";

/**
 * Tab definitions for the Featured Research dashboard section.
 * Decoupled from FeaturedResearchView to separate presentation data from UI JSX.
 */
export const FEATURED_RESEARCH_TABS: FeaturedResearchTabItem[] = [
  {
    id: "list",
    label: "Featured Research List",
  },
  {
    id: "add",
    label: "Add Featured Research",
  },
];
