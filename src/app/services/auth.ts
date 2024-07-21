import prisma, { isActiveRecord } from "@/app/utils/prisma";
import { getIronSession } from "iron-session";
import { env } from "process";
import { cookies } from "next/headers";
import { compareSync } from "bcrypt-ts";
import { ErrorObj } from "../utils/error-handler";
import { userResponse } from "../output/user";
import { UserWithRoles } from "../interfaces/user";
import { isEmpty } from "lodash";
import { v4 as uuidv4 } from "uuid";

const GUEST_SESSION = "GuestSession";

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
  await destroyGuestSession();
  return user;
};

export const logout = async () => {
  const session = await getIronSession<any>(cookies(), {
    password: env.IRON_SESSION_PASSWORD!,
    cookieName: env.IRON_SESSION_COOKIE_NAME!,
  });
  await session.destroy();
  return session;
};

export const getGuestSession = async () => {
  return await getIronSession<{ id: string }>(cookies(), {
    password: env.IRON_SESSION_PASSWORD!,
    cookieName: GUEST_SESSION,
  });
};

export const setGuestSession = async () => {
  const guestSession = await getIronSession<{ id: string }>(cookies(), {
    password: env.IRON_SESSION_PASSWORD!,
    cookieName: GUEST_SESSION,
    cookieOptions: {
      httpOnly: true,
    },
  });

  if (isEmpty(guestSession)) {
    guestSession.id = uuidv4();
  }

  await guestSession.save();
  return guestSession;
};

const destroyGuestSession = async () => {
  const session = await getIronSession<any>(cookies(), {
    password: env.IRON_SESSION_PASSWORD!,
    cookieName: GUEST_SESSION,
  });
  await session.destroy();
  return session;
};
