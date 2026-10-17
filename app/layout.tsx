import type { Metadata, Viewport } from "next";
import {
  Geist_Mono,
  Instrument_Serif,
  Noto_Sans,
  Noto_Sans_Arabic,
  Plus_Jakarta_Sans,
  Syne,
} from "next/font/google";
import { I18nProvider } from "@/components/i18n/i18n-provider";
import { BrandDefs } from "@/components/ui/logo";
import { siteConfig } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";
import { OG_LOCALE } from "@/lib/seo-server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeDirection } from "@/lib/i18n/preferences";
import { getPreferences } from "@/lib/i18n/server";
import "./globals.css";

// latin-ext covers Polish and Turkish letters (ł, ż, ğ, ş…) in the brand font.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
});

// Plus Jakarta Sans has no basic Cyrillic, so Russian uses Noto Sans, which
// leads the font stack only for Russian pages and CVs (see globals.css).
const notoCyrillic = Noto_Sans({
  variable: "--font-cyrillic",
  subsets: ["cyrillic"],
  preload: false,
  adjustFontFallback: false,
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  // latin-ext: Polish and Turkish highlight words (ę, ś, ş, ı) stay in one typeface.
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  preload: false,
});

// Wordmark typeface for the Resumorah logo.
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getPreferences();
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${siteConfig.name} · ${t.meta.title}`, template: `%s · ${siteConfig.name}` },
    description: t.meta.description,
    applicationName: siteConfig.name,
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "productivity",
    appleWebApp: { title: siteConfig.name, statusBarStyle: "black-translucent" },
    formatDetection: { telephone: false, email: false, address: false },
    // Indexing is the default; only preview deployments opt out. Pages that
    // must stay out of search (login, dashboard, 404) set their own robots.
    robots:
      process.env.VERCEL_ENV === "preview"
        ? { index: false, follow: false }
        : { googleBot: { "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: `${siteConfig.name} · ${t.meta.title}`,
      description: t.meta.description,
      locale: OG_LOCALE[locale],
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} · ${t.meta.title}`,
      description: t.meta.description,
      images: ["/twitter-image.png"],
    },
    // Set these in the environment after verifying the site in each console.
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
      other: {
        ...(process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : {}),
        ...(process.env.YANDEX_SITE_VERIFICATION ? { "yandex-verification": process.env.YANDEX_SITE_VERIFICATION } : {}),
      },
    },
  };
}


export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#070a1a" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const preferences = await getPreferences();

  return (
    <html
      lang={preferences.locale}
      dir={localeDirection(preferences.locale)}
      data-theme={preferences.theme}
      data-mode={preferences.mode}
      className={`${jakarta.variable} ${instrument.variable} ${notoArabic.variable} ${notoCyrillic.variable} ${syne.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <BrandDefs />
        <I18nProvider
          value={{ ...preferences, t: getDictionary(preferences.locale) }}
        >
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
