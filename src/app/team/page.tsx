import React from "react";
import TeamHeroHeader from "@/components/team/TeamHeroHeader";
import TeamMembersSection from "@/components/team/TeamMembersSection";

/**
 * Team Page Component
 *
 * Thin route orchestrator composing modular components from `src/components/team/`.
 */
export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <TeamHeroHeader />
        <TeamMembersSection />
      </div>
    </div>
  );
}
