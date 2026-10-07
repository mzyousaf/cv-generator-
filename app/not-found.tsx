import Link from "next/link";
import { LogoMark, Logo } from "@/components/ui/logo";
import { buttonStyles } from "@/components/ui/button-styles";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function NotFound() {
  const t = await getServerDictionary();

  return (
    <main className="scheme-light relative isolate flex min-h-dvh flex-1 flex-col items-center justify-center overflow-hidden bg-ink-mesh px-4 py-16 text-center text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid-faint [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />
      <Link
        href="/"
        className="absolute start-4 top-5 inline-flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:start-6"
      >
        <Logo tone="light" />
      </Link>

      <LogoMark className="size-14 opacity-90" />
      <p className="mt-6 font-brand text-7xl font-bold tracking-tight text-white sm:text-8xl">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{t.notFound.title}</h1>
      <p className="mt-3 max-w-md text-base text-slate-300">{t.notFound.body}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={buttonStyles({ variant: "primary", size: "md", className: "min-h-11" })}>
          {t.notFound.home}
        </Link>
        <Link href="/dashboard" className={buttonStyles({ variant: "inverse", size: "md", className: "min-h-11" })}>
          {t.notFound.dashboard}
        </Link>
      </div>
    </main>
  );
}
