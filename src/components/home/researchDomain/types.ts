/**
 * Data contracts for the Home ResearchDomain component ecosystem.
 * Follows Component Architecture Policy (.agents/ui-policy/component-policy/SKILL.md).
 */

export interface HomeResearchDomainItem {
  id: string;
  title: string;
  shortDescription: string;
  imageUrl?: string;
}

export interface ResearchDomainCardProps {
  domain: HomeResearchDomainItem;
}

export interface ResearchDomainProps {
  id?: string;
}
