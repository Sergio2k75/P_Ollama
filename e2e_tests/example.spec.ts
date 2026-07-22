/**
 * Reference example kept for Playwright basics.
 *
 * This file is intentionally lightweight and can be used as a template for new
 * browser tests. The project-specific coverage lives in the other spec files.
 *
 * Run: npx playwright test e2e_tests/example.spec.ts
 */
import { expect, test } from '@playwright/test';

test('loads the Playwright docs home page', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
  await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
});

test('shows the main navigation links', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'API' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'MCP', exact: true })).toBeVisible();
});

test('contains the expected hero text', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await expect(page.getByText('Playwright enables reliable web automation for testing, scripting, and AI agents.')).toBeVisible();
});

test('can navigate to the intro page', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await page.getByRole('link', { name: 'Docs' }).first().click();
  await expect(page).toHaveURL(/\/docs\/intro$/);
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
