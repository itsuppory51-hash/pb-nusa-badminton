import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const contents = await prisma.content.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(contents);
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const data = await request.json();
    const content = await prisma.content.create({ data });
    return NextResponse.json(content, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 401 });
  }
}
