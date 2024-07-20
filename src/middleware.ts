import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { SessionValue, getSession } from "./app/services/auth";

const checkPathPermission = (session: SessionValue, path: string) => {
  if (path.startsWith("/api/admin") && session.user?.role?.name !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
};

const unautorizedPath = new Set(["/api/login"]);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // skip paths that do not require authentication
  if (unautorizedPath.has(path)) return NextResponse.next();

  const session = await getSession();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if the user has permission to access the path
  return checkPathPermission(session, path);
}

export const config = {
  matcher: "/api/(.*)",
};
