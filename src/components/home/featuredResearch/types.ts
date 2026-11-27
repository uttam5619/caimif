/**
 * Data contracts for the Home FeaturedResearch component ecosystem.
 * Follows Component Architecture Policy (.agents/ui-policy/component-policy/SKILL.md).
 */

export interface HomeFeaturedResearchItem {
  id: string;
  imageUrl?: string;
  authorName: string;
  title: string;
  description: string;
}

export interface FeaturedResearchCardProps {
  research: HomeFeaturedResearchItem;
}

export interface FeaturedResearchCarouselProps {
  items: HomeFeaturedResearchItem[];
}

export interface FeaturedResearchProps {
  id?: string;
}
