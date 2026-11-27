import React from "react";
import type { HardwareCardItem } from "./types";

interface HardwareCardProps {
  card: HardwareCardItem;
}

/**
 * HardwareCard Component
 *
 * Matches the site's modern elevated card system (`rounded-2xl`, crisp hairline
 * borders, flush cover slot, hover lift, deep navy typography accents) while
 * keeping hardware titles and bulleted specifications concise and readable.
 */
export default function HardwareCard({ card }: HardwareCardProps) {
  const imageObjectClass =
    card.imageFit === "contain"
      ? "object-contain p-4"
      : "object-cover object-center";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700">
      {/* Flush Top Visual Slot */}
      <div className="relative h-44 w-full overflow-hidden border-b border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.imageSrc}
          alt={card.imageAlt}
          className={`h-full w-full transition-transform duration-300 group-hover:scale-105 ${imageObjectClass}`}
        />
      </div>

      {/* Card Title & Specification List */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold leading-snug text-[#172554] transition-colors group-hover:text-blue-900 dark:text-zinc-50 dark:group-hover:text-blue-300">
          {card.title}
        </h3>

        <div className="mt-3 h-px w-full bg-zinc-100 dark:bg-zinc-800" />

        <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {card.specs.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#172554] dark:bg-blue-400"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
