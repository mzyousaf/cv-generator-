import { connectToDatabase } from "@/lib/db/connect";
import type { RateLimitStore } from "@/lib/rate-limit";

const COLLECTION = "rate_limits";

let indexReady: Promise<unknown> | null = null;

/** MongoDB counters; a TTL index deletes each window once it has expired. */
export const mongoRateLimitStore: RateLimitStore = async (key, expiresAt) => {
  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database not connected");
  }
  const collection = db.collection<{ _id: string; count: number; expiresAt: Date }>(COLLECTION);
  indexReady ??= collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch((error) => {
    indexReady = null;
    throw error;
  });
  await indexReady;
  const increment = () =>
    collection.findOneAndUpdate(
      { _id: key },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
      { upsert: true, returnDocument: "after" },
    );
  let doc;
  try {
    doc = await increment();
  } catch (error) {
    // Two first hits in the same window can race on the insert; the retry updates the winner's row.
    if ((error as { code?: number }).code !== 11000) {
      throw error;
    }
    doc = await increment();
  }
  return doc?.count ?? 1;
};
