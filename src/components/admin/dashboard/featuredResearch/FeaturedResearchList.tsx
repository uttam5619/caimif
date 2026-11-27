"use client";

import React from "react";
import SearchBar from "@/components/common/SearchBar";
import type { FeaturedResearchListProps } from "./types";

/**
 * FeaturedResearchList Component
 *
 * Displays a searchable, paginated full-width card list of CAIMIF Featured Research
 * records fetched from `/api/featured-research`, with Edit and Delete controls.
 */
export default function FeaturedResearchList({
  items,
  pagination,
  search,
  isLoading,
  loadError = null,
  onSearchChange,
  onPageChange,
  onEdit,
  onDelete,
}: FeaturedResearchListProps) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
      {/* Header & Search Bar */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Featured Research Entries
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {pagination.total} total record{pagination.total === 1 ? "" : "s"}
          </p>
        </div>

        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search title, author name, description..."
          ariaLabel="Search featured research"
        />
      </div>

      {/* Loading Skeleton */}
      {isLoading && items.length === 0 ? (
        <div className="p-6 flex flex-col gap-4 animate-pulse">
          <div className="h-32 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-32 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-32 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ) : items.length === 0 ? (
        /* Empty / Error State */
        <div className="p-12 text-center space-y-2">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {loadError
              ? "Unable to load featured research from the server."
              : search.trim()
                ? `No featured research matched "${search.trim()}".`
                : "No featured research added yet."}
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
          {/* Full-Width Stacked Cards (no horizontal scrollbars) */}
          <div className="p-5 flex flex-col gap-4">
            {items.map((record) => (
              <article
                key={record.id}
                className="w-full rounded-2xl border border-zinc-200/80 bg-zinc-50/40 p-5 dark:border-zinc-800 dark:bg-zinc-900/60 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-[#172554]/35 dark:hover:border-blue-500/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 min-w-0 flex-1">
                  {record.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={record.imageUrl}
                      alt={record.title}
                      className="h-24 w-full sm:w-36 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                    />
                  ) : (
                    <div className="flex h-24 w-full sm:w-36 items-center justify-center rounded-xl bg-blue-50 text-[#172554] dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold shrink-0">
                      {record.title.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 space-y-1.5 flex-1">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 break-words">
                      {record.title}
                    </h3>
                    <p className="text-xs font-medium text-[#172554] dark:text-blue-300 break-words">
                      Author: {record.authorName}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed break-words">
                      {record.description.length > 220
                        ? `${record.description.slice(0, 220)}...`
                        : record.description}
                    </p>
                  </div>
                </div>

                {/* Actions: Edit and Delete */}
                <div className="flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEdit(record)}
                    className="rounded-lg border border-blue-200/60 bg-blue-50/60 dark:border-blue-900/50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(record)}
                    className="rounded-lg border border-red-200 bg-red-50/60 dark:border-red-900/50 dark:bg-red-950/40 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
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
