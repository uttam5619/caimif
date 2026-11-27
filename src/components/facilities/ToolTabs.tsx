"use client";

import React from "react";
import type { ToolTabsProps } from "./types";

/**
 * ToolTabs Component
 *
 * Renders all `ToolType` categories fetched from `/api/tool-types` as
 * accessible pill tabs so visitors can switch between tool categories.
 */
export default function ToolTabs({
  toolTypes,
  activeToolTypeId,
  onSelectToolType,
}: ToolTabsProps) {
  if (toolTypes.length === 0) {
    return null;
  }

  return (
    <div
      role="tablist"
      aria-label="Filter tools by category"
      className="mt-8 flex flex-wrap items-center justify-center gap-3"
    >
      {toolTypes.map((toolType) => {
        const isActive = toolType.id === activeToolTypeId;

        return (
          <button
            key={toolType.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectToolType(toolType.id)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#172554] focus-visible:ring-offset-2 ${
              isActive
                ? "bg-[#172554] text-white shadow-sm dark:bg-blue-600"
                : "border border-zinc-200/90 bg-white text-zinc-700 shadow-xs hover:border-[#172554]/40 hover:text-[#172554] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            <span>{toolType.name}</span>
          </button>
        );
      })}
    </div>
  );
}
