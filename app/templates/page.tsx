import type { Metadata } from "next";
import { Suspense } from "react";
import { GenerateFreeButton } from "@/components/landing/generate-free-button";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/templates-pages/page-hero";
import { PublicPage } from "@/components/templates-pages/public-page";
import { TemplatesIndex } from "@/components/templates-pages/templates-index";
import { CV_TEMPLATE_IDS } from "@/lib/cv/constants";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPreferences } from "@/lib/i18n/server";
import { absoluteUrl, templatePath } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/seo-schema";
import { localizer, pageAlternates, routePath } from "@/lib/seo-server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getPreferences();
  const t = getDictionary(locale).templatesPage;
  return {
    title: t.title,
    description: t.description,
    alternates: await pageAlternates("/templates"),
    openGraph: { title: t.title, description: t.description, url: await routePath("/templates") },
    twitter: { title: t.title, description: t.description },
  };
}

export default async function TemplatesPage() {
  const { locale } = await getPreferences();
  const t = getDictionary(locale);
  const loc = await localizer();
  return (
    <PublicPage>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: t.templatesPage.home, path: loc("/") },
            { name: t.templatesPage.allTemplates, path: loc("/templates") },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t.templatesPage.title,
            description: t.templatesPage.description,
            url: absoluteUrl(loc("/templates")),
            isAccessibleForFree: true,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: CV_TEMPLATE_IDS.length,
              itemListElement: CV_TEMPLATE_IDS.map((id, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: t.templateMeta[id].name,
                url: absoluteUrl(loc(templatePath(id))),
              })),
            },
          },
        ]}
      />
      <PageHero
        breadcrumbs={[{ name: t.templatesPage.home, href: "/" }, { name: t.templatesPage.allTemplates }]}
        eyebrow={t.nav.templates}
        title={t.templatesPage.title}
        description={t.templatesPage.description}
      >
        <GenerateFreeButton />
      </PageHero>
      {/* useSearchParams (for ?q=) needs a Suspense boundary. */}
      <Suspense>
        <TemplatesIndex />
      </Suspense>
    </PublicPage>
  );
}
