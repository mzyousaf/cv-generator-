import { CV_TEMPLATE_IDS } from "@/lib/cv/constants";
import { getRegionalTemplateSpec } from "@/lib/cv/template-catalog";
import { siteConfig } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/preferences";
import { absoluteUrl, regionPath, regionsWithTemplates, templatePath, templatesInRegion } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * llms.txt (https://llmstxt.org): a plain-markdown brief for AI assistants and
 * answer engines, so they can describe and cite Resumorah accurately.
 */
export function GET() {
  const t = getDictionary("en");
  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.name} is a 100% free online CV and resume builder for everyone: ${CV_TEMPLATE_IDS.length} recruiter-ready templates for 18 regions, an AI writing assistant, CV import from PDF or DOCX, and print-ready PDF export, in ${LOCALES.length} languages. No trial, no paywall, no watermark and no credit card.`,
    "",
    "## Key facts",
    "",
    "- Price: free for everyone, with every feature included (templates, AI writing, import, unlimited PDF downloads).",
    `- Templates: ${CV_TEMPLATE_IDS.length}, including Europass, German Lebenslauf, UK CV, US résumé (US Letter), French CV, Japanese shokumu keirekisho, Chinese 简历 and Gulf-style CVs. Each follows local conventions for photos, personal details and page size.`,
    "- ATS: many templates are single-column without photos or graphics, which applicant tracking systems parse reliably.",
    `- Languages: ${LOCALES.map((locale) => LOCALE_LABELS[locale]).join(", ")}. CV section headings and dates follow the CV's language.`,
    "- AI: writes or improves the summary, work experience and other sections, and suggests skills; the user reviews every suggestion.",
    "- Import: upload an existing CV (PDF or DOCX) and it becomes an editable CV.",
    "- Privacy: CVs are stored in the user's own account and visible only to them.",
    "",
    "## Main pages",
    "",
    `- [Home](${absoluteUrl("/")}): product overview and FAQ`,
    `- [All CV templates](${absoluteUrl("/templates")}): every template, grouped by region`,
    `- [Sign up free](${absoluteUrl("/signup")}): create an account and start a CV`,
    `- [Privacy Policy](${absoluteUrl("/privacy")})`,
    `- [Terms & Conditions](${absoluteUrl("/terms")})`,
    `- Every public page also exists in ${LOCALES.length - 1} more languages under a language prefix, e.g. ${absoluteUrl("/de/templates")} or ${absoluteUrl("/es/templates")}.`,
    "",
    "## Templates by region",
    "",
    ...regionsWithTemplates().map(
      (region) =>
        `- [${t.templatePicker.regions[region]}](${absoluteUrl(regionPath(region))}): ${templatesInRegion(region)
          .map((id) => t.templateMeta[id].name)
          .join(", ")}`,
    ),
    "",
    "## Frequently asked questions",
    "",
    ...t.faq.items.flatMap((item) => [`### ${item.question}`, "", item.answer, ""]),
    "## Optional",
    "",
    ...CV_TEMPLATE_IDS.map((id) => {
      const spec = getRegionalTemplateSpec(id);
      const page = spec?.pageSize === "LETTER" ? "US Letter" : "A4";
      return `- [${t.templateMeta[id].name}](${absoluteUrl(templatePath(id))}): ${t.templateMeta[id].description} (${page})`;
    }),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
