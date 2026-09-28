import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { siteConfig } from "@/lib/constants";

const siteUrl =
  process.env.AUTH_URL?.trim() || "http://localhost:3000";

const title = "CV Generator — Create a Professional CV Online";
const description =
  "Build a professional CV with templates, an easy editor, AI writing assistance, and PDF export. Create, save, and download your resume online.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "CV generator",
    "resume builder",
    "professional CV",
    "CV templates",
    "PDF CV export",
    "AI CV writing",
    "online resume",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title,
    description,
    type: "website",
    siteName: siteConfig.name,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function Home() {
  return <LandingPage />;
}
