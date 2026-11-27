"use client";

import React, { useState } from "react";
import {
  COLLABORATION_CONTENT_PREVIEW_LIMIT,
  COLLABORATION_TABLE_HEADERS,
} from "./collaborations.config";
import type { CollaborationsTableProps } from "./types";

function formatCollaborationDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTypeBadgeStyle(rawType: string): string {
  const normalized = rawType.trim().toLowerCase();
  if (normalized === "international") {
    return "border-emerald-200/80 bg-emerald-100/80 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/60 dark:text-emerald-300";
  }
  if (normalized === "national") {
    return "border-orange-200/80 bg-orange-100/80 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/60 dark:text-orange-300";
  }
  return "border-blue-200/80 bg-blue-50 text-[#172554] dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300";
}

/**
 * CollaborationsTable Component
 *
 * Displays all `Collaboration` records in a full-width structured table.
 * For `content` exceeding 120 characters, displays a 120-character preview with a
 * "Read more" link that dynamically expands the row height to show full content.
 */
export default function CollaborationsTable({
  items,
  loadFailed = false,
}: CollaborationsTableProps) {
  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>(
    {}
  );

  const toggleExpanded = (id: string) => {
    setExpandedRowIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="mt-6 w-full overflow-hidden rounded-xl border border-zinc-200/90 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#111c4e] text-white dark:bg-[#0f172a]">
              {COLLABORATION_TABLE_HEADERS.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={COLLABORATION_TABLE_HEADERS.length}
                  className="px-6 py-12 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400"
                >
                  {loadFailed
                    ? "Collaborations are temporarily unavailable."
                    : "No collaborations have been registered yet."}
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const fullContent = item.content.trim();
                const exceedsLimit =
                  fullContent.length > COLLABORATION_CONTENT_PREVIEW_LIMIT;
                const isExpanded = Boolean(expandedRowIds[item.id]);
                const displayedContent =
                  exceedsLimit && !isExpanded
                    ? `${fullContent
                        .slice(0, COLLABORATION_CONTENT_PREVIEW_LIMIT)
                        .trimEnd()}...`
                    : fullContent;

                return (
                  <tr
                    key={item.id}
                    className="divide-x divide-zinc-100 transition-colors hover:bg-zinc-50/70 dark:divide-zinc-800 dark:hover:bg-zinc-800/40"
                  >
                    <td className="px-5 py-4 align-middle text-zinc-700 dark:text-zinc-200">
                      {item.firstParty}
                    </td>
                    <td className="px-5 py-4 align-middle text-zinc-700 dark:text-zinc-200">
                      {item.secondParty}
                    </td>
                    <td className="px-5 py-4 align-middle font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                      {formatCollaborationDate(item.date)}
                    </td>
                    <td className="px-5 py-4 align-middle text-zinc-700 dark:text-zinc-200 whitespace-nowrap">
                      {item.leadingPerson}
                    </td>
                    <td className="px-5 py-4 align-middle whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full border px-3 py-0.5 text-xs font-medium ${getTypeBadgeStyle(
                          item.type
                        )}`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-middle text-zinc-700 dark:text-zinc-300 min-w-[260px] max-w-md leading-relaxed">
                      <p className="whitespace-pre-wrap break-words">
                        {displayedContent}
                      </p>
                      {exceedsLimit && (
                        <button
                          type="button"
                          onClick={() => toggleExpanded(item.id)}
                          aria-expanded={isExpanded}
                          className="mt-1 inline-block text-xs font-medium text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                        >
                          {isExpanded ? "Read less" : "Read more"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
