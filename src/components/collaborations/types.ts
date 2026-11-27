import type { CollaborationDto } from "@/server/modules/collaboration/collaboration.types";

/**
 * Data contracts for the public Collaborations page component ecosystem.
 */

export interface CollaborationSummaryStats {
  total: number;
  international: number;
  national: number;
}

export interface CollaborationSummaryCardsProps {
  stats: CollaborationSummaryStats;
}

export interface CollaborationsTableProps {
  items: CollaborationDto[];
  loadFailed?: boolean;
}

export interface CollaborationsDataResult {
  items: CollaborationDto[];
  loadFailed: boolean;
}
