"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { AuthModalProvider } from "@/components/landing/auth-modal-context";
import { LandingFooter } from "@/components/landing/footer";
import { Logo } from "@/components/ui/logo";

type LegalPageLayoutProps = {
  title: string;
  children: ReactNode;
};

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <AuthModalProvider>
      <div className="flex min-h-full flex-col bg-background text-slate-900">
        <header className="relative isolate overflow-hidden bg-ink-mesh text-white">
          <div
            className="absolute inset-0 -z-10 bg-grid-faint [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_75%)]"
            aria-hidden="true"
          />
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
            <Link
              href="/"
              className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Logo tone="light" />
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              ← Back home
            </Link>
          </div>
          <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Legal</p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-slate-400">
              Last updated: [PLACEHOLDER: insert date]
            </p>
          </div>
        </header>
        <main className="relative z-10 mx-auto -mt-14 w-full max-w-3xl flex-1 px-4 pb-20 sm:px-6">
          <article className="legal-content space-y-6 rounded-3xl border border-slate-200/70 bg-white p-6 text-[0.95rem] leading-relaxed text-slate-600 shadow-lift sm:p-10 [&_a]:font-semibold [&_a]:text-blue-600 [&_a]:underline-offset-2 hover:[&_a]:text-blue-700 hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-slate-950 [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:marker:text-blue-400">
            {children}
          </article>
        </main>
        <LandingFooter />
        <AuthModal />
      </div>
    </AuthModalProvider>
  );
}
