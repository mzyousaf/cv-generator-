import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeAuthEmail,
  resolveJwtSub,
} from "@/lib/auth/resolve-jwt-sub";

const GOOGLE_UUID = "0ad1f435-7f09-41f0-aef5-fea18ee0a037";
const MONGO_ID = "507f1f77bcf86cd799439011";
const MONGO_ID_NEW = "507f1f77bcf86cd799439012";

describe("resolveJwtSub", () => {
  it("1. Google OAuth user receives MongoDB ObjectId as session user ID", async () => {
    let lookupEmail: string | undefined;
    const result = await resolveJwtSub(
      {
        id: GOOGLE_UUID,
        email: "User@Example.com",
        name: "Test User",
      },
      { provider: "google" },
      async (email) => {
        lookupEmail = email;
        return {
          id: MONGO_ID,
          name: "Test User",
          email: "user@example.com",
        };
      },
    );

    assert.equal(lookupEmail, "user@example.com");
    assert.ok(result);
    assert.equal(result.sub, MONGO_ID);
    assert.equal(result.dbUser?.id, MONGO_ID);
  });

  it("2. Existing Google user is found by normalized email", async () => {
    const result = await resolveJwtSub(
      { id: GOOGLE_UUID, email: "  MIXED@Example.COM  " },
      { provider: "google" },
      async (email) => {
        assert.equal(email, "mixed@example.com");
        return {
          id: MONGO_ID,
          name: "Existing",
          email: "mixed@example.com",
        };
      },
    );

    assert.equal(result?.sub, MONGO_ID);
  });

  it("3. New Google user resolves MongoDB _id via email lookup after signIn", async () => {
    const result = await resolveJwtSub(
      { id: GOOGLE_UUID, email: "new@example.com", name: "New" },
      { provider: "google" },
      async () => ({
        id: MONGO_ID_NEW,
        name: "New",
        email: "new@example.com",
      }),
    );

    assert.equal(result?.sub, MONGO_ID_NEW);
  });

  it("4. Credentials user continues to use MongoDB _id without email lookup", async () => {
    let lookedUp = false;
    const result = await resolveJwtSub(
      {
        id: MONGO_ID,
        email: "user@example.com",
        name: "Cred User",
      },
      { provider: "credentials" },
      async () => {
        lookedUp = true;
        return null;
      },
    );

    assert.equal(lookedUp, false);
    assert.equal(result?.sub, MONGO_ID);
  });

  it("does not use Google UUID as sub when email lookup finds no user", async () => {
    const result = await resolveJwtSub(
      { id: GOOGLE_UUID, email: "orphan@example.com" },
      { provider: "google" },
      async () => null,
    );

    assert.equal(result, null);
  });
});

describe("normalizeAuthEmail", () => {
  it("trims and lowercases email", () => {
    assert.equal(normalizeAuthEmail("  A@B.COM "), "a@b.com");
  });
});
