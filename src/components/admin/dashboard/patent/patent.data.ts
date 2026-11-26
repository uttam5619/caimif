import type { PatentStatus, PatentTabItem } from "./types";

/**
 * Tab definitions for the Patent dashboard section.
 * Decoupled from PatentView to separate presentation data from UI JSX.
 */
export const PATENT_TABS: PatentTabItem[] = [
  {
    id: "list",
    label: "List of Patents",
  },
  {
    id: "add",
    label: "Add Patent",
  },
];

/**
 * Selectable PatentStatus options synchronized with `prisma/models/patents.prisma`.
 */
export const PATENT_STATUS_OPTIONS: Array<{ value: PatentStatus; label: string }> = [
  { value: "PUBLISHED", label: "Published" },
  { value: "GRANTED", label: "Granted" },
];
