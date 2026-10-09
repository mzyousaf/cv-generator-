import type { RegionalTemplateSpec } from "@/lib/cv/template-catalog";

type SpecInput = Pick<RegionalTemplateSpec, "id" | "region" | "layout" | "accent"> &
  Partial<Omit<RegionalTemplateSpec, "id" | "region" | "layout" | "accent">>;

/** Fills the conventions most templates share; each entry only states what differs. */
function template(input: SpecInput): RegionalTemplateSpec {
  const photo = input.photo ?? "none";
  const pageSize = input.pageSize ?? "A4";
  const twoColumn = input.layout === "sidebar" || input.layout === "europass";
  const tags: RegionalTemplateSpec["tags"] =
    input.tags ??
    [
      // ATS parsers cope best with one plain column and no photo.
      ...(!twoColumn && photo === "none" && !input.headerBand ? (["ats"] as const) : []),
      ...(input.layout === "europass" ? (["europass"] as const) : []),
      ...(twoColumn && input.layout !== "europass" ? (["two-column"] as const) : []),
      ...(input.personalDetails ? (["personal-details"] as const) : []),
      pageSize === "LETTER" ? ("letter" as const) : ("a4" as const),
    ];
  return {
    font: "sans",
    headerAlign: "start",
    heading: "accent-rule",
    summaryLabel: "profile",
    experienceLabel: "workExperience",
    educationLabel: "education",
    personalDetails: false,
    signature: false,
    referencesNote: false,
    compact: false,
    ...input,
    photo,
    pageSize,
    tags,
  };
}

/**
 * The extended collection: role and style templates for every market plus
 * regional formats for markets the original set did not cover.
 */
export const EXTENDED_TEMPLATES: RegionalTemplateSpec[] = [
  // ---- Global: role and style templates -------------------------------------
  template({ id: "minimal-mono", region: "global", layout: "single", accent: "#111827", heading: "caps", headerAlign: "center" }),
  template({ id: "tech-engineer", region: "global", layout: "single", accent: "#0369a1", heading: "bar" }),
  template({ id: "startup-bold", region: "global", layout: "single", accent: "#0e7490", headerBand: "#0f172a", heading: "caps" }),
  template({ id: "elegant-serif", region: "global", layout: "single", accent: "#78350f", font: "serif", headerAlign: "center", heading: "rule" }),
  template({ id: "executive-navy", region: "global", layout: "single", accent: "#8a6a1c", headerBand: "#0b1f3a", font: "serif", experienceLabel: "professionalExperience" }),
  template({ id: "consultant-pro", region: "global", layout: "single", accent: "#0f766e", heading: "block", experienceLabel: "professionalExperience" }),
  template({ id: "designer-portfolio", region: "global", layout: "sidebar", accent: "#be185d", sidebarColor: "#3b0764", heading: "caps", photo: "optional" }),
  template({ id: "marketing-pop", region: "global", layout: "sidebar", accent: "#c2410c", sidebarColor: "#431407", heading: "bar", photo: "optional" }),
  template({ id: "first-job", region: "global", layout: "single", accent: "#15803d", heading: "accent-rule", summaryLabel: "objective", headerAlign: "center" }),
  template({ id: "healthcare-pro", region: "global", layout: "single", accent: "#0e7490" }),
  template({ id: "legal-classic", region: "global", layout: "single", accent: "#1f2937", font: "serif", headerAlign: "center", heading: "caps", summaryLabel: "summary", compact: true }),
  template({ id: "finance-analyst", region: "global", layout: "single", accent: "#14532d", font: "serif", heading: "caps", summaryLabel: "summary" }),
  template({ id: "sales-impact", region: "global", layout: "single", accent: "#b91c1c", heading: "block", summaryLabel: "summary" }),
  template({ id: "teacher-educator", region: "global", layout: "timeline", accent: "#6d28d9" }),
  template({ id: "research-scientist", region: "global", layout: "timeline", accent: "#1e3a8a", font: "serif", heading: "rule", educationLabel: "educationTraining" }),
  template({ id: "product-manager", region: "global", layout: "sidebar", accent: "#4f46e5", sidebarColor: "#1e1b4b", heading: "caps" }),
  template({ id: "data-analyst", region: "global", layout: "single", accent: "#075985", heading: "block" }),
  template({ id: "hospitality-service", region: "global", layout: "sidebar", accent: "#b45309", sidebarColor: "#292524", photo: "optional" }),
  template({ id: "compact-one-page", region: "global", layout: "single", accent: "#334155", heading: "rule", compact: true }),
  template({ id: "two-tone-modern", region: "global", layout: "single", accent: "#be185d", headerBand: "#1e293b", heading: "bar" }),

  // ---- Europe ---------------------------------------------------------------
  template({ id: "europass-compact", region: "europe", layout: "europass", accent: "#0e4194", compact: true, educationLabel: "educationTraining", personalDetails: true, photo: "optional" }),
  template({ id: "eu-institutions", region: "europe", layout: "europass", accent: "#1e3a8a", font: "serif", educationLabel: "educationTraining", personalDetails: true, photo: "optional" }),

  // ---- Nordics: photos are common but optional ------------------------------
  template({ id: "nordic-clean", region: "nordics", layout: "single", accent: "#0f766e", heading: "caps", photo: "optional" }),
  template({ id: "swedish-cv", region: "nordics", layout: "single", accent: "#1d4ed8", photo: "optional", headerAlign: "center", heading: "rule" }),
  template({ id: "danish-modern", region: "nordics", layout: "sidebar", accent: "#0e7490", sidebarColor: "#083344", heading: "caps", photo: "optional" }),

  // ---- Southern Europe: photo and personal details are customary ------------
  template({ id: "italian-cv", region: "southern-europe", layout: "europass", accent: "#166534", educationLabel: "educationTraining", personalDetails: true, photo: "optional" }),
  template({ id: "spanish-cv", region: "southern-europe", layout: "single", accent: "#b91c1c", personalDetails: true, photo: "expected" }),
  template({ id: "portuguese-cv", region: "southern-europe", layout: "sidebar", accent: "#047857", sidebarColor: "#022c22", heading: "accent-rule", personalDetails: true, photo: "expected" }),

  // ---- Benelux --------------------------------------------------------------
  template({ id: "dutch-cv", region: "benelux", layout: "single", accent: "#c2410c", heading: "bar", personalDetails: true, photo: "optional" }),
  template({ id: "belgian-cv", region: "benelux", layout: "timeline", accent: "#1f2937", personalDetails: true, photo: "optional" }),

  // ---- Central & Eastern Europe, Turkey and the CIS: photo is customary -------
  template({ id: "turkish-cv", region: "eastern-europe", layout: "single", accent: "#b91c1c", heading: "accent-rule", personalDetails: true, photo: "expected", headerBand: "#7f1d1d" }),
  template({ id: "cis-cv", region: "eastern-europe", layout: "timeline", accent: "#1e40af", personalDetails: true, photo: "expected", heading: "caps" }),
  template({ id: "polish-cv", region: "eastern-europe", layout: "single", accent: "#dc2626", personalDetails: true, photo: "expected" }),
  template({ id: "cee-modern", region: "eastern-europe", layout: "sidebar", accent: "#2563eb", sidebarColor: "#172554", heading: "bar", personalDetails: true, photo: "expected" }),

  // ---- UK & Ireland: no photo, references line --------------------------------
  template({ id: "uk-modern", region: "uk", layout: "sidebar", accent: "#0f766e", sidebarColor: "#134e4a", heading: "caps", referencesNote: true }),
  template({ id: "irish-cv", region: "uk", layout: "single", accent: "#15803d", referencesNote: true }),
  template({ id: "uk-graduate", region: "uk", layout: "single", accent: "#6d28d9", heading: "block", summaryLabel: "objective", referencesNote: true }),

  // ---- DACH: photo, personal data, place/date/signature -----------------------
  template({ id: "swiss-cv", region: "dach", layout: "timeline", accent: "#dc2626", heading: "caps", personalDetails: true, photo: "expected", signature: true }),
  template({ id: "austria-cv", region: "dach", layout: "timeline", accent: "#991b1b", font: "serif", heading: "rule", personalDetails: true, photo: "expected", signature: true }),
  template({ id: "dach-elegant", region: "dach", layout: "sidebar", accent: "#1e40af", sidebarColor: "#0f172a", heading: "rule", personalDetails: true, photo: "expected", signature: true, font: "serif" }),

  // ---- France ---------------------------------------------------------------
  template({ id: "cv-moderne", region: "france", layout: "single", accent: "#2563eb", headerBand: "#1e293b", heading: "caps", personalDetails: true, photo: "expected" }),
  template({ id: "cv-classique", region: "france", layout: "single", accent: "#1f2937", font: "serif", heading: "caps", personalDetails: true, photo: "optional" }),

  // ---- USA & Canada: no photo, US Letter --------------------------------------
  template({ id: "us-modern", region: "north-america", layout: "single", accent: "#1d4ed8", headerAlign: "center", summaryLabel: "summary", pageSize: "LETTER" }),
  template({ id: "us-tech", region: "north-america", layout: "single", accent: "#0f766e", heading: "bar", summaryLabel: "summary", compact: true, pageSize: "LETTER" }),
  template({ id: "federal-resume", region: "north-america", layout: "single", accent: "#111827", font: "serif", heading: "caps", summaryLabel: "summary", experienceLabel: "professionalExperience", pageSize: "LETTER" }),
  template({ id: "canada-modern", region: "north-america", layout: "single", accent: "#b91c1c", summaryLabel: "summary", pageSize: "LETTER" }),

  // ---- Latin America ----------------------------------------------------------
  template({ id: "brazil-curriculo", region: "latam", layout: "single", accent: "#15803d", personalDetails: true, photo: "optional", summaryLabel: "objective" }),
  template({ id: "mexico-cv", region: "latam", layout: "sidebar", accent: "#be123c", sidebarColor: "#4c0519", heading: "block", personalDetails: true, photo: "expected" }),
  template({ id: "latam-professional", region: "latam", layout: "single", accent: "#0369a1", heading: "block", personalDetails: true, photo: "expected" }),

  // ---- Middle East & Gulf -----------------------------------------------------
  template({ id: "saudi-cv", region: "middle-east", layout: "sidebar", accent: "#15803d", sidebarColor: "#052e16", personalDetails: true, photo: "expected" }),
  template({ id: "uae-modern", region: "middle-east", layout: "single", accent: "#8a6a1c", headerBand: "#0f172a", heading: "caps", personalDetails: true, photo: "expected" }),
  template({ id: "egypt-cv", region: "middle-east", layout: "single", accent: "#7c2d12", personalDetails: true, photo: "optional", heading: "block" }),

  // ---- Africa ---------------------------------------------------------------
  template({ id: "south-africa-cv", region: "africa", layout: "single", accent: "#047857", personalDetails: true, photo: "optional", referencesNote: true, heading: "bar" }),
  template({ id: "nigeria-cv", region: "africa", layout: "single", accent: "#15803d", heading: "caps", personalDetails: true, photo: "optional", referencesNote: true, summaryLabel: "objective" }),
  template({ id: "kenya-cv", region: "africa", layout: "sidebar", accent: "#b45309", sidebarColor: "#1c1917", heading: "caps", personalDetails: true, photo: "optional", referencesNote: true }),

  // ---- India & South Asia -----------------------------------------------------
  template({ id: "india-fresher", region: "india", layout: "single", accent: "#0f766e", heading: "bar", personalDetails: true, photo: "optional", summaryLabel: "objective" }),
  template({ id: "india-tech", region: "india", layout: "sidebar", accent: "#1d4ed8", sidebarColor: "#172554", heading: "caps" }),
  template({ id: "pakistan-cv", region: "india", layout: "single", accent: "#166534", personalDetails: true, photo: "optional", headerBand: "#14532d", heading: "caps" }),

  // ---- Southeast Asia ---------------------------------------------------------
  template({ id: "singapore-resume", region: "southeast-asia", layout: "single", accent: "#dc2626", summaryLabel: "summary" }),
  template({ id: "philippines-resume", region: "southeast-asia", layout: "single", accent: "#1d4ed8", heading: "caps", personalDetails: true, photo: "expected", summaryLabel: "objective" }),
  template({ id: "malaysia-resume", region: "southeast-asia", layout: "sidebar", accent: "#0e7490", sidebarColor: "#164e63", personalDetails: true, photo: "expected" }),

  // ---- Japan & Korea ----------------------------------------------------------
  template({ id: "japan-shokumu", region: "east-asia", layout: "single", accent: "#1f2937", heading: "block", personalDetails: true, photo: "expected" }),
  template({ id: "korea-resume", region: "east-asia", layout: "single", accent: "#0369a1", personalDetails: true, photo: "expected", headerBand: "#0c4a6e", heading: "bar" }),

  // ---- China ------------------------------------------------------------------
  template({ id: "china-tech", region: "china", layout: "single", accent: "#2563eb", heading: "caps", personalDetails: true, photo: "expected", headerBand: "#1e3a8a" }),
  template({ id: "hong-kong-cv", region: "china", layout: "single", accent: "#b91c1c", photo: "optional", font: "serif", heading: "caps" }),

  // ---- Australia & New Zealand: no photo, references line ---------------------
  template({ id: "nz-cv", region: "oceania", layout: "single", accent: "#0f766e", referencesNote: true, heading: "caps", headerAlign: "center" }),
  template({ id: "australia-modern", region: "oceania", layout: "sidebar", accent: "#0369a1", sidebarColor: "#0c4a6e", heading: "caps", referencesNote: true }),
];

