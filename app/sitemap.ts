import type { MetadataRoute } from "next";
import { CV_TEMPLATE_IDS } from "@/lib/cv/constants";
import { TEMPLATE_PROFILE } from "@/lib/cv/template-catalog";
import { absoluteUrl, regionPath, regionsWithTemplates, templatePath } from "@/lib/seo";

/** Public, indexable pages. Private areas (dashboard, API) are excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/templates"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...regionsWithTemplates().map((region) => ({
      url: absoluteUrl(regionPath(region)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...CV_TEMPLATE_IDS.map((id) => ({
      url: absoluteUrl(templatePath(id)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      // Popular templates get a little more weight.
      priority: TEMPLATE_PROFILE[id].popularity >= 85 ? 0.8 : 0.7,
    })),
    { url: absoluteUrl("/signup"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
