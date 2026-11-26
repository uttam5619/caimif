"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import NavBrand from "./NavBrand";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import { NAV_ITEMS } from "./nav.config";

/**
 * Navbar Component
 *
 * Master orchestrator for application-wide top navigation:
 * - Desktop Layout: Logo and Navigation links
 * - Mobile Layout: Logo, Hamburger toggle, and Fullscreen dropdown drawer
 * - High-level layout composition adhering to clean separation of concerns
 * - Suppressed entirely on administrative routes (/admin) as per design specification
 */
export default function Navbar() {
  const pathname = usePathname();

  // Mobile drawer open/close visibility state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Suppress public navigation bar on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md transition-colors dark:border-zinc-800/80 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <NavBrand onNavigate={() => setIsMobileMenuOpen(false)} />

        {/* Desktop navigation links */}
        <NavLinks items={NAV_ITEMS} />

        {/* Mobile menu trigger and drawer */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onClose={() => setIsMobileMenuOpen(false)}
          items={NAV_ITEMS}
        />
      </div>
    </header>
  );
}
