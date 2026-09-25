# AGENTS.md — ufeek OS (Portfolio Project)

> **Repository Context & Agent Directives for Antigravity & AI Assistants**

---

## 1. Project Overview & Identity

**ufeek OS** is an interactive, nostalgic personal portfolio for **Fikri Sidqi (Ufeek)**, designed as a full-fledged **Windows 98 Desktop Operating System** running in the browser.

- **URL & Domain:** `ufeek.is-a.dev` / `fikrisidqis-portfolio.vercel.app`
- **Core Aesthetic:** Authentic Windows 98 desktop environment (teal background `#008080`, classic beveled 3D windows, taskbar with Start Menu, movable/minimizable windows, retro cursors, glitch art accents, and an embedded playable MS-DOS DOOM Shareware emulator).
- **Core Philosophy:** Pixel-perfect retro immersion with high visual polish, fluid interactions, zero modern UI slop, and a distinct **"wah"** factor.

---

## 2. Tech Stack & Environment

| Layer | Technology | Key Details & Version |
|---|---|---|
| **Framework** | **Svelte 5** (`svelte@^5.57.0`) | **Must use Svelte 5 Runes** (`$state`, `$derived`, `$props`, `$effect`). Do NOT use Svelte 3/4 legacy syntax (`export let`, writable stores for local state). |
| **Meta-Framework** | **SvelteKit 2** (`@sveltejs/kit@^2.70.3`) | App routing, SSR/CSR adapter (`@sveltejs/adapter-auto`). |
| **Bundler & Tooling** | **Vite** + **TypeScript** | Strict typing, fast HMR. |
| **Styling** | **Tailwind CSS 3** (`tailwindcss@^3.4.17`) | Custom retro palette (`colors.win98.*`), beveled utility classes (`.win98-border-outset`, `.win98-border-inset`). |
| **3D Graphics** | **Threlte 8** + **Three.js** (`three@^0.173.0`) | 3D model rendering inside desktop windows (`@threlte/core`, `@threlte/extras`). |
| **Retro Emulation** | **JS-DOS 6.22** (Wasm) | Standalone canvas-based MS-DOS DOOM emulator using `/doom.jsdos`. |
| **Icons & Font** | **Lucide Svelte** + **Iconify** | Microsoft Sans Serif / Tahoma typography with retro bitmap rendering (`-webkit-font-smoothing: none`). |
| **Database** | **Prisma** (`prisma@^6.4.1`) | PostgreSQL/SQLite client for any data persistence. |

---

## 3. Mandatory Behavioral Rules

### Rule 1: Auto-Use Skills (`brainstorming` & `impeccable-ui-ux`)
Enforced via `.agents/rules/auto_use_skills.md`:
Whenever modifying or designing any frontend component:
1. **Brainstorm Edge Cases & Interactions:** Check responsiveness, empty states, click/focus capture, and mobile behavior before executing code.
2. **Elevate to "Wah" Standard:** Every element must feel intentional, lively, and retro-consistent.
3. **Thematic Purity (Windows 98):**
   - **Colors:** Desktop Teal (`#008080`), Window Surface (`#c0c0c0`), Title Active (`#000080`), Title Inactive (`#808080`).
   - **Borders:** Authentic 3D beveled borders:
     - Outset (buttons, windows, taskbar): light top/left (`#dfdfdf`), dark bottom/right (`#808080` & `#000000`).
     - Inset (sunken textboxes, active buttons, canvas containers): dark top/left, light bottom/right.
   - **No Modern Slop:** Absolutely no soft blur drop-shadows, pill-shaped radius, or modern floating glassmorphism unless specifically representing a glitch/hacker sub-element.

### Rule 2: Svelte 5 Runes Enforcement
- Use `$state()` for reactive variables.
- Use `$derived()` for computed values.
- Use `$props()` for component inputs: `let { windowId, title }: Props = $props();`.
- Mutate state directly (e.g., `window.isOpen = true;`) instead of immutably cloning arrays or using old Svelte store contracts.

---

## 4. Architecture & Key Directories

```text
ufeek.is-a.dev-sourcecode/
├── .agents/
│   ├── rules/
│   │   └── auto_use_skills.md        # Mandatory prompt rule for UI tasks
│   └── skills/
│       ├── brainstorming/             # Step-by-step problem-solving guide
│       └── impeccable-ui-ux/          # "Wah" standard & Win98 UI guidelines
├── static/
│   ├── doom.jsdos                     # Clean DOOM shareware bundle
│   └── cursors/                       # Classic retro cursors (.cur)
├── src/
│   ├── app.html                       # Base HTML boilerplate & meta tags
│   ├── routes/
│   │   ├── +layout.svelte             # Root layout: Taskbar, GlitchFavicon, Vercel Analytics
│   │   └── +page.svelte               # Desktop canvas: Icons, GlitchingBackground, Windows mount
│   └── lib/
│       ├── stores/
│       │   └── osState.svelte.ts      # Global OS State (Svelte 5 Runes singleton)
│       ├── styles/
│       │   └── globals.css            # Tailwind layers, Win98 utility classes, retro cursors
│       └── components/
│           ├── os/
│           │   ├── Window.svelte      # Draggable/resizable window with Win98 title bar
│           │   ├── Taskbar.svelte     # Bottom taskbar with Start button, clock & open apps
│           │   ├── StartMenu.svelte   # Classic pop-up Start Menu
│           │   └── DesktopIcon.svelte # Desktop icon with selection & double-click open
│           ├── Doom.svelte            # JS-DOS v6.22 canvas engine & keyboard capture
│           ├── ThreeDModel.svelte     # Threlte Three.js interactive viewport
│           ├── GlitchingBackground.svelte # Retro cyber-scan background effect
│           ├── CursorFollower.svelte  # Retro mouse trailer
│           ├── Hero.svelte            # Welcome / Intro window content
│           ├── AboutMe.svelte         # Bio & background
│           ├── Experience.svelte      # Career history formatted as retro tree/grid
│           ├── Projects.svelte        # Featured work showcase
│           ├── TechStack.svelte       # Skills & technologies
│           └── Contact.svelte         # Retro mail / contact form
```

---

## 5. Specialized Component Protocols

### A. Window Management (`src/lib/stores/osState.svelte.ts`)
- All windows are controlled through the `osState` singleton.
- Windows must have:
  - Unique string `id` (e.g. `'welcome'`, `'about'`, `'doom'`).
  - Active window focus with auto-incrementing `zIndex`.
  - Minimize / restore toggling integrated with `Taskbar.svelte`.

### B. JS-DOS & Canvas Integration (`src/lib/components/Doom.svelte`)
- Engine: **JS-DOS v6.22** (`https://js-dos.com/6.22/current/js-dos.js`).
- Never inject JS-DOS v8 configs into `doom.jsdos` (causes WASM `Uncaught [object Object]` abort).
- **Canvas Sizing:** Must use global CSS styling to prevent JS-DOS inline style overwrites:
  ```css
  :global(#dos-container canvas) {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
    image-rendering: pixelated !important;
    outline: none !important;
  }
  ```
- **Focus & Controls:** Must provide `tabindex="0"` and prevent default key scrolling on `ArrowKeys` / `Space` when the canvas is focused.

### C. Desktop Scrolling Prevention
- The desktop view is fixed (`fixed inset-0 overflow-hidden`).
- Never allow `window` scrollbars on the desktop body; each `Window.svelte` manages its own internal overflow.

---

## 6. Verification & Development Workflow

Run commands from workspace root using `bun`:

```bash
# Start local dev server
bun run dev

# Type-check and Svelte check
bun run check

# Production build check
bun run build
```

Before declaring any UI or logic task complete:
1. Verify that `bun run check` passes without Svelte 5 rune or TypeScript errors.
2. Confirm retro visual fidelity (no accidental modern styling leakage).
3. Test window interactions (drag, open, minimize, close, active title bar focus).
