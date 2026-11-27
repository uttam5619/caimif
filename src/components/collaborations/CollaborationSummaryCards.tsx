import React from "react";
import { COLLABORATION_SUMMARY_LABELS } from "./collaborations.config";
import type { CollaborationSummaryCardsProps } from "./types";

/**
 * CollaborationSummaryCards Component
 *
 * Renders the three summary metric cards (`Total Collaborations`, `International`, `National`)
 * above the Collaborations data table.
 */
export default function CollaborationSummaryCards({
  stats,
}: CollaborationSummaryCardsProps) {
  const cards = [
    {
      label: COLLABORATION_SUMMARY_LABELS.total,
      value: stats.total,
      containerClass:
        "border-blue-200/80 bg-blue-50/90 dark:border-blue-900/50 dark:bg-blue-950/40",
      labelClass: "text-blue-700 dark:text-blue-300",
      valueClass: "text-blue-700 dark:text-blue-200",
    },
    {
      label: COLLABORATION_SUMMARY_LABELS.international,
      value: stats.international,
      containerClass:
        "border-emerald-200/80 bg-emerald-50/90 dark:border-emerald-900/50 dark:bg-emerald-950/40",
      labelClass: "text-emerald-700 dark:text-emerald-300",
      valueClass: "text-emerald-700 dark:text-emerald-200",
    },
    {
      label: COLLABORATION_SUMMARY_LABELS.national,
      value: stats.national,
      containerClass:
        "border-orange-200/80 bg-orange-50/90 dark:border-orange-900/50 dark:bg-orange-950/40",
      labelClass: "text-orange-600 dark:text-orange-300",
      valueClass: "text-orange-600 dark:text-orange-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-xl border px-5 py-4 shadow-2xs ${card.containerClass}`}
        >
          <p className={`text-sm font-semibold ${card.labelClass}`}>
            {card.label}
          </p>
          <p className={`mt-1 text-2xl font-bold ${card.valueClass}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
