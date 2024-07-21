// Next.js Route Handlers (App Router)
import { userResponse } from "@/app/output/user";
import { login } from "@/app/services/auth";
import errorHandler from "@/app/utils/error-handler";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const user = await login({ email, password });
    return Response.json({ data: userResponse(user) });
  } catch (error) {
    return errorHandler(error);
  }
}
