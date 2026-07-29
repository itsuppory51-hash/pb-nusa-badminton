import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL ? "SET" : "NOT SET",
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ? "SET" : "NOT SET",
    JWT_SECRET: process.env.JWT_SECRET ? "SET" : "NOT SET",
    DATABASE_URL: process.env.DATABASE_URL ? "SET" : "NOT SET",
    NODE_ENV: process.env.NODE_ENV,
  });
}
