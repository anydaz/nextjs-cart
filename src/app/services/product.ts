import prisma, { isActiveRecord } from "@/app/utils/prisma";

export const listProducts = async () => {
  return await prisma.product.findMany({
    where: {
      ...isActiveRecord,
    },
  });
};
