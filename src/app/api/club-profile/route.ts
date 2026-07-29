import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const profile = await prisma.clubProfile.findFirst();
  return NextResponse.json(profile || {});
}

export async function PUT(request: Request) {
  try {
    await requireAuth();
    const data = await request.json();
    const existing = await prisma.clubProfile.findFirst();
    const profile = existing
      ? await prisma.clubProfile.update({ where: { id: existing.id }, data })
      : await prisma.clubProfile.create({ data });
    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 401 });
  }
}
