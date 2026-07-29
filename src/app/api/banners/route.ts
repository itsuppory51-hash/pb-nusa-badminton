import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(banners);
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const data = await request.json();
    const banner = await prisma.banner.create({ data });
    return NextResponse.json(banner, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 401 });
  }
}
