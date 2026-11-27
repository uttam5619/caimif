"use client";

import React, { useState } from "react";
import type { BookDto } from "@/server/modules/book/book.types";
import type { BookChapterDto } from "@/server/modules/bookChapter/bookChapter.types";
import type { ConferenceDto } from "@/server/modules/conference/conference.types";
import type { JournalDto } from "@/server/modules/journal/journal.types";
import type { PatentDto } from "@/server/modules/patents/patents.types";
import ResearchOutputDetailModal from "./ResearchOutputDetailModal";
import { RESEARCH_OUTPUT_TABS } from "./research.config";
import {
  formatPatentStatus,
  resolveSafeWeblink,
  truncateChars,
} from "./researchOutputUtils";
import type {
  OutputRow,
  ResearchOutputTabKey,
  ResearchOutputsTabsProps,
  TableColumnConfig,
} from "./types";

const DEFAULT_CELL_MAX_CHARS = 18;

/**
 * Full attribute definitions per tab used inside `ResearchOutputDetailModal`
 * so clicking any table row reveals every attribute of the database record.
 */
const MODAL_COLUMNS: Record<ResearchOutputTabKey, TableColumnConfig[]> = {
  journals: [
    { key: "year", header: "YEAR", variant: "year" },
    { key: "domain", header: "DOMAIN", variant: "domain", maxChars: 18 },
    { key: "title", header: "TITLE", variant: "title", maxChars: 38 },
    { key: "authorFromCaimif", header: "AUTHOR FROM CAIMIF", maxChars: 20 },
    { key: "otherAuthors", header: "OTHER AUTHORS", maxChars: 20 },
    { key: "journalName", header: "JOURNAL NAME", maxChars: 22 },
    { key: "publisher", header: "PUBLISHER", maxChars: 18 },
    { key: "indexing", header: "INDEXING", maxChars: 14 },
    { key: "quartile", header: "QUARTILE", maxChars: 10 },
    { key: "weblink", header: "WEBLINK", variant: "weblink" },
  ],
  conferences: [
    { key: "year", header: "YEAR", variant: "year" },
    { key: "domain", header: "DOMAIN", variant: "domain", maxChars: 16 },
    { key: "title", header: "TITLE", variant: "title", maxChars: 34 },
    { key: "authorFromCaimif", header: "AUTHOR FROM CAIMIF", maxChars: 18 },
    { key: "otherAuthors", header: "OTHER AUTHORS", maxChars: 18 },
    { key: "conferenceName", header: "CONFERENCE NAME", maxChars: 20 },
    { key: "publisher", header: "PUBLISHER", maxChars: 18 },
    { key: "indexing", header: "INDEXING", maxChars: 14 },
    { key: "quartile", header: "QUARTILE", maxChars: 10 },
    { key: "weblink", header: "WEBLINK", variant: "weblink" },
  ],
  patents: [
    { key: "year", header: "YEAR", variant: "year" },
    { key: "domain", header: "DOMAIN", variant: "domain", maxChars: 18 },
    { key: "title", header: "TITLE", variant: "title", maxChars: 38 },
    { key: "status", header: "STATUS", maxChars: 14 },
    { key: "nameOfInventors", header: "NAME OF INVENTORS", maxChars: 22 },
    { key: "patentAgency", header: "PATENT AGENCY", maxChars: 20 },
    { key: "country", header: "COUNTRY", maxChars: 16 },
    { key: "grantNumber", header: "GRANT NUMBER", maxChars: 18 },
  ],
  books: [
    { key: "year", header: "YEAR", variant: "year" },
    { key: "domain", header: "DOMAIN", variant: "domain", maxChars: 16 },
    { key: "title", header: "TITLE", variant: "title", maxChars: 32 },
    { key: "bookAuthor", header: "BOOK AUTHOR", maxChars: 18 },
    { key: "authorFromCaimif", header: "AUTHOR FROM CAIMIF", maxChars: 18 },
    { key: "otherAuthors", header: "OTHER AUTHORS", maxChars: 18 },
    { key: "publisher", header: "PUBLISHER", maxChars: 16 },
    { key: "indexing", header: "INDEXING", maxChars: 14 },
    { key: "quartile", header: "QUARTILE", maxChars: 8 },
    { key: "weblink", header: "WEBLINK", variant: "weblink" },
  ],
  bookChapters: [
    { key: "year", header: "YEAR", variant: "year" },
    { key: "domain", header: "DOMAIN", variant: "domain", maxChars: 16 },
    {
      key: "chapterTitle",
      header: "CHAPTER TITLE",
      variant: "title",
      maxChars: 32,
    },
    { key: "bookName", header: "BOOK NAME", maxChars: 18 },
    { key: "authorFromCaimif", header: "AUTHOR FROM CAIMIF", maxChars: 18 },
    { key: "otherAuthors", header: "OTHER AUTHORS", maxChars: 18 },
    { key: "publisher", header: "PUBLISHER", maxChars: 16 },
    { key: "indexing", header: "INDEXING", maxChars: 14 },
    { key: "quartile", header: "QUARTILE", maxChars: 8 },
    { key: "weblink", header: "WEBLINK", variant: "weblink" },
  ],
};

/**
 * Subset of columns rendered directly inside each category's summary table.
 */
const TABLE_COLUMN_KEYS: Record<ResearchOutputTabKey, string[]> = {
  journals: [
    "year",
    "domain",
    "title",
    "authorFromCaimif",
    "publisher",
    "indexing",
    "weblink",
  ],
  conferences: [
    "year",
    "domain",
    "title",
    "authorFromCaimif",
    "conferenceName",
    "publisher",
    "indexing",
    "weblink",
  ],
  patents: [
    "year",
    "domain",
    "title",
    "status",
    "nameOfInventors",
    "patentAgency",
    "grantNumber",
  ],
  books: [
    "year",
    "domain",
    "title",
    "bookAuthor",
    "authorFromCaimif",
    "publisher",
    "indexing",
    "quartile",
    "weblink",
  ],
  bookChapters: [
    "year",
    "domain",
    "chapterTitle",
    "bookName",
    "authorFromCaimif",
    "publisher",
    "indexing",
    "quartile",
    "weblink",
  ],
};

function getTableColumns(tabKey: ResearchOutputTabKey): TableColumnConfig[] {
  const byKey = new Map(
    MODAL_COLUMNS[tabKey].map((column) => [column.key, column])
  );
  return TABLE_COLUMN_KEYS[tabKey]
    .map((key) => byKey.get(key))
    .filter((column): column is TableColumnConfig => Boolean(column));
}

function mapRowsForTab(
  tabKey: ResearchOutputTabKey,
  outputs: ResearchOutputsTabsProps["outputs"]
): OutputRow[] {
  switch (tabKey) {
    case "journals":
      return outputs.journals.map((item: JournalDto) => ({
        id: item.id,
        year: item.year,
        domain: item.domain,
        title: item.title,
        authorFromCaimif: item.authorFromCaimif,
        otherAuthors: item.otherAuthors,
        journalName: item.journalName,
        publisher: item.publisher,
        indexing: item.indexing,
        quartile: item.quartile,
        weblink: item.weblink,
      }));
    case "conferences":
      return outputs.conferences.map((item: ConferenceDto) => ({
        id: item.id,
        year: item.year,
        domain: item.domain,
        title: item.title,
        authorFromCaimif: item.authorFromCaimif,
        otherAuthors: item.otherAuthors,
        conferenceName: item.conferenceName,
        publisher: item.publisher,
        indexing: item.indexing,
        quartile: item.quartile,
        weblink: item.weblink,
      }));
    case "patents":
      return outputs.patents.map((item: PatentDto) => ({
        id: item.id,
        year: item.year,
        domain: item.domain,
        title: item.title,
        status: formatPatentStatus(item.status),
        nameOfInventors: item.nameOfInventors,
        patentAgency: item.patentAgency,
        country: item.country,
        grantNumber: item.grantNumber,
      }));
    case "books":
      return outputs.books.map((item: BookDto) => ({
        id: item.id,
        year: item.year,
        domain: item.domain,
        title: item.title,
        bookAuthor: item.bookAuthor,
        authorFromCaimif: item.authorFromCaimif,
        otherAuthors: item.otherAuthors,
        publisher: item.publisher,
        indexing: item.indexing,
        quartile: item.quartile,
        weblink: item.weblink,
      }));
    case "bookChapters":
      return outputs.bookChapters.map((item: BookChapterDto) => ({
        id: item.id,
        year: item.year,
        domain: item.domain,
        chapterTitle: item.chapterTitle,
        bookName: item.bookName,
        authorFromCaimif: item.authorFromCaimif,
        otherAuthors: item.otherAuthors,
        publisher: item.publisher,
        indexing: item.indexing,
        quartile: item.quartile,
        weblink: item.weblink,
      }));
  }
}

/**
 * Renders an individual table cell capped to its configured character count.
 * For `weblink` columns, renders `"Link"` and prevents click propagation so
 * clicking the link redirects externally without opening the detail modal.
 */
function renderTableCell(
  column: TableColumnConfig,
  row: OutputRow,
  rowIndex: number
): React.ReactNode {
  if (column.variant === "serial") {
    return (
      <span className="text-zinc-500 dark:text-zinc-400 font-medium">
        {rowIndex + 1}
      </span>
    );
  }

  const rawValue = row[column.key];

  if (column.variant === "weblink") {
    const href = resolveSafeWeblink(rawValue);
    if (!href) {
      return <span className="text-zinc-400 dark:text-zinc-600">—</span>;
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
        className="font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
      >
        Link
      </a>
    );
  }

  const fullValue =
    rawValue !== null && rawValue !== undefined && String(rawValue).trim() !== ""
      ? String(rawValue).trim()
      : null;

  if (!fullValue) {
    return <span className="text-zinc-400 dark:text-zinc-600">—</span>;
  }

  if (column.variant === "year") {
    return (
      <span className="font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
        {fullValue}
      </span>
    );
  }

  const compactValue = truncateChars(
    fullValue,
    column.maxChars ?? DEFAULT_CELL_MAX_CHARS
  );

  if (column.variant === "domain") {
    return (
      <span
        title={fullValue}
        className="inline-block whitespace-nowrap rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      >
        {compactValue}
      </span>
    );
  }

  if (column.variant === "title") {
    return (
      <span
        title={fullValue}
        className="block whitespace-nowrap font-medium text-[#1d4ed8] dark:text-blue-400"
      >
        {compactValue}
      </span>
    );
  }

  return (
    <span
      title={fullValue}
      className="block whitespace-nowrap text-zinc-700 dark:text-zinc-300"
    >
      {compactValue}
    </span>
  );
}

/**
 * ResearchOutputsTabs Component
 *
 * Displays centered pill navigation tabs (`Journal Papers`, `Conference Papers`,
 * `Patents`, `Book`, `Book Chapters`) above a compact data table. Clicking any
 * row opens `ResearchOutputDetailModal` showing every attribute in full.
 */
export default function ResearchOutputsTabs({
  outputs,
}: ResearchOutputsTabsProps) {
  const [activeTab, setActiveTab] = useState<ResearchOutputTabKey>("journals");
  const [selectedRow, setSelectedRow] = useState<OutputRow | null>(null);

  const activeDefinition =
    RESEARCH_OUTPUT_TABS.find((tab) => tab.key === activeTab) ??
    RESEARCH_OUTPUT_TABS[0];

  const tableColumns = getTableColumns(activeTab);
  const modalColumns = MODAL_COLUMNS[activeTab];
  const rows = mapRowsForTab(activeTab, outputs);

  const handleTabChange = (tabKey: ResearchOutputTabKey) => {
    setActiveTab(tabKey);
    setSelectedRow(null);
  };

  return (
    <div className="mt-8 w-full">
      {/* Centered Pill Tab Selector */}
      <div
        role="tablist"
        aria-label="Research output categories"
        className="flex flex-wrap items-center justify-center gap-3"
      >
        {RESEARCH_OUTPUT_TABS.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`research-tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls={`research-tabpanel-${tab.key}`}
              onClick={() => handleTabChange(tab.key)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#172554] text-white shadow-sm dark:bg-blue-600"
                  : "border border-zinc-200/90 bg-white text-zinc-700 shadow-xs hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Data Table Panel */}
      <div
        role="tabpanel"
        id={`research-tabpanel-${activeTab}`}
        aria-labelledby={`research-tab-${activeTab}`}
        className="mt-6 w-full overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[#172554] text-white dark:bg-[#0f172a]">
              {tableColumns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide leading-tight"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={tableColumns.length}
                  className="px-6 py-12 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400"
                >
                  {outputs.loadFailed
                    ? "Research outputs are temporarily unavailable."
                    : activeDefinition.emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={`${activeTab}-${String(row.id ?? rowIndex)}`}
                  tabIndex={0}
                  onClick={() => setSelectedRow(row)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedRow(row);
                    }
                  }}
                  className="cursor-pointer transition-colors hover:bg-blue-50/40 focus:bg-blue-50/60 focus:outline-none dark:hover:bg-zinc-800/60 dark:focus:bg-zinc-800"
                >
                  {tableColumns.map((column) => (
                    <td
                      key={`${activeTab}-${String(row.id ?? rowIndex)}-${column.key}`}
                      className="px-4 py-3.5 align-middle"
                    >
                      {renderTableCell(column, row, rowIndex)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Record Details Modal */}
      <ResearchOutputDetailModal
        categoryLabel={activeDefinition.label}
        columns={modalColumns}
        row={selectedRow}
        onClose={() => setSelectedRow(null)}
      />
    </div>
  );
}
