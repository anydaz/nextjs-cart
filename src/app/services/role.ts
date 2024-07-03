import prisma from "../utils/prisma";

export const listRoles = async () => {
  return await prisma.role.findMany();
};
