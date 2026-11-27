import { getPrisma } from "@/server/database/prisma";
import type {
  Prisma,
  Tool,
  ToolType,
} from "../../../../prisma/generated/prisma/client";
import type {
  CreateToolTypeInput,
  ListToolsQuery,
  ListToolTypesQuery,
  UpdateToolTypeInput,
} from "./tool.types";

export type ToolTypeWithCount = ToolType & {
  _count: {
    tools: number;
  };
};

export type ToolWithType = Tool & {
  toolType: {
    id: string;
    name: string;
  };
};

function buildToolTypeWhereClause(
  query: ListToolTypesQuery
): Prisma.ToolTypeWhereInput {
  if (!query.search) {
    return {};
  }
  return {
    name: { contains: query.search },
  };
}

function buildToolWhereClause(query: ListToolsQuery): Prisma.ToolWhereInput {
  const where: Prisma.ToolWhereInput = {};

  if (query.toolTypeId !== undefined) {
    where.toolTypeId = query.toolTypeId;
  }

  if (query.search !== undefined) {
    where.OR = [
      { title: { contains: query.search } },
      { version: { contains: query.search } },
      { description: { contains: query.search } },
      { toolType: { name: { contains: query.search } } },
    ];
  }

  return where;
}

/**
 * Repository encapsulating all Prisma ORM queries for `ToolType` and `Tool`.
 * Contains zero business logic or HTTP request/response concerns.
 */
export const toolRepository = {
  async findToolTypesPaginated(
    query: ListToolTypesQuery
  ): Promise<{ items: ToolTypeWithCount[]; total: number }> {
    const prisma = getPrisma();
    const where = buildToolTypeWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.toolType.findMany({
        where,
        include: {
          _count: { select: { tools: true } },
        },
        orderBy: [{ name: "asc" }],
        skip,
        take: query.limit,
      }),
      prisma.toolType.count({ where }),
    ]);

    return { items, total };
  },

  async findToolTypeById(id: string): Promise<ToolTypeWithCount | null> {
    const prisma = getPrisma();
    return prisma.toolType.findUnique({
      where: { id },
      include: {
        _count: { select: { tools: true } },
      },
    });
  },

  async findToolTypeByName(name: string): Promise<ToolType | null> {
    const prisma = getPrisma();
    return prisma.toolType.findUnique({
      where: { name },
    });
  },

  async createToolType(data: CreateToolTypeInput): Promise<ToolTypeWithCount> {
    const prisma = getPrisma();
    return prisma.toolType.create({
      data: {
        name: data.name,
      },
      include: {
        _count: { select: { tools: true } },
      },
    });
  },

  async updateToolType(
    id: string,
    data: UpdateToolTypeInput
  ): Promise<ToolTypeWithCount> {
    const prisma = getPrisma();
    return prisma.toolType.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
      },
      include: {
        _count: { select: { tools: true } },
      },
    });
  },

  async deleteToolType(id: string): Promise<ToolType> {
    const prisma = getPrisma();
    return prisma.toolType.delete({ where: { id } });
  },

  async findToolsPaginated(
    query: ListToolsQuery
  ): Promise<{ items: ToolWithType[]; total: number }> {
    const prisma = getPrisma();
    const where = buildToolWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.tool.findMany({
        where,
        include: {
          toolType: {
            select: { id: true, name: true },
          },
        },
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.tool.count({ where }),
    ]);

    return { items, total };
  },

  async findToolById(id: string): Promise<ToolWithType | null> {
    const prisma = getPrisma();
    return prisma.tool.findUnique({
      where: { id },
      include: {
        toolType: {
          select: { id: true, name: true },
        },
      },
    });
  },

  async createTool(data: {
    image: string;
    title: string;
    version: string;
    description: string;
    toolTypeId: string;
  }): Promise<ToolWithType> {
    const prisma = getPrisma();
    return prisma.tool.create({
      data,
      include: {
        toolType: {
          select: { id: true, name: true },
        },
      },
    });
  },

  async updateTool(
    id: string,
    data: {
      image?: string;
      title?: string;
      version?: string;
      description?: string;
      toolTypeId?: string;
    }
  ): Promise<ToolWithType> {
    const prisma = getPrisma();
    return prisma.tool.update({
      where: { id },
      data,
      include: {
        toolType: {
          select: { id: true, name: true },
        },
      },
    });
  },

  async deleteTool(id: string): Promise<Tool> {
    const prisma = getPrisma();
    return prisma.tool.delete({ where: { id } });
  },
};
