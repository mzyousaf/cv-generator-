import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buttonPlainTextValue,
  isButtonPlainText,
  shouldUseRollingButtonLabel,
} from "@/lib/ui/button-label";

describe("button label helpers", () => {
  it("detects plain text children", () => {
    assert.equal(isButtonPlainText("Save"), true);
    assert.equal(isButtonPlainText(42), true);
    assert.equal(isButtonPlainText(null), false);
    assert.equal(isButtonPlainText(undefined), false);
  });

  it("uses rolling label only for plain non-link buttons", () => {
    assert.equal(
      shouldUseRollingButtonLabel({
        variant: "primary",
        children: "Create Your CV Free",
        isLoading: false,
      }),
      true,
    );
    assert.equal(
      shouldUseRollingButtonLabel({
        variant: "link",
        children: "Cancel",
        isLoading: false,
      }),
      false,
    );
    assert.equal(
      shouldUseRollingButtonLabel({
        variant: "primary",
        children: "Save",
        isLoading: true,
      }),
      false,
    );
  });

  it("stringifies plain text values", () => {
    assert.equal(buttonPlainTextValue("Go"), "Go");
    assert.equal(buttonPlainTextValue(null), null);
  });
});
