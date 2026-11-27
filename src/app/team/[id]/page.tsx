import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import TeamMemberProfileView from "@/components/team/TeamMemberProfileView";
import { getTeamMemberById } from "@/components/team/team.data";

interface TeamMemberProfilePageProps {
  params: Promise<{ id: string }>;
}

function TeamProfileSkeleton() {
  return (
    <div className="rounded-3xl border border-zinc-200/90 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 animate-pulse space-y-6">
      <div className="flex items-center gap-6">
        <div className="h-28 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-3 flex-1">
          <div className="h-5 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-1/3 rounded bg-zinc-100 dark:bg-zinc-800/70" />
        </div>
      </div>
      <div className="h-32 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800/70" />
    </div>
  );
}

async function TeamMemberProfileLoader({
  params,
}: TeamMemberProfilePageProps) {
  const { id } = await params;
  const member = await getTeamMemberById(id);

  if (!member) {
    notFound();
  }

  return <TeamMemberProfileView member={member} />;
}

/**
 * Dynamic Team Member Profile Page (`/team/[id]`).
 */
export default function TeamMemberProfilePage({
  params,
}: TeamMemberProfilePageProps) {
  return (
    <div className="flex flex-col min-h-screen py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<TeamProfileSkeleton />}>
          <TeamMemberProfileLoader params={params} />
        </Suspense>
      </div>
    </div>
  );
}
