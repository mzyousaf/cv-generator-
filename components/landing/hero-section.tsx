"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/i18n-provider";
import { GenerateFreeButton } from "@/components/landing/generate-free-button";
import { ProductPreview } from "@/components/landing/product-preview";

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 text-emerald-400" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function HeroSection() {
  const { t } = useI18n();
  return (
    <section className="scheme-light relative isolate overflow-hidden bg-ink-mesh text-white">
      <div
        className="absolute inset-0 -z-10 bg-grid-faint [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-4 pb-20 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-32 lg:pt-24">
        <div className="min-w-0 max-w-2xl animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] py-1 ps-1 pe-3.5 text-xs font-medium text-slate-200 backdrop-blur">
            <span className="rounded-full bg-brand-gradient px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              {t.hero.badgeNew}
            </span>
            {t.hero.badge}
          </p>

          <h1 className="mt-7 hyphens-auto break-words text-[2.6rem] font-bold leading-[1.05] tracking-[-0.03em] max-[360px]:text-[2.1rem] sm:text-6xl lg:text-[4.1rem]">
            {t.hero.titleStart}{" "}
            <span className="inline-block font-display text-[1.12em] font-normal italic tracking-[-0.01em] text-gradient">
              {t.hero.titleHighlight}
            </span>{" "}
            {t.hero.titleEnd}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/90 sm:text-xl">
            {t.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <GenerateFreeButton className="w-full sm:w-auto" />
            <Link
              href="#templates"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white/25 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:text-[0.95rem]"
            >
              {t.hero.browseTemplates}
              <span aria-hidden="true" className="rtl:rotate-180">→</span>
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-slate-300">
            {t.hero.highlights.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full min-w-0 max-w-xl animate-fade-up [animation-delay:150ms] lg:max-w-none">
          <div
            className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-blue-500/25 blur-3xl"
            aria-hidden="true"
          />
          <ProductPreview />
          <div
            className="absolute -bottom-7 start-6 hidden animate-float items-center gap-2.5 rounded-2xl border border-white/60 bg-surface/95 px-3.5 py-2.5 text-slate-900 shadow-lift backdrop-blur sm:flex"
            aria-hidden="true"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3 1.9 5.8L20 10l-5.1 3.7L16.6 20 12 16.3 7.4 20l1.7-6.3L4 10l6.1-1.2Z" />
              </svg>
            </span>
            <span>
              <span className="block text-xs font-bold">{t.hero.chipAiTitle}</span>
              <span className="block text-[11px] text-slate-500">{t.hero.chipAiMeta}</span>
            </span>
          </div>
          <div
            className="absolute -end-3 -top-5 hidden animate-float items-center gap-2 rounded-full border border-white/60 bg-surface/95 px-3.5 py-2 text-xs font-bold text-slate-900 shadow-lift [animation-delay:1.2s] sm:flex xl:-end-6"
            aria-hidden="true"
          >
            <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgb(16_185_129/0.2)]" />
            {t.hero.chipPdf}
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
