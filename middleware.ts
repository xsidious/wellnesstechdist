import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export const AMB_COOKIE = "wt_amb_ref";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
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

  if (!request.auth?.user) {
    const login = new URL("/login", request.nextUrl.origin);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  const role = request.auth.user.role as string | undefined;

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }
  if (pathname.startsWith("/provider") && role !== "PROVIDER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }
  if (
    pathname.startsWith("/ambassador") &&
    role !== "AMBASSADOR" &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|docs|videos|api/webhooks|api/auth).*)",
  ],
};
