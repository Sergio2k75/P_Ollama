import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const screenshotDir = path.join(process.cwd(), "docs", "screenshots");
const screenshotPath = path.join(screenshotDir, "overview.png");

test("capture overview screenshot", async ({ page }) => {
  await mkdir(screenshotDir, { recursive: true });

  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await expect(page.getByRole("heading", { name: "Ollama Panel" })).toBeVisible();

  await page.screenshot({ path: screenshotPath, fullPage: true });
});
