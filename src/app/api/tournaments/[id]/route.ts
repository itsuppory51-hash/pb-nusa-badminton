import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tournament = await prisma.tournament.findUnique({ where: { id: parseInt(id) } });
  if (!tournament) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(tournament);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const data = await request.json();
    if (data.date) data.date = new Date(data.date);
    const tournament = await prisma.tournament.update({ where: { id: parseInt(id) }, data });
    return NextResponse.json(tournament);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 401 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    await prisma.tournament.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 401 });
  }
}
