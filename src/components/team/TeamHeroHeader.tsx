import React from "react";
import { TEAM_PAGE_HEADER } from "./team.config";

/**
 * TeamHeroHeader Component
 *
 * Renders the top banner badge, heading, and description on `/team`.
 */
export default function TeamHeroHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <span className="inline-block rounded-full bg-blue-100 px-3.5 py-1 text-xs font-semibold text-[#172554] dark:bg-blue-950 dark:text-blue-300">
        {TEAM_PAGE_HEADER.badge}
      </span>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
        {TEAM_PAGE_HEADER.title}
      </h1>
      <p className="mt-4 text-base sm:text-sm text-zinc-600 dark:text-zinc-300">
        {TEAM_PAGE_HEADER.subtitle}
      </p>
    </div>
  );
}
