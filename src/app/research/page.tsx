import React from "react";
import ResearchDomainsSection from "@/components/research/ResearchDomainsSection";
import ResearchHeroHeader from "@/components/research/ResearchHeroHeader";
import ResearchOutputsSection from "@/components/research/ResearchOutputsSection";

/**
 * Research Page Component
 *
 * Thin route orchestrator composing modular components from `src/components/research/`.
 */
export default function ResearchPage() {
  return (
    <div className="flex flex-col min-h-screen py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ResearchHeroHeader />
        <ResearchDomainsSection />
        <ResearchOutputsSection />
      </div>
    </div>
  );
}
