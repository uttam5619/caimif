import { getPrisma } from "@/server/database/prisma";
import type {
  Gallery,
  GalleryImage,
  Prisma,
} from "../../../../prisma/generated/prisma/client";
import type {
  CreateGalleryInput,
  ListGalleriesQuery,
  ListGalleryImagesQuery,
  UpdateGalleryInput,
} from "./gallery.types";

export type GalleryWithImages = Gallery & {
  images: GalleryImage[];
};

function buildGalleryWhereClause(
  query: ListGalleriesQuery
): Prisma.GalleryWhereInput {
  if (!query.search) {
    return {};
  }
  return {
    OR: [
      { title: { contains: query.search } },
      { description: { contains: query.search } },
    ],
  };
}

function buildGalleryImageWhereClause(
  query: ListGalleryImagesQuery
): Prisma.GalleryImageWhereInput {
  const where: Prisma.GalleryImageWhereInput = {};

  if (query.galleryId !== undefined) {
    where.galleryId = query.galleryId;
  }

  if (query.search !== undefined) {
    where.description = { contains: query.search };
  }

  return where;
}

/**
 * Repository encapsulating all Prisma ORM operations for `Gallery` and `GalleryImage`.
 * Contains zero business logic or HTTP request/response handling.
 */
export const galleryRepository = {
  async findGalleriesPaginated(
    query: ListGalleriesQuery
  ): Promise<{ items: GalleryWithImages[]; total: number }> {
    const prisma = getPrisma();
    const where = buildGalleryWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        include: {
          images: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.gallery.count({ where }),
    ]);

    return { items, total };
  },

  async findGalleryById(id: string): Promise<GalleryWithImages | null> {
    const prisma = getPrisma();
    return prisma.gallery.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  async createGallery(data: CreateGalleryInput): Promise<GalleryWithImages> {
    const prisma = getPrisma();
    return prisma.gallery.create({
      data: {
        title: data.title,
        description: data.description ?? null,
      },
      include: {
        images: true,
      },
    });
  },

  async updateGallery(
    id: string,
    data: UpdateGalleryInput
  ): Promise<GalleryWithImages> {
    const prisma = getPrisma();
    return prisma.gallery.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
      },
      include: {
        images: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  async deleteGallery(id: string): Promise<Gallery> {
    const prisma = getPrisma();
    return prisma.gallery.delete({ where: { id } });
  },

  async findImagesPaginated(
    query: ListGalleryImagesQuery
  ): Promise<{ items: GalleryImage[]; total: number }> {
    const prisma = getPrisma();
    const where = buildGalleryImageWhereClause(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.galleryImage.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: query.limit,
      }),
      prisma.galleryImage.count({ where }),
    ]);

    return { items, total };
  },

  async findImageById(id: string): Promise<GalleryImage | null> {
    const prisma = getPrisma();
    return prisma.galleryImage.findUnique({ where: { id } });
  },

  async createImage(data: {
    galleryId: string;
    image: string;
    description: string | null;
  }): Promise<GalleryImage> {
    const prisma = getPrisma();
    return prisma.galleryImage.create({
      data: {
        galleryId: data.galleryId,
        image: data.image,
        description: data.description,
      },
    });
  },

  async updateImage(
    id: string,
    data: {
      galleryId?: string;
      image?: string;
      description?: string | null;
    }
  ): Promise<GalleryImage> {
    const prisma = getPrisma();
    return prisma.galleryImage.update({
      where: { id },
      data: {
        ...(data.galleryId !== undefined ? { galleryId: data.galleryId } : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
      },
    });
  },

  async deleteImage(id: string): Promise<GalleryImage> {
    const prisma = getPrisma();
    return prisma.galleryImage.delete({ where: { id } });
  },
};
