import React from "react";
import Link from "next/link";
import { BRAND_CONFIG } from "./nav.config";
import { NavBrandProps } from "./types";

/**
 * NavBrand Component
 *
 * Responsibilities:
 * - Renders the facility monogram badge and text title
 * - Links to the home route
 * - Handles optional onNavigate callback (e.g., closing mobile drawer upon click)
 */
export default function NavBrand({ onNavigate, className = "" }: NavBrandProps) {
  return (
    <Link
      href={BRAND_CONFIG.href}
      onClick={onNavigate}
      className={`group flex items-center gap-3 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg ${className}`}
      aria-label={`${BRAND_CONFIG.name} Home`}
    >
      {/* Monogram / Brand Badge */}
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
        {BRAND_CONFIG.badgeText}
      </div>

      {/* Facility Name & Subtitle */}
      <div className="flex flex-col">
        <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          {BRAND_CONFIG.name}
        </span>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {BRAND_CONFIG.fullName}
        </span>
      </div>
    </Link>
  );
}
