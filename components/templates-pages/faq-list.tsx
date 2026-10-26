export type FaqItem = { question: string; answer: string };

/** Expandable questions; pair with faqSchema() so search engines can show them. */
export function FaqList({ title, items }: { title: string; items: FaqItem[] }) {
  return (
    <section aria-labelledby="faq-title">
      <h2 id="faq-title" className="text-xl font-bold tracking-tight text-slate-950">
        {title}
      </h2>
      <div className="mt-4 divide-y divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-surface shadow-soft">
        {items.map((item) => (
          <details key={item.question} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[0.95rem] font-semibold text-slate-900 focus:outline-none focus-visible:underline [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-lg leading-none text-slate-400 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function faqSchema(items: FaqItem[], page: { url: string; locale: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: page.url,
    inLanguage: page.locale,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
