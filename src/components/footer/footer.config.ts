import type { FooterConfig } from "./types";

/**
 * Static footer configuration and navigation directory.
 * Decoupled from Footer UI markup to adhere to SRP and OCP.
 */
export const FOOTER_CONFIG: FooterConfig = {
  brandTitle: "CAIMIF",
  brandDescription:
    "CAIMIF at Sharda University is a pioneering hub where AI meets healthcare and forensic science. Our multidisciplinary team creates innovative solutions to enhance diagnostics, improve treatment, and advance investigations.",
  quickLinksHeading: "QUICK LINKS",
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "Facilities", href: "/facilities" },
    { label: "Research", href: "/research" },
    { label: "Collaboration", href: "/collaborations" },
  ],
  exploreHeading: "EXPLORE",
  exploreLinks: [
    { label: "Events", href: "/events" },
    { label: "Team", href: "/teams" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact Us", href: "/contectus" },
  ],
  contactHeading: "CONTACT US",
  contactTitle:
    "Center For Artificial Intelligence in Medicine, Imaging & Forensics",
  addressLines: [
    "Plot No. 32-34 Knowledge Park III",
    "Greater Noida, Uttar Pradesh 201310",
  ],
  phone: "+91-9718930785",
  email: "center.ai@sharda.ac.in",
  copyrightText:
    "Copyright © 2026 CAIMIF | Sharda University. All Rights Reserved.",
};
