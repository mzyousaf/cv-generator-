import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/cn";

/**
 * The Resumorah mark: a rounded R with a four-point spark beside it. "Orah"
 * means light, and the spark doubles as the AI cue used across the product.
 */
export const BRAND_MARK_PATH = "M20 84V26H40a14 14 0 0 1 0 28H20M36 54L50 84";
export const BRAND_SPARK_PATH =
  "M79 3C83.18 17.82 83.18 17.82 98 22C83.18 26.18 83.18 26.18 79 41C74.82 26.18 74.82 26.18 60 22C74.82 17.82 74.82 17.82 79 3Z";
const BRAND_GRADIENT_ID = "resumorah-brand-gradient";
const BRAND_GRADIENT_ON_LIGHT_ID = "resumorah-brand-gradient-on-light";

/**
 * Shared gradient for every logo on the page. Rendered once in the root layout:
 * gradients defined inside a `display: none` SVG don't paint, so the definition
 * can't live inside individual (sometimes hidden) logos.
 */
export function BrandDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="pointer-events-none absolute">
      <defs>
        {/* User-space units: one continuous sweep across the R and the spark
            (every mark uses a 0 0 100 100 viewBox). */}
        <linearGradient id={BRAND_GRADIENT_ID} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0" stopColor="#e11d48" />
          <stop offset="1" stopColor="#fb923c" />
        </linearGradient>
        {/* On light surfaces the tangerine end is deepened to keep 3:1 contrast. */}
        <linearGradient id={BRAND_GRADIENT_ON_LIGHT_ID} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0" stopColor="#e11d48" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

type LogoMarkProps = {
  className?: string;
  /** `stroke`: the bare gradient mark. `tile`: white mark on a gradient app-icon tile. */
  variant?: "stroke" | "tile";
  /**
   * Fit the box to the ink (R + spark) for a mark shown on its own, e.g.
   * centred above text. The default box keeps the R on the lockup baseline.
   */
  fitted?: boolean;
  /** The mark sits on a light surface (deeper gradient end for contrast). */
  onLight?: boolean;
};

export function LogoMark({ className, variant = "stroke", fitted = false, onLight = false }: LogoMarkProps) {
  const gradient = `url(#${onLight ? BRAND_GRADIENT_ON_LIGHT_ID : BRAND_GRADIENT_ID})`;
  if (variant === "tile") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-[0.6rem] shadow-[0_1px_0_rgb(255_255_255/0.3)_inset,0_6px_14px_-5px_rgb(225_29_72/0.55)]",
          // cn() does not merge conflicting classes, so the default size only applies without one.
          className ?? "size-8",
        )}
        style={{ backgroundImage: "linear-gradient(135deg, #e11d48, #fb923c)" }}
      >
        {/* Shifted viewBox centres the ink (R + spark) optically in the tile. */}
        <svg viewBox="6 -4 100 100" className="size-[62%]" fill="none">
          <path
            d={BRAND_MARK_PATH}
            stroke="#fff"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d={BRAND_SPARK_PATH} fill="#fff" />
        </svg>
      </span>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox={fitted ? "10 0 92 92" : "0 0 100 100"}
      fill="none"
      className={cn("shrink-0", className ?? "size-8")}
    >
      <path
        d={BRAND_MARK_PATH}
        stroke={gradient}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={BRAND_SPARK_PATH} fill={gradient} />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  /** Light text for dark surfaces. */
  tone?: "dark" | "light";
  showWordmark?: boolean;
};

/**
 * Mark + wordmark lockup, optically centred: the mark's ink and the
 * wordmark's x-height share a centre line. Everything is sized in `em` so the
 * proportions hold at any font size. `align-middle` + `leading-none` stop the
 * lockup from inheriting extra line-box space (and drifting) inside links.
 */
export function Logo({ className, tone = "dark", showWordmark = true }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[0.2em] align-middle font-brand text-[1.3rem] font-bold leading-none",
        className,
      )}
    >
      {/* Lifted so the R's foot sits on the wordmark's baseline (the spark
          raises the mark's ink box above the letters). */}
      <LogoMark
        onLight={tone === "dark"}
        className={cn("size-[1.3em]", showWordmark && "-translate-y-[0.2em]")}
      />
      {showWordmark ? (
        <span
          data-logo-word=""
          className={cn(
            // In LTR the spark sits over empty space after the R; pull the word in.
            "whitespace-nowrap lowercase tracking-[-0.02em] ltr:-ms-[0.08em]",
            tone === "light" ? "text-white" : "text-slate-950",
          )}
        >
          {siteConfig.name}
        </span>
      ) : null}
    </span>
  );
}
