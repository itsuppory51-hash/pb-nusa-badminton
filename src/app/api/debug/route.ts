import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  const results: any = {};

  // Test 1: adapter with just url string (local sqlite mode)
  try {
    const { PrismaLibSql } = await import("@prisma/adapter-libsql");
    const { PrismaClient } = await import("@prisma/client");
    const adapter = new PrismaLibSql({ url: "file:./dev.db" });
    const client = new PrismaClient({ adapter });
    await client.$connect();
    results.local_sqlite = "connected";
    await client.$disconnect();
  } catch (e: any) {
    results.local_sqlite = "error: " + e.message?.substring(0, 80);
  }

  // Test 2: adapter with libsql:// url as options
  try {
    const { PrismaLibSql } = await import("@prisma/adapter-libsql");
    const { PrismaClient } = await import("@prisma/client");
    const adapter = new PrismaLibSql({ url, authToken: token });
    const client = new PrismaClient({ adapter });
    await client.$connect();
    results.turso_options = "connected";
    const r = await client.clubProfile.findFirst();
    results.turso_data = r;
    await client.$disconnect();
  } catch (e: any) {
    results.turso_options = "error: " + e.message?.substring(0, 120);
  }

  // Test 3: adapter with libsql client
  try {
    const { PrismaLibSql } = await import("@prisma/adapter-libsql");
    const { PrismaClient } = await import("@prisma/client");
    const { createClient } = await import("@libsql/client");
    const libsql = createClient({ url, authToken: token });
    const adapter = new PrismaLibSql(libsql);
    const client = new PrismaClient({ adapter });
    await client.$connect();
    results.turso_client = "connected";
    const r = await client.clubProfile.findFirst();
    results.turso_client_data = r;
    await client.$disconnect();
  } catch (e: any) {
    results.turso_client = "error: " + e.message?.substring(0, 120);
  }

  results.env = { url: url?.substring(0, 30), has_token: !!token };

  return NextResponse.json(results);
}
