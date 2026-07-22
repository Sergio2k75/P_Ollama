# Design System: Ollama Panel

## 1. Design Direction

Ollama Panel uses a minimal admin-dashboard design inspired by Porsche Design System.

The interface should feel:

- Precise
- Calm
- Technical
- Premium
- Functional
- Low-noise

Use Porsche Design System as reference for discipline, spacing, contrast, typography, and component clarity.

Primary reference:

- Porsche Design System  
  https://designsystem.porsche.com/

Figma reference:

- Porsche Web Design System v4  
  https://www.figma.com/community/file/1385198638659084461/web-design-system-v4

## 2. Design Principles

### 2.1 Simple first

Every screen should answer the user’s main questions quickly:

- Is Ollama online?
- Which version is running?
- Which models are installed?
- Which models are running?
- Which host am I viewing?

### 2.2 Dashboard, not control center

The first version is mostly read-only. Avoid adding destructive or complex model operations.

### 2.3 Strong hierarchy

Use clear section titles, compact descriptions, and card-based grouping.

### 2.4 Accessible by default

All interactive elements must support keyboard navigation, visible focus, screen reader labels, and clear active states. Implementation rules live in `AGENTS.md`.

### 2.5 Token-driven UI

All visual values should map to CSS variables first, then Tailwind v4 theme tokens in `app/globals.css`.

## 3. Color Tokens

The palette is Porsche-inspired but intentionally generic to avoid depending on restricted brand assets.

### 3.1 Core colors

```css
:root {
  --color-background: #f7f7f5;
  --color-surface: #ffffff;
  --color-surface-muted: #efefec;

  --color-foreground: #111111;
  --color-muted-foreground: #60605c;

  --color-border: #deded8;
  --color-border-strong: #b8b8b0;

  --color-primary: #111111;
  --color-primary-foreground: #ffffff;

  --color-accent: #d5001c;
  --color-accent-foreground: #ffffff;

  --color-success: #0f7b3f;
  --color-warning: #a96700;
  --color-danger: #b00020;

  --color-focus: #0066cc;
}
```

### 3.2 Usage

| Token                      | Usage                          |
| -------------------------- | ------------------------------ |
| `--color-background`       | App background                 |
| `--color-surface`          | Cards, dialogs                 |
| `--color-surface-muted`    | Secondary cards, badges        |
| `--color-foreground`       | Main text                      |
| `--color-muted-foreground` | Descriptions, metadata         |
| `--color-border`           | Card borders                   |
| `--color-primary`          | Main buttons                   |
| `--color-accent`           | Important status or highlights |
| `--color-success`          | Online state                   |
| `--color-warning`          | Partial or degraded state      |
| `--color-danger`           | Offline/error state            |
| `--color-focus`            | Focus outline                  |

## 4. Typography

Use system fonts for simplicity and performance.

```css
:root {
  --font-sans: Arial, Helvetica, sans-serif;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}
```

### 4.1 Type scale

```css
:root {
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
}
```

### 4.2 Typography usage

| Element       |          Size | Weight |
| ------------- | ------------: | -----: |
| Page title    |  `--text-3xl` |    700 |
| Section title |   `--text-xl` |    700 |
| Card title    |   `--text-lg` |    600 |
| Body          | `--text-base` |    400 |
| Metadata      |   `--text-sm` |    400 |
| Badge         |   `--text-xs` |    600 |

## 5. Spacing

Use a compact 4px-based scale.

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
}
```

### 5.1 Layout spacing

| Use                       | Token                      |
| ------------------------- | -------------------------- |
| Card padding              | `--space-6`                |
| Section vertical gap      | `--space-10`               |
| Grid gap                  | `--space-4` or `--space-6` |
| Button horizontal padding | `--space-4`                |
| Button vertical padding   | `--space-2`                |
| Page gutter mobile        | `--space-4`                |
| Page gutter desktop       | `--space-8`                |

## 6. Radius

Porsche-inspired layouts often feel precise and restrained. Use moderate radius, not overly bubbly corners.

```css
:root {
  --radius-sm: 0.375rem;
  --radius-md: 0.625rem;
  --radius-lg: 0.875rem;
  --radius-xl: 1.25rem;
  --radius-full: 999px;
}
```

### 6.1 Radius usage

| Element | Radius          |
| ------- | --------------- |
| Badge   | `--radius-full` |
| Button  | `--radius-md`   |
| Input   | `--radius-md`   |
| Card    | `--radius-lg`   |
| Dialog  | `--radius-xl`   |

## 7. Shadows

Keep shadows very subtle.

```css
:root {
  --shadow-card: 0 1px 2px rgb(0 0 0 / 0.06), 0 8px 24px rgb(0 0 0 / 0.04);
  --shadow-dialog: 0 16px 48px rgb(0 0 0 / 0.18);
}
```

## 8. Borders

```css
:root {
  --border-width: 1px;
}
```

Use borders more often than shadows.

Cards:

```txt
1px solid var(--color-border)
```

Focused controls:

```txt
2px solid var(--color-focus)
```

## 9. Component Guidelines

### 9.1 Cards

Cards should have:

* White background
* 1px border
* Subtle shadow
* Clear title
* Small metadata line
* Compact content

### 9.2 Buttons

Primary button:

* Black background
* White text
* Medium radius
* Strong hover state

Secondary button:

* White background
* Border
* Black text

Danger button:

* White background
* Danger border/text
* Only for removing hosts

### 9.3 Badges

Use badges for:

* Online
* Offline
* Running
* Local
* Default host

Badge shape:

```txt
pill / full radius
```

### 9.4 Dialog

The Add Host dialog must:

* Trap visual attention with backdrop
* Use `role="dialog"`
* Use `aria-modal="true"`
* Have a title
* Have description text
* Focus the URL input on open
* Close on Escape
* Return focus to trigger on close

### 9.5 Forms

Inputs should have:

* Visible label
* Placeholder only as example, not replacement for label
* Error text if invalid
* Focus-visible outline

**Add Host dialog — host URL field**

| Element | Copy |
|---------|------|
| Label | Host URL |
| Description (dialog) | Enter an IP, hostname, or full URL. http and https only; port defaults to 11434 when omitted. |
| Placeholder | `192.168.1.10` or `http://192.168.1.10:11434` |
| Error (invalid) | Enter an IP, hostname, or URL. http/https only; port defaults to 11434. |
| Display name placeholder | Workstation (optional) |

Use `PInputText` for the host field so shorthand IPs are not blocked by native URL validation before submit.

## 10. Layout

### 10.1 Desktop

```txt
Max width: 1120px
Centered container
Two-column dashboard grid where useful
```

### 10.2 Mobile

```txt
Single column
Cards stacked vertically
Host manager appears before status cards
```

## 11. Tailwind v4 Token Translation

Add this to `app/globals.css`.

```css
@import "tailwindcss";

:root {
  --background: #f7f7f5;
  --surface: #ffffff;
  --surface-muted: #efefec;

  --foreground: #111111;
  --muted-foreground: #60605c;

  --border: #deded8;
  --border-strong: #b8b8b0;

  --primary: #111111;
  --primary-foreground: #ffffff;

  --accent: #d5001c;
  --accent-foreground: #ffffff;

  --success: #0f7b3f;
  --warning: #a96700;
  --danger: #b00020;

  --focus: #0066cc;

  --radius-sm: 0.375rem;
  --radius-md: 0.625rem;
  --radius-lg: 0.875rem;
  --radius-xl: 1.25rem;

  --shadow-card: 0 1px 2px rgb(0 0 0 / 0.06), 0 8px 24px rgb(0 0 0 / 0.04);
  --shadow-dialog: 0 16px 48px rgb(0 0 0 / 0.18);
}

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-surface-muted: var(--surface-muted);

  --color-foreground: var(--foreground);
  --color-muted-foreground: var(--muted-foreground);

  --color-border: var(--border);
  --color-border-strong: var(--border-strong);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);

  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);

  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-danger: var(--danger);

  --color-focus: var(--focus);

  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);

  --shadow-card: var(--shadow-card);
  --shadow-dialog: var(--shadow-dialog);
}

html {
  background: var(--background);
  color: var(--foreground);
}

body {
  min-height: 100vh;
  font-family: Arial, Helvetica, sans-serif;
}

:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
```

If using Porsche Design System package directly, import its Tailwind theme after Tailwind according to its Tailwind documentation:

```css
@import "tailwindcss";
@import "@porsche-design-system/components-react/tailwindcss";
```

## 12. Visual QA Checklist

* Page works at 375px width.
* Page works at 768px width.
* Page works at desktop width.
* Long model names wrap or truncate safely.
* Offline host state does not break layout.
* Empty model lists look intentional.
* Buttons have hover and focus states.
