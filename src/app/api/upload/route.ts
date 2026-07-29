import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await requireAuth();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: "Format file tidak didukung. Gunakan: jpg, png, gif, webp, svg" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
    }

    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, name), buffer);

    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal upload" }, { status: 401 });
  }
}
