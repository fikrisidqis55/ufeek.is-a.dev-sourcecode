# 📋 Product Requirements Document (PRD) — `will-remember` (`WILLREMEM.EXE`)
> **Desktop Productivity App for ufeek OS (Windows 98 Portfolio)**  
> **Tagline**: *Notepad speed, Notion flexibility, Windows 98 nostalgia — never forget what matters.*  
> **Target Version**: v1.0.0  
> **Author**: Antigravity x Fikri Sidqi (Ufeek)  
> **Status**: Ready for Implementation  
> **Path**: `docs/PRD-will-remember.md`

---

## 1. Executive Summary & Project Alignment

### 1.1 Context & Vision
Dalam portfolio **ufeek OS** (`ufeek.is-a.dev`), pengguna disuguhkan pengalaman desktop retro Windows 98 interaktif dengan aplikasi seperti *My Computer (Hero)*, *About Me*, *Experience*, *Tech Stack*, *Projects*, *Contact*, dan *DOOM.EXE*. 

**`will-remember`** dirancang sebagai aplikasi desktop unggulan baru (*flagship built-in desktop app*) yang memecahkan dilema klasik produktivitas:
- **Masalah**: Aplikasi modern seperti Notion terasa berat dan lambat untuk sekadar menangkap ide cepat (*cold-start friction*). Sebaliknya, Windows Notepad klasik sangat kencang tetapi miskin struktur (tanpa checklist interaktif, format markdown, atau hierarki folder).
- **Solusi**: Aplikasi hybrid yang memadukan **kecepatan instan Notepad**, **fleksibilitas blok Notion** (headings, interactive todo, slash commands, callouts), serta **estetika autentik Windows 98** yang terintegrasi secara natif ke dalam window manager ufeek OS.

---

## 2. Alignment with Existing Codebase Architecture

Aplikasi ini disesuaikan secara presisi dengan arsitektur dan konvensi ufeek OS:

| Aspek Arsitektur | Standar Project Saat Ini | Implementasi pada `will-remember` |
|---|---|---|
| **Framework & Reactivity** | **Svelte 5** (`svelte@^5.57.0`) | **Wajib menggunakan Svelte 5 Runes** (`$state`, `$derived`, `$props`, `$effect`). <br>⚠️ **Penting:** Semua state store file wajib berekstensi `.svelte.ts` (misal: `willRememberState.svelte.ts`) agar tidak terjadi SSR runtime crash `$state is not defined`. |
| **Meta-Framework & SSR** | **SvelteKit 2** (`@sveltejs/kit@^2.70.3`) | Kompatibel dengan SSR (`adapter-auto`). Semua akses `localStorage`, `window.AudioContext`, dan `navigator.clipboard` harus diguard dengan cek `browser` dari `$app/environment` atau `typeof window !== 'undefined'`. |
| **Window Management** | `src/lib/stores/osState.svelte.ts` | Terdaftar sebagai window id `'will-remember'` dengan konfigurasi default: width `780px`, height `560px`, draggable, resizable, minimizable, dan auto z-index. |
| **Desktop & Shell UI** | `DesktopIcon.svelte` & `StartMenu.svelte` | Muncul sebagai icon desktop baru (`📝 will-remember`) dan item menu di Start Menu (`Programs -> will-remember`). |
| **Styling & Design Tokens** | **Tailwind CSS 3** (`tailwind.config.ts`) & `globals.css` | Menggunakan token otentik: `.win98-border-outset`, `.win98-border-inset`, `.win98-button`, `.win98-window-title`, font `MS Sans Serif` / `Share Tech Mono` tanpa modern blur/rounded slop. |
| **Audio Synthesizer** | Web Audio API (Zero External Asset) | Mensintesis gelombang audio untuk efek motor stepper disket floppy 3.5" saat save, click mekanik, dan chime peringatan retro. |
| **Data Persistence** | Repository Pattern (`localStorage`) | In-memory cache + `localStorage` auto-save debounced (500ms) dengan starter notes bawaan. |

---

## 3. Core Feature Specifications

### 🗂️ 3.1 Multi-Tab Document Management
- **Dynamic Tabs**: Tab strip tepat di bawah Menu Bar bergaya tab Windows 98 klasik.
- **Tab State**:
  - Tab aktif: `.win98-border-outset` dengan border bawah terbuka atau berlatar kontras `#ffffff` / `#dfdfdf`.
  - Tab inaktif: Berlatar `#c0c0c0`, teks redup, dapat diklik untuk berganti tab.
  - Pin Tab: Tab yang di-pin tetap berada di sisi kiri dengan icon pin 📌.
  - Close Button: Tombol mini `✕` pada setiap tab unpinned.
  - **Dirty State Indicator**: Tanda bintang (`*`) pada tab title dan window titlebar saat ada perubahan yang belum tersimpan ke storage.
- **Keyboard Shortcuts**:
  - `Ctrl + T`: Buka dokumen / tab baru.
  - `Ctrl + W`: Tutup tab yang aktif saat ini.
  - `Ctrl + Tab`: Navigasi sirkular antar tab terbuka.
  - `Ctrl + S`: Simpan dokumen seketika + picu suara floppy disk drive.

---

### ✍️ 3.2 Dual-Mode Hybrid Editor

Editor memiliki toggle switch di toolbar/statusbar antara dua mode:

#### A. Mode Notepad (Raw Monospace)
- Textarea berperforma tinggi dengan *zero input latency*.
- Font: `'Share Tech Mono'`, `Consolas`, atau `Courier New`, ukuran 13px, antialiasing tajam retro.
- **Line Number Gutter**: Kolom nomor baris di sisi kiri (tersinkronisasi saat scrolling).
- **Word Wrap Toggle**: Pilihan mode wrap atau horizontal scroll bar klasik.
- **Live Cursor Tracker**: Menghitung posisi kursor baris (`Ln`) dan kolom (`Col`) secara instan.

#### B. Mode Notion Blocks (Formatted & Interactive)
- Render markdown instan dengan tampilan retro chic (dokumen beveled putih ala Microsoft Word 97 / WordPad):
  - **Headings (H1, H2, H3)**: Tipografi tegas dengan garis pemisah tipis retro.
  - **Interactive Checklists**: Sintaks `- [ ]` dan `- [x]` dirender menjadi checkbox retro Win98. **Mengklik checkbox langsung mengubah teks markdown di bawahnya secara reaktif**.
  - **Code Blocks**: Box inset abu-abu gelap/terang dengan sintaks monospace retro dan tombol copy instan.
  - **Retro Callout Box**: Sintaks `> [!NOTE]` atau `> 💡` dirender dengan border inset dan icon retro 90-an.
  - **Bullet & Numbered Lists**: Indentasi hierarkis klasik.
- **Slash Commands Popover (`/`)**:
  - Mengetik `/` di awal baris memunculkan menu popup Win98 floating:
    - `/todo` — Masukkan To-Do Checklist `- [ ] `
    - `/h1`, `/h2`, `/h3` — Masukkan Heading
    - `/code` — Masukkan Code Block
    - `/quote` — Masukkan Retro Quote / Callout
    - `/divider` — Masukkan pemisah horizontal `---`
    - `/date` — Masukkan timestamp saat ini
  - Navigasi popup via keyboard (`ArrowUp`, `ArrowDown`, `Enter`, `Esc`).

---

### 📁 3.3 Explorer Sidebar (File & Folder Tree)
- Panel kiri yang dapat di-*resize* atau di-*toggle* (tutup/buka) via tombol toolbar atau menu *View -> Toggle Sidebar*.
- **Pohon Berkas Hierarkis**:
  - Menampilkan folder bersarang (misal: `📁 Work`, `📁 Personal`, `📁 Ideas`, `📁 Archive`).
  - Indikator expand/collapse `[+]` dan `[-]` otentik Windows 98 TreeView dengan garis titik-titik (*dotted tree guide lines*).
  - Klik berkas untuk membuka di tab editor (jika tab sudah ada, langsung aktifkan tab tersebut).
- **Quick Search Filter**:
  - Input box inset di bagian atas sidebar untuk filter instan judul catatan dan tag secara real-time.
- **Aksi Cepat Toolbar Sidebar**:
  - Tombol New Note (`📄+`), New Folder (`📁+`), dan Collapse All (`↕`).

---

### 🪟 3.4 Windows 98 Shell Integration

```
+-------------------------------------------------------------------------+
| [📝] will-remember - [Roadmap_2026.md *]                       [_] [□] [X] |
+-------------------------------------------------------------------------+
| File   Edit   View   Format   Help                                      |
+-------------------------------------------------------------------------+
| [📄 New] [💾 Save] [📁 Open] | [✂ Cut] [📋 Copy] | [Mode: Notion/Raw ▾] |
+-------------------------------------------------------------------------+
| [📁 Explorer] | [Roadmap_2026.md *] [✕] | [Quick_Ideas.txt] [✕] | [+]   |
+---------------+---------------------------------------------------------+
| 🔍 Search...  | 1 | # 🚀 Roadmap 2026                                   |
| ├─ 📁 Notes   | 2 | - [x] Launch ufeek OS Desktop                       |
| │  ├─ 📄 Todo | 3 | - [ ] Integrate will-remember App                   |
| │  └─ 📄 Idea | 4 |                                                     |
| └─ 📁 Archive | 5 | > [!NOTE]                                           |
|               | 6 | > Always backup your floppy disks!                  |
+---------------+---------------------------------------------------------+
| [Ready]       | Ln 3, Col 12       | 142 Words      | Floppy: Synced 💾 |
+-------------------------------------------------------------------------+
```

1. **Menu Bar Dropdowns**:
   - **File**: *New Note (`Ctrl+N`)*, *New Tab (`Ctrl+T`)*, *Save (`Ctrl+S`)*, *Export (.txt, .md, .json)*, *Print/Preview*, *Exit*.
   - **Edit**: *Undo (`Ctrl+Z`)*, *Redo (`Ctrl+Y`)*, *Cut*, *Copy*, *Paste*, *Select All*, *Insert Timestamp*.
   - **View**: *Toggle Sidebar*, *Raw Mode*, *Notion Blocks Mode*, *Toggle Word Wrap*, *Toggle Sound Effects*.
   - **Help**: *About will-remember (Dialog Box Retro 3D)*, *Keyboard Shortcuts Cheatsheet*.
2. **Status Bar (4 Inset Panels)**:
   - Panel 1: Status Operasi (`Ready`, `Writing to disk...`, `Saved`).
   - Panel 2: Posisi Kursor (`Ln 12, Col 4`).
   - Panel 3: Penghitung Kata & Karakter (`248 words, 1,420 chars`).
   - Panel 4: Indikator Database / Floppy Disk (`Storage: LocalDisk [OK] 💾`).

---

### 🔊 3.5 Procedural Retro Audio Synthesizer (Web Audio API)
Tidak memerlukan file aset MP3/WAV eksternal (100% zero-latency, zero-bandwidth, offline-ready):
1. **Floppy Disk 3.5" Step Motor Sound**:
   - Dihasilkan dengan modulasi osilator frekuensi rendah (`square`/`sawtooth` ~60-120Hz) dengan burst gain envelope berulang untuk mereplikasi bunyi mekanik head stepper drive floppy disk saat menyimpan dokumen.
2. **Mechanical Win98 Click**:
   - Pulsa mikro pendek berkisar 800Hz - 1200Hz dengan decay 15ms saat tombol atau tab diklik.
3. **Retro Asterisk / Ding Chord**:
   - Sine wave 440Hz + 880Hz harmonik klasik Windows 98 saat dialog konfirmasi atau pesan error muncul.
4. **Mute Control**: Pengguna dapat mematikan suara kapan saja melalui menu *View -> Sound Effects* (preferensi disimpan di `localStorage`).

---

## 4. Entity Schema & Data Layer

Aplikasi menggunakan struktur tipe ketat TypeScript yang disimpan di `localStorage` dengan prefix `ufeek_will_remember_`:

```typescript
// Entitas Catatan
export interface NoteEntity {
  id: string;                   // UUID v4 atau nanoid unik
  title: string;                // misal: "Ide_Proyek.md"
  content: string;              // Isi teks / Markdown
  format: 'plain' | 'markdown'; // Mode preferensi
  folderId: string | null;      // Folder ID induk (null = root)
  tags: string[];               // Kategori / tagar
  isPinned: boolean;            // Status disematkan
  isDeleted: boolean;           // Recycle bin soft delete
  createdAt: string;            // ISO 8601 Timestamp
  updatedAt: string;            // ISO 8601 Timestamp
}

// Entitas Folder Direktori
export interface FolderEntity {
  id: string;
  name: string;
  icon?: string;                // misal: '📁', '💡', '💼'
  parentId: string | null;      // Nested folder support
  isExpanded?: boolean;         // State ekspansi tree view
}

// State Tab Editor Aktif
export interface EditorTab {
  tabId: string;
  noteId: string;
  title: string;
  isDirty: boolean;             // Ada perubahan yang belum di-commit
  cursorLine: number;
  cursorCol: number;
  scrollPosition?: number;
}

// Kontrak Repository (Siap diekstensi ke SQLite / Supabase)
export interface INoteRepository {
  getAllNotes(): Promise<NoteEntity[]>;
  getNoteById(id: string): Promise<NoteEntity | null>;
  saveNote(note: NoteEntity): Promise<NoteEntity>;
  deleteNote(id: string, hardDelete?: boolean): Promise<boolean>;
  
  getAllFolders(): Promise<FolderEntity[]>;
  createFolder(name: string, parentId?: string | null): Promise<FolderEntity>;
  deleteFolder(folderId: string): Promise<boolean>;
  
  exportData(): Promise<string>;
  importData(jsonContent: string): Promise<boolean>;
}
```

---

## 5. UI/UX & Thematic Design Guidelines (Impeccable Win98)

Sesuai dengan `.agents/skills/impeccable-ui-ux/SKILL.md` dan `.agents/rules/auto_use_skills.md`:

1. **Bevel Consistency**:
   - Area yang ditekan atau field input (textarea, sunken search box, sunken statusbar panels) **wajib** menggunakan `.win98-border-inset`.
   - Tombol, tab yang belum ditekan, dan frame luar **wajib** menggunakan `.win98-border-outset`.
   - State aktif tombol: Menggeser teks 1px ke bawah-kanan (`padding: 3px 7px 1px 9px;`).
2. **Palet Warna Win98**:
   - Desktop Teal: `#008080`
   - Window Background / Surface: `#c0c0c0`
   - Border Light: `#dfdfdf` / `#ffffff`
   - Border Dark: `#808080`
   - Border Darker: `#000000`
   - Active Titlebar: `#000080` (Dark Blue)
   - Active Titlebar Text: `#ffffff`
   - Inactive Titlebar: `#808080`
   - Editor Paper Canvas: `#ffffff` (Teks `#000000`)
3. **No Modern Slop**:
   - Dilarang menambahkan `border-radius: 9999px` (pill buttons).
   - Dilarang menambahkan blur modern drop shadows (`backdrop-blur`, `shadow-2xl` lembut modern).
   - Typography utama: `MS Sans Serif`, `Tahoma`, atau fallback `sans-serif` dengan `-webkit-font-smoothing: none`.
   - Typography editor: `Share Tech Mono`, `Consolas`, `monospace`.

---

## 6. Edge Cases & Reliability Strategy

| Skenario Edge Case | Potensi Masalah | Solusi / Penanganan |
|---|---|---|
| **SvelteKit SSR Initialization** | ReferenceError pada `$state` atau `localStorage` saat evaluasi modul SSR | Pastikan file reactive store menggunakan ekstensi `.svelte.ts` (bukan `.ts`). Guard pemanggilan `localStorage` & `AudioContext` dengan `browser` guard. |
| **Pencegahan Default Shortcut Browser** | `Ctrl+S` memicu "Save Webpage", `Ctrl+W` menutup tab browser asli | Tambahkan `e.preventDefault()` pada `keydown` listener ketika window `will-remember` sedang fokus aktif. |
| **Koleksi Catatan Kosong (Cold Start)** | Pengguna baru membuka aplikasi dan layar kosong melompong | Sediakan *Starter Pack Notes*: 1. `WELCOME.md` (tutorial fitur), 2. `SHORTCUTS.txt`, dan 3. `PROJECT_IDEAS.md` secara otomatis saat pertama kali dibuka. |
| **Ukuran Layar Kecil (Mobile / Tablet)** | Lebar window 780px melebihi viewport mobile | `Window.svelte` otomatis menyesuaikan `max-width: 95vw; max-height: 80vh;`. Sidebar otomatis ter-collapse di layar < 640px dengan tombol toggle floating. |
| **Sinkronisasi Checklist Markdown** | Menekan checkbox di mode blocks merusak baris markdown lain | Gunakan regex parsing per-line yang mencari baris ke-N dan mengubah `[ ]` menjadi `[x]` atau sebaliknya tanpa mengubah struktur teks lainnya. |

---

## 7. Implementation Plan & File Structure

Pengerjaan akan diorganisir secara rapi di dalam subdirektori `src/lib/components/will-remember/`:

```text
src/
├── lib/
│   ├── components/
│   │   ├── will-remember/
│   │   │   ├── WillRemember.svelte           # Root application container & frame
│   │   │   ├── components/
│   │   │   │   ├── MenuBar.svelte            # File/Edit/View/Help menus & dialogs
│   │   │   │   ├── TabBar.svelte             # Multi-tab strip with close & dirty state
│   │   │   │   ├── SidebarTree.svelte        # Folder & note file explorer
│   │   │   │   ├── RawEditor.svelte          # Fast monospace textarea with line gutter
│   │   │   │   ├── NotionBlocksEditor.svelte # Formatted markdown with interactive todo
│   │   │   │   ├── SlashMenu.svelte          # Win98 popup for fast block insertion
│   │   │   │   └── StatusBar.svelte          # Inset panels for word count, cursor, & disk
│   │   │   ├── services/
│   │   │   │   ├── audioSynthesizer.ts       # Floppy disk & click Web Audio engine
│   │   │   │   └── defaultNotes.ts           # Pre-loaded retro starter notes
│   │   │   ├── repository.svelte.ts          # Reactive LocalStorage Note Repository (Svelte 5)
│   │   │   └── types.ts                      # Strict TypeScript interfaces
│   │   └── os/
│   │       ├── DesktopIcon.svelte            # Register desktop icon
│   │       └── StartMenu.svelte              # Register start menu launcher
│   └── stores/
│       └── osState.svelte.ts                 # Register 'will-remember' window instance
└── routes/
    └── +page.svelte                          # Mount window component on desktop canvas
```

---

## 8. Acceptance Criteria (Definition of Done)

- [ ] **Desktop Integration**: Icon `will-remember` (`📝`) muncul di Desktop canvas dan Start Menu, serta dapat dibuka via klik/double-click.
- [ ] **Window Management**: Window dapat di-drag, di-minimize, di-maximize, di-restore, dan di-close tanpa glitch.
- [ ] **Multi-Tab**: Mampu membuka beberapa catatan sekaligus, berganti tab dengan klik atau `Ctrl+Tab`, dan menutup tab dengan `Ctrl+W` / tombol `✕`.
- [ ] **Dual-Mode Editor**:
  - Mode Raw menampilkan line numbers, monospace font, dan perhitungan Ln/Col akurat.
  - Mode Blocks menampilkan headings, callouts, and checklist interaktif yang bisa dicentang langsung.
  - Slash command (`/`) memunculkan popup Win98 untuk menyisipkan blok cepat.
- [ ] **Sidebar Explorer**: Folder dan catatan tersusun rapi dengan filter pencarian instan.
- [ ] **Audio Feedback**: Menyimpan dokumen via `Ctrl+S` atau tombol save memicu suara motor disket floppy khas retro secara prosedural.
- [ ] **Persistence**: Catatan tersimpan secara aman di `localStorage` dan tidak hilang saat halaman di-refresh.
- [ ] **Type & Build Check**: Lulus `bun run check` dan `bun run build` tanpa error atau peringatan Svelte 5 runes.
