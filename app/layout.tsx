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
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeDirection } from "@/lib/i18n/preferences";
import { getPreferences } from "@/lib/i18n/server";
import "./globals.css";

// latin-ext covers Polish and Turkish letters (ł, ż, ğ, ş…) in the brand font.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
});

// Plus Jakarta Sans has no basic Cyrillic, so Russian uses Noto Sans. It is
// listed first in the font stacks and covers only Cyrillic code points; with
// no Arial-based fallback face of its own, Latin text falls through to
// Jakarta. (Listed after Jakarta, Jakarta's local Arial fallback would claim
// Cyrillic first on machines that have Arial.)
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

// Wordmark typeface for the Resumivo logo.
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
  return {
    title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
    description: getDictionary(locale).meta.description,
    applicationName: siteConfig.name,
    appleWebApp: { title: siteConfig.name, statusBarStyle: "black-translucent" },
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
