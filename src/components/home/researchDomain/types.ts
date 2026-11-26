/**
 * Data contracts for ResearchDomain component ecosystem.
 * Follows Component Architecture Policy (.agents/ui-policy/component-policy/SKILL.md).
 */

export interface ResearchDomainItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  tools: string[];
  icon: "medicine" | "imaging" | "forensics" | "nanomaterials" | "energy" | "biomaterials";
  href: string;
}

export interface ResearchDomainCardProps {
  domain: ResearchDomainItem;
  className?: string;
}

export interface ResearchDomainProps {
  className?: string;
  id?: string;
}
