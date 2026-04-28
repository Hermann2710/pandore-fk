import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Only match locale-prefixed routes — do NOT intercept root routes
  // This prevents redirect loops while the [locale] routing is not yet implemented
  matcher: ["/(en|fr)/:path*"],
};
