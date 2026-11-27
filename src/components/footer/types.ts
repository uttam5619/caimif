/**
 * Data contracts for the global application Footer component.
 */

export interface FooterLinkItem {
  label: string;
  href: string;
}

export interface FooterConfig {
  brandTitle: string;
  brandDescription: string;
  quickLinksHeading: string;
  quickLinks: FooterLinkItem[];
  exploreHeading: string;
  exploreLinks: FooterLinkItem[];
  contactHeading: string;
  contactTitle: string;
  addressLines: string[];
  phone: string;
  email: string;
  copyrightText: string;
}
