// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role;

    // Redirect /dashboard root based on role
    if (path === "/dashboard") {
      return role === "ADMIN"
        ? NextResponse.redirect(new URL("/dashboard/admin_dashboard", req.url))
        : NextResponse.redirect(new URL("/dashboard/user_dashboard", req.url));
    }

    // Block CSD from any /dashboard/admin_dashboard/* route
    if (path.startsWith("/dashboard/admin_dashboard") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/user_dashboard", req.url));
    }

    // Block ADMIN from any /dashboard/user_dashboard/* route
    if (path.startsWith("/dashboard/user_dashboard") && role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin_dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Rejects unauthenticated users entirely — sends them to /login
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};