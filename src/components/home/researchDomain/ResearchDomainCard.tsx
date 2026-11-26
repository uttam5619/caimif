"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ResearchDomainCardProps } from "./types";

/**
 * Semantic SVG icon renderer for research domains.
 */
function DomainIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "medicine":
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      );
    case "imaging":
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      );
    case "forensics":
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      );
    case "nanomaterials":
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      );
    case "energy":
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    default:
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      );
  }
}

/**
 * ResearchDomainCard Subcomponent
 *
 * Responsibilities:
 * - Displays a dedicated research thrust domain card with icon, title, description, and primary tools.
 * - Framer Motion interactive hover elevation.
 * - Deep link connecting users directly to research documentation or facilities.
 */
export default function ResearchDomainCard({
  domain,
  className = "",
}: ResearchDomainCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`group relative flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700 transition-all duration-300 ${className}`}
    >
      <div>
        {/* Top Header: Icon & Category Badge */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center justify-center rounded-2xl bg-[#172554]/10 dark:bg-blue-400/10 p-3 text-[#172554] dark:text-blue-300 group-hover:bg-[#172554] group-hover:text-white transition-colors duration-300 shadow-xs">
            <DomainIcon icon={domain.icon} />
          </div>
          <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800">
            {domain.badge}
          </span>
        </div>

        {/* Domain Title */}
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-[#172554] dark:group-hover:text-blue-300 transition-colors">
          {domain.title}
        </h3>

        {/* Descriptive Summary */}
        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {domain.description}
        </p>

        {/* Primary Analytical Tools / Technology Tags */}
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Primary Tools &amp; Methods:
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {domain.tools.map((tool, idx) => (
              <span
                key={idx}
                className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:text-zinc-300"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Navigation Link */}
      <div className="mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <Link
          href={domain.href}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#172554] dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors"
        >
          <span>Explore domain capabilities</span>
          <svg
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
