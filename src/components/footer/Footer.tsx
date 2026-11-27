"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOOTER_CONFIG } from "./footer.config";

/**
 * Footer Component
 *
 * Global public site footer rendered across all user-facing routes.
 * Suppressed on administrative dashboards (`/admin/*`) and authentication pages
 * (`/admin`, `/auth/*`, `/login`).
 */
export default function Footer() {
  const pathname = usePathname();

  // Suppress global public footer on admin dashboard and authentication pages
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/login")
  ) {
    return null;
  }

  return (
    <footer className="w-full border-t border-white/10 bg-gradient-to-r from-[#081236] via-[#0e2058] to-[#081236] text-slate-300">
      <div className="mx-auto w-full max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        {/* 4-Column Footer Directory */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: CAIMIF Overview */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-base font-extrabold tracking-wide text-white uppercase">
              {FOOTER_CONFIG.brandTitle}
            </h2>
            <p className="max-w-sm text-xs sm:text-[13px] leading-relaxed text-slate-300/90">
              {FOOTER_CONFIG.brandDescription}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              {FOOTER_CONFIG.quickLinksHeading}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {FOOTER_CONFIG.quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-300/90 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              {FOOTER_CONFIG.exploreHeading}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {FOOTER_CONFIG.exploreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-300/90 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              {FOOTER_CONFIG.contactHeading}
            </h3>

            <div className="space-y-1 text-xs sm:text-[13px] leading-relaxed text-slate-300/90">
              <p>{FOOTER_CONFIG.contactTitle}</p>
              {FOOTER_CONFIG.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <div className="space-y-2.5 pt-1 text-xs sm:text-[13px]">
              <a
                href={`tel:${FOOTER_CONFIG.phone.replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-2.5 text-slate-300/90 transition-colors hover:text-white"
              >
                <svg
                  className="h-4 w-4 shrink-0 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>{FOOTER_CONFIG.phone}</span>
              </a>

              <a
                href={`mailto:${FOOTER_CONFIG.email}`}
                className="flex items-center gap-2.5 text-slate-300/90 transition-colors hover:text-white"
              >
                <svg
                  className="h-4 w-4 shrink-0 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{FOOTER_CONFIG.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Divider */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
          {FOOTER_CONFIG.copyrightText}
        </div>
      </div>
    </footer>
  );
}
