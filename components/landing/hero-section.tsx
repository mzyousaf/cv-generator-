import Link from "next/link";
import { GenerateFreeButton } from "@/components/landing/generate-free-button";
import { ProductPreview } from "@/components/landing/product-preview";

export function HeroSection() {
  return (
    <section className="relative border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700 sm:text-sm">
              Professional CV builder
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.08] lg:text-[3.25rem]">
              Build a professional CV without the busywork
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600 sm:text-xl sm:leading-relaxed">
              Use a structured editor, polish your content with AI, pick a
              template, and download a PDF—everything you need, nothing extra.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <GenerateFreeButton className="w-full sm:w-auto" />
              <Link
                href="/login"
                className="inline-flex min-h-11 items-center justify-center text-sm font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:justify-start"
              >
                Sign in to your account
              </Link>
            </div>
          </div>

          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
