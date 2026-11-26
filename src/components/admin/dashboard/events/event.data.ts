import type { EventTabItem } from "./types";

/**
 * Tab definitions for the Events dashboard section.
 * Decoupled from EventView to separate presentation data from UI JSX.
 */
export const EVENT_TABS: EventTabItem[] = [
  {
    id: "list",
    label: "List of Events",
  },
  {
    id: "add",
    label: "Add Events",
  },
];
