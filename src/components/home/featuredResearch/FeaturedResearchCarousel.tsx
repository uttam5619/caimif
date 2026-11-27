"use client";

import React, { useEffect, useState } from "react";
import FeaturedResearchCard from "./FeaturedResearchCard";
import type { FeaturedResearchCarouselProps } from "./types";

const MAX_VISIBLE_CARDS = 4;

/**
 * Resolves the responsive carousel window size without exceeding 4 visible cards.
 */
function getResponsiveVisibleCount(width: number): number {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  if (width < 1280) return 3;
  return MAX_VISIBLE_CARDS;
}

/**
 * FeaturedResearchCarousel Component
 *
 * Responsibilities:
 * - Displays at most 4 `FeaturedResearchCard` items at a time.
 * - Provides dedicated Left and Right navigation buttons on each end of the carousel
 *   to shift through the featured research collection.
 */
export default function FeaturedResearchCarousel({
  items,
}: FeaturedResearchCarouselProps) {
  const [visibleCount, setVisibleCount] = useState<number>(MAX_VISIBLE_CARDS);
  const [startIndex, setStartIndex] = useState<number>(0);

  // Adapt the visible slot count (1 / 2 / 3 / max 4) to viewport width
  useEffect(() => {
    const updateVisibleCount = () => {
      const nextCount = getResponsiveVisibleCount(window.innerWidth);
      setVisibleCount(nextCount);
      setStartIndex((prev) =>
        Math.min(prev, Math.max(0, items.length - nextCount))
      );
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [items.length]);

  const effectiveVisibleCount = Math.min(visibleCount, MAX_VISIBLE_CARDS);
  const maxStartIndex = Math.max(0, items.length - effectiveVisibleCount);
  const safeStartIndex = Math.min(startIndex, maxStartIndex);
  const visibleItems = items.slice(
    safeStartIndex,
    safeStartIndex + effectiveVisibleCount
  );

  const canMoveLeft = safeStartIndex > 0;
  const canMoveRight = safeStartIndex < maxStartIndex;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
  };

  const navButtonClass =
    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-[#172554] shadow-sm transition-all hover:bg-[#172554] hover:text-white hover:border-[#172554] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#172554] disabled:hover:border-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white dark:disabled:hover:bg-zinc-900 dark:disabled:hover:text-blue-300 cursor-pointer";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured Research Carousel"
      className="mt-12 flex items-center gap-2 sm:gap-3"
    >
      {/* Left End Navigation Button */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={!canMoveLeft}
        aria-label="Previous featured research"
        className={navButtonClass}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Carousel Cards Track (max 4 visible cards) */}
      <div className="flex-1 min-w-0 flex flex-wrap xl:flex-nowrap justify-center gap-4">
        {visibleItems.map((research) => (
          <FeaturedResearchCard key={research.id} research={research} />
        ))}
      </div>

      {/* Right End Navigation Button */}
      <button
        type="button"
        onClick={handleNext}
        disabled={!canMoveRight}
        aria-label="Next featured research"
        className={navButtonClass}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
