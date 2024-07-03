import { User } from "@prisma/client";
import { z } from "zod";

export const validateUser = ({
  name,
  role_id,
  email,
  password,
  phone_number,
}: Pick<User, "role_id" | "name" | "email" | "password" | "phone_number">) => {
  const user = z.object({
    role_id: z.number(),
    name: z.string().min(3),
    email: z.string().email().min(5),
    password: z.string().min(4).max(16),
    phone_number: z.string().min(8),
  });
  return user.parse({ role_id, name, email, password, phone_number });
};
