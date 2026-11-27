import { connection } from "next/server";
import { bookService } from "@/server/modules/book/book.service";
import { bookChapterService } from "@/server/modules/bookChapter/bookChapter.service";
import { conferenceService } from "@/server/modules/conference/conference.service";
import { journalService } from "@/server/modules/journal/journal.service";
import { patentsService } from "@/server/modules/patents/patents.service";
import type { ResearchOutputsPayload } from "./types";

const MAX_PUBLIC_OUTPUTS_PER_TAB = 500;

/**
 * Fetches all research output records (Journals, Conferences, Books, Book Chapters, Patents)
 * through the backend service layer for the `/research` page tabs.
 */
export async function getAllResearchOutputs(): Promise<ResearchOutputsPayload> {
  // Opt into per-request dynamic rendering under Next.js 16 `cacheComponents`.
  await connection();

  try {
    const query = { page: 1, limit: MAX_PUBLIC_OUTPUTS_PER_TAB };

    const [journals, conferences, books, bookChapters, patents] =
      await Promise.all([
        journalService.listJournals(query),
        conferenceService.listConferences(query),
        bookService.listBooks(query),
        bookChapterService.listBookChapters(query),
        patentsService.listPatents(query),
      ]);

    return {
      journals: journals.items,
      conferences: conferences.items,
      books: books.items,
      bookChapters: bookChapters.items,
      patents: patents.items,
      loadFailed: false,
    };
  } catch (error) {
    console.error("Failed to fetch research outputs for research page:", error);
    return {
      journals: [],
      conferences: [],
      books: [],
      bookChapters: [],
      patents: [],
      loadFailed: true,
    };
  }
}
