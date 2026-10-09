import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createEmptyBuilderState } from "@/lib/cv/builder-types";
import { getSectionStatus } from "@/lib/cv/section-status";

describe("getSectionStatus", () => {
  it("reports empty, filled and counted sections", () => {
    const state = createEmptyBuilderState();
    assert.deepEqual(getSectionStatus("personal", state), { kind: "empty" });
    assert.deepEqual(getSectionStatus("skills", state), { kind: "empty" });

    state.personal.fullName = "Jane";
    state.summary = "Engineer.";
    state.skills = ["React", "SQL"];
    state.customSections = [{ id: "a", title: "Awards", content: "- Prize" }];
    assert.deepEqual(getSectionStatus("personal", state), { kind: "filled" });
    assert.deepEqual(getSectionStatus("summary", state), { kind: "filled" });
    assert.deepEqual(getSectionStatus("skills", state), { kind: "count", count: 2 });
    assert.deepEqual(getSectionStatus("custom:a", state), { kind: "filled" });
    assert.deepEqual(getSectionStatus("custom:missing", state), { kind: "empty" });
  });
});
