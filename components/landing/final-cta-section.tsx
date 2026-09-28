import { GenerateFreeButton } from "@/components/landing/generate-free-button";

export function FinalCtaSection() {
  return (
    <section className="border-t border-slate-800 bg-slate-900 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Your next opportunity starts with a better CV
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          Create your CV in the builder, refine it with AI assist, and export a
          PDF when you are ready to apply.
        </p>
        <div className="mt-8 flex justify-center">
          <GenerateFreeButton className="bg-white text-slate-900 hover:bg-slate-100 focus-visible:ring-white" />
        </div>
      </div>
    </section>
  );
}
