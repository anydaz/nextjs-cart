import { Prisma, User } from "@prisma/client";
import { UserWithRoles } from "../interfaces/user";

export const listUsersResponse = (users: UserWithRoles[]) => {
  return users.map((user) => {
    return userResponse(user);
  });
};

export const userResponse = (user: UserWithRoles) => {
  const { password, ...rest } = user;

  return rest;
};
