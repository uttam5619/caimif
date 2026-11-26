import React from "react";
import Link from "next/link";
import { HeroCardProps } from "./types";

/**
 * Helper component rendering semantic SVG icons for each hero card type.
 * Eliminates external icon library dependencies and maintains high rendering speed.
 */
function CardIcon({ type }: { type: string }) {
  switch (type) {
    case "microscope":
      return (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 18M12 2v4m0 0a4 4 0 014 4v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2a4 4 0 014-4zm-4 12a4 4 0 008 0"
          />
        </svg>
      );
    case "document":
      return (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    case "handshake":
      return (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      );
    case "grant":
      return (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      );
    case "users":
      return (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      );
    case "shield":
      return (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      );
    default:
      return (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      );
  }
}

/**
 * Returns tailored color styles and subtle glow for each icon type.
 * Enhances visual contrast and gives each hero card a distinct identity.
 */
function getIconStyles(type: string) {
  switch (type) {
    case "microscope":
      return "bg-cyan-500/15 border-cyan-400/30 text-cyan-300 group-hover:bg-cyan-500/25 group-hover:border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.2)]";
    case "document":
      return "bg-amber-500/15 border-amber-400/30 text-amber-300 group-hover:bg-amber-500/25 group-hover:border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.2)]";
    case "handshake":
      return "bg-indigo-500/15 border-indigo-400/30 text-indigo-300 group-hover:bg-indigo-500/25 group-hover:border-indigo-400/50 shadow-[0_0_12px_rgba(129,140,248,0.2)]";
    case "grant":
      return "bg-emerald-500/15 border-emerald-400/30 text-emerald-300 group-hover:bg-emerald-500/25 group-hover:border-emerald-400/50 shadow-[0_0_12px_rgba(52,211,153,0.2)]";
    case "users":
      return "bg-rose-500/15 border-rose-400/30 text-rose-300 group-hover:bg-rose-500/25 group-hover:border-rose-400/50 shadow-[0_0_12px_rgba(251,113,133,0.2)]";
    case "shield":
      return "bg-sky-500/15 border-sky-400/30 text-sky-300 group-hover:bg-sky-500/25 group-hover:border-sky-400/50 shadow-[0_0_12px_rgba(56,189,248,0.2)]";
    default:
      return "bg-blue-500/15 border-blue-400/30 text-blue-300 group-hover:bg-blue-500/25 group-hover:border-blue-400/50 shadow-[0_0_12px_rgba(96,165,250,0.2)]";
  }
}

/**
 * Dedicated HeroCard Component
 *
 * Responsibilities:
 * - Displays a dedicated statistic/capability card for the Hero Section.
 * - Left-aligned layout matching the Hero theme.
 * - Colorful, glowing icon containers tailored to each card's scientific domain.
 * - Displays prominent metric and label without badge or sublabel clutter.
 * - Supports Next.js link wrapping with accessible focus rings and hover elevation.
 */
export default function HeroCard({ item, className = "" }: HeroCardProps) {
  const iconTheme = getIconStyles(item.icon);

  const cardContent = (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-5 text-left backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/15 hover:shadow-lg ${className}`}
    >
      {/* Top Header: Colorful Icon & Optional External Link Indicator */}
      <div className="flex items-center justify-between">
        <div
          className={`inline-flex items-center justify-center rounded-xl border p-2.5 transition-all duration-300 ${iconTheme}`}
        >
          <CardIcon type={item.icon} />
        </div>
        {item.href && (
          <svg
            className="h-4 w-4 text-blue-300 opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 17L17 7M17 7H7M17 7V17"
            />
          </svg>
        )}
      </div>

      {/* Main Metric Value & Title */}
      <div className="mt-4">
        <div className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {item.metric}
        </div>
        <div className="mt-1 text-sm font-semibold text-blue-100">
          {item.label}
        </div>
      </div>
    </div>
  );

  // If href is specified, wrap in Link for seamless navigation
  if (item.href) {
    return (
      <Link
        href={item.href}
        className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label={`${item.label} - ${item.metric}`}
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
