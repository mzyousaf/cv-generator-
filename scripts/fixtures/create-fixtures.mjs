import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(import.meta.dirname);
fs.mkdirSync(dir, { recursive: true });

/** Minimal PDF with extractable text (Helvetica, single line). */
const pdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 68>>stream
BT /F1 12 Tf 72 720 Td (QA Resume Jane Doe Software Engineer) Tj ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000261 00000 n 
0000000378 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
456
%%EOF`;

fs.writeFileSync(path.join(dir, "qa-resume.pdf"), pdf);

/** Minimal ZIP header + content (validation-only DOCX; extraction may fail in mammoth). */
const docx = Buffer.concat([
  Buffer.from("PK\x03\x04"),
  Buffer.from("word/document.xml"),
  Buffer.from(
    "<w:document><w:body><w:p><w:r><w:t>QA Resume DOCX Sample</w:t></w:r></w:p></w:body></w:document>",
  ),
]);
fs.writeFileSync(path.join(dir, "qa-resume.docx"), docx);

fs.writeFileSync(path.join(dir, "unsupported.txt"), "not a resume");
fs.writeFileSync(path.join(dir, "empty.pdf"), "");

console.log("Fixtures written to scripts/fixtures/");
