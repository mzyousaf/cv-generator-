import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { pickActiveSection, type SectionBox } from "@/lib/cv/scroll-spy";

const box = (id: string, top: number, height = 300): SectionBox => ({
  id,
  top,
  bottom: top + height,
  offset: 112,
});
const opts = { atBottom: false, viewportHeight: 900 };

describe("pickActiveSection", () => {
  it("keeps the section filling the top until the next one reaches the landing line", () => {
    const boxes = [box("a", -200), box("b", 300), box("c", 700)];
    assert.equal(pickActiveSection(boxes, opts), "a");
  });

  it("switches once the next section's top reaches its scroll margin", () => {
    const boxes = [box("a", -400), box("b", 115), box("c", 500)];
    assert.equal(pickActiveSection(boxes, opts), "b");
  });

  it("uses the first section before anything is scrolled", () => {
    assert.equal(pickActiveSection([box("a", 150), box("b", 600)], opts), "a");
  });

  it("follows visual order, not array order", () => {
    const boxes = [box("late", 800), box("early", 50)];
    assert.equal(pickActiveSection(boxes, opts), "early");
  });

  it("selects the last visible section at the bottom of the page", () => {
    const boxes = [box("a", -900), box("b", 200, 150), box("c", 400, 120)];
    assert.equal(pickActiveSection(boxes, { atBottom: true, viewportHeight: 900 }), "c");
  });

  it("returns null without sections", () => {
    assert.equal(pickActiveSection([], opts), null);
  });
});
