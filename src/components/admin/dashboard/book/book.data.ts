import type { BookTabItem } from "./types";

/**
 * Tab definitions for the Book dashboard section.
 * Decoupled from BookView to separate presentation data from UI JSX.
 */
export const BOOK_TABS: BookTabItem[] = [
  {
    id: "list",
    label: "List of Books",
  },
  {
    id: "add",
    label: "Add Book",
  },
];
