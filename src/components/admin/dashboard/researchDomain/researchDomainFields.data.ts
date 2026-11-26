import type { DomainFieldDefinition, DomainFieldType } from "./types";

export interface FieldTypeOption {
  value: DomainFieldType;
  label: string;
  description: string;
  badge: string;
}

/**
 * Available field types with user-friendly labels and metadata for field configuration.
 * Supported types: Short text, Long text, Numeric value, Weblink/URL.
 */
export const FIELD_TYPE_OPTIONS: FieldTypeOption[] = [
  {
    value: "text",
    label: "Short text",
    description: "Single-line plain text (names, titles, tags)",
    badge: "Aa",
  },
  {
    value: "textarea",
    label: "Long text",
    description: "Multi-line text area (summaries, detailed notes)",
    badge: "¶",
  },
  {
    value: "number",
    label: "Numeric value",
    description: "Numeric inputs (counts, ranks, scores)",
    badge: "#",
  },
  {
    value: "url",
    label: "Weblink/URL",
    description: "Web address or resource link (https://...)",
    badge: "🔗",
  },
];

/**
 * Initial institutional fields defining a Research Domain.
 * Decoupled from the UI components to adhere to SRP and OCP.
 */
export const INITIAL_DOMAIN_FIELDS: DomainFieldDefinition[] = [
  {
    id: "field-title",
    name: "title",
    label: "Domain Title",
    type: "text",
    required: true,
    placeholder: "e.g., Artificial Intelligence & Machine Learning",
    description: "Primary identifier name of the research domain.",
    isSystem: true,
  },
  {
    id: "field-short-desc",
    name: "shortDescription",
    label: "Short Description",
    type: "text",
    required: true,
    placeholder: "One-line summary for cards and banners",
    description: "Brief summary displayed on domain cards and directory badges.",
    isSystem: true,
  },
  {
    id: "field-desc",
    name: "description",
    label: "Full Description",
    type: "textarea",
    required: true,
    placeholder: "Comprehensive description of scope, objectives, and research focus...",
    description: "In-depth overview of the domain's academic goals and initiatives.",
    isSystem: true,
  },
  {
    id: "field-image",
    name: "image",
    label: "Domain Cover Image",
    type: "file",
    required: false,
    placeholder: "Upload PNG, JPG, or WEBP",
    description: "Visual banner representing the research domain.",
    isSystem: true,
  },
];
