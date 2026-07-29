import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: any = {
    cloudinary_env: {
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
    },
    database: null,
  };

  // Test database
  try {
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const { PrismaClient } = await import("@prisma/client");
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const client = new PrismaClient({ adapter });
    await client.$connect();
    const result = await client.clubProfile.findFirst();
    checks.database = { ok: true, hasData: !!result };
    await client.$disconnect();
  } catch (e: any) {
    checks.database = { ok: false, error: e.message };
  }

  // Test Cloudinary
  try {
    const cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const result = await cloudinary.api.ping();
    checks.cloudinary = { ok: true, ping: result };
  } catch (e: any) {
    checks.cloudinary = { ok: false, error: e.message };
  }

  return NextResponse.json(checks);
}
