import type {
  ToolCategoryRecord,
  ToolRecord,
} from "@/components/admin/dashboard/tool/types";

/**
 * Data contracts for the Facilities page hero, hardware cards, and tools sections.
 */

export interface FacilitySpecItem {
  label: string;
  value: string;
}

export interface FacilityHeroConfig {
  title: string;
  imageSrc: string;
  imageAlt: string;
  specsHeading: string;
  description: string;
  specs: FacilitySpecItem[];
}

export interface HardwareCardItem {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
  specs: string[];
}

export interface ToolTypeTabsProps {
  categories: ToolCategoryRecord[];
  activeCategoryId: string;
  isLoading?: boolean;
  onSelectCategory: (categoryId: string) => void;
}

export interface ListOfToolsProps {
  tools: ToolRecord[];
  isLoading: boolean;
  activeCategoryName?: string;
  onSelectTool?: (tool: ToolRecord) => void;
}

export interface ToolTabsProps {
  toolTypes: ToolCategoryRecord[];
  activeToolTypeId: string;
  onSelectToolType: (toolTypeId: string) => void;
}

export interface ListOfToolsProps {
  tools: ToolRecord[];
  activeCategoryName?: string;
  isLoading: boolean;
}
