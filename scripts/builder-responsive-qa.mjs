/**
 * Optional responsive QA for the CV builder (requires auth session).
 *
 * Usage:
 *   set QA_CV_URL=http://localhost:3000/dashboard/cv/<id>
 *   set QA_STORAGE_STATE=path/to/storageState.json  (Playwright saved auth)
 *   node scripts/builder-responsive-qa.mjs
 */
import { chromium } from "playwright";

const viewports = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "390x844", width: 390, height: 844 },
];

const targetUrl = process.env.QA_CV_URL;
const storageState = process.env.QA_STORAGE_STATE;

if (!targetUrl) {
  console.error("Set QA_CV_URL to a builder URL, e.g. http://localhost:3000/dashboard/cv/...");
  process.exit(1);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext(
  storageState ? { storageState } : {},
);
const page = await context.newPage();
const consoleErrors = [];

page.on("console", (msg) => {
  if (msg.type() === "error") {
    consoleErrors.push(msg.text());
  }
});
page.on("pageerror", (error) => {
  consoleErrors.push(error.message);
});

const results = [];

for (const viewport of viewports) {
  await page.setViewportSize({
    width: viewport.width,
    height: viewport.height,
  });
  await page.goto(targetUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    path: window.location.pathname,
  }));

  results.push({
    viewport: viewport.name,
    ...overflow,
    horizontalOverflow: overflow.scrollWidth > overflow.clientWidth,
  });
}

await browser.close();

console.log(JSON.stringify({ results, consoleErrors }, null, 2));

const anyOverflow = results.some((item) => item.horizontalOverflow);
process.exit(anyOverflow ? 2 : 0);
