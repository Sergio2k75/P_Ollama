/**
 * Browser-level UI coverage for the Ollama Panel.
 *
 * These tests exercise the main dashboard flows in a real browser and are
 * intended to run against the local Next.js dev server.
 *
 * Examples:
 *   npm run test:e2e -- e2e_tests/ollama.spec.ts
 *   npx playwright test e2e_tests/ollama.spec.ts --project=chromium
 *   npx playwright test --grep "add host" --headed
 */
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test('renders the core dashboard layout', async ({ page }) => {
  await expect(page).toHaveTitle(/Ollama/);
  await expect(page.getByRole('heading', { name: 'Ollama Panel' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Host status' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Models', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /add host/i })).toBeVisible();
  await expect(page.getByText(/Monitor Ollama host health/i)).toBeVisible();
});

test('opens and closes the add-host dialog with keyboard', async ({ page }) => {
  await page.getByRole('button', { name: /add host/i }).focus();
  await page.keyboard.press('Enter');

  await expect(page.getByLabel('Host URL')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByLabel('Host URL')).not.toBeVisible();
});

test('adds, selects, and removes a host using shorthand input', async ({ page }) => {
  await page.getByRole('button', { name: /add host/i }).click();

  await expect(page.getByLabel('Host URL')).toBeVisible();
  await page.getByLabel('Host URL').fill('192.168.1.10');
  await page.getByLabel('Display name (optional)').fill('Workstation');
  await page.getByRole('button', { name: /save host/i }).click();

  await expect(page.getByText('Workstation')).toBeVisible();
  await expect(page.getByText('http://192.168.1.10:11434')).toBeVisible();

  await page.locator('li', { hasText: 'Workstation' }).getByRole('button', { name: /remove/i }).click();
  await expect(page.getByText('Workstation')).not.toBeVisible();
});

test('keeps the dashboard usable on a small mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();

  await expect(page.getByRole('button', { name: /add host/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Host status' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Models', exact: true })).toBeVisible();
});
