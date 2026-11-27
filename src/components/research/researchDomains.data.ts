import { connection } from "next/server";
import { researchDomainService } from "@/server/modules/researchDomain/researchDomain.service";
import type { ResearchDomainPageItem } from "./types";

const CORE_SYSTEM_FIELD_NAMES = new Set([
  "title",
  "shortDescription",
  "description",
  "image",
]);

export interface AllResearchDomainsResult {
  items: ResearchDomainPageItem[];
  loadFailed: boolean;
}

/**
 * Fetches all `ResearchDomain` records from MySQL via Prisma (through `researchDomainService` ->
 * `researchDomainRepository` -> `getPrisma()`) along with active schema field labels.
 */
export async function getAllResearchDomains(): Promise<AllResearchDomainsResult> {
  // Opt into per-request rendering under Next.js Cache Components so newly added domains appear live
  await connection();

  try {
    const [domains, fields] = await Promise.all([
      researchDomainService.listDomains(),
      researchDomainService.listFields(),
    ]);

    const nonFileCustomFields = fields.filter(
      (field) =>
        !CORE_SYSTEM_FIELD_NAMES.has(field.name) && field.type !== "file"
    );

    const items: ResearchDomainPageItem[] = domains.map((domain) => ({
      id: domain.id,
      title: domain.title,
      shortDescription: domain.shortDescription,
      description: domain.description,
      imageUrl: domain.imageUrl,
      customFields: nonFileCustomFields
        .map((field) => ({
          label: field.label,
          value: domain.customFields[field.name],
          isUrl: field.type === "url",
        }))
        .filter(
          (
            entry
          ): entry is { label: string; value: string | number; isUrl: boolean } =>
            entry.value !== undefined && String(entry.value).trim() !== ""
        )
        .map((entry) => ({
          label: entry.label,
          value: String(entry.value),
          isUrl: entry.isUrl,
        })),
    }));

    return { items, loadFailed: false };
  } catch (error: unknown) {
    console.warn(
      "[ResearchDomainsData] Unable to load research domains from database:",
      error instanceof Error ? error.message : error
    );
    return { items: [], loadFailed: true };
  }
}
