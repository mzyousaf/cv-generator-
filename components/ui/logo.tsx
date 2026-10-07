import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/cn";

/** The Flow mark: one stroke draws the R and runs on into a V / tick. */
export const BRAND_MARK_PATH = "M22 84V18H46a17 17 0 0 1 0 34H34L55 84L84 18";
const BRAND_GRADIENT_ID = "resumivo-brand-gradient";

/**
 * Shared gradient for every logo on the page. Rendered once in the root layout:
 * gradients defined inside a `display: none` SVG don't paint, so the definition
 * can't live inside individual (sometimes hidden) logos.
 */
export function BrandDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="pointer-events-none absolute">
      <defs>
        <linearGradient id={BRAND_GRADIENT_ID} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e11d48" />
          <stop offset="1" stopColor="#fb923c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

type LogoMarkProps = {
  className?: string;
  /** `stroke`: the bare gradient mark. `tile`: white mark on a gradient app-icon tile. */
  variant?: "stroke" | "tile";
};

export function LogoMark({ className, variant = "stroke" }: LogoMarkProps) {
  if (variant === "tile") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-8 shrink-0 items-center justify-center rounded-[0.6rem] shadow-[0_1px_0_rgb(255_255_255/0.3)_inset,0_6px_14px_-5px_rgb(225_29_72/0.55)]",
          className,
        )}
        style={{ backgroundImage: "linear-gradient(135deg, #e11d48, #fb923c)" }}
      >
        <svg viewBox="0 0 100 100" className="size-[62%]" fill="none">
          <path
            d={BRAND_MARK_PATH}
            stroke="#fff"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      fill="none"
      className={cn("size-8 shrink-0", className)}
    >
      <path
        d={BRAND_MARK_PATH}
        stroke={`url(#${BRAND_GRADIENT_ID})`}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  /** Light text for dark surfaces. */
  tone?: "dark" | "light";
  showWordmark?: boolean;
};

export function Logo({ className, tone = "dark", showWordmark = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className="size-[1.85rem]" />
      {showWordmark ? (
        <span
          className={cn(
            "whitespace-nowrap font-brand text-[1.3rem] font-bold lowercase leading-none tracking-[-0.02em]",
            tone === "light" ? "text-white" : "text-slate-950",
          )}
        >
          {siteConfig.name}
        </span>
      ) : null}
    </span>
  );
}
