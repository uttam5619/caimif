"use client";

import React from "react";
import SearchBar from "@/components/common/SearchBar";
import ToolPaginationBar from "./ToolPaginationBar";
import type { ToolCategoryListProps } from "./types";

/**
 * ToolCategoryList Component
 *
 * Displays a searchable, paginated list of `ToolType` categories fetched from
 * `/api/tool-types`, with assigned tool counts, Edit, and Delete controls.
 */
export default function ToolCategoryList({
  categories,
  pagination,
  search,
  isLoading,
  loadError = null,
  onSearchChange,
  onPageChange,
  onEdit,
  onDelete,
}: ToolCategoryListProps) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
      {/* Header & Search Bar */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Tool Categories
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {pagination.total} total categor{pagination.total === 1 ? "y" : "ies"}
          </p>
        </div>

        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search category name..."
          ariaLabel="Search tool categories"
        />
      </div>

      {/* Loading Skeleton */}
      {isLoading && categories.length === 0 ? (
        <div className="p-6 flex flex-col gap-3 animate-pulse">
          <div className="h-20 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-20 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-20 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {loadError
              ? "Unable to load tool categories from the server."
              : search.trim()
                ? `No tool categories matched "${search.trim()}".`
                : "No tool categories created yet."}
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
          <div className="p-5 flex flex-col gap-3">
            {categories.map((category) => (
              <article
                key={category.id}
                className="w-full rounded-2xl border border-zinc-200/80 bg-zinc-50/40 p-5 dark:border-zinc-800 dark:bg-zinc-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#172554]/35 dark:hover:border-blue-500/40 transition-colors"
              >
                <div className="min-w-0 flex items-center gap-3 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#172554] dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold">
                    {category.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 break-words">
                      {category.name}
                    </h3>
                    <span className="inline-flex rounded-full border border-blue-200/80 bg-blue-50/70 px-2.5 py-0.5 text-[10px] font-semibold text-[#172554] dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
                      {category.toolCount}{" "}
                      {category.toolCount === 1 ? "tool" : "tools"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    className="rounded-lg border border-blue-200/60 bg-blue-50/60 dark:border-blue-900/50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(category)}
                    className="rounded-lg border border-rose-200/60 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/40 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          <ToolPaginationBar
            pagination={pagination}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}
