import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // redirect /dashboard root based on role
    if (path === "/dashboard") {
      if (token?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin_dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard/user_dashboard", req.url));
      }
    }

    // block non-admins from admin routes
    if (path.startsWith("/dashboard/admin_dashboard") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/user_dashboard", req.url));
    }

    // block admins from user routes
    if (path.startsWith("/dashboard/user_dashboard") && token?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin_dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // redirect to /login if not logged in
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};