"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenuProps } from "./types";

/**
 * MobileMenu Component
 *
 * Responsibilities:
 * - Renders the mobile hamburger / close toggle button
 * - Renders the slide-down overlay navigation drawer
 * - Manages scroll-locking on the document body when open
 * - Closes automatically when any navigation link is clicked
 */
export default function MobileMenu({
  isOpen,
  onToggle,
  onClose,
  items,
}: MobileMenuProps) {
  const pathname = usePathname();

  // Prevent background scrolling while the mobile navigation drawer is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  /**
   * Helper function to determine if a route is currently active
   */
  const isRouteActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/" || pathname === "/home";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex md:hidden items-center">
      {/* Hamburger / Close Toggle Button */}
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white transition-colors"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        <span className="sr-only">
          {isOpen ? "Close navigation menu" : "Open navigation menu"}
        </span>
        {isOpen ? (
          // Close (X) Icon
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          // Hamburger (3-bars) Icon
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        )}
      </button>

      {/* Slide-down Drawer Panel */}
      {isOpen && (
        <div
          className="fixed inset-x-0 top-20 bottom-0 z-40 bg-white/98 backdrop-blur-lg px-6 py-6 overflow-y-auto dark:bg-zinc-950/98 border-t border-zinc-200 dark:border-zinc-800 transition-all duration-200"
          aria-label="Mobile Navigation Drawer"
        >
          <div className="flex flex-col space-y-2">
            {items.map((item) => {
              const active = isRouteActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
