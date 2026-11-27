import React, { Suspense } from "react";
import { ResearchDomainCardSkeleton } from "./ResearchDomainCard";
import ResearchDomainsGridClient from "./ResearchDomainsGridClient";
import { getAllResearchDomains } from "./researchDomains.data";

/**
 * Loading skeleton grid while all database-backed ResearchDomain records stream in.
 */
function ResearchDomainsGridSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
      <ResearchDomainCardSkeleton />
      <ResearchDomainCardSkeleton />
      <ResearchDomainCardSkeleton />
    </div>
  );
}

/**
 * Async server subcomponent rendering every `ResearchDomain` record from the database
 * as an individual `ResearchDomainCard`.
 */
async function ResearchDomainsGrid() {
  const { items, loadFailed } = await getAllResearchDomains();

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {loadFailed
            ? "Research domains are temporarily unavailable."
            : "No research domains have been registered yet."}
        </p>
      </div>
    );
  }

  return <ResearchDomainsGridClient items={items} />;
}

/**
 * ResearchDomainsSection Component
 *
 * Displays all `ResearchDomain` records stored in MySQL (`researchDomain.prisma`)
 * on the `/research` page inside `<Suspense>`.
 */
export default function ResearchDomainsSection() {
  return (
    <section className="mt-14 w-full">
      <Suspense fallback={<ResearchDomainsGridSkeleton />}>
        <ResearchDomainsGrid />
      </Suspense>
    </section>
  );
}
