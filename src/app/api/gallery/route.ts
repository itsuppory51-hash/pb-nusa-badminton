import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const gallery = await prisma.gallery.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(gallery);
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const data = await request.json();
    const item = await prisma.gallery.create({ data });
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 401 });
  }
}
