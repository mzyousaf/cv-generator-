"use client";

import { useI18n } from "@/components/i18n/i18n-provider";

import Link from "next/link";
import type { ReactNode } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { AuthModalProvider } from "@/components/landing/auth-modal-context";
import { LandingFooter } from "@/components/landing/footer";
import { Logo } from "@/components/ui/logo";
import { PreferencesMenu } from "@/components/preferences/preferences-menu";

type LegalPageLayoutProps = {
  title: string;
  children: ReactNode;
};

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  const { t, locale } = useI18n();
  return (
    <AuthModalProvider>
      <div className="flex min-h-full flex-col bg-background text-slate-900">
        {/* No overflow clipping here: the preferences panel must float over the content card. */}
        <header className="scheme-light relative z-20 bg-ink-mesh text-white">
          <div
            className="pointer-events-none absolute inset-0 bg-grid-faint [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_75%)]"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
            <Link
              href="/"
              className="min-w-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Logo tone="light" />
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              <PreferencesMenu tone="dark" />
              <Link
                href="/"
                aria-label={t.legal.backHome}
                className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-xl border border-white/15 bg-white/5 px-2.5 text-xs font-semibold sm:rounded-full sm:px-3.5 text-slate-200 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <svg viewBox="0 0 24 24" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
                <span className="hidden sm:inline">{t.legal.backHome}</span>
              </Link>
            </div>
          </div>
          <div className="relative mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">{t.legal.eyebrow}</p>
            <h1 className="mt-3 hyphens-auto text-[2rem] font-bold leading-tight tracking-[-0.03em] [overflow-wrap:anywhere] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-slate-400">
              {t.legal.lastUpdated}
            </p>
          </div>
        </header>
        <main className="relative z-10 mx-auto -mt-14 w-full max-w-3xl flex-1 px-4 pb-20 sm:px-6">
          {locale !== "en" ? (
            <p className="mb-4 rounded-2xl border border-blue-200/70 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              {t.legal.englishOnly}
            </p>
          ) : null}
          <article className="legal-content space-y-6 rounded-3xl border border-slate-200/70 bg-surface p-6 text-[0.95rem] leading-relaxed text-slate-600 shadow-lift sm:p-10 [&_a]:font-semibold [&_a]:text-blue-600 [&_a]:underline-offset-2 hover:[&_a]:text-blue-700 hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-slate-950 [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:marker:text-blue-400">
            {children}
          </article>
        </main>
        <LandingFooter />
        <AuthModal />
      </div>
    </AuthModalProvider>
  );
}
