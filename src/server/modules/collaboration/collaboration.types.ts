/**
 * Serialized DTO representing a `Collaboration` (MoU / partnership) record.
 */
export interface CollaborationDto {
  id: string;
  firstParty: string;
  secondParty: string;
  date: string;
  leadingPerson: string;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Validated payload for creating a `Collaboration` record.
 */
export interface CreateCollaborationInput {
  firstParty: string;
  secondParty: string;
  date: Date;
  leadingPerson: string;
  type: string;
  content: string;
}

/**
 * Validated payload for partially updating a `Collaboration` record.
 */
export type UpdateCollaborationInput = Partial<CreateCollaborationInput>;

/**
 * Validated query parameters for listing/filtering Collaboration records.
 */
export interface ListCollaborationsQuery {
  type?: string;
  search?: string;
  page: number;
  limit: number;
}

/**
 * Paginated list response returned by `/api/collaborations`.
 */
export interface PaginatedCollaborationsDto {
  items: CollaborationDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
