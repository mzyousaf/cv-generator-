/** A legal document as structured blocks so every locale renders identically. */
export type LegalBlock = { h: string } | { p: string } | { ul: string[] };

export type LegalDocument = {
  title: string;
  description: string;
  blocks: LegalBlock[];
};

/** Shown as "Last updated" on the legal pages; bump when either document changes. */
export const LEGAL_LAST_UPDATED = "2026-10-21";
