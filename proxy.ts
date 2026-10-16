import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";
import { isLocalizedRoute, ROUTE_LOCALE_HEADER, splitLocalePrefix } from "@/lib/i18n/routing";

const { auth } = NextAuth(authConfig);

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;

  // Language-prefixed public URL (/de/templates): serve the unprefixed page
  // with the locale fixed by the URL, so each language is its own indexable URL.
  const { locale, path } = splitLocalePrefix(pathname);
  if (locale) {
    if (!isLocalizedRoute(path)) {
      return NextResponse.redirect(new URL(path, request.nextUrl));
    }
    const url = request.nextUrl.clone();
    url.pathname = path;
    const headers = new Headers(request.headers);
    headers.set(ROUTE_LOCALE_HEADER, locale);
    return NextResponse.rewrite(url, { request: { headers } });
  }

  // With a callback, next-auth does not redirect on its own: guard the dashboard here.
  if (pathname.startsWith("/dashboard") && !request.auth?.user) {
    const signIn = new URL("/login", request.nextUrl);
    signIn.searchParams.set("callbackUrl", request.nextUrl.href);
    return NextResponse.redirect(signIn);
  }
  return undefined;
});

export default proxy;

// The matcher must be a static literal; keep the codes in sync with PREFIXED_LOCALES
// (lib/i18n/routing.test.ts checks this).
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/(es|fr|de|pt|it|nl|pl|tr|ru|ar|zh)",
    "/(es|fr|de|pt|it|nl|pl|tr|ru|ar|zh)/:path*",
  ],
};
