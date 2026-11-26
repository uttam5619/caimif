import type { PatentStatus } from "../../../../prisma/generated/prisma/enums";

/**
 * Serialized DTO representing a Patent record.
 */
export interface PatentDto {
  id: string;
  year: number;
  domain: string;
  title: string;
  status: PatentStatus;
  nameOfInventors: string;
  patentAgency: string;
  country: string;
  grantNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input payload for creating a new Patent record.
 */
export interface CreatePatentInput {
  year: number;
  domain: string;
  title: string;
  status: PatentStatus;
  nameOfInventors: string;
  patentAgency: string;
  country: string;
  grantNumber?: string | null;
}

/**
 * Input payload for partially updating an existing Patent record.
 */
export type UpdatePatentInput = Partial<CreatePatentInput>;

/**
 * Validated query parameters for listing/filtering Patent records.
 */
export interface ListPatentsQuery {
  year?: number;
  domain?: string;
  status?: PatentStatus;
  search?: string;
  page: number;
  limit: number;
}

/**
 * Paginated list response returned by the Patent listing endpoint.
 */
export interface PaginatedPatentsDto {
  items: PatentDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
