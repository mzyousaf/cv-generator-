"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useState, useTransition } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { cn } from "@/lib/cn";
import {
  COLOR_MODES,
  LOCALE_LABELS,
  LOCALES,
  PREFERENCE_COOKIES,
  THEME_SWATCHES,
  THEMES,
  localeDirection,
  type ColorMode,
  type Locale,
  type ThemeId,
} from "@/lib/i18n/preferences";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Persist a preference cookie and reflect it on <html> immediately. */
function applyPreference(
  cookie: string,
  value: string,
  root: { theme?: string; mode?: string; lang?: string; dir?: string },
) {
  document.cookie = `${cookie}=${encodeURIComponent(value)}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  const html = document.documentElement;
  if (root.theme) html.dataset.theme = root.theme;
  if (root.mode) html.dataset.mode = root.mode;
  if (root.lang) html.lang = root.lang;
  if (root.dir) html.dir = root.dir;
}

function ModeIcon({ mode }: { mode: ColorMode }) {
  if (mode === "light") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }
  if (mode === "dark") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

/** Shared state and actions for the language, theme and appearance controls. */
function usePreferenceControls() {
  const { locale, theme, mode } = useI18n();
  const router = useRouter();
  const [current, setCurrent] = useState({ theme, mode });
  const [isPending, startTransition] = useTransition();

  function chooseTheme(next: ThemeId) {
    applyPreference(PREFERENCE_COOKIES.theme, next, { theme: next });
    setCurrent((value) => ({ ...value, theme: next }));
  }

  function chooseMode(next: ColorMode) {
    applyPreference(PREFERENCE_COOKIES.mode, next, { mode: next });
    setCurrent((value) => ({ ...value, mode: next }));
  }

  function chooseLocale(next: Locale) {
    if (next === locale) {
      return;
    }
    applyPreference(PREFERENCE_COOKIES.locale, next, {
      lang: next,
      dir: localeDirection(next),
    });
    startTransition(() => router.refresh());
  }

  return { locale, current, isPending, chooseTheme, chooseMode, chooseLocale };
}

type PreferenceControls = ReturnType<typeof usePreferenceControls>;

function PreferenceOptions({ controls }: { controls: PreferenceControls }) {
  const { t } = useI18n();
  const { locale, current, isPending, chooseTheme, chooseMode, chooseLocale } = controls;

  return (
    <>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {t.prefs.language}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {LOCALES.map((code) => (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={code === locale}
            disabled={isPending}
            onClick={() => chooseLocale(code)}
            className={cn(
              "flex min-w-0 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-start text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60",
              code === locale
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50",
            )}
          >
            <span className="truncate">{LOCALE_LABELS[code]}</span>
            <span className="text-[10px] font-bold uppercase text-slate-400">{code}</span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {t.prefs.theme}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {THEMES.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={id === current.theme}
            title={t.prefs.themes[id]}
            onClick={() => chooseTheme(id)}
            className={cn(
              "group flex min-w-0 items-center gap-2 rounded-xl border px-2 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              id === current.theme
                ? "border-slate-300 bg-slate-100 text-slate-900"
                : "border-transparent text-slate-600 hover:bg-slate-50",
            )}
          >
            <span
              className={cn(
                "size-5 shrink-0 rounded-full shadow-inner ring-offset-2 ring-offset-surface transition-transform group-hover:scale-110",
                id === current.theme && "ring-2 ring-slate-900/60",
              )}
              style={{ background: THEME_SWATCHES[id] }}
              aria-hidden="true"
            />
            <span className="min-w-0 truncate">{t.prefs.themes[id]}</span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {t.prefs.appearance}
      </p>
      <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
        {COLOR_MODES.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={value === current.mode}
            onClick={() => chooseMode(value)}
            className={cn(
              "inline-flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-1.5 py-1.5 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              value === current.mode
                ? "bg-surface text-blue-700 shadow-[0_1px_3px_rgb(15_23_42/0.15)]"
                : "text-slate-500 hover:text-slate-900",
            )}
          >
            <ModeIcon mode={value} />
            <span className="truncate">{t.prefs.modes[value]}</span>
          </button>
        ))}
      </div>
    </>
  );
}

/** The preference controls laid out inline, e.g. inside a mobile menu. */
export function PreferencesPanel({ className }: { className?: string }) {
  const { t } = useI18n();
  const controls = usePreferenceControls();

  return (
    <section
      aria-label={t.prefs.title}
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-surface p-4 text-slate-900 ring-1 ring-slate-900/5",
        className,
      )}
    >
      <PreferenceOptions controls={controls} />
    </section>
  );
}

/** Keep gap between a floating panel and the viewport edges. */
const VIEWPORT_GUTTER = 12;

type PreferencesMenuProps = {
  /** `dark` for placement on ink surfaces (navbar, sidebar). */
  tone?: "light" | "dark";
  /** Which edge the panel aligns to. */
  align?: "start" | "end";
  /** Open the panel upwards (e.g. at the bottom of a sidebar). */
  placement?: "bottom" | "top";
  /** `sm` matches small buttons (h-9), e.g. in the builder toolbar. */
  size?: "sm" | "md";
  className?: string;
};

export function PreferencesMenu({
  tone = "light",
  align = "end",
  placement = "bottom",
  size = "md",
  className,
}: PreferencesMenuProps) {
  const { t } = useI18n();
  const controls = usePreferenceControls();
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Nudge the panel sideways so it never runs off a narrow screen.
  useLayoutEffect(() => {
    if (!open) {
      return;
    }
    function fit() {
      const panel = panelRef.current;
      if (!panel) {
        return;
      }
      panel.style.translate = "0px";
      const rect = panel.getBoundingClientRect();
      const viewport = document.documentElement.clientWidth;
      let next = 0;
      if (rect.left < VIEWPORT_GUTTER) {
        next = VIEWPORT_GUTTER - rect.left;
      } else if (rect.right > viewport - VIEWPORT_GUTTER) {
        next = viewport - VIEWPORT_GUTTER - rect.right;
      }
      panel.style.translate = "";
      setShift(next);
    }
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [open]);

  const triggerClass =
    tone === "dark"
      ? "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white focus-visible:ring-blue-400"
      : "border-slate-200 bg-surface text-slate-700 shadow-[0_1px_2px_rgb(15_23_42/0.05)] hover:border-slate-300 hover:text-slate-950 focus-visible:ring-blue-500";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t.prefs.open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-xl border px-2.5 text-xs font-bold uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2",
          size === "sm" ? "h-9" : "h-10",
          triggerClass,
        )}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
        <span>{controls.locale}</span>
        <span
          className="size-2.5 rounded-full ring-2 ring-white/70"
          style={{ background: THEME_SWATCHES[controls.current.theme] }}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={t.prefs.title}
          style={shift ? { translate: `${shift}px 0` } : undefined}
          className={cn(
            "scheme-follow absolute z-50 w-[min(19rem,calc(100vw-1.5rem))] animate-fade-up rounded-2xl border border-slate-200/80 bg-surface p-4 text-slate-900 shadow-[0_24px_60px_-20px_rgb(7_10_26/0.45)] ring-1 ring-slate-900/5 [animation-duration:0.25s]",
            align === "end" ? "end-0" : "start-0",
            placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
          )}
        >
          <PreferenceOptions controls={controls} />
        </div>
      ) : null}
    </div>
  );
}
