import React, { Suspense } from "react";
import { FeaturedResearchCardSkeleton } from "./FeaturedResearchCard";
import FeaturedResearchCarousel from "./FeaturedResearchCarousel";
import { FEATURED_RESEARCH_HEADER } from "./featuredResearch.config";
import { getHomeFeaturedResearch } from "./featuredResearch.data";
import type { FeaturedResearchProps } from "./types";

/**
 * Loading skeleton matching the 4-card FeaturedResearch carousel.
 */
function FeaturedResearchGridSkeleton() {
  return (
    <div className="mt-12 flex flex-wrap xl:flex-nowrap justify-center gap-4">
      <FeaturedResearchCardSkeleton />
      <FeaturedResearchCardSkeleton />
      <FeaturedResearchCardSkeleton />
      <FeaturedResearchCardSkeleton />
    </div>
  );
}

/**
 * Async server subcomponent consuming `getHomeFeaturedResearch` from `featuredResearch.data.ts`.
 */
async function FeaturedResearchCards() {
  const { items, loadFailed } = await getHomeFeaturedResearch();

  if (items.length === 0) {
    return (
      <div className="mt-12 rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {loadFailed
            ? "Featured research is temporarily unavailable."
            : "No featured research has been published yet."}
        </p>
      </div>
    );
  }

  return <FeaturedResearchCarousel items={items} />;
}

/**
 * FeaturedResearch Component (Server Component)
 *
 * Responsibilities:
 * - Renders the Featured Research section for the Home page.
 * - Delegates database fetching to `featuredResearch.data.ts`.
 * - Wraps the carousel in `<Suspense>` with `FeaturedResearchCardSkeleton` fallbacks.
 */
export default function FeaturedResearch({
  id = "featured-research",
}: FeaturedResearchProps) {
  return (
    <section
      id={id}
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-white dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-[#172554] dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            {FEATURED_RESEARCH_HEADER.badge}
          </div>

          <h2 className="mt-4 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl lg:text-3xl leading-tight">
            {FEATURED_RESEARCH_HEADER.title}
          </h2>

          <p className="mt-4 text-base sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {FEATURED_RESEARCH_HEADER.subtitle}
          </p>
        </div>

        {/* Database-Backed Featured Research Carousel */}
        <Suspense fallback={<FeaturedResearchGridSkeleton />}>
          <FeaturedResearchCards />
        </Suspense>
      </div>
    </section>
  );
}
