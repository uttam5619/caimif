import React, { Suspense } from "react";
import CollaborationSummaryCards from "./CollaborationSummaryCards";
import CollaborationsTable from "./CollaborationsTable";
import {
  computeCollaborationStats,
  getAllCollaborations,
} from "./collaborations.data";

function CollaborationsSectionSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-20 rounded-xl bg-blue-100/70 dark:bg-zinc-800" />
        <div className="h-20 rounded-xl bg-emerald-100/70 dark:bg-zinc-800" />
        <div className="h-20 rounded-xl bg-orange-100/70 dark:bg-zinc-800" />
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-12 w-full bg-[#111c4e]/85 dark:bg-zinc-800" />
        <div className="space-y-3 p-5">
          <div className="h-14 w-full rounded bg-zinc-100 dark:bg-zinc-800/70" />
          <div className="h-14 w-full rounded bg-zinc-100 dark:bg-zinc-800/70" />
          <div className="h-14 w-full rounded bg-zinc-100 dark:bg-zinc-800/70" />
        </div>
      </div>
    </div>
  );
}

async function CollaborationsContent() {
  const { items, loadFailed } = await getAllCollaborations();
  const stats = computeCollaborationStats(items);

  return (
    <div>
      <CollaborationSummaryCards stats={stats} />
      <CollaborationsTable items={items} loadFailed={loadFailed} />
    </div>
  );
}

/**
 * CollaborationsSection Component
 *
 * Server component loading all `Collaboration` records inside `<Suspense>` and
 * composing `CollaborationSummaryCards` with `CollaborationsTable`.
 */
export default function CollaborationsSection() {
  return (
    <section className="w-full">
      <Suspense fallback={<CollaborationsSectionSkeleton />}>
        <CollaborationsContent />
      </Suspense>
    </section>
  );
}
