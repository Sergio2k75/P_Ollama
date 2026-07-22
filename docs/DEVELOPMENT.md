# Development Plan: Ollama Panel

Implementation plan for building the panel in Cursor. Product spec: [PRD.md](PRD.md). Design tokens: [DESIGN.md](DESIGN.md). AI coding rules: [AGENTS.md](../AGENTS.md).

## 1. Goal

Build a simple local-first web UI panel for monitoring one or more Ollama hosts.

Default host:

```txt
http://localhost:11434
```

Minimum visible data:

* Ollama status: online / offline / error
* Ollama version
* Available local models
* Running models
* Add / remove Ollama hosts

## 2. Recommended Stack

```txt
Next.js
React Server Components
TypeScript
Tailwind CSS v4
```

Suggested folders:

```txt
app/
  api/
    ollama/
      status/route.ts
  globals.css
  layout.tsx
  page.tsx

components/
  sections/
    HeroSection.tsx
    StatusSection.tsx
    ModelsSection.tsx
  HostManager.tsx
  ui/
    Badge.tsx
    Card.tsx
    Button.tsx

lib/
  ollama.ts
  types.ts

docs/
  PRD.md
  DESIGN.md

AGENTS.md
```

## 3. Page Architecture

### Server Components in `components/sections/`

```txt
components/sections/HeroSection.tsx
components/sections/StatusSection.tsx
components/sections/ModelsSection.tsx
```

Responsibilities:

**HeroSection** — App title, short explanation, default host indicator, local-first message.

**StatusSection** — Selected host status, version when online, error when offline.

**ModelsSection** — Available models and running models in simple cards.

Host selection is client-side. First pass: render default host data on server; client refreshes when user picks another host.

### Client Component

```txt
components/HostManager.tsx
```

Must use `"use client"`. Responsibilities: add/remove/select hosts, `localStorage` persistence, accessible add-host dialog. Accessibility rules: [AGENTS.md](../AGENTS.md).

## 4. UI Layout

Homepage:

```txt
Header
HeroSection
HostManager
StatusSection
ModelsSection
Footer
```

Cards:

* Status card
* Version card
* Available models card
* Running models card
* Host manager card

## 5. Implementation Milestones

### Milestone 1 — Project setup

* Create Next.js app.
* Enable TypeScript.
* Add Tailwind v4.
* Add docs: PRD, DESIGN, AGENTS.

### Milestone 2 — Ollama data layer

* Create `lib/types.ts` and `lib/ollama.ts`.
* Implement `GET /api/ollama/status?host=...` (see [PRD.md](PRD.md) for contract).
* Test default host.

### Milestone 3 — RSC page

* Build `HeroSection`, `StatusSection`, `ModelsSection`.
* Render default host data.

### Milestone 4 — Client host manager

* Add/remove/select hosts.
* Persist to `localStorage`.
* Accessible dialog and keyboard support.
* Normalize host input in `lib/ollama.ts` (`normalizeHostInput` / `validateHostUrl`): IPs and hostnames without scheme → `http://`; default port **11434** when omitted; reject credentials, paths, and non-http(s) schemes.
* Add-host dialog uses text input (not URL-only browser validation) with placeholders and errors for LAN shorthand.

**Manual checks (LAN / shorthand):**

* Add `192.168.1.x` (or a real LAN IP) → stored as `http://…:11434`.
* Add `192.168.1.x:11434` and full `http://192.168.1.x:11434` → same stored URL, no duplicate.
* Open `/?host=192.168.1.x` → normalizes to `http://192.168.1.x:11434`.
* Offline LAN host shows unreachable message; invalid input (`ftp://`, empty) shows friendly error.

### Milestone 5 — Design tokens

* Add CSS variables and `@theme inline` in `app/globals.css` per [DESIGN.md](DESIGN.md).

### Milestone 6 — Polish

* Empty, error, and loading states.
* Mobile layout and focus states.
* Run testing checklist in [AGENTS.md](../AGENTS.md).
