import type { TeamCategory } from "../../../../prisma/generated/prisma/client";

/**
 * Serialized DTO representing a Team member record.
 */
export interface TeamDto {
  id: string;
  imageKey?: string;
  imageUrl?: string;
  category: TeamCategory;
  name: string;
  designation: string | null;
  about: string | null;
  school: string | null;
  department: string | null;
  email: string | null;
  qualification: string | null;
  specializations: string[];
  certifications: string[];
  areaOfInterest: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Validated multipart payload for creating a Team member record.
 */
export interface ValidatedCreateTeamInput {
  imageFile: Express.Multer.File | null;
  category: TeamCategory;
  name: string;
  designation: string | null;
  about: string | null;
  school: string | null;
  department: string | null;
  email: string | null;
  qualification: string | null;
  specializations: string[] | null;
  certifications: string[] | null;
  areaOfInterest: string | null;
}

/**
 * Validated multipart payload for updating an existing Team member record.
 */
export interface ValidatedUpdateTeamInput {
  imageFile: Express.Multer.File | null;
  removeImage: boolean;
  category?: TeamCategory;
  name?: string;
  designation?: string | null;
  about?: string | null;
  school?: string | null;
  department?: string | null;
  email?: string | null;
  qualification?: string | null;
  specializations?: string[] | null;
  certifications?: string[] | null;
  areaOfInterest?: string | null;
}

/**
 * Validated query parameters for listing/filtering Team member records.
 */
export interface ListTeamQuery {
  category?: TeamCategory;
  search?: string;
  page: number;
  limit: number;
}

/**
 * Paginated list response returned by the Team listing endpoint.
 */
export interface PaginatedTeamDto {
  items: TeamDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
