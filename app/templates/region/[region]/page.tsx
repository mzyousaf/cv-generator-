import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GenerateFreeButton } from "@/components/landing/generate-free-button";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/templates-pages/page-hero";
import { PublicPage } from "@/components/templates-pages/public-page";
import { TemplateCard } from "@/components/templates-pages/template-card";
import type { TemplateRegion } from "@/lib/cv/template-catalog";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { format } from "@/lib/i18n/format";
import { getPreferences } from "@/lib/i18n/server";
import { absoluteUrl, regionPath, regionsWithTemplates, templatePath, templatesInRegion } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/seo-schema";

type Params = { params: Promise<{ region: string }> };

export function generateStaticParams() {
  return regionsWithTemplates().map((region) => ({ region }));
}

export const dynamicParams = false;

function resolveRegion(value: string): TemplateRegion | null {
  return (regionsWithTemplates() as string[]).includes(value) ? (value as TemplateRegion) : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const region = resolveRegion((await params).region);
  if (!region) return {};
  const { locale } = await getPreferences();
  const t = getDictionary(locale);
  const name = t.templatePicker.regions[region];
  const title = format(t.templatesPage.regionTitle, { region: name });
  const description = format(t.templatesPage.regionDescription, { n: templatesInRegion(region).length, region: name });
  return {
    title,
    description,
    alternates: { canonical: regionPath(region) },
    openGraph: { title, description, url: regionPath(region) },
    twitter: { title, description },
  };
}

export default async function RegionPage({ params }: Params) {
  const region = resolveRegion((await params).region);
  if (!region) notFound();
  const { locale } = await getPreferences();
  const t = getDictionary(locale);
  const name = t.templatePicker.regions[region];
  const ids = templatesInRegion(region);
  const title = format(t.templatesPage.regionTitle, { region: name });

  return (
    <PublicPage>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: t.templatesPage.home, path: "/" },
            { name: t.templatesPage.allTemplates, path: "/templates" },
            { name, path: regionPath(region) },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            url: absoluteUrl(regionPath(region)),
            isAccessibleForFree: true,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: ids.length,
              itemListElement: ids.map((id, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: t.templateMeta[id].name,
                url: absoluteUrl(templatePath(id)),
              })),
            },
          },
        ]}
      />
      <PageHero
        breadcrumbs={[
          { name: t.templatesPage.home, href: "/" },
          { name: t.templatesPage.allTemplates, href: "/templates" },
          { name },
        ]}
        eyebrow={format(t.templatesPage.count, { n: ids.length })}
        title={title}
        description={format(t.templatesPage.regionDescription, { n: ids.length, region: name })}
      >
        <GenerateFreeButton />
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ids.map((id) => (
            <li key={id} className="min-w-0">
              <TemplateCard id={id} preview />
            </li>
          ))}
        </ul>

        <nav aria-labelledby="other-regions" className="mt-16 border-t border-slate-200 pt-10">
          <h2 id="other-regions" className="text-lg font-bold text-slate-950">
            {t.templatesPage.browseByRegion}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {regionsWithTemplates()
              .filter((other) => other !== region)
              .map((other) => (
                <li key={other}>
                  <Link
                    href={regionPath(other)}
                    className="inline-flex min-h-9 items-center rounded-full border border-slate-200 bg-surface px-3 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {t.templatePicker.regions[other]}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </PublicPage>
  );
}
