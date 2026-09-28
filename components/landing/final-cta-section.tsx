import { GenerateFreeButton } from "@/components/landing/generate-free-button";

export function FinalCtaSection() {
  return (
    <section className="border-t border-slate-800 bg-slate-900 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl sm:leading-tight">
          Ready to build your CV?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
          Open the editor, refine your content with AI, choose a template, and
          download a PDF when you are ready to apply.
        </p>
        <div className="mt-9 flex justify-center">
          <GenerateFreeButton className="w-full max-w-xs bg-white text-slate-900 shadow-lg hover:bg-slate-100 focus-visible:ring-white sm:w-auto sm:max-w-none" />
        </div>
      </div>
    </section>
  );
}
