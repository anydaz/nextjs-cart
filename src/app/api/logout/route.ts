// Next.js Route Handlers (App Router)
import { logout } from "@/app/services/auth";

export async function POST() {
  const session = await logout();
  return Response.json({ data: session });
}
