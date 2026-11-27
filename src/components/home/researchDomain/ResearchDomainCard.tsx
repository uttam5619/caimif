"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ResearchDomainCardProps } from "./types";

/**
 * ResearchDomainCard Subcomponent
 *
 * Responsibilities:
 * - Displays exclusively a ResearchDomain's cover image, title, and shortDescription.
 * - Uses Framer Motion interactive hover elevation.
 */
export default function ResearchDomainCard({ domain }: ResearchDomainCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative flex w-full max-w-[280px] flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xs hover:shadow-lg hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700 transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden border-b border-zinc-100 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
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
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
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

      {/* Title & Short Description */}
      <div className="p-5 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-[#172554] dark:group-hover:text-blue-300 transition-colors">
          {domain.title}
        </h3>

        {domain.shortDescription && (
          <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {domain.shortDescription}
          </p>
        )}
      </div>
    </motion.div>
  );
}
