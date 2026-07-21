import { NextRequest, NextResponse } from "next/server";

import {
  SESSION_COOKIE_NAME,
  verifySessionCookie,
} from "@/lib/session-cookie";

export async function middleware(request: NextRequest) {
  const cookieValue = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const credential = await verifySessionCookie(cookieValue);

  if (credential) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  const response = NextResponse.redirect(loginUrl);
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
  return response;
}

export const config = {
  matcher: [
    "/top/:path*",
    "/mypage/:path*",
    "/study/:path*",
    "/friends/:path*",
    "/friend/:path*",
    "/word-list/:path*",
    "/memorize/:path*",
  ],
};
