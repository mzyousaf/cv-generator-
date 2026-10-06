import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createEmptyBuilderState } from "@/lib/cv/builder-types";
import { addCustomSection, removeCustomSection } from "@/lib/cv/custom-sections";
import { getEditorSectionOrder } from "@/lib/cv/section-settings";

describe("custom sections", () => {
  it("adds a section at the end of the order and removes it cleanly", () => {
    const added = addCustomSection(createEmptyBuilderState(), { title: "Awards", content: "x" });
    const order = getEditorSectionOrder(added.state.sectionSettings, added.state.customSections);
    assert.equal(order[order.length - 1], `custom:${added.id}`);

    const removed = removeCustomSection(added.state, added.id);
    assert.equal(removed.customSections.length, 0);
    assert.equal(removed.sectionSettings.order.includes(`custom:${added.id}`), false);
  });
});
