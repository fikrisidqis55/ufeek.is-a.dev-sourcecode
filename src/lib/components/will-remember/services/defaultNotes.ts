import type { FolderEntity, NoteEntity } from '../types';

export const DEFAULT_FOLDERS: FolderEntity[] = [
  {
    id: 'folder-quick',
    name: 'Quick Notes',
    icon: '📝',
    parentId: null,
    isExpanded: true
  },
  {
    id: 'folder-projects',
    name: 'Projects & Work',
    icon: '💼',
    parentId: null,
    isExpanded: true
  },
  {
    id: 'folder-retro',
    name: 'Retro Archives',
    icon: '💾',
    parentId: null,
    isExpanded: false
  }
];

export const DEFAULT_NOTES: NoteEntity[] = [
  {
    id: 'note-welcome',
    title: 'WELCOME.md',
    content: `# 📝 Welcome to will-remember (v1.0)
*Notepad speed, Notion flexibility, Windows 98 nostalgia.*

> [!NOTE]
> All changes are autosaved to local memory & disk. Press **Ctrl+S** to trigger an authentic 3.5" floppy drive seek head sound! 💾

---

### 🚀 Interactive Checklist (Click me!)
- [x] Boot up ufeek OS Windows 98 environment
- [x] Open will-remember desktop notes
- [ ] Try switching to **Mode: Notion Blocks** or **Mode: Raw Notepad**
- [ ] Click these checkboxes directly to toggle markdown state
- [ ] Type \`/\` on an empty line for quick block insertion
- [ ] Play a round of DOOM.EXE on the desktop

---

### 💻 Code Snippet Example
\`\`\`typescript
const willRemember = {
  speed: "Instant (Zero-DOM)",
  style: "Windows 98 Beveled",
  audio: "Web Audio Floppy Synthesizer",
  batteryImpact: 0
};
console.log("Never forget what matters.");
\`\`\`

### 💡 Tips & Tricks
1. **Tabs**: Press \`Ctrl+T\` for new tabs, \`Ctrl+W\` to close.
2. **Word Wrap**: Toggle wrap from the **View** menu.
3. **Sound**: Toggle diskette sound effects from **View -> Mute Sound**.
`,
    format: 'markdown',
    folderId: 'folder-quick',
    tags: ['welcome', 'guide'],
    isPinned: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'note-shortcuts',
    title: 'SHORTCUTS.txt',
    content: `================================================
  WILL-REMEMBER SHORTCUT REFERENCE CHEATSHEET
================================================

[DOCUMENT SHORTCUTS]
  Ctrl + S       : Save current note (Plays floppy drive sound 💾)
  Ctrl + N       : Create brand new document
  Ctrl + T       : Open new editor tab
  Ctrl + W       : Close current tab
  Ctrl + Tab     : Cycle to next active tab

[EDITOR SHORTCUTS]
  /              : Open Win98 Slash Command popup on empty line
  Tab            : Indent text (2 spaces in Raw mode)
  Shift + Tab    : Outdent text

[STATUS BAR LEGEND]
  Ln / Col       : Current cursor position
  Word Count     : Calculated live without lag
  Floppy Status  : In-sync with localStorage / RAM

Built with love for ufeek OS.
`,
    format: 'plain',
    folderId: 'folder-quick',
    tags: ['help', 'shortcuts'],
    isPinned: false,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'note-ideas',
    title: 'ROADMAP_2026.md',
    content: `# 🗺️ Future Roadmap & Ideas

### High Priority
- [x] Windows 98 authentic beveled window manager
- [x] Playable JS-DOS DOOM Shareware
- [x] will-remember hybrid notepad & Notion block editor
- [ ] Winamp 2.91 MP3 player widget with classic skins
- [ ] Paint 98 mini canvas app with spray can and bitmap tools

### Low Priority / Experiments
- [ ] WebGL 3D screensaver (3D Pipes / 3D Maze 95)
- [ ] Clippy assistant popup with sarcastic tips
`,
    format: 'markdown',
    folderId: 'folder-projects',
    tags: ['roadmap', 'ideas'],
    isPinned: false,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
