"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { AuthModalProvider } from "@/components/landing/auth-modal-context";
import { LandingFooter } from "@/components/landing/footer";
import { siteConfig } from "@/lib/constants";

type LegalPageLayoutProps = {
  title: string;
  children: ReactNode;
};

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <AuthModalProvider>
      <div className="flex min-h-full flex-col bg-slate-50/80 text-slate-900">
        <header className="border-b border-slate-200 bg-white/95">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
            <Link
              href="/"
              className="cursor-pointer text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              ← Back to {siteConfig.name}
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last updated: [PLACEHOLDER: insert date]
          </p>
          <article className="legal-content mt-8 space-y-6 text-base leading-relaxed text-slate-700 [&_a]:font-medium [&_a]:text-blue-700 [&_a]:underline-offset-2 hover:[&_a]:text-blue-800 hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:border-b [&_h2]:border-slate-200 [&_h2]:pb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_li]:mt-1 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
            {children}
          </article>
        </main>
        <LandingFooter />
        <AuthModal />
      </div>
    </AuthModalProvider>
  );
}
