import type { ParsedMultipartPayload } from "@/server/middlewares/multerUpload";
import { ConflictError, NotFoundError } from "@/server/utils/errors/AppError";
import {
  deleteFromS3,
  resolveS3ReadUrl,
  uploadMulterFileToS3,
} from "@/server/utils/storage/s3Storage";
import { Prisma } from "../../../../prisma/generated/prisma/client";
import { TOOL_S3_KEY_PREFIX } from "./tool.constants";
import {
  toolRepository,
  type ToolTypeWithCount,
  type ToolWithType,
} from "./tool.repository";
import type {
  CreateToolTypeInput,
  ListToolsQuery,
  ListToolTypesQuery,
  PaginatedToolsDto,
  PaginatedToolTypesDto,
  ToolDto,
  ToolTypeDto,
  UpdateToolTypeInput,
} from "./tool.types";
import {
  validateCreateToolPayload,
  validateUpdateToolPayload,
} from "./tool.validation";

/**
 * Maps a `ToolType` record with relation count into an API DTO.
 */
function toToolTypeDto(record: ToolTypeWithCount): ToolTypeDto {
  return {
    id: record.id,
    name: record.name,
    toolCount: record._count.tools,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Serializes a Prisma `Tool` entity into a DTO with resolved image URL and parent type info.
 */
async function toToolDto(record: ToolWithType): Promise<ToolDto> {
  let imageUrl: string | undefined;
  try {
    imageUrl = await resolveS3ReadUrl(record.image);
  } catch (error: unknown) {
    console.warn(
      "[ToolService] Unable to resolve S3 image URL:",
      record.id,
      error instanceof Error ? error.message : error
    );
  }

  return {
    id: record.id,
    imageKey: record.image,
    imageUrl,
    title: record.title,
    version: record.version,
    description: record.description,
    toolTypeId: record.toolTypeId,
    toolType: {
      id: record.toolType.id,
      name: record.toolType.name,
    },
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

/**
 * Service layer managing `ToolType` categories, `Tool` entities, S3 image lifecycle,
 * and referential integrity rules.
 */
export const toolService = {
  async listToolTypes(
    query: ListToolTypesQuery
  ): Promise<PaginatedToolTypesDto> {
    const { items, total } = await toolRepository.findToolTypesPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));

    return {
      items: items.map((item) => toToolTypeDto(item)),
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
      },
    };
  },

  async getToolTypeById(id: string): Promise<ToolTypeDto> {
    const record = await toolRepository.findToolTypeById(id);
    if (!record) {
      throw new NotFoundError("Tool type not found.");
    }
    return toToolTypeDto(record);
  },

  async createToolType(input: CreateToolTypeInput): Promise<ToolTypeDto> {
    const duplicate = await toolRepository.findToolTypeByName(input.name);
    if (duplicate) {
      throw new ConflictError("A tool type with this name already exists.");
    }

    try {
      const created = await toolRepository.createToolType(input);
      return toToolTypeDto(created);
    } catch (error: unknown) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictError("A tool type with this name already exists.");
      }
      throw error;
    }
  },

  async updateToolType(
    id: string,
    input: UpdateToolTypeInput
  ): Promise<ToolTypeDto> {
    const existing = await toolRepository.findToolTypeById(id);
    if (!existing) {
      throw new NotFoundError("Tool type not found.");
    }

    if (input.name && input.name !== existing.name) {
      const duplicate = await toolRepository.findToolTypeByName(input.name);
      if (duplicate && duplicate.id !== id) {
        throw new ConflictError("A tool type with this name already exists.");
      }
    }

    try {
      const updated = await toolRepository.updateToolType(id, input);
      return toToolTypeDto(updated);
    } catch (error: unknown) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictError("A tool type with this name already exists.");
      }
      throw error;
    }
  },

  /**
   * Deletes a `ToolType` only if no `Tool` records reference it (`onDelete: Restrict`).
   */
  async deleteToolType(id: string): Promise<void> {
    const existing = await toolRepository.findToolTypeById(id);
    if (!existing) {
      throw new NotFoundError("Tool type not found.");
    }

    if (existing._count.tools > 0) {
      throw new ConflictError(
        "Cannot delete a tool type that is still assigned to one or more tools."
      );
    }

    await toolRepository.deleteToolType(id);
  },

  async listTools(query: ListToolsQuery): Promise<PaginatedToolsDto> {
    const { items, total } = await toolRepository.findToolsPaginated(query);
    const totalPages = Math.max(1, Math.ceil(total / query.limit));
    const dtos = await Promise.all(items.map((item) => toToolDto(item)));

    return {
      items: dtos,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
      },
    };
  },

  async getToolById(id: string): Promise<ToolDto> {
    const record = await toolRepository.findToolById(id);
    if (!record) {
      throw new NotFoundError("Tool not found.");
    }
    return toToolDto(record);
  },

  /**
   * Validates tool input, verifies the target `ToolType` exists, uploads any image file
   * to S3 (rolling back the S3 upload on DB failure), and persists the `Tool` record.
   */
  async createTool(payload: ParsedMultipartPayload): Promise<ToolDto> {
    const validated = validateCreateToolPayload(payload);

    const toolType = await toolRepository.findToolTypeById(validated.toolTypeId);
    if (!toolType) {
      throw new NotFoundError("Tool type not found.");
    }

    let uploadedImageKey: string | null = null;
    try {
      const imageValue = validated.imageFile
        ? (uploadedImageKey = await uploadMulterFileToS3(
            validated.imageFile,
            `${TOOL_S3_KEY_PREFIX}${validated.toolTypeId}/`
          ))
        : (validated.imageKey as string);

      const created = await toolRepository.createTool({
        image: imageValue,
        title: validated.title,
        version: validated.version,
        description: validated.description,
        toolTypeId: validated.toolTypeId,
      });

      return toToolDto(created);
    } catch (error: unknown) {
      if (uploadedImageKey) {
        await deleteFromS3(uploadedImageKey);
      }
      throw error;
    }
  },

  /**
   * Partially updates an existing `Tool`, uploading any replacement image file to S3
   * and deleting the previous S3 asset only after database persistence succeeds.
   */
  async updateTool(
    id: string,
    payload: ParsedMultipartPayload
  ): Promise<ToolDto> {
    const existing = await toolRepository.findToolById(id);
    if (!existing) {
      throw new NotFoundError("Tool not found.");
    }

    const validated = validateUpdateToolPayload(payload);

    if (validated.toolTypeId && validated.toolTypeId !== existing.toolTypeId) {
      const targetType = await toolRepository.findToolTypeById(
        validated.toolTypeId
      );
      if (!targetType) {
        throw new NotFoundError("Target tool type not found.");
      }
    }

    let newlyUploadedKey: string | null = null;
    try {
      const targetTypeId = validated.toolTypeId ?? existing.toolTypeId;
      if (validated.imageFile) {
        newlyUploadedKey = await uploadMulterFileToS3(
          validated.imageFile,
          `${TOOL_S3_KEY_PREFIX}${targetTypeId}/`
        );
      }

      const replacementImage = newlyUploadedKey ?? validated.imageKey;

      const updated = await toolRepository.updateTool(id, {
        ...(replacementImage !== undefined ? { image: replacementImage } : {}),
        ...(validated.title !== undefined ? { title: validated.title } : {}),
        ...(validated.version !== undefined
          ? { version: validated.version }
          : {}),
        ...(validated.description !== undefined
          ? { description: validated.description }
          : {}),
        ...(validated.toolTypeId !== undefined
          ? { toolTypeId: validated.toolTypeId }
          : {}),
      });

      if (
        replacementImage !== undefined &&
        existing.image &&
        replacementImage !== existing.image
      ) {
        await deleteFromS3(existing.image);
      }

      return toToolDto(updated);
    } catch (error: unknown) {
      if (newlyUploadedKey) {
        await deleteFromS3(newlyUploadedKey);
      }
      throw error;
    }
  },

  /**
   * Verifies existence, deletes the `Tool` record, and cleans up its S3 image asset.
   */
  async deleteTool(id: string): Promise<void> {
    const existing = await toolRepository.findToolById(id);
    if (!existing) {
      throw new NotFoundError("Tool not found.");
    }

    await toolRepository.deleteTool(id);
    await deleteFromS3(existing.image);
  },
};
