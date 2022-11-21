import { PrismaClient } from "@prisma/client";
import { links } from "../data/links";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.create({
    data: {
      email: "bensiu123@gmail.com",
      role: "ADMIN",
    },
  });

  await prisma.link.createMany({
    data: links,
  });
};

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
