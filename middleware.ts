import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect all admin routes except login
  if (path.startsWith("/admin/dashboard") || path.startsWith("/admin/experiments")) {
    const adminToken = request.cookies.get("admin_token");
    if (!adminToken) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent logged-in users from seeing the login page
  if (path === "/admin/login") {
    const adminToken = request.cookies.get("admin_token");
    if (adminToken) {
      const dashboardUrl = new URL("/admin/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/experiments/:path*",
    "/admin/login",
  ],
};

