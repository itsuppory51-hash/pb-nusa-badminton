import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const dir = process.env.VERCEL === "1" ? "/tmp/uploads" : path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(dir, name);

  // Security: prevent directory traversal
  if (name.includes("..") || name.includes("/")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const buffer = await readFile(filePath);
    const ext = path.extname(name).toLowerCase();
    const mime: Record<string, string> = {
      ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
      ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
    };
    return new NextResponse(buffer, {
      headers: { "Content-Type": mime[ext] || "application/octet-stream" },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
