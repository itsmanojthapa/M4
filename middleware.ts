import { NextResponse } from "next/server";
import authConfig from "@/services/auth/auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req) {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next(); // Allow request to proceed
});

export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  matcher: ["/multiplayer/(.*)", "/post"],
};
