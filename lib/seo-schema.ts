import { CV_TEMPLATE_IDS } from "@/lib/cv/constants";
import { siteConfig } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { LOCALES, type Locale } from "@/lib/i18n/preferences";
import { absoluteUrl } from "@/lib/seo";

/**
 * Schema.org graph for the home page: who we are (Organization), the site
 * (WebSite with template search), the product (a free WebApplication), the
 * FAQ and the how-to. Answer engines quote these facts directly.
 */
export function homeSchema(t: Dictionary, locale: Locale): Record<string, unknown> {
  const org = { "@id": absoluteUrl("/#organization") };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org["@id"],
        name: siteConfig.name,
        url: absoluteUrl("/"),
        logo: { "@type": "ImageObject", url: absoluteUrl("/icons/icon-512.png"), width: 512, height: 512 },
        description: t.meta.description,
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: siteConfig.name,
        url: absoluteUrl("/"),
        inLanguage: locale,
        publisher: org,
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl("/templates")}?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebApplication",
        "@id": absoluteUrl("/#app"),
        name: siteConfig.name,
        url: absoluteUrl("/"),
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "CV and resume builder",
        operatingSystem: "Any (web browser)",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        description: t.meta.description,
        inLanguage: [...LOCALES],
        image: absoluteUrl("/opengraph-image.png"),
        publisher: org,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          description: "100% free for everyone. No trial, no paywall, no credit card.",
        },
        featureList: [
          `${CV_TEMPLATE_IDS.length} CV and resume templates for 18 regions`,
          "AI writing assistant for summaries, experience and skills",
          "Import an existing CV from PDF or DOCX",
          "Print-ready PDF export",
          `${LOCALES.length} languages`,
          "ATS-friendly templates",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": absoluteUrl("/#faq"),
        inLanguage: locale,
        mainEntity: t.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "HowTo",
        "@id": absoluteUrl("/#how-to"),
        name: t.how.title,
        description: t.how.description,
        inLanguage: locale,
        totalTime: "PT15M",
        estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
        step: t.how.steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.description,
          url: absoluteUrl("/#how-it-works"),
        })),
      },
    ],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
