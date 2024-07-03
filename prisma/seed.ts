import { PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt-ts";

const prisma = new PrismaClient();
async function main() {
  // Seed Roles
  await prisma.role.createMany({
    data: [{ name: "admin" }, { name: "user" }],
    skipDuplicates: true,
  });

  // Seed Users
  const salt = genSaltSync(10);
  const hash = hashSync("1234", salt);

  await prisma.user.upsert({
    where: {
      email: "andy@example.com",
    },
    update: {
      name: "Andy",
    },
    create: {
      email: "andy@example.com",
      password: hash,
      name: "Andy",
      phone_number: "081213141516",
      role_id: 1,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
