# 📋 PRD — Fitur Drag & Drop Folder & External File (`will-remember`)
> **Spesifikasi Teknis & Panduan Desain Retro Windows 98**  
> **Fitur**: File & Note Drag & Drop Interaction System  
> **Target Aplikasi**: `will-remember` (`WILLREMEM.EXE`) pada **ufeek OS**  
> **Lokasi Dokumen**: `docs/PRD-will-remember-drag-and-drop.md`  
> **Status**: Ready for Planning & Implementation  

---

## 1. Pertanyaan: Ke Mana Data Disimpan Saat Ini? 💾

Saat ini, seluruh catatan, folder, dan preferensi aplikasi `will-remember` tersimpan secara **100% lokal dan persisten di browser client** menggunakan **Web Storage API (`localStorage`)**:

### A. Lokasi Penyimpanan Teknis
| Kategori | Key di `localStorage` | Format Data | Keterangan |
|---|---|---|---|
| **Daftar Catatan** | `ufeek_will_remember_notes_v1` | JSON Array of `NoteEntity` | Berisi `id`, `title`, `content` (Markdown), `folderId`, `tags`, `isPinned`, `updatedAt`. |
| **Daftar Folder** | `ufeek_will_remember_folders_v1` | JSON Array of `FolderEntity` | Berisi `id`, `name`, `icon`, `parentId`, `isExpanded`. |
| **Preferensi Editor** | `ufeek_will_remember_settings_v1` | JSON Object | Berisi mode editor (`raw` / `blocks`), status audio (`isMuted`), dan `wordWrap`. |

### B. Karakteristik & Keamanan Penyimpanan:
1. **Otomatis & Persisten**: 
   - Setiap ketikan disimpan ke buffer memori dan di-*commit* ke `localStorage` melalui **debounced autosave (600ms)**.
   - Penekanan `Ctrl+S` atau tombol **Save** melakukan sinkronisasi instan ke diskette `localStorage` dan memicu efek audio stepper motor floppy 3.5".
   - Data **tetap aman** saat tab browser di-refresh, browser ditutup, atau PC di-restart.
2. **Kapasitas**:
   - `localStorage` browser umumnya berkapasitas ~5MB–10MB per origin. Untuk teks catatan murni, kapasitas ini setara dengan ribuan dokumen catatan.
3. **Ekspor & Backup Manual**:
   - Menu **File -> Backup All Notes (.json)** mengunduh seluruh database ke file JSON di komputer lokal.
   - Menu **File -> Export active as .md / .txt** mengunduh dokumen aktif ke file fisik.
   - Menu **File -> Restore Notes Backup...** memungkinkan *restore* kembali seluruh data kapan saja.

---

## 2. Overview Fitur Baru: Drag & Drop ke Folder 📁✨

Fitur **Drag & Drop** pada `will-remember` didesain untuk mereplikasi pengalaman **Windows 98 Explorer** yang intuitif dan taktil. Fitur ini mencakup 2 kemampuan utama:

1. **Internal Drag & Drop**: Pengguna dapat men-drag sebuah catatan di sidebar Explorer dan menjatuhkannya (*drop*) ke folder tujuan manapun atau ke area Root.
2. **External File Drop**: Pengguna dapat men-drag file nyata dari desktop komputer mereka (file `.md`, `.txt`, `.json`) dan melepaskannya langsung ke dalam jendela `will-remember` atau ke atas folder tertentu untuk langsung diimpor menjadi catatan baru!

---

## 3. User Stories & Alur Interaksi

### 3.1 Skenario A: Memindahkan Catatan ke Folder Lain (Internal)
1. **User Action**: Pengguna menekan dan menahan (*drag*) sebuah file catatan (misal: `ROADMAP_2026.md`) di sidebar Explorer.
2. **Visual Feedback (Win98 Style)**:
   - Kursor berubah menjadi `cursor: move` klasik.
   - Elemen yang di-drag menampilkan bayangan mini dengan garis putus-putus (*dashed outline border* khas Windows 98).
3. **Hover Target Feedback**:
   - Saat kursor melayang di atas folder target (misal: `📁 Retro Archives`), folder tersebut otomatis:
     - Mendapatkan highlight biru aktif Windows 98 (`bg-win98-title-active text-white`) atau border putus-putus hitam-putih (*marching ants effect*).
     - Jika pengguna melayang (*hover*) di atas folder tertutup selama **800ms**, folder tersebut otomatis terbuka (*auto-expand*).
4. **Drop Action**:
   - Pengguna melepas klik mouse (*drop*).
   - Efek suara klik mekanik / floppy seek berbunyi (`playClickSound()`).
   - `folderId` catatan target diperbarui ke ID folder tujuan.
   - Status bar menampilkan: `Moved 'ROADMAP_2026.md' to 'Retro Archives' 📁`.
   - Data langsung di-autosave ke `localStorage`.

---

### 3.2 Skenario B: Mengeluarkan Catatan ke "Root Notes"
1. **User Action**: Pengguna men-drag catatan yang berada di dalam folder dan menjatuhkannya ke area kosong "Root Notes" di bagian bawah sidebar.
2. **Drop Action**:
   - `folderId` catatan diubah menjadi `null`.
   - Catatan berpindah ke daftar root notes.

---

### 3.3 Skenario C: Drag & Drop File Nyata dari Luar (External Desktop File Drop)
1. **User Action**: Pengguna men-drag file `.md` atau `.txt` dari File Explorer Windows / Finder laptop mereka langsung ke dalam jendela `will-remember`.
2. **Visual Feedback**:
   - Overlay drop zone retro muncul di atas editor dengan border putus-putus 3D (`win98-border-inset`) bertuliskan:  
     `[ 💾 DROP FILE HERE TO IMPORT AS NEW NOTE ]`.
3. **Drop Action**:
   - Browser membaca isi file melalui HTML5 `FileReader` API.
   - File baru otomatis dibuat di folder aktif atau folder yang di-hover.
   - Catatan baru langsung terbuka di tab baru.
   - Efek suara floppy disk save (`playFloppySaveSound()`) berbunyi untuk merayakan import berhasil.

---

## 4. Spesifikasi Desain & Estetika (Impeccable Win98)

Sesuai dengan `.agents/skills/impeccable-ui-ux/SKILL.md`:

```
+------------------------------------+
| 📁 Projects & Work                 |
|    ├── 📄 Todo.md                  |
|    └── 📄 Idea.md  <-- [DRAGGING]  |
|                                    |
| [📁 Retro Archives] <============= |  <-- DROP TARGET HIGHLIGHT
|   (border: 2px dashed #000080)     |      (Auto-expands on hover)
+------------------------------------+
```

1. **Drag Source**:
   - Elemen yang sedang di-drag diberi style redup/opacity 40% dan border tipis putus-putus.
2. **Drop Target (Folder Node)**:
   - Saat `dragover`: Latar folder berubah menjadi `#000080` dengan teks putih, atau memiliki border inset hitam-putih `border-2 border-dashed border-[#000080]`.
3. **Zero Modern Slop**:
   - Tidak menggunakan animasi bouncy modern atau floating blur. Transisi instan dan tajam (*pixelated precision*).
4. **Audio Feedback**:
   - Menggunakan audio synthesizer Web Audio API:
     - `playClickSound()` saat file dilepas pada folder.
     - `playDingSound()` jika drag dibatalkan atau dilepas di target yang tidak valid.

---

## 5. Perubahan Arsitektur & State Management

### 5.1 Penambahan Method pada `INoteRepository` (`types.ts`)
```typescript
export interface INoteRepository {
  // ... method yang sudah ada ...

  // Method baru untuk Drag & Drop:
  moveNoteToFolder(noteId: string, targetFolderId: string | null): void;
  importExternalFile(file: File, targetFolderId?: string | null): Promise<void>;
}
```

### 5.2 Implementasi pada `repository.svelte.ts`
```typescript
function moveNoteToFolder(noteId: string, targetFolderId: string | null) {
  const note = notes.find((n) => n.id === noteId);
  if (!note) return;

  // Jika folder sama, tidak perlu ubah
  if (note.folderId === targetFolderId) return;

  note.folderId = targetFolderId;
  note.updatedAt = new Date().toISOString();
  
  // Pastikan folder tujuan terbuka agar user melihat hasilnya
  if (targetFolderId) {
    const targetFolder = folders.find((f) => f.id === targetFolderId);
    if (targetFolder) targetFolder.isExpanded = true;
  }

  playClickSound();
  persistToStorage();
  
  const folderName = targetFolderId 
    ? (folders.find(f => f.id === targetFolderId)?.name || 'Folder') 
    : 'Root';
  statusMessage = `Moved '${note.title}' to ${folderName} 📁`;
}
```

### 5.3 Modifikasi Komponen
1. **`SidebarTree.svelte`**:
   - Menambahkan attribute `draggable="true"` pada item catatan (`onstartdrag`, `ondragend`).
   - Menambahkan event handler pada folder node:
     - `ondragover={(e) => { e.preventDefault(); ... }}`
     - `ondragenter` (highlight & trigger timer auto-expand)
     - `ondragleave` (remove highlight)
     - `ondrop` (panggil `willRememberStore.moveNoteToFolder(draggedNoteId, folder.id)`)
   - Menambahkan dropzone untuk "Root Notes" area di bagian bawah.
2. **`WillRemember.svelte`**:
   - Menambahkan global window file drop handler untuk file nyata dari OS komputer luar (`.txt`, `.md`, `.json`).

---

## 6. Edge Cases & Penanganan

| Skenario Edge Case | Potensi Masalah | Solusi Penanganan |
|---|---|---|
| **Drop ke Folder yang Sama** | Mengubah timestamp dan mentrigger autosave tanpa perubahan nyata | Cek kondisi `if (note.folderId === targetFolderId) return;` (early exit). |
| **Drag & Drop Batal (Esc / Lepas di luar)** | State drag menggantung atau UI tetap ter-highlight | Event `ondragend` selalu membersihkan `draggedNoteId = null` dan `dragOverFolderId = null`. |
| **Hover Folder Tertutup** | Pengguna ingin memasukkan file ke dalam sub-folder yang sedang tertutup | Timer `hoverExpandTimer` selama 800ms: jika kursor tetap di atas folder, panggil `folder.isExpanded = true`. |
| **File Eksternal Terlalu Besar (>2MB)** | Memory crash atau browser melambat | Berikan validasi ukuran file: jika `file.size > 2 * 1024 * 1024`, tampilkan notifikasi alert di status bar dan batalkan pembacaan. |
| **File Non-Teks (misal: .png, .exe)** | Konten binary merusak dokumen | Filter mime-type/ekstensi: hanya izinkan file teks (`.txt`, `.md`, `.json`, `.csv`, `.js`, `.ts`, `.html`). |

---

## 7. Rencana Tahapan Implementasi

1. **Fase 1: State & Contract Upgrade**:
   - Tambahkan `moveNoteToFolder` dan `importExternalFile` pada [`types.ts`](file:///d:/Ufeek/portfolio.app/ufeek.is-a.dev-sourcecode/src/lib/components/will-remember/types.ts) dan [`repository.svelte.ts`](file:///d:/Ufeek/portfolio.app/ufeek.is-a.dev-sourcecode/src/lib/components/will-remember/repository.svelte.ts).
2. **Fase 2: Explorer Tree Drag & Drop**:
   - Pasang HTML5 Drag & Drop API pada [`SidebarTree.svelte`](file:///d:/Ufeek/portfolio.app/ufeek.is-a.dev-sourcecode/src/lib/components/will-remember/components/SidebarTree.svelte).
   - Implementasikan highlight target dan timer auto-expand saat hover.
3. **Fase 3: External OS File Drop**:
   - Pasang drop handler global di [`WillRemember.svelte`](file:///d:/Ufeek/portfolio.app/ufeek.is-a.dev-sourcecode/src/lib/components/will-remember/WillRemember.svelte) untuk import file `.txt`/`.md`/`.json` dari desktop pengguna.
4. **Fase 4: Testing & Verification**:
   - Verifikasi type-check via `bun run check`.
   - Test interaksi drag & drop di browser.
