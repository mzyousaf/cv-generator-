import assert from "node:assert/strict";
import test from "node:test";
import { format } from "./format";

test("format fills placeholders and leaves unknown ones", () => {
  assert.equal(format("Hi {name}, {n} CVs {x}", { name: "Ana", n: 2 }), "Hi Ana, 2 CVs {x}");
});
