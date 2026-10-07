"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";
import { PreferencesMenu } from "@/components/preferences/preferences-menu";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  const { t } = useI18n();
  return (
    <main className="grid flex-1 bg-background lg:grid-cols-[1fr_1.1fr]">
      <aside className="scheme-light relative isolate hidden overflow-hidden bg-ink-mesh px-12 py-12 text-white lg:flex lg:flex-col">
        <div
          className="absolute inset-0 -z-10 bg-grid-faint [mask-image:radial-gradient(ellipse_at_top_left,black_25%,transparent_70%)]"
          aria-hidden="true"
        />
        <Link
          href="/"
          className="inline-flex w-fit items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <Logo tone="light" />
        </Link>

        <div className="my-auto max-w-md py-12">
          <h2 className="text-4xl font-bold leading-[1.1] tracking-[-0.03em]">
            {t.auth.shellTitle}{" "}
            <span className="font-display font-normal italic text-gradient">
              {t.auth.shellHighlight}
            </span>
          </h2>
          <ul className="mt-10 space-y-6">
            {t.auth.perks.map((perk) => (
              <li key={perk.title} className="flex gap-4">
                <span className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-blue-200">
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>
                  <span className="block font-semibold text-white">{perk.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-400">
                    {perk.body}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-slate-500">{t.auth.shellNote}</p>
      </aside>

      <div className="relative flex flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div
          className="absolute inset-x-0 top-0 h-72 bg-dots-soft [mask-image:linear-gradient(to_bottom,black,transparent)]"
          aria-hidden="true"
        />
        <div className="absolute end-4 top-4 z-20 sm:end-6 sm:top-6">
          <PreferencesMenu />
        </div>
        <div className="relative w-full max-w-md">
          <Link
            href="/"
            className="mb-10 flex w-fit rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"
          >
            <Logo />
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-[-0.025em] text-slate-950">
              {title}
            </h1>
            <p className="text-slate-500">{description}</p>
          </div>
          <div className="mt-8 rounded-3xl border border-slate-200/70 bg-surface p-6 shadow-lift sm:p-8">
            {children}
          </div>
          <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
        </div>
      </div>
    </main>
  );
}

type AuthLinkProps = {
  href: string;
  children: ReactNode;
};

export function AuthLink({ href, children }: AuthLinkProps) {
  return (
    <Link
      href={href}
      className="cursor-pointer font-semibold text-blue-600 underline-offset-2 transition-colors hover:text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      {children}
    </Link>
  );
}
