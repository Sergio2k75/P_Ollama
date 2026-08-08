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
  await expect(page.getByRole('heading', { name: 'Model recommendations' })).toBeVisible();
  await expect(page.getByRole('button', { name: /add host/i })).toBeVisible();
  await expect(page.getByText(/Monitor Ollama host health/i)).toBeVisible();
});

test('shows a refresh state for running models', async ({ page }) => {
  await expect(page.getByText(/Refreshing|Last updated|Waiting for first update/i)).toBeVisible();
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

test('switches hosts without waiting on unreachable Ollama and clears stale running models', async ({ page }) => {
  const runningCard = page.locator('article').filter({ has: page.getByRole('heading', { name: 'Running models' }) });

  await page.route('**/api/ollama/status**', async (route) => {
    const requestUrl = new URL(route.request().url());
    const host = requestUrl.searchParams.get('host') ?? '';

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        host,
        online: !host.includes('192.168.1.10'),
        version: '0.0.0-test',
        models: [],
        running: host.includes('192.168.1.10') ? [] : [{ name: 'stale-host-model' }],
        error: host.includes('192.168.1.10')
          ? 'This Ollama host is not reachable. Check that Ollama is running and the host URL is correct.'
          : undefined,
      }),
    });
  });

  await page.reload();
  await expect(runningCard.getByText('stale-host-model')).toBeVisible();

  await page.getByRole('button', { name: /add host/i }).click();
  await page.getByLabel('Host URL').fill('192.168.1.10');
  await page.getByLabel('Display name (optional)').fill('LAN target');
  await page.getByRole('button', { name: /save host/i }).click();

  // Navigation must not be blocked by the unreachable-host server fetch timeout (~5s).
  await expect(page).toHaveURL(/192\.168\.1\.10/, { timeout: 2000 });
  await expect(page.getByRole('button', { name: /Select host LAN target/i })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByText('stale-host-model')).toHaveCount(0);
});

test('adds a host when crypto.randomUUID is unavailable (LAN http context)', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      value: undefined,
      configurable: true,
    });
  });
  await page.reload();

  await page.getByRole('button', { name: /add host/i }).click();
  await page.getByLabel('Host URL').fill('192.168.1.20');
  await page.getByLabel('Display name (optional)').fill('LAN box');
  await page.getByRole('button', { name: /save host/i }).click();

  await expect(page.getByText('LAN box')).toBeVisible();
  await expect(page.getByText('http://192.168.1.20:11434')).toBeVisible();
});

test('keeps the dashboard usable on a small mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();

  await expect(page.getByRole('button', { name: /add host/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Host status' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Models', exact: true })).toBeVisible();
});
