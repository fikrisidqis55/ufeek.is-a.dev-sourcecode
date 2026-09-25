# will-remember Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `will-remember` (`WILLREMEM.EXE`), a Windows 98 desktop note-taking app combining Notepad instant speed with Notion-style blocks (interactive checklists, headings, callouts, slash commands) within ufeek OS.

**Architecture:** A standalone modular desktop app component mounted in `Window.svelte` via `osState.svelte.ts`. State management is powered by Svelte 5 Runes (`$state`, `$derived`) in `.svelte.ts` files with `localStorage` autosave. Zero external audio assets (100% Web Audio API procedural synthesis for floppy disk stepper motor sounds).

**Tech Stack:** Svelte 5 (Runes), SvelteKit 2, TypeScript, Tailwind CSS 3 (Win98 bevel tokens), Web Audio API.

**Spec:** [`docs/PRD-will-remember.md`](file:///d:/Ufeek/portfolio.app/ufeek.is-a.dev-sourcecode/docs/PRD-will-remember.md)

## Global Constraints

- Must use Svelte 5 Runes syntax (`$state`, `$derived`, `$props`, `$effect`).
- Any reactive TypeScript file containing runes MUST have the `.svelte.ts` file extension to prevent Vite SSR runtime crashes.
- All browser APIs (`window`, `document`, `localStorage`, `AudioContext`, `navigator.clipboard`) must be guarded with `typeof window !== 'undefined'` or `browser` from `$app/environment`.
- Authentic Windows 98 design language: `.win98-border-outset`, `.win98-border-inset`, `.win98-button`, `#c0c0c0`, `#000080`. No modern pill buttons or soft drop shadows.
- All code must pass `bun run check` and `bun run build`.

---

### Task 1: Core Types & Procedural Web Audio Engine

**Files:**
- Create: `src/lib/components/will-remember/types.ts`
- Create: `src/lib/components/will-remember/services/audioSynthesizer.ts`

**Interfaces:**
- Produces: `NoteEntity`, `FolderEntity`, `EditorTab`, `INoteRepository`, `EditorMode`, `AudioSynthesizer` (`playFloppySaveSound`, `playClickSound`, `playDingSound`).

- [ ] **Step 1: Create TypeScript type definitions**
  Define `NoteEntity`, `FolderEntity`, `EditorTab`, and editor interface contracts in `src/lib/components/will-remember/types.ts`.

- [ ] **Step 2: Create Web Audio procedural sound synthesizer**
  Implement `src/lib/components/will-remember/services/audioSynthesizer.ts` with floppy 3.5" stepper motor chirp, click, and ding sound generators with browser guards and mute toggle.

- [ ] **Step 3: Verify types and synthesizer**
  Run: `bun run check`
  Expected: PASS with 0 errors.

---

### Task 2: Default Starter Notes & Svelte 5 Reactive Repository

**Files:**
- Create: `src/lib/components/will-remember/services/defaultNotes.ts`
- Create: `src/lib/components/will-remember/repository.svelte.ts`

**Interfaces:**
- Consumes: `NoteEntity`, `FolderEntity`, `EditorTab` from `types.ts`.
- Produces: `willRememberStore` (Svelte 5 runes singleton managing notes, folders, open tabs, active tab, dirty state, and autosave).

- [ ] **Step 1: Create default starter notes and folders**
  Write pre-populated notes in `defaultNotes.ts` (`WELCOME.md` with features and interactive checklist, `SHORTCUTS.txt`, `PROJECT_IDEAS.md`).

- [ ] **Step 2: Implement reactive repository with Svelte 5 Runes**
  Create `repository.svelte.ts` using `$state()` for notes, folders, active tabs, dirty state, with debounced 500ms `localStorage` save and explicit save triggering audio feedback.

- [ ] **Step 3: Verify repository logic**
  Run: `bun run check`
  Expected: PASS with 0 errors.

---

### Task 3: Windows 98 Shell Components (MenuBar, TabBar, StatusBar, TreeView, About Dialog)

**Files:**
- Create: `src/lib/components/will-remember/components/MenuBar.svelte`
- Create: `src/lib/components/will-remember/components/TabBar.svelte`
- Create: `src/lib/components/will-remember/components/SidebarTree.svelte`
- Create: `src/lib/components/will-remember/components/StatusBar.svelte`
- Create: `src/lib/components/will-remember/components/AboutDialog.svelte`

**Interfaces:**
- Consumes: `willRememberStore`, `audioSynthesizer`.
- Produces: Modular Win98 UI chrome components.

- [ ] **Step 1: Create MenuBar.svelte**
  Dropdown menus for File (New, Save, Export .txt/.md/.json), Edit, View (Mode toggle, Word wrap, Audio mute), Help (About).

- [ ] **Step 2: Create TabBar.svelte**
  Multi-tab strip with Win98 beveled styling, pin status, dirty asterisk `*`, close button `✕`, and new tab `+`.

- [ ] **Step 3: Create SidebarTree.svelte**
  Win98 explorer tree with expand/collapse, quick search filter, new note/folder actions, and note selection.

- [ ] **Step 4: Create StatusBar.svelte & AboutDialog.svelte**
  4 inset status panels and retro 3D About dialog modal.

- [ ] **Step 5: Verify shell components**
  Run: `bun run check`
  Expected: PASS with 0 errors.

---

### Task 4: Dual-Mode Editor (Raw Notepad & Notion Blocks with Slash Commands)

**Files:**
- Create: `src/lib/components/will-remember/components/RawEditor.svelte`
- Create: `src/lib/components/will-remember/components/NotionBlocksEditor.svelte`
- Create: `src/lib/components/will-remember/components/SlashMenu.svelte`
- Create: `src/lib/components/will-remember/WillRemember.svelte`

**Interfaces:**
- Consumes: `willRememberStore`, `audioSynthesizer`, shell components.
- Produces: `WillRemember.svelte` master app component.

- [ ] **Step 1: Implement RawEditor.svelte**
  Monospace textarea with line numbers gutter, tab indentation handling, and real-time cursor Ln/Col tracker.

- [ ] **Step 2: Implement SlashMenu.svelte & NotionBlocksEditor.svelte**
  Formatted markdown blocks with interactive `- [ ]` / `- [x]` checkboxes that update note content directly, retro callouts, headings, code blocks, and `/` slash command popup.

- [ ] **Step 3: Implement WillRemember.svelte master container**
  Integrate toolbar, sidebar toggle, tabs, dual-mode editor switch, status bar, and keyboard shortcuts (`Ctrl+S`, `Ctrl+T`, `Ctrl+W`, `Ctrl+Tab`).

- [ ] **Step 4: Verify editor components**
  Run: `bun run check`
  Expected: PASS with 0 errors.

---

### Task 5: Desktop Shell Integration & End-to-End Verification

**Files:**
- Modify: `src/lib/components/os/DesktopIcon.svelte` (add window size defaults for `will-remember`)
- Modify: `src/lib/components/os/StartMenu.svelte` (add launcher entry)
- Modify: `src/routes/+page.svelte` (add desktop icon and mount `Window`)

- [ ] **Step 1: Update desktop icon & start menu**
  Add `will-remember` icon to `desktopIcons` and launcher button to `StartMenu.svelte`.

- [ ] **Step 2: Mount WillRemember in +page.svelte**
  Mount `<Window windowId="will-remember"><WillRemember /></Window>` in `+page.svelte`.

- [ ] **Step 3: Run comprehensive verification**
  Run: `bun run check && bun run build`
  Expected: Clean build with 0 errors.

- [ ] **Step 4: Commit completed feature**
  ```bash
  git add -A
  git commit -m "feat(notes): implement will-remember Windows 98 desktop app with dual-mode editor"
  ```
