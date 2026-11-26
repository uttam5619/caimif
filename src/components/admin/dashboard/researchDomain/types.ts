import type { AdminRole } from "@/components/admin/authenticationForm/types";

/**
 * Allowed administrative access roles for the CAIMIF portal.
 */
export type { AdminRole };

/**
 * Research Domain entity definition.
 */
export interface ResearchDomain {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  image?: File | null;
  imageKey?: string;
  imageUrl?: string;
  customFields?: Record<string, string | number>;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Data payload collected for registering a research domain.
 */
export interface ResearchDomainPayload {
  title: string;
  shortDescription: string;
  description: string;
  image: File | null;
}

/**
 * Supported field data types for domain schema attributes.
 */
export type DomainFieldType =
  | "text"
  | "textarea"
  | "number"
  | "url"
  | "file"
  | "date"
  | "select"
  | "email";

/**
 * Definition of a single field/attribute belonging to a Research Domain.
 */
export interface DomainFieldDefinition {
  id: string;
  name: string; // uniqueIdentifier
  label: string; // Title
  type: DomainFieldType; // FieldType
  required: boolean;
  placeholder?: string; // placeHolder
  description?: string;
  isSystem?: boolean;
  sortOrder?: number;
}

/**
 * Payload submitted from the field configuration form.
 * Contains exclusively: Title (label), uniqueIdentifier (name), FieldType (type), and placeHolder (placeholder).
 */
export interface HandleFieldFormData {
  label: string;
  name: string;
  type: DomainFieldType;
  placeholder: string;
  required?: boolean;
  description?: string;
}

/**
 * Props for the HandleFieldForm component.
 */
export interface HandleFieldFormProps {
  fieldToEdit?: DomainFieldDefinition | null;
  existingIdentifiers?: string[];
  onCancel?: () => void;
  onSubmit: (fieldData: HandleFieldFormData, editId?: string) => Promise<void> | void;
}

/**
 * Props for the DomainFieldModal component.
 */
export interface DomainFieldModalProps {
  isOpen: boolean;
  fieldToEdit: DomainFieldDefinition | null;
  existingIdentifiers?: string[];
  onClose: () => void;
  onSave: (fieldData: HandleFieldFormData, editId?: string) => Promise<void> | void;
}

/**
 * Props for the EditDomainModal component.
 */
export interface EditDomainModalProps {
  isOpen: boolean;
  domain: ResearchDomain | null;
  fields?: DomainFieldDefinition[];
  onClose: () => void;
  onSave: (domainId: string, payload: FormData) => Promise<void> | void;
}

/**
 * Props for the ManageResearchDomains component.
 */
export interface ManageResearchDomainsProps {
  initialFields?: DomainFieldDefinition[];
  onFieldsChange?: (fields: DomainFieldDefinition[]) => void;
  onCreateField?: (fieldData: HandleFieldFormData) => Promise<void>;
  onUpdateField?: (editId: string, fieldData: HandleFieldFormData) => Promise<void>;
  onDeleteField?: (fieldId: string) => Promise<void>;
}

/**
 * Props for the RegisterNewDomainForm component.
 */
export interface RegisterNewDomainFormProps {
  fields?: DomainFieldDefinition[];
  onSubmitDomain?: (payload: FormData) => Promise<ResearchDomain>;
  onSuccess?: (createdDomain: ResearchDomain) => void;
}

/**
 * Props for the DeleteConfirmModal component.
 */
export interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  description?: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
}

/**
 * Props for the ResearchDomainList component.
 */
export interface ResearchDomainListProps {
  /**
   * Array of registered research domains to display in the list table.
   */
  domains: ResearchDomain[];

  /**
   * Configured fields used to render dynamic custom field summaries.
   */
  fields?: DomainFieldDefinition[];

  /**
   * Indicates whether domains are currently being loaded from the backend.
   */
  isLoading?: boolean;

  /**
   * Error message when fetching research domains fails.
   */
  loadError?: string | null;

  /**
   * Callback when the user clicks the Edit button for a domain.
   */
  onEdit: (domain: ResearchDomain) => void;

  /**
   * Callback when the user clicks the Delete button for a domain.
   */
  onDelete: (id: string) => void;

  /**
   * Callback to switch to the Register New Domain form when the list is empty or requested.
   */
  onRegisterNew: () => void;
}

/**
 * Props for the ResearchDomainView orchestrator.
 */
export interface ResearchDomainViewProps {
  /**
   * Current authenticated administrative role.
   * "Manage Research Domains" is strictly visible only when role is "SecurityAdmin".
   * @default "SecurityAdmin"
   */
  userRole?: AdminRole;
}
