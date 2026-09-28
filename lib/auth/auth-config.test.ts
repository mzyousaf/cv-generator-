import assert from "node:assert/strict";
import { describe, it } from "node:test";
import authConfig from "@/auth.config";

function isDashboardAuthorized(pathname: string, isLoggedIn: boolean): boolean {
  const authorized = authConfig.callbacks?.authorized;
  assert.ok(typeof authorized === "function");

  return authorized({
    auth: isLoggedIn ? { user: { email: "user@example.com" } } : null,
    request: { nextUrl: new URL(`https://example.com${pathname}`) },
  } as Parameters<NonNullable<typeof authorized>>[0]);
}

describe("Auth protected routes", () => {
  it("allows public routes without a session", () => {
    assert.equal(isDashboardAuthorized("/", false), true);
    assert.equal(isDashboardAuthorized("/login", false), true);
  });

  it("blocks dashboard routes for signed-out users", () => {
    assert.equal(isDashboardAuthorized("/dashboard", false), false);
    assert.equal(isDashboardAuthorized("/dashboard/cv/abc", false), false);
  });

  it("allows dashboard routes for signed-in users", () => {
    assert.equal(isDashboardAuthorized("/dashboard", true), true);
    assert.equal(isDashboardAuthorized("/dashboard/cv/abc", true), true);
  });
});
