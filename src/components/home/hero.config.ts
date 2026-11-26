import { HeroStatItem, HeroAnimationConfig } from "./types";

/**
 * Target text for the dynamic typewriter animation in the Hero Section.
 */
export const HERO_TARGET_TEXT =
  "Center for Artificial Intelligence in Medicine, Imaging & Forensics";

/**
 * Timing configuration for the typewriter animation.
 */
export const HERO_ANIMATION_CONFIG: HeroAnimationConfig = {
  typingSpeed: 50, // ms per character while typing
  pauseDuration: 6000, // ms to hold full text before backspacing
  deletingSpeed: 30, // ms per character while backspacing
  restartDelay: 500, // ms pause when empty before re-typing
};

/**
 * Dedicated statistics and capability items displayed in the Hero Section cards.
 * Decoupled from component rendering in accordance with component-policy.
 */
export const HERO_STAT_ITEMS: HeroStatItem[] = [
  {
    id: "instruments",
    metric: "15+",
    label: "High-End Instruments",
    href: "/facilities",
    icon: "microscope",
  },
  {
    id: "publications",
    metric: "120+",
    label: "Publications",
    href: "/research",
    icon: "document",
  },
  {
    id: "collaborations",
    metric: "25+",
    label: "Collaborations",
    href: "/collaborations",
    icon: "handshake",
  },
  {
    id: "grants",
    metric: "10+",
    label: "On-going-Research Grant",
    href: "/research",
    icon: "grant",
  },
];
