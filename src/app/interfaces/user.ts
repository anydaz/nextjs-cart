import { Role, User } from "@prisma/client";

export interface UserWithRoles extends User {
  role?: Role;
}
