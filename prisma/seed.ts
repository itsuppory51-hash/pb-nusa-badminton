import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { createHash } from "crypto";

const url = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!url) { console.error("DATABASE_URL not set"); process.exit(1); }

const pool = new Pool({ connectionString: url });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const secret = process.env.JWT_SECRET || "nusa-badminton-jwt-secret-2026";
  const password = createHash("sha256").update("admin123" + secret).digest("hex");

  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", password },
  });

  console.log("Admin user created: admin / admin123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
