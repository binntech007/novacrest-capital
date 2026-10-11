
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((request) => {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;
  const session = request.auth;

  const user = session?.user;
  const isLoggedIn = Boolean(user?.id);
  const role = user?.role;
  const status = user?.status;

  const isActive = isLoggedIn && status === "ACTIVE";

  const isAdminLogin = pathname === "/admin/login";
  const isAdminRegister = pathname === "/admin/register";

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const isDashboardRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  const isCustomerAuth =
    pathname === "/login" ||
    pathname === "/register";

  // Allow authentication pages to load.
  if (isAdminLogin || isAdminRegister) {
    if (isActive && role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }

    if (isActive && role === "CUSTOMER") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    return NextResponse.next();
  }

  if (isCustomerAuth) {
    if (isActive && role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }

    if (isActive && role === "CUSTOMER") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    return NextResponse.next();
  }

  // Protect admin routes.
  if (isAdminRoute) {
    if (!isLoggedIn) {
      const url = new URL("/admin/login", nextUrl);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (status !== "ACTIVE") {
      return NextResponse.redirect(
        new URL("/admin/login?error=account-unavailable", nextUrl)
      );
    }

    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    return NextResponse.next();
  }

  // Protect customer dashboard routes.
  if (isDashboardRoute) {
    if (!isLoggedIn) {
      const url = new URL("/login", nextUrl);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (status !== "ACTIVE") {
      return NextResponse.redirect(
        new URL("/login?error=account-unavailable", nextUrl)
      );
    }

    if (role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};