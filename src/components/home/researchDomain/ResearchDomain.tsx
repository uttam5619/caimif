import React, { Suspense } from "react";
import Link from "next/link";
import ResearchDomainCard from "./ResearchDomainCard";
import { RESEARCH_DOMAIN_HEADER } from "./researchDomain.config";
import { getHomeResearchDomains } from "./researchDomain.data";
import type { ResearchDomainProps } from "./types";

/**
 * Loading skeleton rendered while dynamic database-backed domains stream in.
 */
function ResearchDomainGridSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-6 animate-pulse">
      <div className="h-72 w-full max-w-[280px] rounded-3xl bg-zinc-200/70 dark:bg-zinc-800/70" />
      <div className="h-72 w-full max-w-[280px] rounded-3xl bg-zinc-200/70 dark:bg-zinc-800/70" />
      <div className="h-72 w-full max-w-[280px] rounded-3xl bg-zinc-200/70 dark:bg-zinc-800/70" />
    </div>
  );
}

/**
 * Async server subcomponent consuming `getHomeResearchDomains` from `researchDomain.data.ts`.
 */
async function ResearchDomainCards() {
  const { items, loadFailed } = await getHomeResearchDomains();

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {loadFailed
            ? "Research domains are temporarily unavailable."
            : "No research domains have been published yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {items.map((domain) => (
        <ResearchDomainCard key={domain.id} domain={domain} />
      ))}
    </div>
  );
}

/**
 * ResearchDomain Component (Server Component)
 *
 * Responsibilities:
 * - Renders the Research Thrust Areas section on the Home page.
 * - Delegates database fetching and the 6-card limit to `researchDomain.data.ts`.
 * - Displays a "View More" button linking to `/research` directly above the cards.
 */
export default function ResearchDomain({
  id = "research-domains",
}: ResearchDomainProps) {
  return (
    <section
      id={id}
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200/80 dark:border-zinc-800"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-[#172554] dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            {RESEARCH_DOMAIN_HEADER.badge}
          </div>

          <h2 className="mt-4 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl lg:text-3xl leading-tight">
            {RESEARCH_DOMAIN_HEADER.title}
          </h2>

          <p className="mt-4 text-base sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {RESEARCH_DOMAIN_HEADER.subtitle}
          </p>
        </div>

        {/* View More Button Above Cards */}
        <div className="mt-10 mb-6 flex justify-center sm:justify-end">
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#172554] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1e3a8a] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554]"
          >
            <span>View More</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Database-Backed Research Domain Cards (via researchDomain.data.ts) */}
        <Suspense fallback={<ResearchDomainGridSkeleton />}>
          <ResearchDomainCards />
        </Suspense>

      </div>
    </section>
  );
}
