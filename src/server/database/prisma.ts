import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../../prisma/generated/prisma/client";

/**
 * Global cache prevents creating redundant MariaDB connection pools
 * during Next.js hot module reloads in development.
 */
const globalForPrisma = globalThis as unknown as {
  prismaClient?: PrismaClient;
};

/**
 * Validates that DATABASE_URL is configured for MySQL/MariaDB before opening a pool.
 */
function resolveDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not configured.");
  }

  if (!databaseUrl.startsWith("mysql://") && !databaseUrl.startsWith("mariadb://")) {
    throw new Error(
      "DATABASE_URL must use a mysql:// or mariadb:// connection string for PrismaMariaDb."
    );
  }

  return databaseUrl;
}

/**
 * Returns the singleton PrismaClient instance backed by the MariaDB driver adapter.
 * Instantiated lazily so Next.js build-time route analysis does not require a live DB.
 */
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prismaClient) {
    const adapter = new PrismaMariaDb(resolveDatabaseUrl());
    globalForPrisma.prismaClient = new PrismaClient({ adapter });
  }

  return globalForPrisma.prismaClient;
}
