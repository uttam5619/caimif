import type { ConferencePaperTabItem } from "./types";

/**
 * Tab definitions for the Conference Paper dashboard section.
 * Decoupled from ConferencePaperView to keep presentation data separate from UI JSX.
 */
export const CONFERENCE_PAPER_TABS: ConferencePaperTabItem[] = [
  {
    id: "list",
    label: "Conference Paper List",
  },
  {
    id: "add",
    label: "Add Paper",
  },
];
