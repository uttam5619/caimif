import React, { Suspense } from "react";
import ResearchOutputsTabs from "./ResearchOutputsTabs";
import { RESEARCH_OUTPUTS_SECTION_HEADER } from "./research.config";
import { getAllResearchOutputs } from "./researchOutputs.data";

/**
 * Loading skeleton displayed while publication and patent records stream in.
 */
function ResearchOutputsSkeleton() {
  return (
    <div className="mt-8 animate-pulse">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="h-10 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-10 w-36 rounded-full bg-zinc-200/80 dark:bg-zinc-800" />
        <div className="h-10 w-24 rounded-full bg-zinc-200/80 dark:bg-zinc-800" />
        <div className="h-10 w-20 rounded-full bg-zinc-200/80 dark:bg-zinc-800" />
        <div className="h-10 w-32 rounded-full bg-zinc-200/80 dark:bg-zinc-800" />
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-11 w-full bg-[#172554]/80 dark:bg-zinc-800" />
        <div className="divide-y divide-zinc-100 p-4 dark:divide-zinc-800">
          <div className="h-10 w-full rounded bg-zinc-100 dark:bg-zinc-800/70" />
          <div className="mt-3 h-10 w-full rounded bg-zinc-100 dark:bg-zinc-800/70" />
          <div className="mt-3 h-10 w-full rounded bg-zinc-100 dark:bg-zinc-800/70" />
        </div>
      </div>
    </div>
  );
}

/**
 * Async server subcomponent fetching all five publication/patent lists
 * and passing them into `ResearchOutputsTabs`.
 */
async function ResearchOutputsContent() {
  const outputs = await getAllResearchOutputs();
  return <ResearchOutputsTabs outputs={outputs} />;
}

/**
 * ResearchOutputsSection Component
 *
 * Displays the tabbed Research Outputs container immediately below
 * the Research Domain cards on `/research`.
 */
export default function ResearchOutputsSection() {
  return (
    <section className="mt-16 w-full">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {RESEARCH_OUTPUTS_SECTION_HEADER.title}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {RESEARCH_OUTPUTS_SECTION_HEADER.description}
        </p>
      </div>

      <Suspense fallback={<ResearchOutputsSkeleton />}>
        <ResearchOutputsContent />
      </Suspense>
    </section>
  );
}
