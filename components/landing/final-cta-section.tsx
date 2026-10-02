import { GenerateFreeButton } from "@/components/landing/generate-free-button";

export function FinalCtaSection() {
  return (
    <section className="bg-background px-4 pb-24 sm:px-6 sm:pb-32">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-ink-mesh px-6 py-16 text-center shadow-[0_40px_100px_-40px_rgb(40_26_110/0.6)] sm:px-12 sm:py-24">
        <div
          className="absolute inset-0 -z-10 bg-grid-faint [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
          aria-hidden="true"
        />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
          Your next role starts here
        </p>
        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-[-0.025em] text-white sm:text-5xl sm:leading-[1.08]">
          Ready to build a CV that{" "}
          <span className="font-display font-normal italic text-gradient">
            stands out?
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Open the editor, refine your content with AI, choose a template, and
          download a PDF when you are ready to apply.
        </p>
        <div className="mt-10 flex justify-center">
          <GenerateFreeButton variant="inverse" className="w-full max-w-xs sm:w-auto sm:max-w-none" />
        </div>
        <p className="mt-5 text-xs text-slate-400">Free to start · No credit card required</p>
      </div>
    </section>
  );
}
