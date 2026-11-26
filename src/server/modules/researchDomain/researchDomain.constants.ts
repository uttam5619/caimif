import type { DomainFieldType } from "@/components/admin/dashboard/researchDomain/types";
import { ResearchDomainFieldType as PrismaFieldType } from "../../../../prisma/generated/prisma/enums";

/**
 * Maps frontend lowercase DomainFieldType identifiers to Prisma enum values.
 */
export const FIELD_TYPE_TO_PRISMA: Record<DomainFieldType, PrismaFieldType> = {
  text: PrismaFieldType.TEXT,
  textarea: PrismaFieldType.TEXTAREA,
  number: PrismaFieldType.NUMBER,
  url: PrismaFieldType.URL,
  file: PrismaFieldType.FILE,
  date: PrismaFieldType.DATE,
  select: PrismaFieldType.SELECT,
  email: PrismaFieldType.EMAIL,
};

/**
 * Maps Prisma enum values back to frontend DomainFieldType strings.
 */
export const PRISMA_TO_FIELD_TYPE: Record<PrismaFieldType, DomainFieldType> = {
  [PrismaFieldType.TEXT]: "text",
  [PrismaFieldType.TEXTAREA]: "textarea",
  [PrismaFieldType.NUMBER]: "number",
  [PrismaFieldType.URL]: "url",
  [PrismaFieldType.FILE]: "file",
  [PrismaFieldType.DATE]: "date",
  [PrismaFieldType.SELECT]: "select",
  [PrismaFieldType.EMAIL]: "email",
};

/**
 * Core fields backed by non-null columns on the `research_domains` table.
 * These cannot be deleted or marked optional without breaking DB constraints.
 */
export const CORE_REQUIRED_SYSTEM_FIELDS: ReadonlySet<string> = new Set([
  "title",
  "shortDescription",
  "description",
]);

/**
 * Default institutional fields bootstrapped on first access when
 * the `research_domain_fields` table is empty.
 */
export const DEFAULT_SYSTEM_FIELD_SEEDS = [
  {
    name: "title",
    label: "Domain Title",
    type: PrismaFieldType.TEXT,
    required: true,
    placeholder: "e.g., Artificial Intelligence & Machine Learning",
    description: "Primary identifier name of the research domain.",
    isSystem: true,
    sortOrder: 0,
  },
  {
    name: "shortDescription",
    label: "Short Description",
    type: PrismaFieldType.TEXT,
    required: true,
    placeholder: "One-line summary for cards and banners",
    description: "Brief summary displayed on domain cards and directory badges.",
    isSystem: true,
    sortOrder: 1,
  },
  {
    name: "description",
    label: "Full Description",
    type: PrismaFieldType.TEXTAREA,
    required: true,
    placeholder:
      "Comprehensive description of scope, objectives, and research focus...",
    description: "In-depth overview of the domain's academic goals and initiatives.",
    isSystem: true,
    sortOrder: 2,
  },
  {
    name: "image",
    label: "Domain Cover Image",
    type: PrismaFieldType.FILE,
    required: false,
    placeholder: "Upload PNG, JPG, or WEBP",
    description: "Visual banner representing the research domain.",
    isSystem: true,
    sortOrder: 3,
  },
] as const;
