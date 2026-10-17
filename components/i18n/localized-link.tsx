"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentProps, useCallback } from "react";
import { localizePath, splitLocalePrefix } from "@/lib/i18n/routing";

/**
 * Localizes internal paths for the current page: on a language-prefixed URL
 * (/de/…) links keep the prefix, so crawlers and visitors stay in that language.
 */
export function useLocalizedPath(): (path: string) => string {
  const pathname = usePathname();
  const { locale } = splitLocalePrefix(pathname ?? "/");
  return useCallback((path: string) => (locale ? localizePath(path, locale) : path), [locale]);
}

/** next/link that keeps the current language prefix on internal paths. */
export function LocalizedLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const localize = useLocalizedPath();
  return <Link href={localize(href)} {...props} />;
}
