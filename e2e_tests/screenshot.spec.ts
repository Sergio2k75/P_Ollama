import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { APP_VERSION } from "../lib/app-version";

const screenshotDir = path.join(process.cwd(), "docs", "screenshots");
const screenshotPaths = [
  path.join(screenshotDir, "overview.png"),
  path.join(screenshotDir, `${APP_VERSION}.png`),
];

test("capture overview and version screenshots", async ({ page }) => {
  await mkdir(screenshotDir, { recursive: true });

  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await expect(page.getByRole("heading", { name: "Ollama Panel" })).toBeVisible();

  for (const screenshotPath of screenshotPaths) {
    await page.screenshot({ path: screenshotPath, fullPage: true });
  }
});
