import type { Metadata } from "next";
import { LocalizedLink as Link } from "@/components/i18n/localized-link";
import { notFound } from "next/navigation";
import { GenerateFreeButton } from "@/components/landing/generate-free-button";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/templates-pages/page-hero";
import { PublicPage } from "@/components/templates-pages/public-page";
import { TemplateCard } from "@/components/templates-pages/template-card";
import { TemplatePreview } from "@/components/templates-pages/template-preview";
import { CV_TEMPLATE_IDS, type CvTemplateId } from "@/lib/cv/constants";
import { getRegionalTemplateSpec, templateFacets } from "@/lib/cv/template-catalog";
import { siteConfig } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { format } from "@/lib/i18n/format";
import { getPreferences } from "@/lib/i18n/server";
import { absoluteUrl, regionPath, templatePath, templatesInRegion } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/seo-schema";
import { localizer, pageMetadata } from "@/lib/seo-server";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return CV_TEMPLATE_IDS.map((id) => ({ id }));
}

export const dynamicParams = false;

function resolveId(value: string): CvTemplateId | null {
  return (CV_TEMPLATE_IDS as readonly string[]).includes(value) ? (value as CvTemplateId) : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const id = resolveId((await params).id);
  if (!id) return {};
  const { locale } = await getPreferences();
  const t = getDictionary(locale);
  return pageMetadata({
    title: format(t.templatesPage.templateTitle, { name: t.templateMeta[id].name }),
    description: format(t.templatesPage.templateDescription, { description: t.templateMeta[id].description }),
    path: templatePath(id),
  });
}

export default async function TemplatePage({ params }: Params) {
  const id = resolveId((await params).id);
  if (!id) notFound();
  const { locale } = await getPreferences();
  const t = getDictionary(locale);
  const loc = await localizer();
  const copy = t.templatesPage;
  const facets = templateFacets(id);
  const spec = getRegionalTemplateSpec(id);
  const name = t.templateMeta[id].name;
  const regionName = t.templatePicker.regions[facets.region];
  const title = format(copy.templateTitle, { name });
  const guide = [
    t.templateMeta[id].description,
    copy.guide.layout[spec?.layout ?? "single"],
    format(copy.guide.photo[facets.photo], { region: regionName }),
    ...(spec?.personalDetails ? [copy.guide.personalDetails] : []),
    ...(spec?.signature ? [copy.guide.signature] : []),
    ...(spec?.referencesNote ? [copy.guide.references] : []),
    spec?.pageSize === "LETTER" ? copy.guide.letter : copy.guide.a4,
    ...(facets.ats ? [copy.guide.ats] : []),
  ];
  const related = templatesInRegion(facets.region).filter((other) => other !== id).slice(0, 9);

  const rows: [string, string][] = [
    [copy.layoutLabel, copy.layouts[spec?.layout ?? "single"]],
    [copy.photoLabel, copy.photoValues[facets.photo]],
    [copy.pageSizeLabel, spec?.pageSize === "LETTER" ? "US Letter" : "A4"],
    [copy.personalDetailsLabel, spec?.personalDetails ? copy.included : copy.notIncluded],
    [t.templatePicker.styleLabel, t.templatePicker.styles[facets.style]],
    [t.templatePicker.regionLabel, regionName],
  ];
  if (facets.ats) rows.push([t.templatePicker.tags.ats, copy.included]);

  return (
    <PublicPage>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: copy.home, path: loc("/") },
            { name: copy.allTemplates, path: loc("/templates") },
            { name: regionName, path: loc(regionPath(facets.region)) },
            { name, path: loc(templatePath(id)) },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: title,
            description: t.templateMeta[id].description,
            url: absoluteUrl(loc(templatePath(id))),
            genre: "CV template",
            isAccessibleForFree: true,
            inLanguage: locale,
            keywords: [name, regionName, t.templatePicker.styles[facets.style], "CV template", "resume template"].join(", "),
            publisher: { "@type": "Organization", name: siteConfig.name, url: absoluteUrl("/") },
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
          },
        ]}
      />
      <PageHero
        breadcrumbs={[
          { name: copy.home, href: "/" },
          { name: copy.allTemplates, href: "/templates" },
          { name: regionName, href: regionPath(facets.region) },
          { name },
        ]}
        eyebrow={regionName}
        title={title}
        description={format(copy.templateDescription, { description: t.templateMeta[id].description })}
      >
        <GenerateFreeButton>{copy.useTemplate}</GenerateFreeButton>
      </PageHero>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <TemplatePreview id={id} />
        <section aria-labelledby="details-title">
          <h2 id="details-title" className="text-xl font-bold tracking-tight text-slate-950">
            {copy.details}
          </h2>
          <dl className="mt-4 divide-y divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-surface text-sm shadow-soft">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 px-4 py-3">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-end font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-slate-500">{t.cta.note}</p>
          <div className="mt-4">
            <GenerateFreeButton className="w-full sm:w-auto">{copy.useTemplate}</GenerateFreeButton>
          </div>
        </section>
      </div>

      {/* Template-specific guidance: built from the format's real attributes. */}
      <section aria-labelledby="guide-title" className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div>
          <h2 id="guide-title" className="text-xl font-bold tracking-tight text-slate-950">
            {copy.guide.title}
          </h2>
          <div className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-slate-600">
            {guide.map((sentence) => (
              <p key={sentence}>{sentence}</p>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-950">{copy.guide.stepsTitle}</h2>
          <ol className="mt-4 space-y-3">
            {copy.guide.steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-[0.95rem] leading-relaxed text-slate-600">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700 ring-1 ring-blue-100">
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {related.length ? (
        <section aria-labelledby="related-title" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <h2 id="related-title" className="text-xl font-bold tracking-tight text-slate-950">
              {copy.related}
            </h2>
            <Link href={regionPath(facets.region)} className="min-w-0 text-right text-sm font-semibold text-blue-700 hover:underline">
              {regionName}
            </Link>
          </div>
          <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((other) => (
              <li key={other} className="min-w-0">
                <TemplateCard id={other} showRegion={false} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </PublicPage>
  );
}
