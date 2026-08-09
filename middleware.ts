import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const AMB_COOKIE = "wt_amb_ref";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const response = NextResponse.next();

  // Ambassador attribution at the edge — before page render.
  const ref = searchParams.get("ref") || searchParams.get("amb");
  if (ref && /^[a-zA-Z0-9_-]{2,40}$/.test(ref)) {
    response.cookies.set(AMB_COOKIE, ref.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  const isDashboard =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/provider") ||
    pathname.startsWith("/ambassador") ||
    pathname.startsWith("/account");

  if (!isDashboard) return response;

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    const login = new URL("/login", request.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  const role = token.role as string | undefined;

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname.startsWith("/provider") && role !== "PROVIDER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (
    pathname.startsWith("/ambassador") &&
    role !== "AMBASSADOR" &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|docs|videos|api/webhooks|api/auth).*)",
  ],
};
