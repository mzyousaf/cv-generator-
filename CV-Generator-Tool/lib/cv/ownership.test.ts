import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CV_ERROR_CODES } from "@/lib/cv/errors";
import { checkCvOwnership } from "@/lib/cv/ownership";

describe("checkCvOwnership", () => {
  it("denies unauthenticated access", () => {
    const result = checkCvOwnership({ userId: "user-a" }, null);
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, CV_ERROR_CODES.UNAUTHENTICATED);
    }
  });

  it("returns not found when CV is missing", () => {
    const result = checkCvOwnership(null, "user-a");
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, CV_ERROR_CODES.NOT_FOUND);
    }
  });

  it("forbids access to another user's CV", () => {
    const result = checkCvOwnership({ userId: "user-a" }, "user-b");
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, CV_ERROR_CODES.FORBIDDEN);
    }
  });

  it("allows access to the owner's CV", () => {
    const result = checkCvOwnership({ userId: "user-a" }, "user-a");
    assert.equal(result.ok, true);
  });
});
