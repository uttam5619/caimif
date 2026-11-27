import React from "react";
import CollaborationsSection from "@/components/collaborations/CollaborationsSection";

/**
 * Collaborations Page Component (`/collaborations`)
 *
 * Thin route orchestrator composing `CollaborationsSection` from
 * `src/components/collaborations/`.
 */
export default function CollaborationsPage() {
  return (
    <div className="flex flex-col min-h-screen py-10 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <CollaborationsSection />
      </div>
    </div>
  );
}
