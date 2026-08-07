import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const versionFile = path.join(rootDir, "lib", "app-version.ts");

if (process.env.SKIP_VERSION_BUMP === "1") {
  process.exit(0);
}

const source = await readFile(versionFile, "utf8");
const match = source.match(/export const APP_VERSION = "([^"]+)";/);

if (!match) {
  console.error("Could not parse APP_VERSION from lib/app-version.ts");
  process.exit(1);
}

const current = Number.parseFloat(match[1]);
const next = (Math.round((current + 0.01) * 100) / 100).toFixed(2);
const updated = source.replace(
  /export const APP_VERSION = "[^"]+";/,
  `export const APP_VERSION = "${next}";`,
);

await writeFile(versionFile, updated, "utf8");
console.log(`Bumped app version: ${match[1]} -> ${next}`);

const playwright = spawnSync(
  "npx",
  ["playwright", "test", "e2e_tests/screenshot.spec.ts", "--project=chromium"],
  { cwd: rootDir, stdio: "inherit", shell: true },
);

if (playwright.status !== 0) {
  process.exit(playwright.status ?? 1);
}

const gitAdd = spawnSync(
  "git",
  ["add", "lib/app-version.ts", "docs/screenshots/overview.png"],
  { cwd: rootDir, stdio: "inherit", shell: true },
);

if (gitAdd.status !== 0) {
  process.exit(gitAdd.status ?? 1);
}
