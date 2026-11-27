"use client";

import React from "react";
import type { ToolTypeTabsProps } from "./types";

/**
 * ToolTypeTabs Component
 *
 * Renders all `ToolType` categories as centered wrapping pill tabs matching
 * the site's `#172554` active pill aesthetic.
 */
export default function ToolTypeTabs({
  categories,
  activeCategoryId,
  isLoading = false,
  onSelectCategory,
}: ToolTypeTabsProps) {
  if (isLoading && categories.length === 0) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 animate-pulse">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-9 w-40 rounded-full bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div
      role="tablist"
      aria-label="Software tool categories"
      className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 sm:gap-3"
    >
      {categories.map((category) => {
        const isActive = category.id === activeCategoryId;
        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectCategory(category.id)}
            className={`rounded-full px-4 py-2 text-xs sm:text-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#172554] focus-visible:ring-offset-2 ${
              isActive
                ? "bg-[#172554] font-semibold text-white shadow-xs dark:bg-blue-600"
                : "font-medium text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
