import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  /** Light text for dark surfaces. */
  tone?: "dark" | "light";
  showWordmark?: boolean;
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative isolate inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[0.6rem] bg-brand-gradient shadow-[0_1px_0_rgb(255_255_255/0.35)_inset,0_6px_14px_-4px_color-mix(in_oklab,var(--brand-600)_65%,transparent)] ring-1 ring-blue-700/30",
        className,
      )}
    >
      <span className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_100%_0%,color-mix(in_oklab,var(--color-gold-400)_85%,transparent)_0,transparent_45%)]" />
      <svg viewBox="0 0 24 24" className="relative size-[58%]" fill="none">
        <path
          d="M7 4.5h7.2L18 8.3V19a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 19Z"
          fill="white"
          fillOpacity="0.95"
        />
        <path d="M14 4.5V8.5h4" fill="white" fillOpacity="0.55" />
        <path
          d="M9.5 12h6M9.5 14.75h6M9.5 17.5h3.5"
          style={{ stroke: "var(--brand-600)" }}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function Logo({ className, tone = "dark", showWordmark = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {showWordmark ? (
        <span
          className={cn(
            "whitespace-nowrap text-[1.05rem] font-bold tracking-tight",
            tone === "light" ? "text-white" : "text-slate-950",
          )}
        >
          {siteConfig.name}
        </span>
      ) : null}
    </span>
  );
}
