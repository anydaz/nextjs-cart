import { listRoles } from "@/app/services/role";

export async function GET() {
  const roles = await listRoles();
  return Response.json({ data: roles });
}
