import type { ParsedMultipartPayload } from "@/server/middlewares/multerUpload";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@/server/utils/errors/AppError";
import {
  deleteFromS3,
  resolveS3ReadUrl,
  uploadMulterFileToS3,
} from "@/server/utils/storage/s3Storage";
import type {
  Prisma,
  ResearchDomain,
  ResearchDomainField,
} from "../../../../prisma/generated/prisma/client";
import {
  CORE_REQUIRED_SYSTEM_FIELDS,
  FIELD_TYPE_TO_PRISMA,
  PRISMA_TO_FIELD_TYPE,
} from "./researchDomain.constants";
import { researchDomainRepository } from "./researchDomain.repository";
import type {
  CreateFieldInput,
  CustomFieldValues,
  DomainFieldDto,
  ResearchDomainDto,
  UpdateFieldInput,
} from "./researchDomain.types";
import { validateMultipartDomainSubmission } from "./researchDomain.validation";

/**
 * Converts a Prisma `ResearchDomainField` record into the frontend DTO shape.
 */
function toFieldDto(record: ResearchDomainField): DomainFieldDto {
  return {
    id: record.id,
    name: record.name,
    label: record.label,
    type: PRISMA_TO_FIELD_TYPE[record.type],
    required: record.required,
    placeholder: record.placeholder ?? undefined,
    description: record.description ?? undefined,
    isSystem: record.isSystem,
    sortOrder: record.sortOrder,
  };
}

/**
 * Safely normalizes Prisma `JsonValue` into a typed custom-fields dictionary.
 */
function normalizeCustomFields(raw: Prisma.JsonValue | null): CustomFieldValues {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const result: CustomFieldValues = {};
  for (const [key, val] of Object.entries(raw)) {
    if (typeof val === "string" || typeof val === "number") {
      result[key] = val;
    }
  }
  return result;
}

/**
 * Converts a Prisma `ResearchDomain` record into the API DTO shape,
 * exposing both the persisted S3 key (`imageKey`) and a readable URL (`imageUrl`).
 */
async function toDomainDto(record: ResearchDomain): Promise<ResearchDomainDto> {
  const imageUrl = await resolveS3ReadUrl(record.image);

  return {
    id: record.id,
    title: record.title,
    shortDescription: record.shortDescription,
    description: record.description,
    imageKey: record.image ?? undefined,
    imageUrl,
    customFields: normalizeCustomFields(record.customFields),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Inspects Prisma unique-constraint errors (`P2002`) without leaking raw ORM traces.
 */
function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

/**
 * Service layer orchestrating business rules, schema invariants, Multer -> S3 uploads,
 * and repository persistence for Research Domains and their dynamic fields.
 */
export const researchDomainService = {
  /**
   * Lists active schema fields, bootstrapping the 4 core system fields on first access.
   */
  async listFields(): Promise<DomainFieldDto[]> {
    await researchDomainRepository.ensureSystemFieldsSeeded();
    const fields = await researchDomainRepository.findAllFields();
    return fields.map(toFieldDto);
  },

  /**
   * Creates a new custom schema field (`isSystem = false`) after uniqueness check.
   */
  async createField(input: CreateFieldInput): Promise<DomainFieldDto> {
    await researchDomainRepository.ensureSystemFieldsSeeded();

    const existing = await researchDomainRepository.findFieldByName(input.name);
    if (existing) {
      throw new ConflictError(
        `A field with uniqueIdentifier "${input.name}" already exists.`
      );
    }

    const sortOrder = await researchDomainRepository.getNextFieldSortOrder();
    const created = await researchDomainRepository.createField({
      name: input.name,
      label: input.label,
      type: FIELD_TYPE_TO_PRISMA[input.type],
      required: input.required,
      placeholder: input.placeholder,
      description: input.description ?? null,
      isSystem: false,
      sortOrder,
    });

    return toFieldDto(created);
  },

  /**
   * Updates an existing schema field while enforcing system-field protection rules.
   */
  async updateField(id: string, input: UpdateFieldInput): Promise<DomainFieldDto> {
    const existing = await researchDomainRepository.findFieldById(id);
    if (!existing) {
      throw new NotFoundError("Research domain field not found.");
    }

    if (existing.isSystem) {
      if (input.name && input.name !== existing.name) {
        throw new ForbiddenError(
          `Cannot rename uniqueIdentifier of system field "${existing.name}".`
        );
      }
      if (
        input.required === false &&
        CORE_REQUIRED_SYSTEM_FIELDS.has(existing.name)
      ) {
        throw new ForbiddenError(
          `System field "${existing.label}" is required by the database schema and cannot be made optional.`
        );
      }
    } else if (input.name && input.name !== existing.name) {
      const collision = await researchDomainRepository.findFieldByName(input.name);
      if (collision && collision.id !== id) {
        throw new ConflictError(
          `A field with uniqueIdentifier "${input.name}" already exists.`
        );
      }
    }

    const updated = await researchDomainRepository.updateField(id, {
      name: input.name,
      label: input.label,
      type: input.type ? FIELD_TYPE_TO_PRISMA[input.type] : undefined,
      placeholder: input.placeholder,
      required: input.required,
      description: input.description,
    });

    return toFieldDto(updated);
  },

  /**
   * Deletes a custom field. Core `isSystem` fields cannot be deleted.
   */
  async deleteField(id: string): Promise<void> {
    const existing = await researchDomainRepository.findFieldById(id);
    if (!existing) {
      throw new NotFoundError("Research domain field not found.");
    }

    if (existing.isSystem) {
      throw new ForbiddenError(
        `System field "${existing.label}" cannot be deleted.`
      );
    }

    await researchDomainRepository.deleteField(id);
  },

  /**
   * Lists all registered research domains ordered newest first.
   */
  async listDomains(): Promise<ResearchDomainDto[]> {
    const domains = await researchDomainRepository.findAllDomains();
    return Promise.all(domains.map((domain) => toDomainDto(domain)));
  },

  /**
   * Validates Multer-parsed submission against active fields, uploads images/files
   * to S3, and persists the S3 object key (`image`) and domain fields in MySQL.
   */
  async createDomain(
    multipart: ParsedMultipartPayload
  ): Promise<ResearchDomainDto> {
    const activeFields = await this.listFields();
    const validated = validateMultipartDomainSubmission(multipart, activeFields);

    const uploadedS3Keys: string[] = [];
    try {
      let imageS3Key: string | null = null;
      if (validated.imageFile) {
        imageS3Key = await uploadMulterFileToS3(validated.imageFile);
        uploadedS3Keys.push(imageS3Key);
      }

      const customFields: CustomFieldValues = { ...validated.customTextValues };
      for (const [fieldName, file] of Object.entries(validated.customFiles)) {
        const s3Key = await uploadMulterFileToS3(file);
        uploadedS3Keys.push(s3Key);
        customFields[fieldName] = s3Key;
      }

      const created = await researchDomainRepository.createDomain({
        title: validated.title,
        shortDescription: validated.shortDescription,
        description: validated.description,
        image: imageS3Key,
        customFields: customFields as Prisma.InputJsonValue,
      });

      return toDomainDto(created);
    } catch (error: unknown) {
      // Roll back S3 uploads if MySQL insertion fails (e.g. duplicate title)
      await Promise.all(uploadedS3Keys.map((key) => deleteFromS3(key)));

      if (isUniqueConstraintError(error)) {
        throw new ConflictError(
          `A research domain titled "${validated.title}" already exists.`
        );
      }
      throw error;
    }
  },

  /**
   * Updates an existing research domain, uploading replacement images to S3,
   * storing the new S3 key in MySQL, and deleting replaced S3 objects.
   */
  async updateDomain(
    id: string,
    multipart: ParsedMultipartPayload
  ): Promise<ResearchDomainDto> {
    const existing = await researchDomainRepository.findDomainById(id);
    if (!existing) {
      throw new NotFoundError("Research domain not found.");
    }

    const activeFields = await this.listFields();
    const existingCustomFields = normalizeCustomFields(existing.customFields);

    const validated = validateMultipartDomainSubmission(multipart, activeFields, {
      isUpdate: true,
      existingCustomFields,
      hasExistingImage: Boolean(existing.image),
    });

    const newlyUploadedKeys: string[] = [];
    const keysToCleanupAfterSave: string[] = [];

    try {
      let nextImageKey: string | null | undefined = undefined;
      if (validated.imageFile) {
        const s3Key = await uploadMulterFileToS3(validated.imageFile);
        newlyUploadedKeys.push(s3Key);
        nextImageKey = s3Key;
        if (existing.image) {
          keysToCleanupAfterSave.push(existing.image);
        }
      } else if (validated.removeImage) {
        nextImageKey = null;
        if (existing.image) {
          keysToCleanupAfterSave.push(existing.image);
        }
      }

      const nextCustomFields: CustomFieldValues = { ...validated.customTextValues };
      for (const [fieldName, file] of Object.entries(validated.customFiles)) {
        const s3Key = await uploadMulterFileToS3(file);
        newlyUploadedKeys.push(s3Key);
        const previousVal = existingCustomFields[fieldName];
        if (typeof previousVal === "string") {
          keysToCleanupAfterSave.push(previousVal);
        }
        nextCustomFields[fieldName] = s3Key;
      }

      const updated = await researchDomainRepository.updateDomain(id, {
        title: validated.title,
        shortDescription: validated.shortDescription,
        description: validated.description,
        ...(nextImageKey !== undefined ? { image: nextImageKey } : {}),
        customFields: nextCustomFields as Prisma.InputJsonValue,
      });

      // Only remove replaced S3 objects after the database update succeeds
      await Promise.all(keysToCleanupAfterSave.map((key) => deleteFromS3(key)));

      return toDomainDto(updated);
    } catch (error: unknown) {
      await Promise.all(newlyUploadedKeys.map((key) => deleteFromS3(key)));

      if (isUniqueConstraintError(error)) {
        throw new ConflictError(
          `A research domain titled "${validated.title}" already exists.`
        );
      }
      throw error;
    }
  },

  /**
   * Deletes a research domain and cleans up its S3 objects.
   */
  async deleteDomain(id: string): Promise<void> {
    const existing = await researchDomainRepository.findDomainById(id);
    if (!existing) {
      throw new NotFoundError("Research domain not found.");
    }

    await researchDomainRepository.deleteDomain(id);

    const customFields = normalizeCustomFields(existing.customFields);
    const cleanupKeys: Array<string | null | undefined> = [existing.image];
    for (const value of Object.values(customFields)) {
      if (typeof value === "string") {
        cleanupKeys.push(value);
      }
    }

    await Promise.all(cleanupKeys.map((key) => deleteFromS3(key)));
  },
};
