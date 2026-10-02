/** A legal document as structured blocks so every locale renders identically. */
export type LegalBlock = { h: string } | { p: string } | { ul: string[] };

export type LegalDocument = {
  title: string;
  description: string;
  blocks: LegalBlock[];
};
