import { getPrisma } from "@/server/database/prisma";
import type {
  Prisma,
  ResearchDomain,
  ResearchDomainField,
  ResearchDomainFieldType,
} from "../../../../prisma/generated/prisma/client";
import { DEFAULT_SYSTEM_FIELD_SEEDS } from "./researchDomain.constants";

/**
 * Repository encapsulating all Prisma ORM queries for `ResearchDomain`
 * and `ResearchDomainField`. Contains zero business logic or HTTP concerns.
 */
export const researchDomainRepository = {
  /**
   * Ensures the 4 core system fields exist if the schema table is empty.
   */
  async ensureSystemFieldsSeeded(): Promise<void> {
    const prisma = getPrisma();
    const count = await prisma.researchDomainField.count();
    if (count > 0) return;

    await prisma.researchDomainField.createMany({
      data: [...DEFAULT_SYSTEM_FIELD_SEEDS],
      skipDuplicates: true,
    });
  },

  async findAllFields(): Promise<ResearchDomainField[]> {
    const prisma = getPrisma();
    return prisma.researchDomainField.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  },

  async findFieldById(id: string): Promise<ResearchDomainField | null> {
    const prisma = getPrisma();
    return prisma.researchDomainField.findUnique({ where: { id } });
  },

  async findFieldByName(name: string): Promise<ResearchDomainField | null> {
    const prisma = getPrisma();
    return prisma.researchDomainField.findUnique({ where: { name } });
  },

  async getNextFieldSortOrder(): Promise<number> {
    const prisma = getPrisma();
    const last = await prisma.researchDomainField.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    return (last?.sortOrder ?? -1) + 1;
  },

  async createField(data: {
    name: string;
    label: string;
    type: ResearchDomainFieldType;
    required: boolean;
    placeholder?: string | null;
    description?: string | null;
    isSystem: boolean;
    sortOrder: number;
  }): Promise<ResearchDomainField> {
    const prisma = getPrisma();
    return prisma.researchDomainField.create({ data });
  },

  async updateField(
    id: string,
    data: Prisma.ResearchDomainFieldUpdateInput
  ): Promise<ResearchDomainField> {
    const prisma = getPrisma();
    return prisma.researchDomainField.update({ where: { id }, data });
  },

  async deleteField(id: string): Promise<ResearchDomainField> {
    const prisma = getPrisma();
    return prisma.researchDomainField.delete({ where: { id } });
  },

  async findAllDomains(): Promise<ResearchDomain[]> {
    const prisma = getPrisma();
    return prisma.researchDomain.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async findDomainById(id: string): Promise<ResearchDomain | null> {
    const prisma = getPrisma();
    return prisma.researchDomain.findUnique({ where: { id } });
  },

  async createDomain(data: {
    title: string;
    shortDescription: string;
    description: string;
    image?: string | null;
    customFields?: Prisma.InputJsonValue;
  }): Promise<ResearchDomain> {
    const prisma = getPrisma();
    return prisma.researchDomain.create({ data });
  },

  async updateDomain(
    id: string,
    data: Prisma.ResearchDomainUpdateInput
  ): Promise<ResearchDomain> {
    const prisma = getPrisma();
    return prisma.researchDomain.update({ where: { id }, data });
  },

  async deleteDomain(id: string): Promise<ResearchDomain> {
    const prisma = getPrisma();
    return prisma.researchDomain.delete({ where: { id } });
  },
};
