// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { authClient } from "@/lib/auth"; // your Better Auth server client

export async function middleware(req: NextRequest) {
  const session= await authClient.getSession();
  console.log(session)

  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // 1️⃣ If user is logged in and visiting auth pages → redirect to dashboard
  if (session && pathname.startsWith("/auth")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 2️⃣ If user is NOT logged in and visiting protected pages → redirect to sign-in
  const isAuthPage = pathname.startsWith("/auth");
  const isPublicPage = pathname === "/";

  if (!session && !isAuthPage && !isPublicPage) {
    url.pathname = "/auth/signin";
    return NextResponse.redirect(url);
  }

  // 3️⃣ Otherwise, allow request
  return NextResponse.next();
}

// Apply middleware to all routes except static assets
export const config = {
  matcher: [
    "/((?!_next/static|favicon.ico|robots.txt).*)", // match everything except static files
  ],
};
