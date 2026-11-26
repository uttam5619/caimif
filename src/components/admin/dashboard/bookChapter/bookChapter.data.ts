import type { BookChapterTabItem } from "./types";

/**
 * Tab definitions for the Book Chapter dashboard section.
 * Decoupled from BookChapterView to separate presentation data from UI JSX.
 */
export const BOOK_CHAPTER_TABS: BookChapterTabItem[] = [
  {
    id: "list",
    label: "List of Book Chapters",
  },
  {
    id: "add",
    label: "Add Book Chapter",
  },
];
