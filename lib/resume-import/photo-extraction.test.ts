import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createCanvas } from "@napi-rs/canvas";
import JSZip from "jszip";
import { readFileSync } from "node:fs";
import { extractDocxPhoto } from "@/lib/resume-import/extract-docx";
import { extractPdfPhoto, extractPdfText } from "@/lib/resume-import/extract-pdf";
import {
  isLikelyPortrait,
  pickPhotoCandidate,
  readImageDimensions,
} from "@/lib/resume-import/photo-candidate";

function png(width: number, height: number): Buffer {
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  context.fillStyle = "#3366cc";
  context.fillRect(0, 0, width, height);
  return canvas.toBuffer("image/png");
}

describe("photo candidate selection", () => {
  it("prefers the largest portrait-like image and ignores logos and icons", () => {
    const picked = pickPhotoCandidate([
      { width: 600, height: 120, dataUrl: "data:image/png;base64,logo" },
      { width: 32, height: 32, dataUrl: "data:image/png;base64,icon" },
      { width: 200, height: 250, dataUrl: "data:image/png;base64,small" },
      { width: 400, height: 500, dataUrl: "data:image/png;base64,photo" },
    ]);
    assert.equal(picked, "data:image/png;base64,photo");
    assert.equal(pickPhotoCandidate([]), null);
    assert.equal(isLikelyPortrait(800, 200), false);
  });

  it("reads PNG dimensions from the header", () => {
    assert.deepEqual(readImageDimensions(png(120, 150)), {
      width: 120,
      height: 150,
      mime: "image/png",
    });
    assert.equal(readImageDimensions(Buffer.from("not an image")), null);
  });
});

describe("photo extraction from documents", () => {
  it("finds the portrait embedded in a DOCX", async () => {
    const zip = new JSZip();
    zip.file("word/document.xml", "<w:document/>");
    zip.file("word/media/image1.png", png(500, 100));
    zip.file("word/media/image2.png", png(300, 375));
    const buffer = await zip.generateAsync({ type: "nodebuffer" });

    const photo = await extractDocxPhoto(buffer);
    assert.ok(photo?.startsWith("data:image/png;base64,"));
    const bytes = Buffer.from(photo!.split(",")[1], "base64");
    assert.equal(readImageDimensions(bytes)?.width, 300);
  });

  it("reads text and the portrait from a PDF", async () => {
    // Generated with @react-pdf/renderer: a wide logo plus a 300x375 portrait.
    const pdf = readFileSync("scripts/fixtures/photo-resume.pdf");

    const text = await extractPdfText(pdf);
    assert.match(text, /Jane Doe/);
    const photo = await extractPdfPhoto(pdf);
    assert.ok(photo?.startsWith("data:image/png;base64,"), "expected a photo data URL");
    const dims = readImageDimensions(Buffer.from(photo!.split(",")[1], "base64"));
    assert.deepEqual([dims?.width, dims?.height], [300, 375]);
  });
});
