import type { ContactTabItem } from "./types";

/**
 * Single tab definition for the Contact dashboard section.
 * Decoupled from ContactView to adhere to SRP and OCP.
 */
export const CONTACT_TABS: ContactTabItem[] = [
  {
    id: "list",
    label: "List of message",
  },
];
