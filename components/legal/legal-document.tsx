import { siteConfig } from "@/lib/constants";
import { format } from "@/lib/i18n/format";
import type { LegalBlock } from "@/lib/legal/types";

/** Render structured legal blocks inside LegalPageLayout's article styles. */
export function LegalDocumentBody({ blocks }: { blocks: LegalBlock[] }) {
  const fill = (text: string) => format(text, { name: siteConfig.name });

  return (
    <>
      {blocks.map((block, index) => {
        if ("h" in block) {
          return <h2 key={index}>{fill(block.h)}</h2>;
        }
        if ("ul" in block) {
          return (
            <ul key={index}>
              {block.ul.map((item) => (
                <li key={item}>{fill(item)}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{fill(block.p)}</p>;
      })}
    </>
  );
}
