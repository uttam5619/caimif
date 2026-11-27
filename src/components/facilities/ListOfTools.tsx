"use client";

import React from "react";
import type { ListOfToolsProps } from "./types";

/**
 * ListOfTools Component
 *
 * Displays a responsive multi-column grid of tool cards for the selected
 * `ToolType` tab, matching the clean icon, centered title, and `VERSION : ...`
 * layout while staying aligned with the site's rounded elevated card theme.
 */
export default function ListOfTools({
  tools,
  isLoading,
  activeCategoryName,
  onSelectTool,
}: ListOfToolsProps) {
  if (isLoading) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 animate-pulse">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-2xl border border-zinc-200/90 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="h-36 w-full rounded-xl bg-zinc-200/70 dark:bg-zinc-800" />
            <div className="mt-4 h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-2 h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800/70" />
          </div>
        ))}
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white/80 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/60">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {activeCategoryName
            ? `No tools listed under "${activeCategoryName}" yet.`
            : "No software tools available yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {tools.map((tool) => (
        <button
          key={tool.id}
          type="button"
          onClick={() => onSelectTool?.(tool)}
          className="group flex h-full flex-col items-center rounded-2xl border border-zinc-200/90 bg-white p-4 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#172554]"
        >
          {/* Tool Visual Frame */}
          <div className="flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-white p-2 dark:bg-zinc-950">
            {tool.imageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={tool.imageUrl}
                alt={tool.title}
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-blue-50 text-base font-bold text-[#172554] dark:bg-blue-950/60 dark:text-blue-300">
                {tool.title.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Tool Name & Version */}
          <h3 className="mt-4 text-sm font-bold leading-snug text-zinc-900 transition-colors group-hover:text-[#172554] dark:text-zinc-100 dark:group-hover:text-blue-300 break-words">
            {tool.title}
          </h3>

          <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            VERSION : {tool.version}
          </p>
        </button>
      ))}
    </div>
  );
}
