import { userResponse } from "@/app/output/user";
import { getUser } from "@/app/services/user";
import errorHandler from "@/app/utils/error-handler";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const user = await getUser(parseInt(id));
    return Response.json({ data: userResponse(user) });
  } catch (error) {
    errorHandler(error);
  }
}
