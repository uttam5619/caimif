"use client";

import React from "react";
import SearchBar from "@/components/common/SearchBar";
import type { ConferencePaperListProps } from "./types";

/**
 * ConferencePaperList Component
 *
 * Displays a searchable, paginated table of CAIMIF Conference Paper publications
 * fetched from `/api/conferences`, with Edit and Delete action controls per record.
 */
export default function ConferencePaperList({
  conferences,
  pagination,
  search,
  isLoading,
  loadError = null,
  onSearchChange,
  onPageChange,
  onEdit,
  onDelete,
}: ConferencePaperListProps) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden shadow-xs">
      {/* Table Header & Attribute Search Bar */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Published Conference Papers
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {pagination.total} total publication{pagination.total === 1 ? "" : "s"}
          </p>
        </div>

        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search year, domain, title, author, conference, indexing..."
          ariaLabel="Search conference papers"
        />
      </div>

      {/* Loading Skeleton */}
      {isLoading && conferences.length === 0 ? (
        <div className="p-6 space-y-3 animate-pulse">
          <div className="h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ) : conferences.length === 0 ? (
        /* Empty / Error State */
        <div className="p-12 text-center space-y-2">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {loadError
              ? "Unable to load conference papers from the server."
              : search.trim()
                ? `No conference papers matched "${search.trim()}".`
                : "No conference papers registered yet."}
          </p>
          {search.trim() && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="rounded-xl border border-zinc-200 px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                <tr>
                  <th className="px-5 py-3.5 w-20">Year</th>
                  <th className="px-5 py-3.5 w-44">Domain</th>
                  <th className="px-5 py-3.5">Title &amp; Authors</th>
                  <th className="px-5 py-3.5 w-52">Conference &amp; Publisher</th>
                  <th className="px-5 py-3.5 w-36">Indexing / Quartile</th>
                  <th className="px-5 py-3.5 w-24">Link</th>
                  <th className="px-5 py-3.5 text-right w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {conferences.map((paper) => (
                  <tr
                    key={paper.id}
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    {/* Year */}
                    <td className="px-5 py-4 align-top">
                      <span className="font-mono text-xs font-bold text-[#172554] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-1 rounded-md">
                        {paper.year}
                      </span>
                    </td>

                    {/* Domain */}
                    <td className="px-5 py-4 align-top">
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">
                        {paper.domain}
                      </span>
                    </td>

                    {/* Title & Authors */}
                    <td className="px-5 py-4 align-top space-y-1.5">
                      <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 block leading-snug">
                        {paper.title}
                      </span>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                        <span className="font-semibold">CAIMIF:</span>{" "}
                        {paper.authorFromCaimif}
                      </p>
                      {paper.otherAuthors && (
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          <span className="font-semibold">Co-authors:</span>{" "}
                          {paper.otherAuthors}
                        </p>
                      )}
                    </td>

                    {/* Conference Name & Publisher */}
                    <td className="px-5 py-4 align-top space-y-1">
                      <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 block">
                        {paper.conferenceName}
                      </span>
                      {paper.publisher && (
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                          {paper.publisher}
                        </span>
                      )}
                    </td>

                    {/* Indexing & Quartile */}
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-wrap gap-1.5">
                        {paper.indexing && (
                          <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
                            {paper.indexing}
                          </span>
                        )}
                        {paper.quartile && (
                          <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-900/50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                            {paper.quartile}
                          </span>
                        )}
                        {!paper.indexing && !paper.quartile && (
                          <span className="text-[11px] text-zinc-400">—</span>
                        )}
                      </div>
                    </td>

                    {/* Web Link */}
                    <td className="px-5 py-4 align-top">
                      {paper.weblink ? (
                        <a
                          href={paper.weblink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg border border-blue-200/60 bg-blue-50/60 dark:border-blue-900/50 dark:bg-blue-950/40 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          View ↗
                        </a>
                      ) : (
                        <span className="text-[11px] text-zinc-400">—</span>
                      )}
                    </td>

                    {/* Actions: Edit and Delete buttons */}
                    <td className="px-5 py-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(paper)}
                          className="rounded-lg border border-blue-200/60 bg-blue-50/60 dark:border-blue-900/50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(paper)}
                          className="rounded-lg border border-red-200 bg-red-50/60 dark:border-red-900/50 dark:bg-red-950/40 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1 || isLoading}
                  onClick={() => onPageChange(pagination.page - 1)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                  onClick={() => onPageChange(pagination.page + 1)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
