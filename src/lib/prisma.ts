import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? (() => {
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) return createDummyClient();

  if (url.startsWith("libsql://") || url.startsWith("http")) {
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    const { createClient } = require("@libsql/client");
    const libsql = createClient({ url, authToken });
    const adapter = new PrismaLibSql(libsql);
    return new PrismaClient({ adapter });
  }

  const { PrismaLibSql } = require("@prisma/adapter-libsql");
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({ adapter });
})();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma as PrismaClient;
}

function createDummyClient() {
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === "then" || prop === "catch" || prop === "finally") return undefined;
      return async () => [];
    },
  };
  return new Proxy({}, handler) as PrismaClient;
}
