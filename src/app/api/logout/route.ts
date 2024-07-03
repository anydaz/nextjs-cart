// Next.js Route Handlers (App Router)
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { env } from "process";

export async function POST() {
  const session = await getIronSession<any>(cookies(), {
    password: env.IRON_SESSION_PASSWORD!,
    cookieName: env.IRON_SESSION_COOKIE_NAME!,
  });
  await session.destroy();
  return Response.json({ data: {} });
}
