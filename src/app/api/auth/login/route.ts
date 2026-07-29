import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password diperlukan" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
    }

    const hashed = await hashPassword(password);
    if (hashed !== admin.password) {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
    }

    await setAuth(username);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
