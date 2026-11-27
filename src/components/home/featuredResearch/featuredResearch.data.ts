import { connection } from "next/server";
import { featuredResearchService } from "@/server/modules/featuredResearch/featuredResearch.service";
import type { HomeFeaturedResearchItem } from "./types";

/**
 * Maximum number of FeaturedResearch records loaded for the Home carousel.
 */
export const MAX_HOME_FEATURED_RESEARCH_ITEMS = 20;

export interface HomeFeaturedResearchResult {
  items: HomeFeaturedResearchItem[];
  loadFailed: boolean;
}

/**
 * Fetches live FeaturedResearch records from MySQL via Prisma (through the service/repository layer)
 * for display inside the Home page carousel.
 */
export async function getHomeFeaturedResearch(
  limit: number = MAX_HOME_FEATURED_RESEARCH_ITEMS
): Promise<HomeFeaturedResearchResult> {
  // Opt into per-request rendering under Next.js Cache Components so admin updates appear immediately
  await connection();

  try {
    const result = await featuredResearchService.listFeaturedResearch({
      page: 1,
      limit,
    });

    const items: HomeFeaturedResearchItem[] = result.items.map((record) => ({
      id: record.id,
      imageUrl: record.imageUrl,
      authorName: record.authorName,
      title: record.title,
      description: record.description,
    }));

    return { items, loadFailed: false };
  } catch (error: unknown) {
    console.warn(
      "[HomeFeaturedResearchData] Unable to load featured research from database:",
      error instanceof Error ? error.message : error
    );
    return { items: [], loadFailed: true };
  }
}
