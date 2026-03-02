import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.nextauth.token;

    // Protection de l'espace producteur
    if (pathname.startsWith("/producteur")) {
      if (token?.role !== "PRODUCTEUR" && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Protection de l'espace admin
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/producteur/:path*", "/admin/:path*", "/panier", "/commandes/:path*"],
};
