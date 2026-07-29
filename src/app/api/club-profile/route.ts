import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await prisma.clubProfile.findFirst();
    return NextResponse.json(profile || {}, {
      headers: { "Cache-Control": "no-store, must-revalidate" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth();
    const data = await request.json();
    const existing = await prisma.clubProfile.findFirst();
    let profile;
    if (existing) {
      profile = await prisma.clubProfile.update({ where: { id: existing.id }, data });
    } else {
      profile = await prisma.clubProfile.create({ data });
    }
    return NextResponse.json(profile, {
      headers: { "Cache-Control": "no-store, must-revalidate" },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan" }, { status: 401 });
  }
}
