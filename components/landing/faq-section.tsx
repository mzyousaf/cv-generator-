"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { SectionHeading } from "@/components/landing/section-heading";

/**
 * Frequently asked questions. Native <details> keeps every answer in the
 * HTML (crawlable and quotable by answer engines) while staying compact.
 */
export function FaqSection() {
  const { t } = useI18n();
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading id="faq-title" eyebrow={t.faq.eyebrow} title={t.faq.title} description={t.faq.description} />
        <div className="mt-12 divide-y divide-slate-200/80 overflow-hidden rounded-3xl border border-slate-200/80 bg-surface shadow-soft">
          {t.faq.items.map((item, index) => (
            <details key={item.question} className="group" open={index === 0}>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-start text-base font-semibold text-slate-950 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 sm:px-6 [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-semibold">{item.question}</h3>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="size-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M10 4.5v11M4.5 10h11" />
                </svg>
              </summary>
              <p className="px-5 pb-5 text-[0.95rem] leading-relaxed text-slate-600 sm:px-6">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
