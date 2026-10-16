import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";
import { DEFAULT_LOCALE, PREFERENCE_COOKIES, type Locale } from "@/lib/i18n/preferences";
import {
  isLocalizedRoute,
  localizePath,
  PREFIXED_LOCALES,
  ROUTE_LOCALE_HEADER,
  splitLocalePrefix,
} from "@/lib/i18n/routing";

const { auth } = NextAuth(authConfig);

/** Serve `path` with the locale fixed by the URL, so every language is its own indexable page. */
function withRouteLocale(request: Request, locale: Locale, rewriteTo?: URL) {
  const headers = new Headers(request.headers);
  headers.set(ROUTE_LOCALE_HEADER, locale);
  return rewriteTo
    ? NextResponse.rewrite(rewriteTo, { request: { headers } })
    : NextResponse.next({ request: { headers } });
}

export const proxy = auth((request) => {
  const { pathname, search } = request.nextUrl;

  // /en/… is the root: point it at the one English URL.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.redirect(new URL((pathname.slice(3) || "/") + search, request.nextUrl), 308);
  }

  // Language-prefixed public URL (/de/templates): serve the unprefixed page in that language.
  // Unknown paths fall through to a localized 404; only the dashboard has no language versions.
  const { locale, path } = splitLocalePrefix(pathname);
  if (locale) {
    if (path === "/dashboard" || path.startsWith("/dashboard/")) {
      return NextResponse.redirect(new URL(path + search, request.nextUrl), 308);
    }
    const url = request.nextUrl.clone();
    url.pathname = path;
    return withRouteLocale(request, locale, url);
  }

  // Unprefixed public URL: always English, whatever the browser sends, so the
  // English URL never serves another language. A language the visitor picked
  // (cookie) takes them to that language's URL instead.
  if (isLocalizedRoute(pathname)) {
    const chosen = request.cookies.get(PREFERENCE_COOKIES.locale)?.value;
    if (chosen && (PREFIXED_LOCALES as string[]).includes(chosen)) {
      const response = NextResponse.redirect(new URL(localizePath(pathname, chosen as Locale) + search, request.nextUrl));
      response.headers.set("Vary", "Cookie");
      return response;
    }
    return withRouteLocale(request, DEFAULT_LOCALE);
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
// and the public routes in sync with isLocalizedRoute (lib/i18n/routing.test.ts checks this).
export const config = {
  matcher: [
    "/",
    "/templates/:path*",
    "/privacy",
    "/terms",
    "/signup",
    "/login",
    "/dashboard/:path*",
    "/en",
    "/en/:path*",
    "/(es|fr|de|pt|it|nl|pl|tr|ru|ar|zh)",
    "/(es|fr|de|pt|it|nl|pl|tr|ru|ar|zh)/:path*",
  ],
};
