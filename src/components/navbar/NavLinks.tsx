"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLinksProps } from "./types";

/**
 * NavLinks Component
 *
 * Responsibilities:
 * - Renders desktop navigation menu items
 * - Highlights current route using usePathname
 * - Provides subtle active indicators and hover states
 */
export default function NavLinks({ items, className = "" }: NavLinksProps) {
  const pathname = usePathname();

  /**
   * Helper function to determine if a route is currently active
   * - Treats "/" and "/home" as equivalent for root navigation
   * - Uses prefix matching for nested facility/research paths
   */
  const isRouteActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/" || pathname === "/home";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`hidden md:flex items-center gap-1 lg:gap-2 ${className}`}
      aria-label="Desktop Navigation"
    >
      {items.map((item) => {
        const active = isRouteActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative px-3.5 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
              active
                ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40"
                : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900/60"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
            {active && (
              <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
