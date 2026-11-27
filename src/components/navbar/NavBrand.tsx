import React from "react";
import Link from "next/link";
import { BRAND_CONFIG } from "./nav.config";
import { NavBrandProps } from "./types";

/**
 * NavBrand Component
 *
 * Responsibilities:
 * - Renders the official institutional brand logo image
 * - Links to the home route
 * - Handles optional onNavigate callback (e.g., closing mobile drawer upon click)
 */
export default function NavBrand({ onNavigate, className = "" }: NavBrandProps) {
  return (
    <Link
      href={BRAND_CONFIG.href}
      onClick={onNavigate}
      className={`group flex items-center shrink-0 rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${className}`}
      aria-label={`${BRAND_CONFIG.name} Home`}
    >
      <div className="flex items-center dark:rounded-lg dark:bg-white dark:px-2 dark:py-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/sharda-logo.png"
          alt={BRAND_CONFIG.logoAlt}
          className="h-10 w-auto sm:h-12 object-contain"
        />
      </div>
    </Link>
  );
}
