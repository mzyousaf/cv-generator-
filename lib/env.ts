type MongoEnv = {
  uri: string;
  dbName: string;
};

export type EnvAuditLevel = "error" | "warning";

export type EnvAuditIssue = {
  variable: string;
  level: EnvAuditLevel;
  message: string;
};

export type EnvAuditInput = Record<string, string | undefined>;

const PRODUCTION = "production";

function readEnvValue(
  env: EnvAuditInput,
  key: string,
): string | undefined {
  return env[key]?.trim() || undefined;
}

function isProduction(nodeEnv: string | undefined): boolean {
  return (nodeEnv ?? process.env.NODE_ENV) === PRODUCTION;
}

export function getMongoEnv(): MongoEnv {
  const uri = process.env.MONGODB_URI?.trim();
  const dbName = process.env.MONGODB_DB_NAME?.trim();

  if (!uri) {
    throw new Error("MONGODB_URI is not set.");
  }

  if (!dbName) {
    throw new Error("MONGODB_DB_NAME is not set.");
  }

  return { uri, dbName };
}

/**
 * Non-throwing audit for deployment docs, health checks, and tests.
 * Pass `env` and `nodeEnv` to avoid mutating process.env in unit tests.
 */
export function auditRuntimeEnv(
  env: EnvAuditInput = process.env,
  nodeEnv: string | undefined = env.NODE_ENV,
): EnvAuditIssue[] {
  const issues: EnvAuditIssue[] = [];
  const production = isProduction(nodeEnv);

  const requireVar = (variable: string, message: string) => {
    if (!readEnvValue(env, variable)) {
      issues.push({ variable, level: "error", message });
    }
  };

  const warnIfMissing = (variable: string, message: string) => {
    if (!readEnvValue(env, variable)) {
      issues.push({ variable, level: "warning", message });
    }
  };

  requireVar(
    "MONGODB_URI",
    production
      ? "Required in production. Set your MongoDB Atlas (or compatible) connection string."
      : "Required at runtime when the app connects to MongoDB.",
  );
  requireVar(
    "MONGODB_DB_NAME",
    production
      ? "Required in production. Use a dedicated database name for this deployment."
      : "Required at runtime when the app connects to MongoDB.",
  );

  if (production) {
    const secret = readEnvValue(env, "AUTH_SECRET");
    if (!secret) {
      issues.push({
        variable: "AUTH_SECRET",
        level: "error",
        message:
          "Required in production. Generate with `openssl rand -base64 32` and set in Vercel.",
      });
    } else if (secret.length < 32) {
      issues.push({
        variable: "AUTH_SECRET",
        level: "warning",
        message: "Use at least 32 characters for production session security.",
      });
    }

    warnIfMissing(
      "AUTH_URL",
      "Recommended in production (e.g. https://your-app.vercel.app). Auth.js trustHost is enabled for Vercel, but AUTH_URL helps OAuth redirects.",
    );
  } else {
    warnIfMissing(
      "AUTH_SECRET",
      "Recommended for local Auth.js sessions. Generate with `openssl rand -base64 32`.",
    );
  }

  const googleId = readEnvValue(env, "AUTH_GOOGLE_ID");
  const googleSecret = readEnvValue(env, "AUTH_GOOGLE_SECRET");
  if (Boolean(googleId) !== Boolean(googleSecret)) {
    issues.push({
      variable: "AUTH_GOOGLE_ID",
      level: "error",
      message:
        "Set both AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET for Google sign-in, or leave both unset.",
    });
  }

  if (
    !readEnvValue(env, "OPENROUTER_API_KEY") &&
    !readEnvValue(env, "OPENAI_API_KEY")
  ) {
    issues.push({
      variable: "OPENROUTER_API_KEY",
      level: "warning",
      message:
        "Optional. AI assist features stay disabled until OPENROUTER_API_KEY (or OPENAI_API_KEY) is configured.",
    });
  }

  return issues;
}

export function assertProductionEnvReady(
  env: EnvAuditInput = process.env,
  nodeEnv: string | undefined = env.NODE_ENV,
): void {
  if (!isProduction(nodeEnv)) {
    return;
  }

  const errors = auditRuntimeEnv(env, nodeEnv).filter(
    (issue) => issue.level === "error",
  );
  if (errors.length === 0) {
    return;
  }

  const summary = errors
    .map((issue) => `${issue.variable}: ${issue.message}`)
    .join(" ");
  throw new Error(`Production environment misconfigured. ${summary}`);
}
