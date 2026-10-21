import assert from "node:assert/strict";
import test from "node:test";
import { parseConsent } from "@/lib/analytics/consent";

test("parseConsent reads the consent cookie", () => {
  assert.equal(parseConsent("theme=ocean; analytics_consent=granted; x=1"), "granted");
  assert.equal(parseConsent("analytics_consent=denied"), "denied");
});

test("parseConsent ignores missing or unknown values", () => {
  assert.equal(parseConsent(""), null);
  assert.equal(parseConsent("analytics_consent=maybe"), null);
  assert.equal(parseConsent("other_analytics_consent=granted"), null);
});
