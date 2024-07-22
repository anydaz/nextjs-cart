import { CartItem, TemporaryCartItem } from "@prisma/client";
import prisma from "../utils/prisma";
import { getGuestSession, getSession } from "./auth";

type TemporaryCartItemParam = Pick<
  CartItem,
  "product_id" | "user_id" | "quantity"
>;
export const addToGuestCart = async ({
  product_id,
  quantity,
}: TemporaryCartItemParam) => {
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

export const destroyGuestCart = async () => {
  const session = await getGuestSession();
  return await prisma.temporaryCartItem.deleteMany({
    where: {
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

type CartItemParam = Pick<CartItem, "product_id" | "user_id" | "quantity">;
export const bulkAddCart = async (data: CartItemParam[]) => {
  await prisma.cartItem.createMany({
    data: data,
  });
};

export const listItemOnCart = async () => {
  const session = await getSession();

  return await prisma.cartItem.findMany({
    where: {
      user_id: session.user.id,
    },
  });
};
