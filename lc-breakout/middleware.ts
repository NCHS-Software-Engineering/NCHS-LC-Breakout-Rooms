import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
      // Allow /admin/login for all authenticated users
      if (pathname === "/admin/login") {
        return NextResponse.next();
      }

      // Require admin role for other admin routes
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow access to public pages, but require auth for /admin routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
