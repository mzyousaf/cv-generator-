import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clampPreviewScale,
  computeFitPreviewScale,
  createDefaultPreviewZoomMode,
  formatPreviewZoomLabel,
  PREVIEW_SCALE_MAX,
  PREVIEW_SCALE_MIN,
  resolvePreviewScale,
  shouldUseSinglePaneLayout,
  stepPreviewZoomMode,
} from "@/lib/cv/preview-zoom";

describe("preview zoom", () => {
  it("clamps scale between min and max", () => {
    assert.equal(clampPreviewScale(0.2), PREVIEW_SCALE_MIN);
    assert.equal(clampPreviewScale(1.5), PREVIEW_SCALE_MAX);
    assert.equal(clampPreviewScale(0.75), 0.75);
  });

  it("computes fit scale from container and document width", () => {
    assert.equal(computeFitPreviewScale(400, 800, 0), 0.5);
    assert.equal(computeFitPreviewScale(848, 800, 48), 1);
    assert.equal(computeFitPreviewScale(0, 800), 0.75);
    // Fit may go below the smallest preset so a page fits on a phone.
    assert.equal(computeFitPreviewScale(300, 800, 0), 0.375);
    assert.equal(resolvePreviewScale({ type: "fit" }, 0.375), 0.375);
  });

  it("resolves preset and fit modes", () => {
    assert.equal(
      resolvePreviewScale({ type: "preset", level: 100 }, 0.6),
      1,
    );
    assert.equal(resolvePreviewScale({ type: "fit" }, 0.82), 0.82);
  });

  it("steps from a phone-sized fit to the smallest preset", () => {
    assert.deepEqual(stepPreviewZoomMode({ type: "fit" }, "in", 0.38), {
      type: "preset",
      level: 50,
    });
  });

  it("formats zoom labels", () => {
    assert.equal(formatPreviewZoomLabel({ type: "fit" }), "Fit");
    assert.equal(
      formatPreviewZoomLabel({ type: "preset", level: 75 }),
      "75%",
    );
  });

  it("steps from fit into preset levels", () => {
    const stepped = stepPreviewZoomMode({ type: "fit" }, "in", 0.72);
    assert.equal(stepped.type, "preset");
    if (stepped.type === "preset") {
      assert.equal(stepped.level, 100);
    }
  });

  it("defaults to 75% preset mode", () => {
    const mode = createDefaultPreviewZoomMode();
    assert.deepEqual(mode, { type: "preset", level: 75 });
  });

  it("uses single-pane layout below 1280px", () => {
    assert.equal(shouldUseSinglePaneLayout(1279), true);
    assert.equal(shouldUseSinglePaneLayout(1280), false);
    assert.equal(shouldUseSinglePaneLayout(1024), true);
  });
});
