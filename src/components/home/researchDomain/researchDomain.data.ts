import { connection } from "next/server";
import { researchDomainService } from "@/server/modules/researchDomain/researchDomain.service";
import type { HomeResearchDomainItem } from "./types";

/**
 * Maximum number of ResearchDomain cards displayed on the Home page.
 */
export const MAX_HOME_RESEARCH_DOMAINS = 6;

export interface HomeResearchDomainsResult {
  items: HomeResearchDomainItem[];
  loadFailed: boolean;
}

/**
 * Fetches live ResearchDomain records from MySQL via Prisma (through the service/repository layer)
 * and caps the result to at most `limit` items for the Home page preview.
 */
export async function getHomeResearchDomains(
  limit: number = MAX_HOME_RESEARCH_DOMAINS
): Promise<HomeResearchDomainsResult> {
  // Opt into per-request rendering under Next.js Cache Components so admin updates appear immediately
  await connection();

  try {
    const domains = await researchDomainService.listDomains();

    const items: HomeResearchDomainItem[] = domains
      .slice(0, limit)
      .map((domain) => ({
        id: domain.id,
        title: domain.title,
        shortDescription: domain.shortDescription,
        imageUrl: domain.imageUrl,
      }));

    return { items, loadFailed: false };
  } catch (error: unknown) {
    console.warn(
      "[HomeResearchDomainData] Unable to load research domains from database:",
      error instanceof Error ? error.message : error
    );
    return { items: [], loadFailed: true };
  }
}
