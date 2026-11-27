import type { CollaborationTabItem } from "./types";

/**
 * Two-tab definitions for the Collaboration dashboard section.
 * Decoupled from CollaborationView to separate presentation data from UI JSX.
 */
export const COLLABORATION_TABS: CollaborationTabItem[] = [
  {
    id: "list",
    label: "List of Collaborations",
  },
  {
    id: "add",
    label: "Add Collaboration",
  },
];
