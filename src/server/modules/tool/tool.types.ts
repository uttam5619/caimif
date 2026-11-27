/**
 * Minimal parent `ToolType` summary embedded in serialized `ToolDto` responses.
 */
export interface ToolTypeSummaryDto {
  id: string;
  name: string;
}

/**
 * Serialized DTO representing a `ToolType` category record.
 */
export interface ToolTypeDto {
  id: string;
  name: string;
  toolCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Serialized DTO representing a `Tool` record with resolved image URL and category metadata.
 */
export interface ToolDto {
  id: string;
  imageKey: string;
  imageUrl?: string;
  title: string;
  version: string;
  description: string;
  toolTypeId: string;
  toolType: ToolTypeSummaryDto;
  createdAt: string;
  updatedAt: string;
}

/**
 * Validated payload for creating a `ToolType`.
 */
export interface CreateToolTypeInput {
  name: string;
}

/**
 * Validated payload for partially updating a `ToolType`.
 */
export type UpdateToolTypeInput = Partial<CreateToolTypeInput>;

/**
 * Validated query parameters for listing/filtering `ToolType` records.
 */
export interface ListToolTypesQuery {
  search?: string;
  page: number;
  limit: number;
}

/**
 * Paginated response returned by the `ToolType` listing endpoint.
 */
export interface PaginatedToolTypesDto {
  items: ToolTypeDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Validated payload (multipart or JSON) for creating a new `Tool`.
 */
export interface ValidatedCreateToolInput {
  title: string;
  version: string;
  description: string;
  toolTypeId: string;
  imageFile: Express.Multer.File | null;
  imageKey: string | null;
}

/**
 * Validated payload (multipart or JSON) for partially updating an existing `Tool`.
 */
export interface ValidatedUpdateToolInput {
  title?: string;
  version?: string;
  description?: string;
  toolTypeId?: string;
  imageFile: Express.Multer.File | null;
  imageKey?: string;
}

/**
 * Validated query parameters for listing/filtering `Tool` records.
 */
export interface ListToolsQuery {
  toolTypeId?: string;
  search?: string;
  page: number;
  limit: number;
}

/**
 * Paginated response returned by the `Tool` listing endpoint.
 */
export interface PaginatedToolsDto {
  items: ToolDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
