import "server-only";
import type { Metadata } from "next";
import { languageAlternates, localizePath } from "@/lib/i18n/routing";
import { getRouteLocale } from "@/lib/i18n/server";

/**
 * Canonical + hreflang for a localized public route. The canonical is the
 * URL actually requested (/de/templates or /templates), and every language
 * version is listed as an alternate.
 */
export async function pageAlternates(path: string): Promise<NonNullable<Metadata["alternates"]>> {
  const routeLocale = await getRouteLocale();
  return {
    canonical: routeLocale ? localizePath(path, routeLocale) : path,
    languages: languageAlternates(path),
  };
}

/** Localize a path for links rendered on the server (keeps /de/ on /de/ pages). */
export async function routePath(path: string): Promise<string> {
  const routeLocale = await getRouteLocale();
  return routeLocale ? localizePath(path, routeLocale) : path;
}

/** A synchronous localizer for the current request, for building many paths. */
export async function localizer(): Promise<(path: string) => string> {
  const routeLocale = await getRouteLocale();
  return (path) => (routeLocale ? localizePath(path, routeLocale) : path);
}
