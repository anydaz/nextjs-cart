import { listUsers } from "@/app/services/user";

export async function GET() {
  const users = await listUsers();
  return Response.json({ data: users });
}
