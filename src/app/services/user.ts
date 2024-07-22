import { User } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { ErrorObj } from "@/app/utils/error-handler";
import prisma, { isActiveRecord } from "@/app/utils/prisma";
import { bulkAddCart, destroyGuestCart, listItemOnGuestCart } from "./cart";

export const listUsers = async () => {
  return await prisma.user.findMany({
    include: {
      role: true,
    },
    where: {
      ...isActiveRecord,
    },
  });
};

export const getUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      ...isActiveRecord,
      id: id,
    },
  });

  if (!user) throw ErrorObj.NOT_FOUND;
  return user;
};

export const deleteUser = async (id: number) => {
  const user = await prisma.user.update({
    where: {
      ...isActiveRecord,
      id: id,
    },
    data: {
      deleted_at: new Date(),
    },
  });

  if (!user) throw ErrorObj.NOT_FOUND;
  return user;
};

type UserParams = Pick<
  User,
  "role_id" | "name" | "email" | "password" | "phone_number"
>;
export const createUser = async (user: UserParams) => {
  // hash password
  const salt = genSaltSync(10);
  const hash = hashSync(user.password, salt);
  user.password = hash;

  return await prisma.user.create({
    data: user,
  });
};

export const registerUser = async (user: UserParams) => {
  const newUser = await createUser(user);

  // migrate cart from guest cart to regular cart
  const guestCart = await listItemOnGuestCart();
  if (guestCart.length > 0) {
    const data = guestCart.map((cart) => {
      return {
        product_id: cart.product_id,
        quantity: cart.quantity,
        user_id: newUser.id,
      };
    });
    bulkAddCart(data);
    destroyGuestCart();
  }

  return newUser;
};
