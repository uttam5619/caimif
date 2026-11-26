/**
 * Data contract for an individual hero metric / feature card item.
 */
export interface HeroStatItem {
  id: string;
  metric: string;
  label: string;
  href?: string;
  icon: "microscope" | "document" | "handshake" | "grant" | "users" | "shield";
}

/**
 * Prop interface for the dedicated HeroCard component.
 */
export interface HeroCardProps {
  item: HeroStatItem;
  className?: string;
}

/**
 * Configuration options for the Hero section typewriter animation.
 */
export interface HeroAnimationConfig {
  typingSpeed: number;
  pauseDuration: number;
  deletingSpeed: number;
  restartDelay: number;
}

/**
 * Prop interface for the DotGridBackground component.
 */
export interface DotGridBackgroundProps {
  dotSize?: number;
  gap?: number;
  color?: string;
  className?: string;
  interactive?: boolean;
}
