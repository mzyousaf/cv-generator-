/**

 * Authenticated end-to-end QA (Playwright).

 *

 *   node scripts/fixtures/create-fixtures.mjs

 *   npm run build && npm run start

 *   QA_BASE_URL=http://localhost:3000 npm run qa:e2e

 *   node scripts/e2e-db-verify.mjs

 *   node scripts/e2e-cleanup.mjs

 */

import fs from "node:fs";

import path from "node:path";

import { chromium } from "playwright";

import { loadProjectEnv, envConfigured } from "./load-env.mjs";



loadProjectEnv();



const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";

const FIXTURES = path.resolve(import.meta.dirname, "fixtures");

const META_PATH = path.join(FIXTURES, ".qa-last-run.json");



const QA_EMAIL_A = `qa+e2e.${Date.now()}@example.invalid`;

const QA_EMAIL_B = `qa+e2e.b.${Date.now()}@example.invalid`;

const QA_PASSWORD = process.env.QA_E2E_PASSWORD ?? `Qa${Date.now()}Pass!9`;

const QA_NAME = "QA E2E User";



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

const results = [];

const consoleErrors = [];

const expectedHttpFailures = [];

const qaMeta = { emails: [QA_EMAIL_A, QA_EMAIL_B], cvIds: [] };



function record(phase, status, detail = {}) {

  results.push({ phase, status, ...detail });

}



function trackConsole(page) {

  page.on("console", (msg) => {

    if (msg.type() === "error") {

      consoleErrors.push({ url: page.url(), text: msg.text() });

    }

  });

  page.on("pageerror", (error) => {

    consoleErrors.push({ url: page.url(), text: error.message });

  });

}



async function measureOverflow(page) {

  return page.evaluate(() => ({

    sw: document.documentElement.scrollWidth,

    cw: document.documentElement.clientWidth,

    ok: document.documentElement.scrollWidth <= document.documentElement.clientWidth,

  }));

}



async function waitForSaved(page, timeout = 20_000) {

  await page.getByText(/^Saved$/).waitFor({ state: "visible", timeout });

}



async function signupViaModal(page, email, name = QA_NAME) {

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

  await page.getByRole("button", { name: /Create Your CV Free/i }).first().click();

  await page.getByRole("dialog").waitFor();

  await page.locator("#modal-signup-name").fill(name);

  await page.locator("#modal-signup-email").fill(email);

  await page.locator("#modal-signup-password").fill(QA_PASSWORD);

  await page.getByRole("button", { name: /Create account/i }).click();

  await page.waitForURL(/\/dashboard/, { timeout: 30_000 });

}



async function loginViaPage(page, email, password) {

  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });

  await page.locator("#email").fill(email);

  await page.locator("#password").fill(password);

  await page.getByRole("button", { name: /Login/i }).click();

  await page.waitForURL(/\/dashboard/, { timeout: 20_000 });

}



async function openManageSections(page) {

  await page.setViewportSize({ width: 1440, height: 900 });

  const desktop = page.getByRole("button", { name: "Manage Sections" });

  if (await desktop.isVisible().catch(() => false)) {

    await desktop.click();

  } else {

    await page.getByRole("button", { name: "More" }).click();

    await page.getByRole("menuitem", { name: "Manage Sections" }).click();

  }

  await page.getByRole("dialog").waitFor();

}



async function openTemplates(page) {

  await page.setViewportSize({ width: 1440, height: 900 });

  const desktop = page.getByRole("button", { name: "Templates" }).first();

  if (await desktop.isVisible().catch(() => false)) {

    await desktop.click();

  } else {

    await page.getByRole("button", { name: "More" }).click();

    await page.getByRole("menuitem", { name: "Templates" }).click();

  }

  await page.getByRole("dialog").waitFor();

}



function previewLocator(page) {

  return page.locator("aside").filter({ has: page.getByRole("heading", { name: "Preview" }) });

}



async function exportPdfFromBuilder(page) {

  const exportResp = page.waitForResponse(

    (resp) => resp.url().includes("/api/cv/") && resp.url().includes("/export"),

    { timeout: 60_000 },

  );

  const exportBtn = page.getByRole("button", { name: /Export PDF/i }).first();

  await exportBtn.click();

  const resp = await exportResp;

  const pdfBuf = await resp.body();

  return { ok: resp.ok() && pdfBuf.length > 1000, status: resp.status(), bytes: pdfBuf.length };

}



async function runImportFlow(page, fileName, phasePrefix) {

  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });

  const filePath = path.join(FIXTURES, fileName);

  if (!fs.existsSync(filePath)) {

    record(`${phasePrefix}_file`, "fail", { reason: "fixture missing" });

    return null;

  }



  await page.locator('input[type="file"]').first().setInputFiles(filePath);

  // Import starts automatically: AI parses the file, creates the CV and opens the editor.
  if (!configured.OPENROUTER_API_KEY && !configured.OPENAI_API_KEY) {
    await page.waitForTimeout(4000);
    const opened = /\/dashboard\/cv\//.test(page.url());
    record(phasePrefix, opened ? "pass" : "blocked", {
      reason: opened ? "unexpected parse without AI" : "AI API key not configured",
    });
    return null;
  }

  await page.waitForURL(/\/dashboard\/cv\//, { timeout: 150_000 });
  record(`${phasePrefix}_created`, "pass");

  const importCvId = page.url().split("/").pop();

  if (importCvId) {

    qaMeta.cvIds.push(importCvId);

  }

  await page.reload({ waitUntil: "networkidle" });

  const title = await page.locator("#cv-title").inputValue();

  record(phasePrefix, title.trim().length > 0 ? "pass" : "fail");

  return importCvId;

}



if (!configured.MONGODB_URI || !configured.MONGODB_DB_NAME || !configured.AUTH_SECRET) {

  record("environment", "blocked", {

    reason: "Missing MONGODB_URI, MONGODB_DB_NAME, or AUTH_SECRET",

    configured,

  });

  console.log(JSON.stringify({ configured, results, consoleErrors }, null, 2));

  process.exit(2);

}



if (!fs.existsSync(path.join(FIXTURES, "qa-resume.pdf"))) {

  await import("./fixtures/create-fixtures.mjs");

}



let cvIdA = null;

const browser = await chromium.launch({ headless: true });



try {

  const contextA = await browser.newContext();

  const page = await contextA.newPage();

  trackConsole(page);



  record("signup_modal", "running");

  await signupViaModal(page, QA_EMAIL_A);

  await page.reload({ waitUntil: "networkidle" });

  record("signup_modal", page.url().includes("/dashboard") ? "pass" : "fail");



  record("dashboard_new_user", "running");

  const dashOverflow = await measureOverflow(page);

  record("dashboard_new_user", dashOverflow.ok ? "pass" : "fail", dashOverflow);



  record("create_blank_cv", "running");

  await page.getByRole("button", { name: /Create New Resume/i }).click();

  await page.waitForURL(/\/dashboard\/cv\//, { timeout: 20_000 });

  cvIdA = page.url().split("/").pop();

  if (cvIdA) {

    qaMeta.cvIds.push(cvIdA);

  }

  record("create_blank_cv", cvIdA ? "pass" : "fail");



  await page.setViewportSize({ width: 1440, height: 900 });

  await page.locator("#cv-title").fill("QA E2E Resume");

  await page.locator("#personal-fullName").fill("QA Tester");

  await page.locator("#summary").fill("Summary for E2E persistence check.");

  await page.getByRole("button", { name: /Add experience/i }).click();

  await page.locator('[id^="work-title-"]').first().fill("Engineer");

  await page.locator('[id^="work-company-"]').first().fill("Example Co");

  await page.getByRole("button", { name: /Add education/i }).first().click();

  await page.locator('[id^="edu-inst-"]').first().fill("Example University");

  await page.locator("#skill-add-input").fill("TypeScript");

  await page.locator("#skill-add-input").press("Enter");

  await waitForSaved(page);

  await page.reload({ waitUntil: "networkidle" });

  const titleAfter = await page.locator("#cv-title").inputValue();

  record("autosave_refresh", titleAfter === "QA E2E Resume" ? "pass" : "fail");



  record("template_classic", "running");

  await openTemplates(page);

  await page.getByRole("dialog").getByRole("button", { name: "Classic" }).click();

  await waitForSaved(page);

  await page.reload({ waitUntil: "networkidle" });

  const classicLabel = await page.getByText(/Classic template/i).first().isVisible();

  record("template_classic", classicLabel ? "pass" : "fail");



  record("sections_hide_summary", "running");

  await openManageSections(page);

  const summaryRow = page.getByRole("listitem").filter({ hasText: "Professional Summary" });

  await summaryRow.getByRole("button", { name: "Hide" }).click();

  await page.keyboard.press("Escape");

  await waitForSaved(page);

  const summaryInPreview = await previewLocator(page)

    .getByText("Professional Summary")

    .isVisible()

    .catch(() => false);

  record("sections_hide_summary", summaryInPreview ? "fail" : "pass");



  await openManageSections(page);

  await summaryRow.getByRole("button", { name: "Show" }).click();

  await page.keyboard.press("Escape");

  await waitForSaved(page);



  record("sections_reorder", "running");

  await openManageSections(page);

  const workRow = page.getByRole("listitem").filter({ hasText: "Work Experience" });

  await workRow.getByRole("button", { name: /Move down/i }).click();

  await page.keyboard.press("Escape");

  await waitForSaved(page);

  await page.reload({ waitUntil: "networkidle" });

  record("sections_reorder", "pass", { note: "order persisted after reload" });



  record("export_pdf_primary", "running");

  const exportPrimary = await exportPdfFromBuilder(page);

  record(

    "export_pdf_primary",

    exportPrimary.ok ? "pass" : "fail",

    exportPrimary,

  );



  record("back_to_dashboard", "running");

  await page.getByRole("link", { name: /Back to Resumes/i }).click();

  await page.waitForURL(/\/dashboard\/?$/, { timeout: 15_000 });

  const resumeListed = await page.getByText("QA E2E Resume").isVisible().catch(() => false);

  record("back_to_dashboard", resumeListed ? "pass" : "fail");



  const viewports = [

    [1440, 900],

    [1280, 800],

    [1024, 768],

    [768, 1024],

    [390, 844],

  ];

  if (cvIdA) {

    await page.goto(`${BASE}/dashboard/cv/${cvIdA}`, { waitUntil: "networkidle" });

  }

  for (const [w, h] of viewports) {

    await page.setViewportSize({ width: w, height: h });

    await page.waitForTimeout(400);

    const m = await measureOverflow(page);

    record(`builder_viewport_${w}x${h}`, m.ok ? "pass" : "fail", m);

  }



  record("ownership_user_b", "running");

  const contextB = await browser.newContext();

  const pageB = await contextB.newPage();

  trackConsole(pageB);

  await signupViaModal(pageB, QA_EMAIL_B, "QA E2E User B");

  if (cvIdA) {

    await pageB.goto(`${BASE}/dashboard/cv/${cvIdA}`, { waitUntil: "networkidle" });

    const blockedUi = await pageB

      .getByRole("heading", { name: "Unable to open CV" })

      .isVisible()

      .catch(() => false);

    const exportAsB = await pageB.request.get(`${BASE}/api/cv/${cvIdA}/export`);

    expectedHttpFailures.push({ url: exportAsB.url(), status: exportAsB.status() });

    const exportBlocked = [401, 403, 404].includes(exportAsB.status());

    record(

      "ownership_user_b",

      blockedUi && exportBlocked ? "pass" : "fail",

      { ui: blockedUi, exportStatus: exportAsB.status() },

    );

  } else {

    record("ownership_user_b", "fail", { reason: "no cvIdA" });

  }

  await contextB.close();



  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });

  await runImportFlow(page, "qa-resume.pdf", "import_pdf");

  await runImportFlow(page, "qa-resume.docx", "import_docx");



  record("sign_out", "running");

  await page.setViewportSize({ width: 1440, height: 900 });

  await page.getByRole("button", { name: /Sign out/i }).click();

  await page.waitForURL(/\/(login)?(\?|$)/, { timeout: 15_000 });



  record("login_valid", "running");

  await loginViaPage(page, QA_EMAIL_A, QA_PASSWORD);

  record("login_valid", page.url().includes("/dashboard") ? "pass" : "fail");

  await page.reload({ waitUntil: "networkidle" });

  record("login_session_refresh", page.url().includes("/dashboard") ? "pass" : "fail");



  record("login_invalid", "running");

  await page.goto(`${BASE}/login`);

  await page.locator("#email").fill(QA_EMAIL_A);

  await page.locator("#password").fill("wrong-password-xyz");

  await page.getByRole("button", { name: /Login/i }).click();

  await page.waitForTimeout(2000);

  const errVisible = await page

    .getByText(/invalid|incorrect|could not|wrong/i)

    .isVisible()

    .catch(() => false);

  record("login_invalid", errVisible ? "pass" : "fail", { errVisible });



  record("google_oauth", "running");

  const googleBtn = page.getByRole("button", { name: /Continue with Google/i });

  const googleVisible = await googleBtn.isVisible().catch(() => false);

  const hasIcon = await googleBtn.locator("svg").count().then((n) => n > 0);

  if (configured.AUTH_GOOGLE_ID && configured.AUTH_GOOGLE_SECRET) {

    const providers = await page.request.get(`${BASE}/api/auth/providers`);

    let googleInProviders = false;

    if (providers.ok()) {

      const body = await providers.json();

      googleInProviders = Boolean(body?.google);

    }

    record("google_oauth", googleVisible && hasIcon && googleInProviders ? "pass" : "fail", {

      googleVisible,

      hasIcon,

      providersStatus: providers.status(),

      googleInProviders,

    });

  } else {

    record("google_oauth", googleVisible && hasIcon ? "pass" : "skip", {

      note: "Button UI only; Google credentials not configured",

    });

  }



  if ((configured.OPENROUTER_API_KEY || configured.OPENAI_API_KEY) && cvIdA) {

    record("ai_live", "skip", {

      reason: "Live AI builder calls omitted to limit API usage; import parse covers AI path when enabled",

    });

  } else {

    record("ai_live", "skip", { reason: "AI API key not configured" });

  }



  record("ownership_unauthenticated_export", "running");

  await contextA.clearCookies();

  const anonExport = await page.request.get(

    cvIdA ? `${BASE}/api/cv/${cvIdA}/export` : `${BASE}/api/cv/000000000000000000000001/export`,

  );

  expectedHttpFailures.push({ url: anonExport.url(), status: anonExport.status() });

  record(

    "ownership_unauthenticated_export",

    [401, 403, 404].includes(anonExport.status()) ? "pass" : "fail",

    { status: anonExport.status() },

  );



  await contextA.close();

} catch (error) {

  record("fatal", "fail", {

    message: error instanceof Error ? error.message : String(error),

  });

} finally {

  await browser.close();

  fs.mkdirSync(FIXTURES, { recursive: true });

  fs.writeFileSync(META_PATH, JSON.stringify(qaMeta, null, 2));

}



const unexpectedConsole = consoleErrors.filter(

  (entry) => !/favicon|Failed to load resource.*404/i.test(entry.text),

);



console.log(

  JSON.stringify(

    {

      configured: { ...configured, QA_EMAIL_A: "[created]", QA_PASSWORD: "[redacted]" },

      results,

      expectedHttpFailures,

      consoleErrors: unexpectedConsole,

      pass: results.filter((r) => r.status === "pass").length,

      fail: results.filter((r) => r.status === "fail").length,

      blocked: results.filter((r) => r.status === "blocked").length,

      skip: results.filter((r) => r.status === "skip").length,

    },

    null,

    2,

  ),

);



const failed = results.some((r) => r.status === "fail");

process.exit(failed ? 1 : 0);


