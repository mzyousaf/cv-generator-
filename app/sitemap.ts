import type { MetadataRoute } from "next";
import { CV_TEMPLATE_IDS } from "@/lib/cv/constants";
import { TEMPLATE_PROFILE } from "@/lib/cv/template-catalog";
import { LOCALES } from "@/lib/i18n/preferences";
import { languageAlternates, localizePath } from "@/lib/i18n/routing";
import { absoluteUrl, regionPath, regionsWithTemplates, templatePath } from "@/lib/seo";

type Entry = { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number };

/**
 * Public, indexable pages in every language, each with its hreflang
 * alternates. Private areas (dashboard, API) and noindex pages are excluded.
 */
/** Bump when public page content changes; a constant lastmod is one search engines can trust. */
const CONTENT_UPDATED = new Date("2026-10-16");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = CONTENT_UPDATED;
  const entries: Entry[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/templates", changeFrequency: "weekly", priority: 0.9 },
    ...regionsWithTemplates().map((region) => ({
      path: regionPath(region),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...CV_TEMPLATE_IDS.map((id) => ({
      path: templatePath(id),
      changeFrequency: "monthly" as const,
      // Popular templates get a little more weight.
      priority: TEMPLATE_PROFILE[id].popularity >= 85 ? 0.8 : 0.7,
    })),
    { path: "/signup", changeFrequency: "yearly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  ];

  return entries.flatMap(({ path, changeFrequency, priority }) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path)).map(([code, href]) => [code, absoluteUrl(href)]),
    );
    return LOCALES.map((locale) => ({
      url: absoluteUrl(localizePath(path, locale)),
      lastModified: now,
      changeFrequency,
      // Language versions rank alongside the English page, slightly below it.
      priority: locale === "en" ? priority : Math.round(priority * 90) / 100,
      alternates: { languages },
    }));
  });
}
