/**
 * Post-E2E MongoDB checks (no PII in output).
 * Usage: node scripts/e2e-db-verify.mjs
 */
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const uri = process.env.MONGODB_URI?.trim();
const dbName = process.env.MONGODB_DB_NAME?.trim();
const metaPath = path.resolve(import.meta.dirname, "fixtures", ".qa-last-run.json");

if (!uri || !dbName || !fs.existsSync(metaPath)) {
  console.log(
    JSON.stringify({ ok: false, reason: "Missing MongoDB env or .qa-last-run.json" }),
  );
  process.exit(2);
}

const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
const cvIds = (meta.cvIds ?? []).filter(Boolean);
const emails = (meta.emails ?? []).filter(Boolean);

const FORBIDDEN_CONTENT_KEYS = [
  "extractedText",
  "rawPdf",
  "rawDocx",
  "importPrompt",
  "aiPrompt",
  "parsePrompt",
];

function docHasForbiddenKeys(doc) {
  const json = JSON.stringify(doc);
  return FORBIDDEN_CONTENT_KEYS.some((key) => json.includes(`"${key}"`));
}

try {
  await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 10_000 });
  const db = mongoose.connection.db;
  const users = db.collection("users");
  const cvs = db.collection("cvs");

  const checks = [];

  for (const email of emails) {
    const user = await users.findOne(
      { email: String(email).toLowerCase() },
      { projection: { _id: 1, email: 1 } },
    );
    checks.push({
      check: "user_exists",
      ok: Boolean(user?._id),
    });
  }

  for (const cvId of cvIds) {
    if (!mongoose.Types.ObjectId.isValid(cvId)) {
      checks.push({ check: "cv_id_valid", cvId: "[invalid]", ok: false });
      continue;
    }
    const cv = await cvs.findOne({ _id: new mongoose.Types.ObjectId(cvId) });
    checks.push({
      check: "cv_exists",
      ok: Boolean(cv),
    });
    if (cv) {
      checks.push({
        check: "cv_no_import_artifacts",
        ok: !docHasForbiddenKeys(cv),
      });
      checks.push({
        check: "cv_has_template",
        ok: typeof cv.template === "string" && cv.template.length > 0,
      });
      checks.push({
        check: "cv_has_userId",
        ok: Boolean(cv.userId),
      });
    }
  }

  await mongoose.disconnect();
  const ok = checks.every((c) => c.ok);
  console.log(JSON.stringify({ ok, checks }, null, 2));
  process.exit(ok ? 0 : 1);
} catch (error) {
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  console.log(
    JSON.stringify({
      ok: false,
      reason: error instanceof Error ? error.message : "Verify failed",
    }),
  );
  process.exit(1);
}
