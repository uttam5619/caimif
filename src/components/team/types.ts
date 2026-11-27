import type { TeamDto } from "@/server/modules/team/team.types";
import type { TeamCategory } from "../../../prisma/generated/prisma/client";

/**
 * Data contracts for the Team page component ecosystem.
 */

export interface TeamMemberCardProps {
  member: TeamDto;
}

export interface TeamMembersDataResult {
  items: TeamDto[];
  loadFailed: boolean;
}

export interface TeamCategorySectionConfig {
  category: TeamCategory;
  title: string;
}

export type TeamCardTabKey = "profile" | "interests" | "qualifications";

export interface TeamCardTabItem {
  key: TeamCardTabKey;
  label: string;
}

export type TeamCategoryFilterKey = "ALL" | TeamCategory;

export interface TeamCategoryFilterOption {
  key: TeamCategoryFilterKey;
  label: string;
}

export interface TeamMembersGridClientProps {
  items: TeamDto[];
  loadFailed: boolean;
}

export interface TeamMemberProfileViewProps {
  member: TeamDto;
}
