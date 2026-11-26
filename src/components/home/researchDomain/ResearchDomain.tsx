"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ResearchDomainCard from "./ResearchDomainCard";
import {
  RESEARCH_DOMAIN_HEADER,
  RESEARCH_DOMAINS,
} from "./researchDomain.config";
import { ResearchDomainProps } from "./types";

/**
 * ResearchDomain Component
 *
 * Responsibilities:
 * - High-level orchestrator displaying CAIMIF's core research thrust areas.
 * - Viewport-triggered scroll entrance powered by Framer Motion.
 * - 3-column responsive grid rendering modular ResearchDomainCard components.
 * - Consistent styling adhering to UI policy (#172554 brand color, Open Sans typography).
 */
export default function ResearchDomain({
  className = "",
  id = "research-domains",
}: ResearchDomainProps) {
  return (
    <section
      id={id}
      className={`relative w-full py-16 sm:py-20 lg:py-24 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200/80 dark:border-zinc-800 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-[#172554] dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            {RESEARCH_DOMAIN_HEADER.badge}
          </div>

          {/* Section Main Title */}
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl leading-tight">
            {RESEARCH_DOMAIN_HEADER.title}
          </h2>

          {/* Subtitle / Overview */}
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {RESEARCH_DOMAIN_HEADER.subtitle}
          </p>
        </motion.div>

        {/* 6 Research Domains Grid */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {RESEARCH_DOMAINS.map((domain) => (
            <ResearchDomainCard key={domain.id} domain={domain} />
          ))}
        </div>

        {/* Section Footer / Action Navigation */}
        <div className="mt-14 pt-8 border-t border-zinc-200/70 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Have a multidisciplinary proposal or project?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Access CAIMIF instrumentation and computational clusters with subsidized academic tariffs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/research"
              className="rounded-xl bg-[#172554] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1e3a8a] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554]"
            >
              View Research Thrusts
            </Link>
            <Link
              href="/facilities"
              className="rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
            >
              Explore Equipment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
