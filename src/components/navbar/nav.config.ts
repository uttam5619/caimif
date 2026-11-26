import { NavItem, BrandConfig } from "./types";

/**
 * Facility brand details
 */
export const BRAND_CONFIG: BrandConfig = {
  name: "CAIMIF",
  fullName: "Central Analytical & Microscopy Facility",
  badgeText: "C",
  href: "/",
};

/**
 * Main application navigation links
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Facilities", href: "/facilities" },
  { label: "Research", href: "/research" },
  { label: "Teams", href: "/teams" },
  { label: "Collaborations", href: "/collaborations" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contectus" },
];
