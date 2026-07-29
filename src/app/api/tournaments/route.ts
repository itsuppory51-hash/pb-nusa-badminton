import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const tournaments = await prisma.tournament.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(tournaments);
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const data = await request.json();
    data.date = new Date(data.date);
    const tournament = await prisma.tournament.create({ data });
    return NextResponse.json(tournament, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 401 });
  }
}
