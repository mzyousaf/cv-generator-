import type { TemplateRegion, TemplateStyle } from "@/lib/cv/template-catalog";

/** Hiring conventions for one region, shown on its region page and its templates' pages. */
export type RegionGuide = {
  length: string;
  personal: string;
  focus: string;
  tip: string;
};

/**
 * Long-form copy for the public template pages. `{name}` is the template
 * name, `{region}` the region phrase and `{count}` the number of templates.
 */
export type TemplatesContent = {
  /** Used for `{region}` on global templates instead of the region name. */
  globalRegion: string;
  regionHeading: string;
  regionLabels: Record<keyof RegionGuide, string>;
  regions: Record<TemplateRegion, RegionGuide>;
  fitHeading: string;
  styles: Record<TemplateStyle, string>;
  faq: {
    heading: string;
    atsQ: string;
    atsYes: string;
    atsNo: string;
    photoQ: string;
    photoExpected: string;
    photoOptional: string;
    photoNone: string;
    lengthQ: string;
    freeQ: string;
    freeA: string;
    switchQ: string;
    switchA: string;
  };
};
