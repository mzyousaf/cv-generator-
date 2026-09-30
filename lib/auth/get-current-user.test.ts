import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidMongoObjectIdString } from "@/lib/auth/mongo-object-id";
import { resolveSessionUserIdForDbLookup } from "@/lib/auth/get-current-user";

const VALID_MONGO_ID = "507f1f77bcf86cd799439011";
const GOOGLE_UUID = "0ad1f435-7f09-41f0-aef5-fea18ee0a037";

describe("session user id validation for getCurrentUser", () => {
  it("5. UUID-like session ID does not pass lookup validation", () => {
    assert.equal(isValidMongoObjectIdString(GOOGLE_UUID), false);
    assert.equal(resolveSessionUserIdForDbLookup(GOOGLE_UUID), null);
  });

  it("6. Invalid session ID fails safely without reaching findById", () => {
    assert.equal(resolveSessionUserIdForDbLookup(""), null);
    assert.equal(resolveSessionUserIdForDbLookup(undefined), null);
    assert.equal(resolveSessionUserIdForDbLookup("not-an-object-id"), null);
    assert.equal(resolveSessionUserIdForDbLookup("507f1f77bcf86cd79943901"), null);
  });

  it("7. Valid MongoDB session ID still resolves for database lookup", () => {
    assert.equal(isValidMongoObjectIdString(VALID_MONGO_ID), true);
    assert.equal(resolveSessionUserIdForDbLookup(VALID_MONGO_ID), VALID_MONGO_ID);
  });
});
