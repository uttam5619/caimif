"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ResearchDomainCardProps } from "./types";

/**
 * Loading skeleton matching an individual `ResearchDomainCard`.
 */
export function ResearchDomainCardSkeleton() {
  return (
    <div className="flex min-h-[300px] w-full max-w-[380px] flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 animate-pulse">
      <div className="h-40 w-full bg-zinc-200/80 dark:bg-zinc-800" />
      <div className="p-5 space-y-2.5">
        <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3.5 w-full rounded bg-zinc-100 dark:bg-zinc-800/70" />
        <div className="h-3.5 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800/70" />
      </div>
    </div>
  );
}

/**
 * ResearchDomainCard Component
 *
 * Displays an individual `ResearchDomain` record queried from the database:
 * - Cover image (or institutional fallback icon when absent)
 * - Title
 * - Short description
 * - Full description
 * - Any populated dynamic custom fields
 */
export default function ResearchDomainCard({
  domain,
  onSelect,
}: ResearchDomainCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if ((event.key === "Enter" || event.key === " ") && onSelect) {
      event.preventDefault();
      onSelect(domain);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect ? () => onSelect(domain) : undefined}
      onKeyDown={onSelect ? handleKeyDown : undefined}
      className={`group flex min-h-[300px] w-full max-w-[250px] flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700 ${
        onSelect ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-400" : ""
      }`}
    >
      <div>
        {/* Cover Image */}
        <div className="relative h-40 w-full overflow-hidden border-b border-zinc-100 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
          {domain.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={domain.imageUrl}
              alt={domain.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#172554]/5 text-[#172554]/50 dark:bg-blue-950/30 dark:text-blue-300/60">
              <svg
                className="h-9 w-9"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Title, Short Description & Description */}
        <div className="p-5 space-y-2">
          <h3 className="text-base font-bold leading-snug line-clamp-2 text-zinc-900 dark:text-zinc-100 group-hover:text-[#172554] dark:group-hover:text-blue-300 transition-colors">
            {domain.title}
          </h3>

          {domain.shortDescription && (
            <p className="text-xs font-medium text-[#172554]/85 dark:text-blue-300/90 leading-snug line-clamp-2">
              {domain.shortDescription}
            </p>
          )}

          {domain.description && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-4">
              {domain.description}
            </p>
          )}
        </div>
      </div>

      {/* Dynamic Custom Fields */}
      {domain.customFields.length > 0 && (
        <div className="px-5 pb-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-1.5">
          {domain.customFields.map((field) => (
            <span
              key={`${domain.id}-${field.label}`}
              className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-[#172554] dark:bg-blue-950/60 dark:text-blue-300"
            >
              <span className="font-semibold">{field.label}:</span> {field.value}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  );
}
