import Link from "next/link";
import { GenerateFreeButton } from "@/components/landing/generate-free-button";
import { ProductPreview } from "@/components/landing/product-preview";

const valuePoints = [
  "Create a professional CV with structured sections",
  "Build quickly with autosave in the CV editor",
  "Improve summaries and experience with AI assist",
  "Download a PDF from your saved CV",
];

export function HeroSection() {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Online CV builder
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.1]">
              Create a professional CV—fast, clear, and ready to send
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              CV Generator helps you draft a polished resume, refine it with AI
              writing assistance, pick a template, and export a PDF when you are
              ready to apply.
            </p>
            <ul className="mt-6 space-y-2.5">
              {valuePoints.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm text-slate-700 sm:text-base">
                  <span
                    className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-700 text-[10px] font-bold text-white"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <GenerateFreeButton />
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                I already have an account
              </Link>
            </div>
          </div>

          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
