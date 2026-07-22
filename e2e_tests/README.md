# Playwright automation

This folder contains the end-to-end test suite for the Ollama Panel app.

## What is covered

- Browser-level dashboard rendering and layout checks
- Add-host dialog flow and host removal flow
- Basic mobile viewport behavior
- HTTP API smoke checks for Ollama and the local status route

## Prerequisites

- Node.js 20+
- Dependencies installed with `npm install`
- A local Ollama instance for API tests, or the tests will still exercise the offline/error path

## Common commands

- Run all Playwright tests: `npm run test:e2e`
- Run tests in a visible browser: `npm run test:e2e:headed`
- Debug a specific file: `npm run test:e2e:debug -- e2e_tests/ollama.spec.ts`
- Run one spec in one browser: `npx playwright test e2e_tests/ollama.spec.ts --project=chromium`
- Run one test by name: `npx playwright test e2e_tests/ollama.spec.ts --grep "add host"`

## Notes

- The Playwright config starts the Next.js app automatically on `http://127.0.0.1:3000`.
- The browser tests use a clean local storage state before each run.
- API tests can be pointed at a different Ollama host with `OLLAMA_HOST=http://host:11434`.
