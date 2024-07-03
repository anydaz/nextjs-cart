import { userResponse } from "@/app/output/user";
import { deleteUser, getUser } from "@/app/services/user";
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const user = await deleteUser(parseInt(id));
    return Response.json({ data: userResponse(user) });
  } catch (error) {
    errorHandler(error);
  }
}
