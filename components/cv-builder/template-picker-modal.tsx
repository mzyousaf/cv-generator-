"use client";

import { memo, useDeferredValue, useMemo, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { CvTemplateRenderer } from "@/components/cv-templates/cv-template-renderer";
import { templatePreviewSample } from "@/components/cv-templates/sample-preview-state";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { updateCvAction } from "@/lib/cv/actions";
import { cn } from "@/lib/cn";
import { CV_TEMPLATE_IDS, type CvTemplateId } from "@/lib/cv/constants";
import {
  browseTemplates,
  getRegionalTemplateSpec,
  POPULAR_THRESHOLD,
  TEMPLATE_REGIONS,
  TEMPLATE_STYLES,
  templateFacets,
  type TemplateRegion,
  type TemplateSort,
  type TemplateStyle,
} from "@/lib/cv/template-catalog";
import { format } from "@/lib/i18n/format";
import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n/preferences";
import { localizeServerMessage } from "@/lib/i18n/server-messages";

type TemplatePickerModalProps = {
  open: boolean;
  onClose: () => void;
  cvId: string;
  selectedTemplate: CvTemplateId;
  documentLocale: Locale;
  onDocumentLocaleChange: (locale: Locale) => void;
  onTemplateChange: (templateId: CvTemplateId) => void;
  onTemplateSaved: (templateId: CvTemplateId) => void;
  onTemplateError: (message: string) => void;
};

const PAGE_WIDTH_PX = { A4: 794, LETTER: 816 } as const;

type PhotoFilter = "any" | "with" | "without";
type ColumnsFilter = "any" | "one" | "two";

// Memoised: typing in the search box must not re-render 90 full CV previews.
const TemplateThumbnail = memo(function TemplateThumbnail({
  templateId,
  locale,
}: {
  templateId: CvTemplateId;
  locale: Locale;
}) {
  const sample = useMemo(
    () => ({ ...templatePreviewSample(locale), template: templateId }),
    [locale, templateId],
  );
  const width = PAGE_WIDTH_PX[getRegionalTemplateSpec(templateId)?.pageSize ?? "A4"];

  return (
    <div
      aria-hidden
      className="pointer-events-none relative h-44 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-100 to-blue-50/60"
    >
      <div
        className="absolute left-1/2 top-3 origin-top -translate-x-1/2 scale-[0.2] shadow-[0_20px_40px_-12px_rgb(15_23_42/0.4)]"
        style={{ width }}
      >
        <CvTemplateRenderer templateId={templateId} state={sample} />
      </div>
    </div>
  );
});

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="9" cy="9" r="5.5" />
      <path d="M13.2 13.2 17 17" />
    </svg>
  );
}

export function TemplatePickerModal({
  open,
  onClose,
  cvId,
  selectedTemplate,
  documentLocale,
  onDocumentLocaleChange,
  onTemplateChange,
  onTemplateSaved,
  onTemplateError,
}: TemplatePickerModalProps) {
  const { t, locale } = useI18n();
  const copy = t.templatePicker;
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<TemplateSort>("popular");
  const [region, setRegion] = useState<TemplateRegion | "all">("all");
  const [style, setStyle] = useState<TemplateStyle | "all">("all");
  const [atsOnly, setAtsOnly] = useState(false);
  const [photo, setPhoto] = useState<PhotoFilter>("any");
  const [columns, setColumns] = useState<ColumnsFilter>("any");
  const searchRef = useRef<HTMLInputElement>(null);
  const deferredQuery = useDeferredValue(query);

  // Each opening starts from the full collection, not the last session's filters.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      resetFilters();
    }
  }

  const filtersActive =
    query.trim() !== "" || region !== "all" || style !== "all" || atsOnly || photo !== "any" || columns !== "any";

  function resetFilters() {
    setQuery("");
    setRegion("all");
    setStyle("all");
    setAtsOnly(false);
    setPhoto("any");
    setColumns("any");
  }

  function clearFilters() {
    resetFilters();
    // The clear button unmounts itself; keep keyboard focus inside the dialog.
    searchRef.current?.focus();
  }

  const visible = useMemo(
    () =>
      browseTemplates(
        { query: deferredQuery, region, style, ats: atsOnly, photo, columns },
        sort,
        {
          // Names and search use the UI language; recommendations follow the CV's language.
          locale,
          recommendFor: documentLocale,
          nameOf: (id) => t.templateMeta[id].name,
          searchTextOf: (id) => {
            const facets = templateFacets(id);
            return [
              t.templateMeta[id].name,
              t.templateMeta[id].description,
              copy.regions[facets.region],
              copy.styles[facets.style],
              ...(getRegionalTemplateSpec(id)?.tags ?? []).map((tag) => copy.tags[tag]),
            ].join(" ");
          },
        },
        CV_TEMPLATE_IDS,
      ),
    [deferredQuery, region, style, atsOnly, photo, columns, sort, documentLocale, locale, t, copy],
  );

  async function handleSelect(templateId: CvTemplateId) {
    if (templateId === selectedTemplate || isSavingTemplate) {
      return;
    }

    const previousTemplate = selectedTemplate;
    onTemplateChange(templateId);
    setIsSavingTemplate(true);

    const result = await updateCvAction(cvId, { template: templateId });
    setIsSavingTemplate(false);

    if (!result.success) {
      onTemplateError(localizeServerMessage(t, result.error.message));
      onTemplateChange(previousTemplate);
      return;
    }

    onTemplateSaved(templateId);
    onClose();
  }

  const toggle = (pressed: boolean, label: string, onClick: () => void) => (
    <button
      key={label}
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        pressed
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-slate-200 bg-surface text-slate-600 hover:border-slate-300 hover:text-slate-900",
      )}
    >
      {pressed ? (
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.5 8.5l3 3 6-7" />
        </svg>
      ) : null}
      {label}
    </button>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.builder.templates}
      description={`${format(t.builder.templatesCurrent, { name: t.templateMeta[selectedTemplate].name })}${isSavingTemplate ? t.builder.templatesSaving : ""}`}
      className="sm:max-w-5xl"
    >
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label htmlFor="cv-document-locale" className="text-sm font-semibold text-slate-900">
            {copy.documentLanguage}
          </label>
          <p className="text-xs text-slate-500">{copy.documentLanguageHint}</p>
        </div>
        <Select
          id="cv-document-locale"
          value={documentLocale}
          onChange={(event) => onDocumentLocaleChange(event.target.value as Locale)}
          className="w-full sm:w-auto sm:min-w-44"
        >
          {LOCALES.map((code) => (
            <option key={code} value={code}>
              {LOCALE_LABELS[code]}
            </option>
          ))}
        </Select>
      </div>

      {/* Search, region, sort and style: two columns on phones, one row on desktop. */}
      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div className="relative col-span-2 lg:col-span-1">
          <label htmlFor="template-search" className="sr-only">
            {copy.search}
          </label>
          <SearchIcon />
          <input
            ref={searchRef}
            id="template-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.search}
            className="h-10 w-full rounded-xl border border-slate-200 bg-surface ps-10 pe-3.5 text-sm text-slate-900 shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/12"
          />
        </div>
        <Select aria-label={copy.regionLabel} value={region} onChange={(event) => setRegion(event.target.value as TemplateRegion | "all")} className="col-span-2 w-full lg:col-span-1">
          <option value="all">{copy.allRegions}</option>
          {TEMPLATE_REGIONS.map((value) => (
            <option key={value} value={value}>
              {copy.regions[value]}
            </option>
          ))}
        </Select>
        <Select aria-label={copy.sortLabel} value={sort} onChange={(event) => setSort(event.target.value as TemplateSort)} className="w-full">
          {(["popular", "recommended", "name"] as const).map((value) => (
            <option key={value} value={value}>
              {copy.sort[value]}
            </option>
          ))}
        </Select>
        <Select aria-label={copy.styleLabel} value={style} onChange={(event) => setStyle(event.target.value as TemplateStyle | "all")} className="w-full">
          <option value="all">{copy.allStyles}</option>
          {TEMPLATE_STYLES.map((value) => (
            <option key={value} value={value}>
              {copy.styles[value]}
            </option>
          ))}
        </Select>
      </div>

      {/* Toggle facets: one chip row that scrolls on narrow screens. */}
      <div
        role="group"
        aria-label={copy.filtersLabel}
        className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1"
      >
        {toggle(atsOnly, copy.filterAts, () => setAtsOnly((value) => !value))}
        {toggle(photo === "with", copy.filterWithPhoto, () => setPhoto((value) => (value === "with" ? "any" : "with")))}
        {toggle(photo === "without", copy.filterNoPhoto, () => setPhoto((value) => (value === "without" ? "any" : "without")))}
        {toggle(columns === "one", copy.filterOneColumn, () => setColumns((value) => (value === "one" ? "any" : "one")))}
        {toggle(columns === "two", copy.filterTwoColumns, () => setColumns((value) => (value === "two" ? "any" : "two")))}
      </div>

      <div className="mt-3 flex min-h-8 items-center justify-between gap-3">
        <p className="text-xs font-medium text-slate-500" aria-live="polite">
          {format(copy.showing, { n: visible.length, total: CV_TEMPLATE_IDS.length })}
        </p>
        {filtersActive ? (
          <button
            type="button"
            onClick={clearFilters}
            className="min-h-8 cursor-pointer rounded-lg px-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {copy.clearFilters}
          </button>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-600">{copy.noResults}</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 inline-flex min-h-10 cursor-pointer items-center rounded-xl border border-slate-200 bg-surface px-4 text-sm font-semibold text-slate-800 hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {copy.clearFilters}
          </button>
        </div>
      ) : (
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((templateId) => {
            const isSelected = templateId === selectedTemplate;
            const spec = getRegionalTemplateSpec(templateId);
            const facets = templateFacets(templateId);
            const popular = facets.popularity >= POPULAR_THRESHOLD;

            return (
              <button
                key={templateId}
                type="button"
                disabled={isSavingTemplate}
                aria-pressed={isSelected}
                onClick={() => void handleSelect(templateId)}
                // Offscreen cards skip layout and paint until scrolled near, so 90 previews stay fast.
                style={{ contentVisibility: "auto", containIntrinsicSize: "auto 320px" }}
                className={cn(
                  "group flex cursor-pointer flex-col rounded-2xl border p-3 text-start transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                  isSelected
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/15"
                    : "border-slate-200 bg-surface hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-soft",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                <div className="relative">
                  <TemplateThumbnail templateId={templateId} locale={documentLocale} />
                  {isSelected || popular ? (
                    <span
                      className={cn(
                        "absolute start-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm",
                        isSelected ? "bg-blue-600 text-white" : "bg-surface text-blue-700 ring-1 ring-blue-200",
                      )}
                    >
                      {isSelected ? copy.current : copy.popular}
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 flex items-start justify-between gap-2">
                  <p className="min-w-0 text-sm font-bold text-slate-950 [overflow-wrap:break-word]">{t.templateMeta[templateId].name}</p>
                  {/* Long region names truncate rather than squeeze the template name. */}
                  <span
                    title={copy.regions[facets.region]}
                    className="mt-px max-w-[50%] min-w-0 truncate rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                  >
                    {copy.regions[facets.region]}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {t.templateMeta[templateId].description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                    {copy.styles[facets.style]}
                  </span>
                  {(spec ? [...spec.tags, ...(spec.photo === "expected" ? (["photo"] as const) : spec.photo === "optional" ? (["photoOptional"] as const) : [])] : facets.ats ? (["ats"] as const) : []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-100"
                    >
                      {copy.tags[tag]}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
