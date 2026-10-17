import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/templates-pages/breadcrumbs";

type PageHeroProps = {
  breadcrumbs: { name: string; href?: string }[];
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
};

/** Dark header band shared by the public template pages. */
export function PageHero({ breadcrumbs, eyebrow, title, description, children }: PageHeroProps) {
  return (
    <header className="scheme-light relative isolate overflow-hidden bg-ink-mesh text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid-faint [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
      />
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
        <Breadcrumbs items={breadcrumbs} />
        {eyebrow ? (
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-[-0.03em] max-[360px]:text-[1.65rem] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">{description}</p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}
