import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const tursoUrl = process.env.TURSO_DATABASE_URL || "";
  return NextResponse.json({
    TURSO_DATABASE_URL: tursoUrl ? tursoUrl.substring(0, 20) + "..." : "NOT SET",
    DATABASE_URL: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + "..." : "NOT SET",
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ? "SET (" + process.env.TURSO_AUTH_TOKEN.substring(0, 10) + "...)" : "NOT SET",
    JWT_SECRET: process.env.JWT_SECRET ? "SET" : "NOT SET",
    FULL_TURSO_URL: tursoUrl,
  });
}
