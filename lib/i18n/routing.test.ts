import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  isLocalizedRoute,
  languageAlternates,
  localizePath,
  PREFIXED_LOCALES,
  splitLocalePrefix,
} from "@/lib/i18n/routing";

describe("language-prefixed routes", () => {
  it("splits and builds prefixed paths", () => {
    assert.deepEqual(splitLocalePrefix("/de/templates/lebenslauf"), { locale: "de", path: "/templates/lebenslauf" });
    assert.deepEqual(splitLocalePrefix("/de"), { locale: "de", path: "/" });
    assert.deepEqual(splitLocalePrefix("/templates"), { locale: null, path: "/templates" });
    assert.deepEqual(splitLocalePrefix("/en/templates"), { locale: null, path: "/en/templates" });
    assert.equal(localizePath("/", "de"), "/de");
    assert.equal(localizePath("/templates?q=x", "fr"), "/fr/templates?q=x");
    assert.equal(localizePath("/templates", "en"), "/templates");
    assert.equal(localizePath("/#faq", "de"), "/de#faq");
    assert.equal(localizePath("/dashboard", "de"), "/dashboard");
  });

  it("only localizes public routes", () => {
    for (const path of ["/", "/templates", "/templates/region/dach", "/templates/lebenslauf", "/privacy", "/terms", "/signup", "/login"]) {
      assert.ok(isLocalizedRoute(path), path);
    }
    for (const path of ["/dashboard", "/dashboard/cv/1", "/api/cv", "/llms.txt", "/sitemap.xml"]) {
      assert.ok(!isLocalizedRoute(path), path);
    }
  });

  it("lists every language plus x-default", () => {
    const alternates = languageAlternates("/templates");
    assert.equal(alternates["x-default"], "/templates");
    assert.equal(alternates.en, "/templates");
    assert.equal(alternates.ar, "/ar/templates");
    assert.equal(Object.keys(alternates).length, PREFIXED_LOCALES.length + 2);
  });

  it("keeps the proxy matcher in sync with the prefixed locales", () => {
    const proxy = readFileSync("proxy.ts", "utf8");
    assert.ok(proxy.includes(`"/(${PREFIXED_LOCALES.join("|")})"`));
    assert.ok(proxy.includes(`"/(${PREFIXED_LOCALES.join("|")})/:path*"`));
  });

  it("runs the proxy on every unprefixed localized route", () => {
    const proxy = readFileSync("proxy.ts", "utf8");
    for (const route of ["/", "/templates/:path*", "/privacy", "/terms", "/signup", "/login"]) {
      assert.ok(proxy.includes(`"${route}"`), route);
      assert.ok(isLocalizedRoute(route.replace("/:path*", "")), route);
    }
  });
});
