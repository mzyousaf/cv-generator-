import assert from "node:assert/strict";
import test from "node:test";
import { checkRateLimit, type RateLimitStore } from "@/lib/rate-limit";

function memoryStore() {
  const counts = new Map<string, number>();
  const store: RateLimitStore = async (key) => {
    const next = (counts.get(key) ?? 0) + 1;
    counts.set(key, next);
    return next;
  };
  return { store, counts };
}

const rule = { name: "test", limit: 3, windowMs: 60_000 };

test("allows requests up to the limit, then blocks", async () => {
  const { store } = memoryStore();
  const now = 1_000_000_000;
  for (let i = 0; i < 3; i += 1) {
    assert.deepEqual(await checkRateLimit([rule], "user-1", store, now), { ok: true });
  }
  const blocked = await checkRateLimit([rule], "user-1", store, now);
  assert.equal(blocked.ok, false);
  assert.ok(!blocked.ok && blocked.retryAfterSeconds > 0 && blocked.retryAfterSeconds <= 60);
});

test("limits each identifier separately and resets in the next window", async () => {
  const { store } = memoryStore();
  const now = 1_000_000_000;
  for (let i = 0; i < 4; i += 1) await checkRateLimit([rule], "user-1", store, now);
  assert.deepEqual(await checkRateLimit([rule], "user-2", store, now), { ok: true });
  assert.deepEqual(await checkRateLimit([rule], "user-1", store, now + 60_000), { ok: true });
});

test("blocks when any of several rules is exceeded", async () => {
  const { store } = memoryStore();
  const daily = { name: "daily", limit: 1, windowMs: 86_400_000 };
  assert.deepEqual(await checkRateLimit([rule, daily], "u", store), { ok: true });
  assert.equal((await checkRateLimit([rule, daily], "u", store)).ok, false);
});

test("never stores the raw identifier", async () => {
  const { store, counts } = memoryStore();
  await checkRateLimit([rule], "person@example.com", store);
  assert.ok([...counts.keys()].every((key) => !key.includes("person@example.com")));
});

test("allows the request when the store fails", async () => {
  const failing: RateLimitStore = async () => {
    throw new Error("down");
  };
  const original = console.error;
  console.error = () => {};
  try {
    assert.deepEqual(await checkRateLimit([rule], "u", failing), { ok: true });
  } finally {
    console.error = original;
  }
});
