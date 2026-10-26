import type { RegionGuide as RegionGuideCopy } from "@/lib/templates-content";

type RegionGuideProps = {
  title: string;
  labels: Record<keyof RegionGuideCopy, string>;
  guide: RegionGuideCopy;
};

const ORDER: (keyof RegionGuideCopy)[] = ["length", "personal", "focus", "tip"];

/** Local hiring conventions for a region (shown on region and template pages). */
export function RegionGuide({ title, labels, guide }: RegionGuideProps) {
  return (
    <section aria-labelledby="region-guide-title">
      <h2 id="region-guide-title" className="text-xl font-bold tracking-tight text-slate-950">
        {title}
      </h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {ORDER.map((key) => (
          <div key={key} className="rounded-2xl border border-slate-200/80 bg-surface p-5 shadow-soft">
            <dt className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">{labels[key]}</dt>
            <dd className="mt-2 text-[0.95rem] leading-relaxed text-slate-600">{guide[key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
