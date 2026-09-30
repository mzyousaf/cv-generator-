import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  const text = fs.readFileSync(filePath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const eq = line.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env) || !process.env[key]?.trim()) {
      process.env[key] = value;
    }
  }
}

export function loadProjectEnv() {
  parseEnvFile(path.join(ROOT, ".env"));
  parseEnvFile(path.join(ROOT, ".env.local"));
  parseEnvFile(path.join(ROOT, ".env.production.local"));
}

export function envConfigured(keys) {
  return Object.fromEntries(
    keys.map((key) => [key, Boolean(process.env[key]?.trim())]),
  );
}
