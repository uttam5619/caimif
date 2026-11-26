import type { DomainFieldType } from "@/components/admin/dashboard/researchDomain/types";

/**
 * Custom dynamic field values stored on a ResearchDomain record.
 */
export type CustomFieldValues = Record<string, string | number>;

/**
 * Serialized DTO representing a ResearchDomain record returned by APIs.
 */
export interface ResearchDomainDto {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  imageKey?: string;
  imageUrl?: string;
  customFields: CustomFieldValues;
  createdAt: string;
  updatedAt: string;
}

/**
 * Serialized DTO representing a ResearchDomainField schema definition.
 */
export interface DomainFieldDto {
  id: string;
  name: string;
  label: string;
  type: DomainFieldType;
  required: boolean;
  placeholder?: string;
  description?: string;
  isSystem: boolean;
  sortOrder: number;
}

/**
 * Input payload for creating a custom schema field.
 */
export interface CreateFieldInput {
  name: string;
  label: string;
  type: DomainFieldType;
  placeholder: string;
  required: boolean;
  description?: string;
}

/**
 * Input payload for updating an existing schema field.
 */
export interface UpdateFieldInput {
  name?: string;
  label?: string;
  type?: DomainFieldType;
  placeholder?: string;
  required?: boolean;
  description?: string;
}

/**
 * Result produced after validating a Multer-parsed domain submission.
 */
export interface ValidatedDomainSubmission {
  title: string;
  shortDescription: string;
  description: string;
  imageFile: Express.Multer.File | null;
  removeImage: boolean;
  customTextValues: CustomFieldValues;
  customFiles: Record<string, Express.Multer.File>;
}

/**
 * Standard API envelope used across all module endpoints.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details: unknown;
  };
}
