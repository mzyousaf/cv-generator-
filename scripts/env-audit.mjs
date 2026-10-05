/**
 * Safe environment audit (never prints secret values).
 * Usage: node scripts/env-audit.mjs
 */
import mongoose from "mongoose";
import { loadProjectEnv, envConfigured } from "./load-env.mjs";

loadProjectEnv();

const KEYS = [
  "MONGODB_URI",
  "MONGODB_DB_NAME",
  "AUTH_SECRET",
  "AUTH_URL",
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
  "OPENROUTER_API_KEY",
  "OPENAI_API_KEY",
  "AI_MODEL",
  "AI_BASE_URL",
];

const configured = envConfigured(KEYS);

let mongoPing = { attempted: false, ok: false, error: null };

if (configured.MONGODB_URI && configured.MONGODB_DB_NAME) {
  mongoPing.attempted = true;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME,
      serverSelectionTimeoutMS: 8000,
    });
    await mongoose.connection.db.admin().ping();
    mongoPing.ok = true;
    await mongoose.disconnect();
  } catch (error) {
    mongoPing.error =
      error instanceof Error ? error.message : "MongoDB connection failed";
    try {
      await mongoose.disconnect();
    } catch {
      /* ignore */
    }
  }
}

const googlePairOk =
  configured.AUTH_GOOGLE_ID === configured.AUTH_GOOGLE_SECRET;

const readyForAuthenticatedE2e =
  configured.MONGODB_URI &&
  configured.MONGODB_DB_NAME &&
  configured.AUTH_SECRET &&
  mongoPing.ok;

console.log(
  JSON.stringify(
    {
      configured,
      mongoPing,
      googleOAuthPairConfigured: googlePairOk,
      aiConfigured: configured.OPENROUTER_API_KEY || configured.OPENAI_API_KEY,
      readyForAuthenticatedE2e: Boolean(readyForAuthenticatedE2e),
    },
    null,
    2,
  ),
);

process.exit(readyForAuthenticatedE2e ? 0 : 2);
