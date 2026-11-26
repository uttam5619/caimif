"use client";

import React from "react";
import type { SearchBarProps } from "./types";

/**
 * SearchBar Component
 *
 * Self-contained reusable search input atom with native clear button support.
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  ariaLabel = "Search",
}: SearchBarProps) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className="w-full sm:w-80 rounded-xl border border-zinc-200 bg-zinc-50/70 px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-[#172554] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#172554] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
    />
  );
}
