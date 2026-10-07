import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((request) => {
  const { nextUrl } = request;
  const session = request.auth;

  const pathname = nextUrl.pathname;

  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;
  const status = session?.user?.status;

  /*
   * --------------------------------------------------
   * ADMIN AUTH PAGES
   * These must remain publicly accessible.
   * --------------------------------------------------
   */

  const isAdminLoginPage = pathname === "/admin/login";
  const isAdminRegisterPage = pathname === "/admin/register";

  if (isAdminLoginPage || isAdminRegisterPage) {
    /*
     * If an ADMIN is already logged in,
     * send them directly to the admin dashboard.
     */
    if (isLoggedIn && status === "ACTIVE" && role === "ADMIN") {
      return NextResponse.redirect(
        new URL("/admin", nextUrl)
      );
    }

    /*
     * If a CUSTOMER is logged in and tries to access
     * the admin login/register page, send them back
     * to their customer dashboard.
     */
    if (isLoggedIn && status === "ACTIVE" && role === "CUSTOMER") {
      return NextResponse.redirect(
        new URL("/dashboard", nextUrl)
      );
    }

    /*
     * Not logged in:
     * allow access to /admin/login and /admin/register.
     */
    return NextResponse.next();
  }

  /*
   * --------------------------------------------------
   * ADMIN ROUTES
   * --------------------------------------------------
   */

  const isAdminRoute = pathname === "/admin" ||
    pathname.startsWith("/admin/");

  if (isAdminRoute) {
    /*
     * User is not logged in.
     */
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(
          `/admin/login?callbackUrl=${encodeURIComponent(pathname)}`,
          nextUrl
        )
      );
    }

    /*
     * Account is not active.
     */
    if (status !== "ACTIVE") {
      return NextResponse.redirect(
        new URL("/admin/login?error=account-unavailable", nextUrl)
      );
    }

    /*
     * Only ADMIN users can access /admin.
     */
    if (role !== "ADMIN") {
      return NextResponse.redirect(
        new URL("/dashboard", nextUrl)
      );
    }

    return NextResponse.next();
  }

  /*
   * --------------------------------------------------
   * CUSTOMER DASHBOARD
   * --------------------------------------------------
   */

  const isDashboardRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  if (isDashboardRoute) {
    /*
     * Not logged in.
     */
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(
          `/login?callbackUrl=${encodeURIComponent(pathname)}`,
          nextUrl
        )
      );
    }

    /*
     * Account is not active.
     */
    if (status !== "ACTIVE") {
      return NextResponse.redirect(
        new URL("/login?error=account-unavailable", nextUrl)
      );
    }

    /*
     * Admin users belong in the admin dashboard.
     */
    if (role === "ADMIN") {
      return NextResponse.redirect(
        new URL("/admin", nextUrl)
      );
    }

    /*
     * Only CUSTOMER users can access customer dashboard.
     */
    if (role !== "CUSTOMER") {
      return NextResponse.redirect(
        new URL("/login", nextUrl)
      );
    }

    return NextResponse.next();
  }

  /*
   * --------------------------------------------------
   * CUSTOMER AUTH PAGES
   * --------------------------------------------------
   */

  const isCustomerAuthPage =
    pathname === "/login" ||
    pathname === "/register";

  if (isCustomerAuthPage && isLoggedIn && status === "ACTIVE") {
    if (role === "ADMIN") {
      return NextResponse.redirect(
        new URL("/admin", nextUrl)
      );
    }

    if (role === "CUSTOMER") {
      return NextResponse.redirect(
        new URL("/dashboard", nextUrl)
      );
    }
  }

  /*
   * --------------------------------------------------
   * PUBLIC ROUTES
   * --------------------------------------------------
   */

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Don't run Proxy on:
     * - /api
     * - Next.js static files
     * - images
     * - favicon
     * - common static assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};