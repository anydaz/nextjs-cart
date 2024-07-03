import { validateUser } from "@/app/input/user";
import { userResponse } from "@/app/output/user";
import { createUser, listUsers } from "@/app/services/user";
import errorHandler from "@/app/utils/error-handler";

export async function GET() {
  const users = await listUsers();
  return Response.json({ data: users });
}

export async function POST(req: Request) {
  const { role_id, name, email, password, phone_number } = await req.json();

  try {
    const user = validateUser({ role_id, name, email, password, phone_number });

    const createdUser = await createUser(user);

    return Response.json({
      data: userResponse(createdUser),
    });
  } catch (error) {
    return errorHandler(error);
  }
}
