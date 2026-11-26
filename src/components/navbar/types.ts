/**
 * Navigation data contracts and prop types for the Navbar system
 */

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface BrandConfig {
  name: string;
  fullName: string;
  /** Single letter or monogram badge */
  badgeText: string;
  href: string;
}

export interface NavBrandProps {
  /** Optional click handler (e.g. to close mobile menu upon navigation) */
  onNavigate?: () => void;
  /** Optional custom CSS classes */
  className?: string;
}

export interface NavLinksProps {
  /** List of navigation items to render */
  items: NavItem[];
  /** Optional custom CSS classes */
  className?: string;
}

export interface MobileMenuProps {
  /** Whether the mobile menu drawer is currently visible */
  isOpen: boolean;
  /** Handler to toggle open/close status */
  onToggle: () => void;
  /** Handler to explicitly close the drawer */
  onClose: () => void;
  /** Navigation links to display inside the drawer */
  items: NavItem[];
}
