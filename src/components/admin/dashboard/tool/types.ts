/**
 * Identifiers for the four tabs inside the Tool dashboard section.
 */
export type ToolTabId =
  | "tools"
  | "categories"
  | "add-category"
  | "add-tool";

/**
 * Configuration item describing a single tab in the Tool view switcher.
 */
export interface ToolTabItem {
  id: ToolTabId;
  label: string;
}

/**
 * Serialized `ToolType` category record matching `/api/tool-types` responses.
 */
export interface ToolCategoryRecord {
  id: string;
  name: string;
  toolCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Minimal parent `ToolType` summary nested inside each `ToolRecord`.
 */
export interface ToolCategorySummary {
  id: string;
  name: string;
}

/**
 * Serialized `Tool` record matching `/api/tools` responses.
 */
export interface ToolRecord {
  id: string;
  imageKey: string;
  imageUrl?: string;
  title: string;
  version: string;
  description: string;
  toolTypeId: string;
  toolType: ToolCategorySummary;
  createdAt: string;
  updatedAt: string;
}

/**
 * Shared pagination metadata returned by `/api/tool-types` and `/api/tools`.
 */
export interface ToolPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ToolListProps {
  tools: ToolRecord[];
  categories: ToolCategoryRecord[];
  pagination: ToolPagination;
  search: string;
  categoryFilter: string;
  isLoading: boolean;
  loadError?: string | null;
  onSearchChange: (value: string) => void;
  onCategoryFilterChange: (toolTypeId: string) => void;
  onPageChange: (nextPage: number) => void;
  onEdit: (tool: ToolRecord) => void;
  onDelete: (tool: ToolRecord) => void;
}

export interface ToolCategoryListProps {
  categories: ToolCategoryRecord[];
  pagination: ToolPagination;
  search: string;
  isLoading: boolean;
  loadError?: string | null;
  onSearchChange: (value: string) => void;
  onPageChange: (nextPage: number) => void;
  onEdit: (category: ToolCategoryRecord) => void;
  onDelete: (category: ToolCategoryRecord) => void;
}

export interface AddToolCategoryFormProps {
  onSubmitCategory?: (payload: {
    name: string;
  }) => Promise<ToolCategoryRecord>;
  onSuccess?: (createdCategory: ToolCategoryRecord) => void;
}

export interface AddToolFormProps {
  categories: ToolCategoryRecord[];
  onSubmitTool?: (payload: FormData) => Promise<ToolRecord>;
  onSuccess?: (createdTool: ToolRecord) => void;
  onRequestAddCategory?: () => void;
}

export interface EditToolCategoryModalProps {
  isOpen: boolean;
  category: ToolCategoryRecord | null;
  onClose: () => void;
  onSave: (
    categoryId: string,
    payload: { name?: string }
  ) => Promise<void> | void;
}

export interface EditToolModalProps {
  isOpen: boolean;
  tool: ToolRecord | null;
  categories: ToolCategoryRecord[];
  onClose: () => void;
  onSave: (toolId: string, payload: FormData) => Promise<void> | void;
}
