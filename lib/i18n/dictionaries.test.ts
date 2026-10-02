import assert from "node:assert/strict";
import test from "node:test";
import { getDictionary } from "./dictionaries";
import { en } from "./dictionaries/en";
import { LOCALES } from "./preferences";

type Tree = string | Tree[] | { [key: string]: Tree };

function walk(source: Tree, target: Tree, path: string, problems: string[]) {
  if (typeof source === "string") {
    if (typeof target !== "string" || target.trim() === "") {
      problems.push(`${path}: missing or empty`);
      return;
    }
    const expected = (source.match(/\{\w+\}/g) ?? []).sort().join(",");
    const actual = (target.match(/\{\w+\}/g) ?? []).sort().join(",");
    if (expected !== actual) {
      problems.push(`${path}: placeholders ${actual || "none"} != ${expected}`);
    }
    return;
  }
  if (Array.isArray(source)) {
    if (!Array.isArray(target) || target.length !== source.length) {
      problems.push(`${path}: array length differs`);
      return;
    }
    source.forEach((item, index) => walk(item, target[index], `${path}[${index}]`, problems));
    return;
  }
  for (const key of Object.keys(source)) {
    walk(source[key], (target as Record<string, Tree>)[key], `${path}.${key}`, problems);
  }
}

for (const locale of LOCALES) {
  test(`${locale} dictionary matches the English structure and placeholders`, () => {
    const problems: string[] = [];
    walk(en as Tree, getDictionary(locale) as Tree, locale, problems);
    assert.deepEqual(problems, []);
  });
}
