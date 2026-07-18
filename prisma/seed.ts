import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@sharanyapropertieshub.com",
    },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@sharanyapropertieshub.com",
      passwordHash,
      role: Role.ADMIN,
      permissions: [],
    },
  });

  console.log("✅ Admin user created");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
