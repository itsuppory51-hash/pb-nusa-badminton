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
      return NextResponse.json({ error: "Format file tidak didukung" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
    }

    // Try Cloudinary in production
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        const cloudinary = require("cloudinary").v2;
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "nusa-badminton", resource_type: "image" },
            (err: any, result: any) => (err ? reject(err) : resolve(result))
          ).end(buffer);
        });
        return NextResponse.json({ url: (result as any).secure_url });
      } catch (e: any) {
        return NextResponse.json({ error: "Gagal upload ke Cloudinary: " + e.message }, { status: 500 });
      }
    }

    // Fallback: save to /tmp on Vercel, or public/uploads locally
    try {
      const isVercel = process.env.VERCEL === "1";
      const dir = isVercel ? "/tmp/uploads" : path.join(process.cwd(), "public", "uploads");
      await mkdir(dir, { recursive: true });
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(dir, name), buffer);
      const url = isVercel ? `/api/files/${name}` : `/uploads/${name}`;
      return NextResponse.json({ url, _warning: "File disimpan sementara. Untuk production, gunakan Cloudinary." });
    } catch {
      return NextResponse.json({ error: "Gagal menyimpan file. Gunakan URL gambar langsung" }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal upload" }, { status: 401 });
  }
}
