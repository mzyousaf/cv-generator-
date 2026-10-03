"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { SectionHeading } from "@/components/landing/section-heading";

export function HowItWorksSection() {
  const { t } = useI18n();
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-slate-200/70 bg-gradient-to-b from-surface to-slate-50 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t.how.eyebrow}
          title={t.how.title}
          description={t.how.description}
        />

        <ol className="relative mt-16 grid gap-6 md:grid-cols-3">
          <div
            className="absolute left-[16.6%] right-[16.6%] top-8 hidden h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 md:block"
            aria-hidden="true"
          />
          {t.how.steps.map((item, index) => (
            <li key={item.title} className="relative flex flex-col items-center text-center">
              <span className="relative z-10 inline-flex size-16 items-center justify-center rounded-2xl bg-surface text-lg font-bold text-blue-600 shadow-lift ring-1 ring-blue-100">
                <span className="absolute inset-1 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/60" aria-hidden="true" />
                <span className="relative">{String(index + 1).padStart(2, "0")}</span>
              </span>
              <p className="mt-6 text-xl font-bold tracking-tight text-slate-950">
                {item.title}
              </p>
              <p className="mt-2 max-w-xs text-[0.95rem] leading-relaxed text-slate-500">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
