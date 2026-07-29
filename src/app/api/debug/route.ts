import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  // Test 1: Adapter with options object (not client)
  try {
    const adapter1 = new PrismaLibSql({ url, authToken: token });
    const client1 = new PrismaClient({ adapter: adapter1 });
    const r1 = await client1.clubProfile.findFirst();
    return NextResponse.json({ method: "options_object", success: true, data: r1 });
  } catch (e1: any) {
    // Test 2: Adapter with libsql client
    try {
      const { createClient } = require("@libsql/client");
      const libsql = createClient({ url, authToken: token });
      const adapter2 = new PrismaLibSql(libsql);
      const client2 = new PrismaClient({ adapter: adapter2 });
      const r2 = await client2.clubProfile.findFirst();
      return NextResponse.json({ method: "libsql_client", success: true, data: r2 });
    } catch (e2: any) {
      return NextResponse.json({
        error1: e1.message,
        error2: e2.message,
        url_prefix: url?.substring(0, 30),
        has_token: !!token,
      });
    }
  }
}
