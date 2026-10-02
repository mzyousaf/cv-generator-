import type { Metadata } from "next";
import {
  Geist_Mono,
  Instrument_Serif,
  Noto_Sans_Arabic,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { I18nProvider } from "@/components/i18n/i18n-provider";
import { siteConfig } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeDirection } from "@/lib/i18n/preferences";
import { getPreferences } from "@/lib/i18n/server";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getPreferences();
  return {
    title: siteConfig.name,
    description: getDictionary(locale).meta.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const preferences = await getPreferences();

  return (
    <html
      lang={preferences.locale}
      dir={localeDirection(preferences.locale)}
      data-theme={preferences.theme}
      data-mode={preferences.mode}
      className={`${jakarta.variable} ${instrument.variable} ${notoArabic.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider
          value={{ ...preferences, t: getDictionary(preferences.locale) }}
        >
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
