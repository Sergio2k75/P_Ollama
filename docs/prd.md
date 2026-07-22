# PRD: Ollama Panel

## 1. Product Summary

Ollama Panel is a simple local-first web UI for monitoring one or more Ollama hosts.

The panel displays:

- Ollama host status
- Ollama version
- Available local models
- Running models
- User-managed Ollama host list

Default host:

```txt
http://localhost:11434
```

The product should stay intentionally small. The first version is a dashboard, not a full Ollama administration console.

## 2. Reference Links

### Primary Design Reference

* Porsche Design System GitHub  
  <https://github.com/porsche-design-system/porsche-design-system>

* Porsche Design System documentation  
  <https://designsystem.porsche.com/>

* Porsche Design System Tailwind CSS v4 introduction  
  <https://designsystem.porsche.com/v3/tailwindcss/introduction/>

* Porsche Design System tokens introduction  
  <https://designsystem.porsche.com/v4/tokens/introduction/>

* Porsche Design System Figma Community file  
  <https://www.figma.com/community/file/1385198638659084461/web-design-system-v4>

### Secondary UI Inspiration

* Figma dashboard templates  
  <https://www.figma.com/community/website-templates/dashboards>

Use Porsche Design System as the main visual reference. Use dashboard templates only for generic admin-panel layout inspiration. Visual tokens and component styling: see [DESIGN.md](DESIGN.md).

## 3. Background

Ollama exposes a local HTTP API. The panel should use that API to show the health and state of an Ollama host.

Required Ollama API endpoints:

```txt
GET /api/version
GET /api/tags
GET /api/ps
```

These endpoints are enough for the first version:

* `/api/version` returns Ollama version.
* `/api/tags` returns local models.
* `/api/ps` returns currently running models.

## 4. Audience

Primary audience:

* Developers running Ollama locally.
* AI hobbyists managing local models.
* Engineers testing different local LLM setups.
* Users who prefer a clean dashboard instead of terminal commands.

Secondary audience:

* Students learning Next.js, Tailwind CSS, local APIs, and basic dashboard design.
* Developers working in Cursor who want a small practical project.

## 5. User Problems

Users need a quick way to answer:

1. Is my Ollama host online?
2. Which Ollama version is running?
3. Which models are installed?
4. Which models are currently loaded or running?
5. Can I switch between multiple Ollama hosts?

## 6. Goals

### Functional Goals

* Display status for the default Ollama host.
* Display Ollama version.
* Display available local models.
* Display running models.
* Allow user to add a host.
* Allow user to remove a host.
* Allow user to select an active host.
* Persist hosts locally in the browser.

### UX Goals

* Clear dashboard layout.
* Minimal cognitive load.
* Works well on desktop and mobile.
* Accessible keyboard navigation.
* Visible focus states.
* Useful empty and error states.

### Technical Goals

* Use Next.js App Router.
* Use React Server Components where possible.
* Route Ollama API calls through Next.js backend.
* Store host list in `localStorage`.

Implementation details (components, folders, milestones): see [DEVELOPMENT.md](DEVELOPMENT.md) and [AGENTS.md](../AGENTS.md).

## 7. Non-Goals

The first version will not include:

* Pulling models
* Deleting models
* Chat interface
* Model creation
* Authentication
* Cloud sync
* User accounts
* Role-based access control
* Advanced telemetry
* Charts
* Logs viewer

These can be added later.

## 8. Constraints

### Design Constraints

* Use Porsche Design System as the visual reference.
* Keep the UI simple and dashboard-like.
* Prefer neutral colors, strong spacing, clean typography, subtle radius.
* Avoid using Porsche brand assets unless license and usage rights are clear.
* Do not copy protected brand assets directly into the project unless explicitly allowed.

Token values and Tailwind setup: see [DESIGN.md](DESIGN.md).

### Technical Constraints

* Tailwind CSS v4 is required.
* Host data should be stored locally in `localStorage`.
* API calls to Ollama should be routed through the Next.js backend to avoid browser CORS problems.
* Invalid host URLs must be rejected after normalization (IPs, hostnames, and full URLs).
* UI must handle offline hosts gracefully.

### Security Constraints

* Validate host URLs before server-side fetch.
* Only allow `http:` and `https:` URLs after normalization.
* Reject credentials, paths, query strings, and non-http(s) schemes in host input.
* Keep timeouts short.
* Do not expose stack traces in the UI.
* Treat user-entered host URLs as untrusted input.

## 9. User Stories

### Story 1: View default Ollama status

As a user, I want to open the panel and immediately see whether my default Ollama host is online.

Acceptance criteria:

* The app checks `http://localhost:11434`.
* The app shows online/offline state.
* The app shows an error message if the host is unreachable.

### Story 2: View Ollama version

As a user, I want to see the Ollama version of the selected host.

Acceptance criteria:

* The app calls `/api/version`.
* The version is displayed in a visible card.
* If version cannot be loaded, the UI shows a friendly fallback.

### Story 3: View available models

As a user, I want to see which models are available on the selected host.

Acceptance criteria:

* The app calls `/api/tags`.
* Model names are displayed.
* Empty state is shown when no models are returned.

### Story 4: View running models

As a user, I want to see which models are currently running.

Acceptance criteria:

* The app calls `/api/ps`.
* Running models are displayed separately from available models.
* Empty state is shown when no models are running.

### Story 5: Manage hosts

As a user, I want to add and remove Ollama hosts.

Acceptance criteria:

* User can open an accessible dialog.
* User can enter a valid host URL, LAN IP address, or hostname (shorthand or full URL).
* Shorthand without `http://` / `https://` is normalized to `http://` with Ollama port **11434** when no port is given (e.g. `192.168.1.10` → `http://192.168.1.10:11434`).
* `http://192.168.1.10` without a port also normalizes to port **11434**, not implicit port 80.
* User can save the host.
* User can remove non-default hosts.
* Hosts persist in `localStorage`.
* Active host can be selected with mouse and keyboard.
* `?host=` query values are normalized on page load the same way as dialog input.

### Story 5b: Add LAN Ollama host by IP

As a user, I want to monitor an Ollama instance on another machine on my network using its IP or hostname.

Acceptance criteria:

* User can add hosts such as `192.168.1.10`, `192.168.1.10:11434`, `my-server.local:11434`, or `http://192.168.1.10:11434`.
* Duplicate shorthand and full URL for the same host resolve to one stored origin (no duplicate list entries).
* Offline LAN hosts show the standard unreachable message without crashing the app.
* Reachability depends on Ollama on the target machine listening on the network (see operations note below).

**Operations (LAN):** On the machine running Ollama, bind to all interfaces when you need LAN access, for example `OLLAMA_HOST=0.0.0.0` (or your platform’s equivalent). The panel only validates and normalizes URLs; it does not discover hosts on the subnet.

## 10. Information Architecture

Homepage:

```txt
Header
Hero section
Host manager
Status section
Models section
Footer
```

## 11. Data Model

```ts
export type OllamaHost = {
  id: string;
  name: string;
  url: string;
  isDefault?: boolean;
};

export type OllamaPanelStatus = {
  host: string;
  online: boolean;
  version?: string;
  models: OllamaModel[];
  running: OllamaRunningModel[];
  error?: string;
};

export type OllamaModel = {
  name: string;
  model?: string;
  modified_at?: string;
  size?: number;
  digest?: string;
};

export type OllamaRunningModel = {
  name: string;
  model?: string;
  size?: number;
  digest?: string;
  expires_at?: string;
};
```

## 12. API Contract

Internal API route:

```txt
GET /api/ollama/status?host=http://localhost:11434
GET /api/ollama/status?host=http://192.168.1.10:11434
```

The `host` query parameter must be a normalized `http:` or `https:` origin (including explicit port when using the default Ollama port). Shorthand values in the browser UI or `?host=` on the home page are normalized before this call.

The route calls the selected host:

```txt
GET /api/version
GET /api/tags
GET /api/ps
```

Successful response:

```json
{
  "host": "http://localhost:11434",
  "online": true,
  "version": "0.x.x",
  "models": [],
  "running": []
}
```

Failed response:

```json
{
  "host": "http://localhost:11434",
  "online": false,
  "models": [],
  "running": [],
  "error": "Unable to reach Ollama host"
}
```

## 13. Empty States

### No models

Message:

```txt
No local models found on this host.
```

### No running models

Message:

```txt
No models are currently running.
```

### Offline host

Message:

```txt
This Ollama host is not reachable. Check that Ollama is running and the host URL is correct.
```

## 14. Success Metrics

For version 1:

* User can see host status without reading terminal output.
* User can add a second host.
* User can switch hosts.
* UI remains usable if Ollama is offline.
* Lighthouse accessibility score should stay high.
* No major keyboard traps.

## 15. Definition of Done

* `docs/PRD.md` exists.
* `docs/DESIGN.md` exists.
* `AGENTS.md` exists.
* Tailwind CSS v4 is configured.
* `app/globals.css` contains initial tokens.
* Page renders without runtime errors.
* 3 RSC section components exist in `components/sections/`.
* At least 1 accessible client component exists.
* Default Ollama host is supported.
* Add/remove host works.
* Version, models, and running models are displayed.
* Offline host state is handled.
