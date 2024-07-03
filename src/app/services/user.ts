import { User } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { ErrorObj } from "@/app/utils/error-handler";
import prisma, { isActiveRecord } from "@/app/utils/prisma";

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

export const createUser = async (
  user: Pick<User, "role_id" | "name" | "email" | "password" | "phone_number">
) => {
  // hash password
  const salt = genSaltSync(10);
  const hash = hashSync(user.password, salt);
  user.password = hash;

  return await prisma.user.create({
    data: user,
  });
};
