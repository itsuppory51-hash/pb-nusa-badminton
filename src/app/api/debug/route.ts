import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const envCheck = {
    TURSO_URL: (process.env.TURSO_DATABASE_URL || "").substring(0, 30),
    TURSO_TOKEN: process.env.TURSO_AUTH_TOKEN ? "SET" : "NOT SET",
  };

  try {
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    const { createClient } = require("@libsql/client");
    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSql(libsql);
    const client = new PrismaClient({ adapter });
    const result = await client.clubProfile.findFirst();
    return NextResponse.json({ status: "direct_connection_ok", result, env: envCheck });
  } catch (e: any) {
    return NextResponse.json({
      status: "error",
      message: e.message,
      code: e.code,
      env: envCheck,
    });
  }
}
