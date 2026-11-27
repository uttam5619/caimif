import type { ResearchOutputTabDefinition } from "./types";

/**
 * Static header, tab configuration, and policy metadata for the Research page.
 * Decoupled from UI JSX to adhere to SRP and OCP.
 */
export const RESEARCH_PAGE_HEADER = {
  badge: "Multidisciplinary Pillars ",
  title: "Core Research Domains",
  subtitle:
    "Fostering interdisciplinary discoveries through high-precision characterization, collaborative research initiatives, and national scientific grants.",
};

export const RESEARCH_DOMAINS_SECTION_HEADER = {
  title: "Research Thrust Areas",
  subtitle:
    "Explore all active CAIMIF research domains supported by our central analytical instrumentation and AI computing infrastructure:",
};

export const RESEARCH_OUTPUTS_SECTION_HEADER = {
  title: "Our Scholarly Work And Research Highlights",
  description:
    "Explore peer-reviewed journal articles, conference papers, patents, books, and book chapters contributed by CAIMIF researchers.",
};

export const RESEARCH_OUTPUT_TABS: ResearchOutputTabDefinition[] = [
  {
    key: "journals",
    label: "Journal Papers",
    emptyMessage: "No journal papers have been added yet.",
  },
  {
    key: "conferences",
    label: "Conference Papers",
    emptyMessage: "No conference papers have been added yet.",
  },
  {
    key: "patents",
    label: "Patents",
    emptyMessage: "No patents have been added yet.",
  },
  {
    key: "books",
    label: "Book",
    emptyMessage: "No books have been added yet.",
  },
  {
    key: "bookChapters",
    label: "Book Chapters",
    emptyMessage: "No book chapters have been added yet.",
  },
];
