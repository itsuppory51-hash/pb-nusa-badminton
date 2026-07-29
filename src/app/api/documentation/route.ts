import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const docs = await prisma.documentation.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(docs);
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const data = await request.json();
    data.date = new Date(data.date);
    const doc = await prisma.documentation.create({ data });
    return NextResponse.json(doc, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 401 });
  }
}
