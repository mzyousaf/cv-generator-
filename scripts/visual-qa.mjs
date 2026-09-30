/**
 * Headless QA: page loads, horizontal overflow, modal + button computed styles.
 * Usage: QA_BASE_URL=http://127.0.0.1:3000 node scripts/visual-qa.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL ?? "http://127.0.0.1:3000";

const viewports = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "390x844", width: 390, height: 844 },
];

const publicPaths = ["/", "/login", "/signup", "/privacy", "/terms"];

function measureOverflow(page) {
  return page.evaluate(() => {
    const el = document.documentElement;
    return {
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      ok: el.scrollWidth <= el.clientWidth + 1,
    };
  });
}

function readButtonStyle(locator) {
  return locator.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      color: s.color,
      backgroundColor: s.backgroundColor,
      borderColor: s.borderTopColor,
      opacity: s.opacity,
      visibility: s.visibility,
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const report = {
    overflowByViewport: {},
    modal390: null,
    buttonStates: {},
    pageStatus: {},
    untested: [
      "Dashboard and CV builder require authenticated session (no test credentials in CI).",
      "Login/signup validation errors require interactive form submit.",
      "Google OAuth redirect not exercised (would leave app).",
    ],
    errors: [],
  };

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();
    report.overflowByViewport[vp.name] = {};

    for (const path of publicPaths) {
      try {
        const res = await page.goto(`${BASE}${path}`, {
          waitUntil: "domcontentloaded",
          timeout: 45000,
        });
        report.pageStatus[`${vp.name}${path}`] = res?.status() ?? 0;
        report.overflowByViewport[vp.name][path] = await measureOverflow(page);
      } catch (e) {
        report.errors.push({ scope: `${vp.name}${path}`, error: String(e) });
      }
    }

    if (vp.name === "390x844") {
      try {
        await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
        await page
          .getByRole("button", { name: /create your cv free/i })
          .first()
          .click();
        await page.getByRole("dialog").waitFor({ timeout: 10000 });
        const docOverflow = await measureOverflow(page);
        const dialogMetrics = await page.evaluate(() => {
          const dialog = document.querySelector('[role="dialog"]');
          return {
            scrollHeight: dialog?.scrollHeight ?? 0,
            clientHeight: dialog?.clientHeight ?? 0,
            canScroll: (dialog?.scrollHeight ?? 0) > (dialog?.clientHeight ?? 0),
          };
        });
        report.modal390 = { docOverflow, dialogMetrics };
        await page.getByRole("button", { name: /sign in/i }).click();
        await page.getByRole("heading", { name: /sign in to continue/i }).waitFor();
        report.modal390.loginView = true;
      } catch (e) {
        report.errors.push({ scope: "390-modal", error: String(e) });
      }
    }

    await context.close();
  }

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });

  const checks = [
    {
      key: "primary",
      get: () => page.getByRole("button", { name: /create your cv free/i }).first(),
    },
    {
      key: "outline-nav-menu",
      get: () => page.getByRole("button", { name: /open menu/i }),
    },
  ];

  for (const { key, get } of checks) {
    try {
      const el = get();
      const defaultStyle = await readButtonStyle(el);
      const boxBefore = await el.boundingBox();
      await el.hover();
      const hoverStyle = await readButtonStyle(el);
      await el.focus();
      const focusOutline = await el.evaluate((node) => {
        const s = getComputedStyle(node);
        return s.outlineStyle !== "none" || s.boxShadow.includes("rgb");
      });
      report.buttonStates[key] = { defaultStyle, hoverStyle, focusOutline, boxBefore };
    } catch (e) {
      report.errors.push({ scope: `button-${key}`, error: String(e) });
    }
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(200);
  try {
    const inverse = page
      .locator("section")
      .filter({ hasText: "Ready to build your CV?" })
      .getByRole("button", { name: /create your cv free/i });
    report.buttonStates.inverse = {
      default: await readButtonStyle(inverse),
    };
    await inverse.hover();
    report.buttonStates.inverse.hover = await readButtonStyle(inverse);
  } catch (e) {
    report.errors.push({ scope: "button-inverse", error: String(e) });
  }

  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  try {
    const google = page.getByRole("button", { name: /continue with google/i });
    report.buttonStates.google = {
      default: await readButtonStyle(google),
      hasSvg: await google.locator("svg").count(),
    };
    const submit = page.getByRole("button", { name: /^sign in$/i });
    await submit.evaluate((node) => {
      node.disabled = true;
    });
    report.buttonStates.primaryDisabled = await readButtonStyle(submit);
  } catch (e) {
    report.errors.push({ scope: "login-buttons", error: String(e) });
  }

  await browser.close();
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
