import { GenerateFreeButton } from "@/components/landing/generate-free-button";

export function HeroSection() {
  return (
    <section className="relative border-b border-slate-200 bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700 sm:text-sm">
            Professional CV builder
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.08] lg:text-[3.25rem]">
            Build a professional CV without the busywork
          </h1>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-slate-600 sm:text-xl">
            Use a structured editor, polish your content with AI, pick a
            template, and download a PDF. Everything you need, nothing extra.
          </p>
          <div className="mt-9">
            <GenerateFreeButton className="w-full sm:w-auto" />
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Free to start. PDF export. Three professional templates.
          </p>
        </div>
      </div>
    </section>
  );
}
