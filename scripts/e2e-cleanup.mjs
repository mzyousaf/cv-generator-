/**
 * Remove disposable QA users/CVs created by e2e-authenticated-qa.mjs.
 * Never prints secrets. Usage: node scripts/e2e-cleanup.mjs
 */
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { loadProjectEnv } from "./load-env.mjs";

loadProjectEnv();

const uri = process.env.MONGODB_URI?.trim();
const dbName = process.env.MONGODB_DB_NAME?.trim();

if (!uri || !dbName) {
  console.log(JSON.stringify({ ok: false, reason: "MongoDB env not configured" }));
  process.exit(2);
}

const metaPath = path.resolve(import.meta.dirname, "fixtures", ".qa-last-run.json");
let meta = { emails: [], cvIds: [] };
if (fs.existsSync(metaPath)) {
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  } catch {
    meta = { emails: [], cvIds: [] };
  }
}

const emailPattern = /^qa\+e2e\.[^@]+@example\.invalid$/i;
const emails = [
  ...new Set(
    (meta.emails ?? []).filter((e) => typeof e === "string" && emailPattern.test(e)),
  ),
];

try {
  await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 10_000 });
  const db = mongoose.connection.db;
  const users = db.collection("users");
  const cvs = db.collection("cvs");

  let deletedUsers = 0;
  let deletedCvs = 0;

  for (const email of emails) {
    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user?._id) {
      continue;
    }
    const res = await cvs.deleteMany({ userId: user._id });
    deletedCvs += res.deletedCount ?? 0;
    const ures = await users.deleteOne({ _id: user._id });
    deletedUsers += ures.deletedCount ?? 0;
  }

  const orphanCvIds = (meta.cvIds ?? []).filter(Boolean);
  if (orphanCvIds.length) {
    const { ObjectId } = mongoose.Types;
    const ids = orphanCvIds
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));
    if (ids.length) {
      const res = await cvs.deleteMany({ _id: { $in: ids } });
      deletedCvs += res.deletedCount ?? 0;
    }
  }

  await mongoose.disconnect();
  console.log(
    JSON.stringify({
      ok: true,
      deletedUsers,
      deletedCvs,
      emailsProcessed: emails.length,
    }),
  );
} catch (error) {
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  console.log(
    JSON.stringify({
      ok: false,
      reason: error instanceof Error ? error.message : "Cleanup failed",
    }),
  );
  process.exit(1);
}
