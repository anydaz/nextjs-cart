// Next.js Route Handlers (App Router)
import { getSession } from "@/app/services/auth";

export async function GET() {
  const session = await getSession();
  return Response.json({ data: session });
}
