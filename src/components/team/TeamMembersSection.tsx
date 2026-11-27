import React, { Suspense } from "react";
import { TeamMemberCardSkeleton } from "./TeamMemberCard";
import TeamMembersGridClient from "./TeamMembersGridClient";
import { getAllTeamMembers } from "./team.data";

/**
 * Loading skeleton matching the category filter bar and 3-column card grid.
 */
function TeamMembersSkeleton() {
  return (
    <div className="mt-10 space-y-10 animate-pulse">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="h-10 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-10 w-20 rounded-full bg-zinc-200/80 dark:bg-zinc-800" />
        <div className="h-10 w-28 rounded-full bg-zinc-200/80 dark:bg-zinc-800" />
        <div className="h-10 w-32 rounded-full bg-zinc-200/80 dark:bg-zinc-800" />
        <div className="h-10 w-24 rounded-full bg-zinc-200/80 dark:bg-zinc-800" />
      </div>

      <div>
        <div className="flex items-center gap-4">
          <div className="h-7 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-6 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center sm:justify-items-start">
          <TeamMemberCardSkeleton />
          <TeamMemberCardSkeleton />
          <TeamMemberCardSkeleton />
        </div>
      </div>
    </div>
  );
}

/**
 * Async server subcomponent loading every `Team` record and passing
 * the list into `TeamMembersGridClient` for top category filtering.
 */
async function TeamMembersContent() {
  const { items, loadFailed } = await getAllTeamMembers();
  return <TeamMembersGridClient items={items} loadFailed={loadFailed} />;
}

/**
 * TeamMembersSection Component
 *
 * Displays all `Team` member cards queried from the database on `/team`
 * with category filtering inside `<Suspense>`.
 */
export default function TeamMembersSection() {
  return (
    <div className="w-full">
      <Suspense fallback={<TeamMembersSkeleton />}>
        <TeamMembersContent />
      </Suspense>
    </div>
  );
}
