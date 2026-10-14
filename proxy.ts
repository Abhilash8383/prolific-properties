import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get("pp_session")?.value;
  const valid =
    token &&
    (await jwtVerify(token, new TextEncoder().encode(process.env.SESSION_SECRET)).then(
      () => true,
      () => false,
    ));
  if (!valid) return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
