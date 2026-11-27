import type { BookDto } from "@/server/modules/book/book.types";
import type { BookChapterDto } from "@/server/modules/bookChapter/bookChapter.types";
import type { ConferenceDto } from "@/server/modules/conference/conference.types";
import type { JournalDto } from "@/server/modules/journal/journal.types";
import type { PatentDto } from "@/server/modules/patents/patents.types";

/**
 * Data contracts for the Research page component ecosystem.
 */

export interface ResearchDomainPageCustomField {
  label: string;
  value: string;
  isUrl?: boolean;
}

export interface ResearchDomainPageItem {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  imageUrl?: string;
  customFields: ResearchDomainPageCustomField[];
}

export interface ResearchDomainCardProps {
  domain: ResearchDomainPageItem;
  onSelect?: (domain: ResearchDomainPageItem) => void;
}

export type ResearchOutputTabKey =
  | "journals"
  | "conferences"
  | "books"
  | "bookChapters"
  | "patents";

export interface ResearchOutputTabDefinition {
  key: ResearchOutputTabKey;
  label: string;
  emptyMessage: string;
}

export interface ResearchOutputsPayload {
  journals: JournalDto[];
  conferences: ConferenceDto[];
  books: BookDto[];
  bookChapters: BookChapterDto[];
  patents: PatentDto[];
  loadFailed: boolean;
}

export interface ResearchOutputsTabsProps {
  outputs: ResearchOutputsPayload;
}

export type OutputRow = Record<string, string | number | null | undefined>;

export interface TableColumnConfig {
  key: string;
  header: string;
  variant?: "serial" | "year" | "domain" | "title" | "weblink" | "text";
  maxChars?: number;
}

export interface DetailModalField {
  key: string;
  label: string;
  value: string | number | null | undefined;
  isWeblink?: boolean;
}

export interface RecordDetailModalProps {
  isOpen: boolean;
  badgeLabel: string;
  title: string;
  fields: DetailModalField[];
  onClose: () => void;
}

export interface ResearchOutputDetailModalProps {
  categoryLabel: string;
  columns: TableColumnConfig[];
  row: OutputRow | null;
  onClose: () => void;
}
