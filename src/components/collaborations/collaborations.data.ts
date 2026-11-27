import { connection } from "next/server";
import { COLLABORATION_MAX_LIMIT } from "@/server/modules/collaboration/collaboration.constants";
import { collaborationService } from "@/server/modules/collaboration/collaboration.service";
import type { CollaborationDto } from "@/server/modules/collaboration/collaboration.types";
import type {
  CollaborationsDataResult,
  CollaborationSummaryStats,
} from "./types";

/**
 * Fetches every `Collaboration` record from `memorandums` via `collaborationService`
 * across all pages so counts and table rows reflect the full database dataset.
 */
export async function getAllCollaborations(): Promise<CollaborationsDataResult> {
  // Opt into per-request dynamic rendering under Next.js 16 `cacheComponents`.
  await connection();

  try {
    const firstPage = await collaborationService.listCollaborations({
      page: 1,
      limit: COLLABORATION_MAX_LIMIT,
    });

    const allItems: CollaborationDto[] = [...firstPage.items];
    const totalPages = firstPage.pagination.totalPages;

    if (totalPages > 1) {
      const remainingRequests = [];
      for (let page = 2; page <= totalPages; page += 1) {
        remainingRequests.push(
          collaborationService.listCollaborations({
            page,
            limit: COLLABORATION_MAX_LIMIT,
          })
        );
      }
      const remainingPages = await Promise.all(remainingRequests);
      for (const pageResult of remainingPages) {
        allItems.push(...pageResult.items);
      }
    }

    return { items: allItems, loadFailed: false };
  } catch (error: unknown) {
    console.warn(
      "[CollaborationsData] Unable to load collaborations from database:",
      error instanceof Error ? error.message : error
    );
    return { items: [], loadFailed: true };
  }
}

/**
 * Computes Total, International, and National summary counts from collaboration items.
 */
export function computeCollaborationStats(
  items: CollaborationDto[]
): CollaborationSummaryStats {
  let international = 0;
  let national = 0;

  for (const item of items) {
    const normalizedType = item.type.trim().toLowerCase();
    if (normalizedType === "international") {
      international += 1;
    } else if (normalizedType === "national") {
      national += 1;
    }
  }

  return {
    total: items.length,
    international,
    national,
  };
}
