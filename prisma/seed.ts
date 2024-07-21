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

  await prisma.product.upsert({
    where: {
      id: 1,
    },
    update: {
      name: "Product 1",
    },
    create: {
      name: "Product 1",
      price: 1000.0,
    },
  });

  await prisma.product.upsert({
    where: {
      id: 2,
    },
    update: {
      name: "Product 2",
    },
    create: {
      name: "Product 2",
      price: 2000.0,
    },
  });

  await prisma.product.upsert({
    where: {
      id: 3,
    },
    update: {
      name: "Product 3",
    },
    create: {
      name: "Product 3",
      price: 3000.0,
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
