"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { FeaturedResearchCardProps } from "./types";

const MAX_TITLE_CHARS = 40;
const MAX_DESCRIPTION_CHARS = 100;

/**
 * Truncates text so the rendered string (including trailing ellipsis)
 * never exceeds `maxLength` characters.
 */
function truncateWithEllipsis(value: string, maxLength: number): string {
  const normalized = value.trim();
  if (normalized.length <= maxLength) return normalized;
  const sliceLimit = Math.max(0, maxLength - 3);
  return `${normalized.slice(0, sliceLimit).trimEnd()}...`;
}

/**
 * Loading skeleton matching the exact anatomy of `FeaturedResearchCard`.
 */
export function FeaturedResearchCardSkeleton() {
  return (
    <div className="flex w-full max-w-[270px] min-h-[440px] flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 animate-pulse">
      <div>
        <div className="bg-zinc-100 dark:bg-zinc-800/80 p-2">
          <div className="h-56 w-full rounded-xl bg-zinc-200/80 dark:bg-zinc-700/70" />
        </div>
        <div className="px-4 pt-3 pb-2 space-y-2.5">
          <div className="h-6 w-28 rounded-md bg-blue-50 dark:bg-blue-950/50" />
          <div className="space-y-2">
            <div className="h-5 w-4/5 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-5 w-3/5 rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="h-3.5 w-full rounded bg-zinc-100 dark:bg-zinc-800/70" />
            <div className="h-3.5 w-11/12 rounded bg-zinc-100 dark:bg-zinc-800/70" />
            <div className="h-3.5 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800/70" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-1">
        <div className="h-9 w-full rounded-xl bg-zinc-100 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

/**
 * FeaturedResearchCard Subcomponent
 *
 * Responsibilities:
 * - Mirrors the visual card layout: framed top image, author badge, truncated title (<= 40 chars),
 *   truncated description (<= 100 chars), and full-width "Explore Publication" button.
 * - Clicking "Explore Publication" opens a clean detail modal showing the full publication content.
 */
export default function FeaturedResearchCard({
  research,
}: FeaturedResearchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  const displayTitle = truncateWithEllipsis(research.title, MAX_TITLE_CHARS);
  const displayDescription = truncateWithEllipsis(
    research.description,
    MAX_DESCRIPTION_CHARS
  );

  return (
    <>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group flex w-full max-w-[290px] min-h-[440px] flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm hover:shadow-lg hover:border-blue-300/80 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700 transition-all duration-300"
      >
        <div>
          {/* Framed Research Image */}
          <div className="bg-slate-200/65 dark:bg-zinc-800/80 p-2">
            <div className="relative h-56 w-full overflow-hidden rounded-xl bg-white/80 dark:bg-zinc-900">
              {research.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={research.imageUrl}
                  alt={research.title}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#172554]/5 text-[#172554]/50 dark:bg-blue-950/30 dark:text-blue-300/60">
                  <svg
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Author Pill, Title (max 40 chars) & Description (max 100 chars) */}
          <div className="px-4 pt-3 pb-2">
            {research.authorName && (
              <span className="inline-flex items-center rounded-md bg-blue-50/90 px-2.5 py-0.5 text-xs font-medium text-[#172554] dark:bg-blue-950/60 dark:text-blue-200">
                {research.authorName}
              </span>
            )}

            <h3 className="mt-2.5 text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-snug break-words">
              {displayTitle}
            </h3>

            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 break-words">
              {displayDescription}
            </p>
          </div>
        </div>

        {/* Explore Publication Action Button */}
        <div className="px-4 pb-4 pt-1">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex w-full items-center justify-between rounded-xl border border-zinc-200/90 bg-zinc-50/70 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#172554] hover:bg-blue-50/60 hover:border-blue-200 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-blue-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554]"
          >
            <span>Explore Publication</span>
            <svg
              className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 3h6m0 0v6m0-6l-7 7M9 21H3m0 0v-6m0 6l7-7"
              />
            </svg>
          </button>
        </div>
      </motion.article>

      {/* Publication Detail Modal */}
      {isExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`featured-research-modal-${research.id}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div className="space-y-1.5">
                {research.authorName && (
                  <span className="inline-flex items-center rounded-md bg-blue-50/90 px-3 py-1 text-xs font-medium text-[#172554] dark:bg-blue-950/60 dark:text-blue-200">
                    {research.authorName}
                  </span>
                )}
                <h4
                  id={`featured-research-modal-${research.id}`}
                  className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug"
                >
                  {research.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                aria-label="Close publication details"
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-lg font-bold p-1 rounded-lg transition-colors cursor-pointer leading-none"
              >
                ✕
              </button>
            </div>

            {research.imageUrl && (
              <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-slate-100 p-3 dark:border-zinc-800 dark:bg-zinc-800/70">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={research.imageUrl}
                  alt={research.title}
                  className="max-h-96 w-full object-contain rounded-xl"
                />
              </div>
            )}

            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
              {research.description}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
