import { validateUser } from "@/app/input/user";
import { userResponse } from "@/app/output/user";
import { registerUser } from "@/app/services/user";
import errorHandler from "@/app/utils/error-handler";
import prisma from "@/app/utils/prisma";

export async function POST(req: Request) {
  const { name, email, password, phone_number } = await req.json();

  try {
    const roleUser = await prisma.role.findFirst({ where: { name: "user" } });
    if (!roleUser) {
      throw "Role User Not Found";
    }

    const user = validateUser({
      role_id: roleUser.id,
      name,
      email,
      password,
      phone_number,
    });

    const createdUser = await registerUser(user);

    return Response.json({
      data: userResponse(createdUser),
    });
  } catch (error) {
    return errorHandler(error);
  }
}
