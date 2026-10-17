"use client";

import { LocalizedLink as Link } from "@/components/i18n/localized-link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { TemplateCard } from "@/components/templates-pages/template-card";
import { CV_TEMPLATE_IDS } from "@/lib/cv/constants";
import { browseTemplates, REGION_COUNTRIES, templateFacets } from "@/lib/cv/template-catalog";
import { format } from "@/lib/i18n/format";
import { regionPath, regionsWithTemplates, templatesInRegion } from "@/lib/seo";

/**
 * All templates grouped by region, with a search box. The server passes the
 * ?q= query, so the full list renders in the first HTML (no streamed shift).
 */
export function TemplatesIndex({ initialQuery = "" }: { initialQuery?: string }) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const deferred = useDeferredValue(query);
  const regions = regionsWithTemplates();

  const matches = useMemo(() => {
    if (!deferred.trim()) return null;
    // DisplayNames only uses the first supported locale, so search both the UI language and English.
    const localNames = new Intl.DisplayNames([locale], { type: "region" });
    const englishNames = new Intl.DisplayNames(["en"], { type: "region" });
    return browseTemplates(
      { query: deferred },
      "popular",
      {
        locale,
        nameOf: (id) => t.templateMeta[id].name,
        primaryTextOf: (id) => `${t.templateMeta[id].name} ${t.templateMeta[id].description}`,
        searchTextOf: (id) => {
          const facets = templateFacets(id);
          return [
            t.templateMeta[id].name,
            t.templateMeta[id].description,
            t.templatePicker.regions[facets.region],
            t.templatePicker.styles[facets.style],
            ...REGION_COUNTRIES[facets.region].flatMap((code) => [localNames.of(code) ?? "", englishNames.of(code) ?? ""]),
          ].join(" ");
        },
      },
      CV_TEMPLATE_IDS,
    );
  }, [deferred, locale, t]);

  // Keep ?q= in the address bar so a search can be shared or restored, without adding history entries.
  useEffect(() => {
    const url = new URL(window.location.href);
    const trimmed = deferred.trim();
    if (trimmed) url.searchParams.set("q", trimmed);
    else url.searchParams.delete("q");
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
  }, [deferred]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="relative w-full max-w-md">
          <label htmlFor="templates-search" className="sr-only">
            {t.templatePicker.search}
          </label>
          <input
            ref={inputRef}
            id="templates-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.templatePicker.search}
            className="h-11 w-full rounded-xl border border-slate-200 bg-surface ps-4 pe-11 text-sm [&::-webkit-search-cancel-button]:appearance-none text-slate-900 shadow-[0_1px_2px_rgb(15_23_42/0.04)] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/12"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label={t.templatesPage.clearSearch}
              className="absolute end-1.5 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          ) : null}
        </div>
        <p className="text-sm font-medium text-slate-500" aria-live="polite">
          {matches
            ? format(t.templatePicker.showing, { n: matches.length, total: CV_TEMPLATE_IDS.length })
            : format(t.templatesPage.count, { n: CV_TEMPLATE_IDS.length })}
        </p>
      </div>

      <nav aria-label={t.templatesPage.browseByRegion} className="mt-8" hidden={Boolean(matches)}>
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">{t.templatesPage.browseByRegion}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {regions.map((region) => (
            <li key={region}>
              <Link
                href={regionPath(region)}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-surface px-3 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {t.templatePicker.regions[region]}
                <span className="text-slate-500">{templatesInRegion(region).length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {matches ? (
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((id) => (
            <li key={id} className="min-w-0">
              <TemplateCard id={id} />
            </li>
          ))}
          {matches.length === 0 ? (
            <li className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
              {format(t.templatesPage.noMatches, { q: deferred.trim() })}
            </li>
          ) : null}
        </ul>
      ) : (
        regions.map((region) => (
          <section key={region} aria-labelledby={`region-${region}`} className="mt-14">
            <div className="flex items-end justify-between gap-4">
              <h2 id={`region-${region}`} className="text-2xl font-bold tracking-tight text-slate-950">
                <Link href={regionPath(region)} className="hover:text-blue-700 hover:underline">
                  {t.templatePicker.regions[region]}
                </Link>
              </h2>
              <span className="shrink-0 text-sm text-slate-500">
                {format(t.templatesPage.count, { n: templatesInRegion(region).length })}
              </span>
            </div>
            <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {templatesInRegion(region).map((id) => (
                <li key={id} className="min-w-0">
                  <TemplateCard id={id} showRegion={false} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
