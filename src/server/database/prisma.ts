import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { Prisma, PrismaClient } from "../../../prisma/generated/prisma/client";

/**
 * Global cache prevents creating redundant MariaDB connection pools
 * during Next.js hot module reloads in development.
 */
const globalForPrisma = globalThis as unknown as {
  caimifPrismaClient?: PrismaClient;
  caimifPrismaSchemaSignature?: string;
};

/**
 * Checks whether a cached PrismaClient instance still exposes delegates for all
 * currently generated Prisma models (e.g., after `prisma generate` adds a model).
 */
function hasExpectedModelDelegates(client: PrismaClient): boolean {
  const clientRecord = client as unknown as Record<string, unknown>;
  for (const modelName of Object.values(Prisma.ModelName)) {
    const delegateKey = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    if (typeof clientRecord[delegateKey] !== "object" || clientRecord[delegateKey] === null) {
      return false;
    }
  }
  return true;
}

/**
 * Validates that DATABASE_URL is configured for MySQL/MariaDB and ensures
 * connection options required by MySQL 8 (`caching_sha2_password` on non-TLS
 * connections and a sensible handshake timeout) are present.
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

  const parsed = new URL(databaseUrl);

  // MySQL 8 defaults to caching_sha2_password; without TLS or an explicit RSA key path,
  // mariadb@3 rejects cold-cache handshakes unless allowPublicKeyRetrieval=true is enabled.
  if (
    !parsed.searchParams.has("allowPublicKeyRetrieval") &&
    !parsed.searchParams.has("cachingRsaPublicKey") &&
    !parsed.searchParams.has("ssl")
  ) {
    parsed.searchParams.set("allowPublicKeyRetrieval", "true");
  }

  // Raise mariadb's 1000ms default connectTimeout so cold starts / concurrent queries don't flake.
  if (!parsed.searchParams.has("connectTimeout")) {
    parsed.searchParams.set("connectTimeout", "10000");
  }

  return parsed.toString();
}

/**
 * Builds a schema signature including both model names and scalar field lists
 * so `prisma generate` field edits also invalidate the global dev client cache.
 */
function buildPrismaSchemaSignature(databaseUrl: string): string {
  const prismaNamespace = Prisma as unknown as Record<string, unknown>;
  const modelParts = Object.keys(Prisma.ModelName)
    .sort()
    .map((modelName) => {
      const enumKey = `${modelName}ScalarFieldEnum`;
      const fieldEnum = prismaNamespace[enumKey];
      const fields =
        fieldEnum && typeof fieldEnum === "object"
          ? Object.keys(fieldEnum as Record<string, unknown>).sort().join(".")
          : "";
      return `${modelName}:${fields}`;
    });

  return `${modelParts.join(",")}|${databaseUrl}`;
}

/**
 * Returns the singleton PrismaClient instance backed by the MariaDB driver adapter.
 * Instantiated lazily so Next.js build-time route analysis does not require a live DB.
 */
export function getPrisma(): PrismaClient {
  const databaseUrl = resolveDatabaseUrl();
  const schemaSignature = buildPrismaSchemaSignature(databaseUrl);

  const cached = globalForPrisma.caimifPrismaClient;
  const isStale =
    !cached ||
    globalForPrisma.caimifPrismaSchemaSignature !== schemaSignature ||
    !hasExpectedModelDelegates(cached);

  if (isStale) {
    if (cached) {
      void cached.$disconnect().catch(() => undefined);
    }
    const adapter = new PrismaMariaDb(databaseUrl);
    globalForPrisma.caimifPrismaClient = new PrismaClient({ adapter });
    globalForPrisma.caimifPrismaSchemaSignature = schemaSignature;
  }

  return globalForPrisma.caimifPrismaClient!;
}
