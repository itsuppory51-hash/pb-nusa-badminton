import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const schedules = await prisma.schedule.findMany({ orderBy: [{ dayOfWeek: "asc" }, { time: "asc" }] });
  return NextResponse.json(schedules);
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const data = await request.json();
    const schedule = await prisma.schedule.create({ data });
    return NextResponse.json(schedule, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 401 });
  }
}
