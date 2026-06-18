import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// ── Route definitions ─────────────────────────────────────────────────────────

// Pages that logged-in users should NOT access (redirect to home)
const AUTH_ONLY_PATHS = ["/login", "/register"];

// Pages that require authentication (any role)
const PROTECTED_PATHS = [
  "/cart",
  "/checkout",
  "/orders",
  "/wishlist",
  "/profile",
];

// Pages restricted to a specific role
const ROLE_PATHS: Record<string, string> = {
  "/admin": "admin",
  "/delivery": "delivery",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Strip the locale prefix from a pathname, e.g. /fr/admin → /admin */
function stripLocale(pathname: string, locales: readonly string[]): string {
  for (const locale of locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1) || "/";
    }
  }
  return pathname;
}

/** Check if a path starts with any of the given prefixes */
function matchesAny(path: string, prefixes: string[]): boolean {
  return prefixes.some((p) => path === p || path.startsWith(p + "/"));
}

// ── Middleware ────────────────────────────────────────────────────────────────

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locales = routing.locales as readonly string[];

  // Let Next.js internals and static files pass through untouched
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Read the non-HTTP-only role cookie set by the backend at login
  const role = request.cookies.get("pandore_role")?.value ?? null;
  const isAuthenticated = role !== null;

  // Strip locale prefix to get the clean path for matching
  const path = stripLocale(pathname, locales);

  // 1. Authenticated users trying to access login/register → redirect to home
  if (isAuthenticated && matchesAny(path, AUTH_ONLY_PATHS)) {
    const home = new URL(`/${routing.defaultLocale}`, request.url);
    return NextResponse.redirect(home);
  }

  // 2. Unauthenticated users trying to access protected pages → redirect to login
  if (!isAuthenticated && matchesAny(path, PROTECTED_PATHS)) {
    const loginUrl = new URL(`/${routing.defaultLocale}/login`, request.url);
    loginUrl.searchParams.set("from", pathname); // preserve intended destination
    return NextResponse.redirect(loginUrl);
  }

  // 3. Role-based protection: wrong role → redirect to home
  for (const [prefix, requiredRole] of Object.entries(ROLE_PATHS)) {
    if (matchesAny(path, [prefix])) {
      if (!isAuthenticated) {
        const loginUrl = new URL(
          `/${routing.defaultLocale}/login`,
          request.url,
        );
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
      }
      if (role !== requiredRole) {
        // Authenticated but wrong role — send to their own dashboard
        const fallback =
          role === "admin"
            ? "/admin"
            : role === "delivery"
              ? "/delivery"
              : "/catalog";
        return NextResponse.redirect(
          new URL(`/${routing.defaultLocale}${fallback}`, request.url),
        );
      }
      break;
    }
  }

  // 4. All checks passed — let next-intl handle locale routing
  return intlMiddleware(request);
}

export const config = {
  // Match all routes except Next.js internals and static files
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
