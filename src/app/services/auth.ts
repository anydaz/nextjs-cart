import prisma, { isActiveRecord } from "@/app/utils/prisma";
import { getIronSession } from "iron-session";
import { env } from "process";
import { cookies } from "next/headers";
import { compareSync } from "bcrypt-ts";
import { ErrorObj } from "../utils/error-handler";
import { userResponse } from "../output/user";
import { UserWithRoles } from "../interfaces/user";

export interface SessionValue {
  user: Omit<UserWithRoles, "password">;
}

export const getSession = async () => {
  return await getIronSession<SessionValue>(cookies(), {
    password: env.IRON_SESSION_PASSWORD!,
    cookieName: env.IRON_SESSION_COOKIE_NAME!,
  });
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const session = await getIronSession<SessionValue>(cookies(), {
    password: env.IRON_SESSION_PASSWORD!,
    cookieName: env.IRON_SESSION_COOKIE_NAME!,
    ttl: 60 * 60 + 60,
    cookieOptions: {
      httpOnly: true,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      ...isActiveRecord,
      email: email,
    },
    include: {
      role: true,
    },
  });

  if (!user) throw ErrorObj.USER_NOT_FOUND;

  const valid = compareSync(password, user.password);
  if (!valid) throw ErrorObj.INCORRECT_PASSWORD;

  const a = userResponse(user);
  session.user = a;
  await session.save();
  return user;
};
