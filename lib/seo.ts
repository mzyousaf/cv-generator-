import { CV_TEMPLATE_IDS, type CvTemplateId } from "@/lib/cv/constants";
import { TEMPLATE_REGIONS, templateRegion, type TemplateRegion } from "@/lib/cv/template-catalog";

/**
 * Canonical origin for absolute URLs (canonical links, sitemap, structured
 * data). NEXT_PUBLIC_SITE_URL wins; AUTH_URL is the deployed origin in most
 * environments; the production domain is the last resort.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.AUTH_URL?.trim() ||
  "https://resumorah.com"
).replace(/\/+$/, "");

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function templatePath(id: CvTemplateId): string {
  return `/templates/${id}`;
}

export function regionPath(region: TemplateRegion): string {
  return `/templates/region/${region}`;
}

/** Regions that have at least one template, in catalog order. */
export function regionsWithTemplates(): TemplateRegion[] {
  return TEMPLATE_REGIONS.filter((region) => CV_TEMPLATE_IDS.some((id) => templateRegion(id) === region));
}

export function templatesInRegion(region: TemplateRegion): CvTemplateId[] {
  return CV_TEMPLATE_IDS.filter((id) => templateRegion(id) === region);
}
