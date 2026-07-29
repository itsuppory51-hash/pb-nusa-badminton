import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const settings = await prisma.setting.findMany();
  const obj: Record<string, string> = {};
  settings.forEach((s) => { obj[s.key] = s.value; });
  return NextResponse.json(obj);
}

export async function PUT(request: Request) {
  try {
    await requireAuth();
    const data = await request.json();
    for (const [key, value] of Object.entries(data)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 401 });
  }
}
