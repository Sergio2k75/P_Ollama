# AGENTS.md

AI coding rules for Ollama Panel. Product spec, design tokens, and build plan live in separate docs — do not duplicate them here.

## Docs

| File | Purpose |
|------|---------|
| [docs/PRD.md](docs/PRD.md) | What to build — user stories, data model, API contract |
| [docs/DESIGN.md](docs/DESIGN.md) | How it looks — tokens, components, layout |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | How to build — stack, folders, milestones |

## Development Style

Keep the project simple.

Prefer:

* Small components
* Clear names
* TypeScript types
* Server Components by default
* Client Components only when needed
* Accessible UI
* Token-based styling
* Tailwind CSS v4 utilities

Avoid:

* Over-engineering
* Large state libraries
* Complex abstractions
* Premature model management features
* Unnecessary dependencies

## Architecture Rules

Use this structure:

```txt
app/
components/
components/sections/
lib/
docs/
```

Required server components:

```txt
components/sections/HeroSection.tsx
components/sections/StatusSection.tsx
components/sections/ModelsSection.tsx
```

Required client component:

```txt
components/HostManager.tsx
```

`HostManager.tsx` must include:

```tsx
"use client";
```

## Accessibility Rules

Interactive components must support:

* Keyboard usage
* Focus-visible states
* ARIA labels where needed
* Escape key for dialogs
* Proper input labels
* Clear active state

Do not use color as the only status signal.

## Styling Rules

Use [docs/DESIGN.md](docs/DESIGN.md) as source of truth. Implement tokens in `app/globals.css`.

## API Rules

Use internal route `GET /api/ollama/status?host=...` — see [docs/PRD.md](docs/PRD.md) for contract.

Always validate host URLs. Only allow `http:` and `https:`.

Return friendly errors. Do not expose stack traces.

## Testing Checklist

Before considering work done:

* App loads with Ollama offline.
* App loads with Ollama online.
* Default host is visible.
* User can add a host.
* User can add a host via IP shorthand (e.g. `192.168.1.10` → `http://192.168.1.10:11434`).
* User can switch to a LAN host and see offline messaging when unreachable.
* User can remove a non-default host.
* User can select host with keyboard.
* Dialog opens and closes with keyboard.
* Escape closes dialog.
* Version card renders.
* Available models card renders.
* Running models card renders.
* Empty states render.
* Mobile layout works.
