"use client";

import React from "react";
import type { ToolPagination } from "./types";

interface ToolPaginationBarProps {
  pagination: ToolPagination;
  onPageChange: (nextPage: number) => void;
}

/**
 * Shared pagination footer reused by `ToolList` and `ToolCategoryList`.
 */
export default function ToolPaginationBar({
  pagination,
  onPageChange,
}: ToolPaginationBarProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
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
  );
}
