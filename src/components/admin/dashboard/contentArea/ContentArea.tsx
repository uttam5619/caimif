"use client";

import React from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import ResearchDomainView from "@/components/admin/dashboard/researchDomain/ResearchDomainView";

export interface ContentAreaProps {
  activeTab?: string;
  userRole?: AdminRole;
}

/**
 * ContentArea Component
 *
 * Right section of the Admin Dashboard.
 * Displays the appropriate management view based on the active navigation tab.
 * Default view: Research Domains with list, registration, and security-admin field management.
 */
export default function ContentArea({
  activeTab = "research-domains",
  userRole = "SecurityAdmin",
}: ContentAreaProps = {}) {
  return (
    <main className="flex-1 h-full overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-6 lg:p-8 space-y-6">
      {activeTab === "research-domains" ? (
        <ResearchDomainView userRole={userRole} />
      ) : (
        <div className="space-y-6">
          <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 capitalize">
              {activeTab.replace("-", " ")}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Management interface for {activeTab.replace("-", " ")}.
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center bg-white dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Section interface under active configuration.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
