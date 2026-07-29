import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createHash } from "crypto";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const secret = process.env.JWT_SECRET || "nusa-badminton-secret-key-2026";
  const password = createHash("sha256").update("admin123" + secret).digest("hex");

  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", password },
  });

  console.log("Admin user created: admin / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
