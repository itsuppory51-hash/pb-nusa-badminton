import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

  try {
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const { PrismaClient } = await import("@prisma/client");
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: url });
    const adapter = new PrismaPg(pool);
    const client = new PrismaClient({ adapter });
    await client.$connect();
    const result = await client.clubProfile.findFirst();
    return NextResponse.json({ success: true, db_url: !!url, result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, code: e.code, db_url: !!url });
  }
}
