"use client";

import React from "react";
import SearchBar from "@/components/common/SearchBar";
import type { MessageListProps } from "./types";

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * MessageList Component
 *
 * Displays all `ContactInquiry` rows fetched from `contact_inquiries`
 * as searchable, paginated message cards without horizontal scrollbars.
 */
export default function MessageList({
  items,
  pagination,
  search,
  isLoading,
  loadError = null,
  onSearchChange,
  onPageChange,
  onRefresh,
  onDelete,
}: MessageListProps) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
      {/* Header & Search Bar */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Contact Messages
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {pagination.total} total message{pagination.total === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          )}

          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Search name, email, subject, message..."
            ariaLabel="Search contact messages"
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && items.length === 0 ? (
        <div className="p-6 flex flex-col gap-4 animate-pulse">
          <div className="h-28 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-28 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-28 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {loadError
              ? "Unable to load contact messages from the server."
              : search.trim()
                ? `No messages matched "${search.trim()}".`
                : "No contact inquiries received yet."}
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
          <div className="p-5 flex flex-col gap-4">
            {items.map((inquiry) => (
              <article
                key={inquiry.id}
                className="w-full rounded-2xl border border-zinc-200/80 bg-zinc-50/40 p-5 dark:border-zinc-800 dark:bg-zinc-900/60 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-[#172554]/35 dark:hover:border-blue-500/40 transition-colors"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 break-words">
                      {inquiry.subject}
                    </h3>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-mono font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {formatTimestamp(inquiry.createdAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                      From: {inquiry.name}
                    </span>
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-400 break-all"
                    >
                      {inquiry.email}
                    </a>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed break-words whitespace-pre-wrap pt-1 border-t border-zinc-100 dark:border-zinc-800">
                    {inquiry.message}
                  </p>
                </div>

                <div className="flex items-center justify-end shrink-0">
                  <button
                    type="button"
                    onClick={() => onDelete(inquiry)}
                    className="rounded-lg border border-rose-200/60 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/40 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => onPageChange(pagination.page - 1)}
                  className="rounded-lg border border-zinc-200 px-3 py-1 font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => onPageChange(pagination.page + 1)}
                  className="rounded-lg border border-zinc-200 px-3 py-1 font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
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
