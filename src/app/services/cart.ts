import prisma from "../utils/prisma";
import { getGuestSession } from "./auth";

export const addToGuestCart = async ({
  product_id,
  quantity,
}: {
  product_id: number;
  quantity: number;
}) => {
  const session = await getGuestSession();

  return await prisma.temporaryCartItem.upsert({
    where: {
      session_id_product_id_key: {
        product_id: product_id,
        session_id: session.id,
      },
    },
    update: {
      quantity: quantity,
    },
    create: {
      product_id: product_id,
      quantity: quantity,
      session_id: session.id,
    },
  });
};

export const listItemOnGuestCart = async () => {
  const session = await getGuestSession();

  return await prisma.temporaryCartItem.findMany({
    where: {
      session_id: session.id,
    },
  });
};
