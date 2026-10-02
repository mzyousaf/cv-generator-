"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { GenerateFreeButton } from "@/components/landing/generate-free-button";

export function FinalCtaSection() {
  const { t } = useI18n();
  return (
    <section className="bg-background px-4 pb-24 sm:px-6 sm:pb-32">
      <div className="scheme-light relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-ink-mesh px-6 py-16 text-center shadow-[0_40px_100px_-40px_color-mix(in_oklab,var(--brand-900)_60%,transparent)] sm:px-12 sm:py-24">
        <div
          className="absolute inset-0 -z-10 bg-grid-faint [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
          aria-hidden="true"
        />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
          {t.cta.eyebrow}
        </p>
        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-[-0.025em] text-white sm:text-5xl sm:leading-[1.08]">
          {t.cta.titleStart}{" "}
          <span className="font-display font-normal italic text-gradient">
            {t.cta.titleHighlight}
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          {t.cta.description}
        </p>
        <div className="mt-10 flex justify-center">
          <GenerateFreeButton variant="inverse" className="w-full max-w-xs sm:w-auto sm:max-w-none" />
        </div>
        <p className="mt-5 text-xs text-slate-400">{t.cta.note}</p>
      </div>
    </section>
  );
}
