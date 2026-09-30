/**
 * Public routes QA: overflow + console errors.
 * Usage: node scripts/public-pages-qa.mjs [baseUrl]
 */
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3002";
const viewports = [
  ["1440x900", 1440, 900],
  ["1280x800", 1280, 800],
  ["768x1024", 768, 1024],
  ["390x844", 390, 844],
];
const paths = ["/", "/login", "/signup", "/privacy", "/terms"];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const consoleErrors = [];
const pageErrors = [];

page.on("console", (msg) => {
  if (msg.type() === "error") {
    consoleErrors.push({ url: page.url(), text: msg.text() });
  }
});
page.on("pageerror", (error) => {
  pageErrors.push({ url: page.url(), text: error.message });
});

const results = [];

for (const [name, width, height] of viewports) {
  await page.setViewportSize({ width, height });
  for (const path of paths) {
    await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    if (path === "/") {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
    }
    const metrics = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    results.push({
      viewport: name,
      path,
      ...metrics,
      overflow: metrics.sw > metrics.cw,
    });
  }
}

await browser.close();

const uniqueErrors = [
  ...new Map(
    [...consoleErrors, ...pageErrors].map((e) => [e.text, e]),
  ).values(),
];

console.log(
  JSON.stringify(
    {
      base,
      results,
      uniqueErrors,
      overflowCount: results.filter((r) => r.overflow).length,
    },
    null,
    2,
  ),
);

process.exit(uniqueErrors.length > 0 ? 1 : 0);
