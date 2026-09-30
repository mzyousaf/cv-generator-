/**
 * Landing interaction smoke test (public).
 * Usage: node scripts/landing-interaction-qa.mjs [baseUrl]
 */
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3002";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];

page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (msg) => {
  if (msg.type() === "error") {
    errors.push(msg.text());
  }
});

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });

await page.getByRole("button", { name: /Create Your CV Free/i }).first().click();
await page.waitForTimeout(500);
const dialog = page.getByRole("dialog");
const dialogVisible = await dialog.isVisible();

await page.keyboard.press("Escape");
await page.waitForTimeout(300);

await page.getByRole("button", { name: "Open menu" }).click();
await page.getByRole("banner").getByRole("link", { name: "Templates" }).click();
await page.waitForTimeout(300);

const templatesRendered = await page.locator("#templates").isVisible();
const templateCards = await page.locator("#templates li").count();

await browser.close();

console.log(
  JSON.stringify(
    {
      dialogVisible,
      templatesRendered,
      templateCards,
      errors,
    },
    null,
    2,
  ),
);

process.exit(errors.length > 0 ? 1 : 0);
