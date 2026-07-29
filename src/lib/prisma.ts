import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const url = process.env.TURSO_DATABASE_URL; // Only use Turso URL, not DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    return new Proxy({} as any, {
      get: () => async () => [],
    }) as PrismaClient;
  }

  if (url.startsWith("libsql://") || url.startsWith("http")) {
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    const { createClient } = require("@libsql/client");
    const libsql = createClient({ url, authToken });
    const adapter = new PrismaLibSql(libsql);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  } else {
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    const adapter = new PrismaLibSql({ url });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.prisma!;
}

export function getPrisma() {
  return getPrismaClient();
}

export const prisma = new Proxy({} as any, {
  get(_target, prop) {
    const client = getPrismaClient();
    return (client as any)[prop];
  },
}) as PrismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = getPrismaClient();
}
