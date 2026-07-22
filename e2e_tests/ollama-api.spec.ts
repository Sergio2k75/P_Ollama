/**
 * HTTP API smoke tests for the Ollama integration.
 *
 * These tests call the Ollama HTTP API directly and also exercise the local
 * Next.js status route. Set OLLAMA_HOST when you want to point the checks at a
 * non-default Ollama instance.
 *
 * Examples:
 *   npm run test:e2e -- e2e_tests/ollama-api.spec.ts
 *   OLLAMA_HOST=http://192.168.1.10:11434 npx playwright test e2e_tests/ollama-api.spec.ts
 */
import { expect, test } from '@playwright/test';

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? 'http://127.0.0.1:11434';

test('GET /api/tags returns a models payload when Ollama is reachable', async ({ request }) => {
  const response = await request.get(`${OLLAMA_HOST}/api/tags`);

  if (!response.ok()) {
    expect(response.status()).toBeGreaterThanOrEqual(400);
    return;
  }

  const body = await response.json();
  expect(body).toHaveProperty('models');
  expect(Array.isArray(body.models)).toBeTruthy();
});

test('GET /api/ollama/status reports a friendly offline payload', async ({ request }) => {
  const response = await request.get('/api/ollama/status?host=not-a-real-host');

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body).toEqual(expect.objectContaining({
    host: expect.any(String),
    online: false,
    models: expect.any(Array),
    running: expect.any(Array),
  }));
  expect(body.host).toContain('not-a-real-host');
  expect(body.error).toEqual(expect.any(String));
});

test('GET /api/ollama/status defaults to a status object shape', async ({ request }) => {
  const response = await request.get('/api/ollama/status');

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body).toEqual(expect.objectContaining({
    host: expect.any(String),
    online: expect.any(Boolean),
    models: expect.any(Array),
    running: expect.any(Array),
  }));
});
