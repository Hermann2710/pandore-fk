import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const AUTH_ONLY_PATHS = ["/login", "/register"];

const PROTECTED_PATHS = [
  "/cart",
  "/checkout",
  "/orders",
  "/wishlist",
  "/profile",
  "/admin",
  "/delivery",
];

function stripLocale(pathname: string, locales: readonly string[]): string {
  for (const locale of locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1) || "/";
    }
  }
  return pathname;
}

function matchesAny(path: string, prefixes: string[]): boolean {
  return prefixes.some((p) => path === p || path.startsWith(p + "/"));
}

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locales = routing.locales as readonly string[];

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const role = request.cookies.get("pandore_role")?.value ?? null;
  const isAuthenticated = role !== null;
  const path = stripLocale(pathname, locales);

  // Authenticated users on login/register → home
  if (isAuthenticated && matchesAny(path, AUTH_ONLY_PATHS)) {
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, request.url));
  }

  // Unauthenticated users on protected pages → login
  if (!isAuthenticated && matchesAny(path, PROTECTED_PATHS)) {
    const loginUrl = new URL(`/${routing.defaultLocale}/login`, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)" ],
};
