import { setGuestSession } from "@/app/services/auth";

export async function POST() {
  const session = await setGuestSession();
  return Response.json({ data: session });
}
