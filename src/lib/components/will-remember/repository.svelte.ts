import type { EditorMode, EditorTab, FolderEntity, INoteRepository, NoteEntity } from './types';
import { DEFAULT_FOLDERS, DEFAULT_NOTES } from './services/defaultNotes';
import { playClickSound, playDingSound, playFloppySaveSound, setAudioMuted } from './services/audioSynthesizer';

const STORAGE_KEY_NOTES = 'ufeek_will_remember_notes_v1';
const STORAGE_KEY_FOLDERS = 'ufeek_will_remember_folders_v1';
const STORAGE_KEY_SETTINGS = 'ufeek_will_remember_settings_v1';

export function createWillRememberRepository(): INoteRepository & {
  isSidebarOpen: boolean;
  toggleSidebar(): void;
  statusMessage: string;
  setStatusMessage(msg: string): void;
} {
  // Check if browser environment
  const isBrowser = typeof window !== 'undefined';

  // Initialize stored or default notes
  let initialNotes: NoteEntity[] = DEFAULT_NOTES;
  let initialFolders: FolderEntity[] = DEFAULT_FOLDERS;
  let initialMode: EditorMode = 'raw';
  let initialMute = false;
  let initialWordWrap = true;

  if (isBrowser) {
    try {
      const storedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
      if (storedNotes) {
        initialNotes = JSON.parse(storedNotes);
      }
      const storedFolders = localStorage.getItem(STORAGE_KEY_FOLDERS);
      if (storedFolders) {
        initialFolders = JSON.parse(storedFolders);
      }
      const storedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        initialMode = settings.editorMode || 'raw';
        initialMute = !!settings.isMuted;
        initialWordWrap = settings.wordWrap !== false;
      }
    } catch {
      // Fallback to defaults
    }
  }

  setAudioMuted(initialMute);

  // Svelte 5 Runes State
  let notes = $state<NoteEntity[]>(initialNotes);
  let folders = $state<FolderEntity[]>(initialFolders);
  let editorMode = $state<EditorMode>(initialMode);
  let isMuted = $state<boolean>(initialMute);
  let wordWrap = $state<boolean>(initialWordWrap);
  let isSidebarOpen = $state<boolean>(true);
  let statusMessage = $state<string>('Ready');

  // Initial tab setup
  const welcomeNote = initialNotes.find((n) => !n.isDeleted) || initialNotes[0];
  const initialTabs: EditorTab[] = welcomeNote
    ? [
        {
          tabId: 'tab-' + welcomeNote.id,
          noteId: welcomeNote.id,
          title: welcomeNote.title,
          isDirty: false,
          isPinned: welcomeNote.isPinned,
          cursorLine: 1,
          cursorCol: 1
        }
      ]
    : [];

  let openTabs = $state<EditorTab[]>(initialTabs);
  let activeTabId = $state<string | null>(initialTabs.length > 0 ? initialTabs[0].tabId : null);

  // Active note derived from active tab
  let activeTab = $derived(openTabs.find((t) => t.tabId === activeTabId) || null);
  let activeNote = $derived(activeTab ? notes.find((n) => n.id === activeTab.noteId) || null : null);

  // Autosave timer
  let autosaveTimer: ReturnType<typeof setTimeout> | null = null;

  function persistToStorage() {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
      localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
      localStorage.setItem(
        STORAGE_KEY_SETTINGS,
        JSON.stringify({
          editorMode,
          isMuted,
          wordWrap
        })
      );
    } catch (e) {
      console.error('Failed to persist notes to localStorage', e);
    }
  }

  function scheduleAutosave() {
    statusMessage = 'Writing to buffer...';
    if (autosaveTimer) clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      persistToStorage();
      if (activeTab) {
        activeTab.isDirty = false;
      }
      statusMessage = 'Autosaved to disk 💾';
      setTimeout(() => {
        if (statusMessage === 'Autosaved to disk 💾') statusMessage = 'Ready';
      }, 2000);
    }, 600);
  }

  function setStatusMessage(msg: string) {
    statusMessage = msg;
  }

  // --- TAB ACTIONS ---
  function openNoteInTab(noteId: string) {
    const note = notes.find((n) => n.id === noteId && !n.isDeleted);
    if (!note) return;

    playClickSound();
    const existingTab = openTabs.find((t) => t.noteId === noteId);
    if (existingTab) {
      activeTabId = existingTab.tabId;
      return;
    }

    const newTab: EditorTab = {
      tabId: 'tab-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      noteId: note.id,
      title: note.title,
      isDirty: false,
      isPinned: note.isPinned,
      cursorLine: 1,
      cursorCol: 1
    };

    openTabs.push(newTab);
    activeTabId = newTab.tabId;
  }

  function closeTab(tabId: string) {
    playClickSound();
    const index = openTabs.findIndex((t) => t.tabId === tabId);
    if (index === -1) return;

    openTabs.splice(index, 1);

    if (activeTabId === tabId) {
      if (openTabs.length > 0) {
        const nextIndex = Math.min(index, openTabs.length - 1);
        activeTabId = openTabs[nextIndex].tabId;
      } else {
        activeTabId = null;
      }
    }
  }

  function switchTab(tabId: string) {
    playClickSound();
    activeTabId = tabId;
  }

  function togglePinTab(tabId: string) {
    playClickSound();
    const tab = openTabs.find((t) => t.tabId === tabId);
    if (!tab) return;
    tab.isPinned = !tab.isPinned;
    const note = notes.find((n) => n.id === tab.noteId);
    if (note) {
      note.isPinned = tab.isPinned;
      persistToStorage();
    }
  }

  function createNewTab(title?: string, folderId?: string | null): string {
    playClickSound();
    const newId = 'note-' + Date.now();
    const noteTitle = title || `Untitled_${notes.length + 1}.md`;

    const newNote: NoteEntity = {
      id: newId,
      title: noteTitle,
      content: `# ${noteTitle.replace(/\\.md$|\\.txt$/i, '')}\n\nType your notes here...`,
      format: 'markdown',
      folderId: folderId ?? 'folder-quick',
      tags: [],
      isPinned: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    notes.push(newNote);

    const newTab: EditorTab = {
      tabId: 'tab-' + newId,
      noteId: newNote.id,
      title: newNote.title,
      isDirty: false,
      cursorLine: 1,
      cursorCol: 1
    };

    openTabs.push(newTab);
    activeTabId = newTab.tabId;

    persistToStorage();
    return newNote.id;
  }

  // --- NOTE ACTIONS ---
  function updateActiveNoteContent(content: string) {
    if (!activeNote || !activeTab) return;
    activeNote.content = content;
    activeNote.updatedAt = new Date().toISOString();
    activeTab.isDirty = true;
    scheduleAutosave();
  }

  function updateNoteTitle(noteId: string, newTitle: string) {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    note.title = trimmed;
    note.updatedAt = new Date().toISOString();

    const tab = openTabs.find((t) => t.noteId === noteId);
    if (tab) {
      tab.title = trimmed;
    }
    persistToStorage();
    playClickSound();
    statusMessage = `Renamed note to '${trimmed}'`;
    setTimeout(() => {
      if (statusMessage.startsWith('Renamed note')) statusMessage = 'Ready';
    }, 2500);
  }

  function saveActiveNote() {
    if (activeNote && activeTab) {
      activeTab.isDirty = false;
      activeNote.updatedAt = new Date().toISOString();
    }
    persistToStorage();
    playFloppySaveSound();
    statusMessage = 'Committed to Floppy Disk 💾 [OK]';
    setTimeout(() => {
      if (statusMessage === 'Committed to Floppy Disk 💾 [OK]') statusMessage = 'Ready';
    }, 2500);
  }

  function deleteNote(noteId: string) {
    playDingSound();
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    note.isDeleted = true;
    const tab = openTabs.find((t) => t.noteId === noteId);
    if (tab) {
      closeTab(tab.tabId);
    }
    persistToStorage();
    statusMessage = `Deleted '${note.title}'`;
  }

  // --- FOLDER ACTIONS ---
  function createFolder(name: string, parentId?: string | null): FolderEntity {
    playClickSound();
    const newFolder: FolderEntity = {
      id: 'folder-' + Date.now(),
      name: name || 'New Folder',
      icon: '📁',
      parentId: parentId || null,
      isExpanded: true
    };
    folders.push(newFolder);
    persistToStorage();
    return newFolder;
  }

  function renameFolder(folderId: string, newName: string) {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;
    folder.name = trimmed;
    persistToStorage();
    playClickSound();
    statusMessage = `Renamed folder to '${trimmed}'`;
    setTimeout(() => {
      if (statusMessage.startsWith('Renamed folder')) statusMessage = 'Ready';
    }, 2500);
  }

  function toggleFolder(folderId: string) {
    playClickSound();
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      folder.isExpanded = !folder.isExpanded;
    }
  }

  function deleteFolder(folderId: string) {
    playDingSound();
    const index = folders.findIndex((f) => f.id === folderId);
    if (index !== -1) {
      folders.splice(index, 1);
      // Move notes under this folder to root
      notes.forEach((n) => {
        if (n.folderId === folderId) {
          n.folderId = null;
        }
      });
      persistToStorage();
    }
  }

  function moveNoteToFolder(noteId: string, targetFolderId: string | null) {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    if (note.folderId === targetFolderId) return;

    note.folderId = targetFolderId;
    note.updatedAt = new Date().toISOString();

    if (targetFolderId) {
      const targetFolder = folders.find((f) => f.id === targetFolderId);
      if (targetFolder) {
        targetFolder.isExpanded = true;
      }
    }

    playClickSound();
    persistToStorage();

    const folderName = targetFolderId
      ? folders.find((f) => f.id === targetFolderId)?.name || 'Folder'
      : 'Root';
    statusMessage = `Moved '${note.title}' to ${folderName} 📁`;
    setTimeout(() => {
      if (statusMessage.startsWith('Moved ')) statusMessage = 'Ready';
    }, 2500);
  }

  // --- SETTINGS ---
  function setEditorMode(mode: EditorMode) {
    playClickSound();
    editorMode = mode;
    persistToStorage();
  }

  function toggleMute() {
    isMuted = !isMuted;
    setAudioMuted(isMuted);
    if (!isMuted) {
      playClickSound();
    }
    persistToStorage();
    statusMessage = isMuted ? 'Audio Synthesizer: Muted' : 'Audio Synthesizer: Active 🔊';
  }

  function toggleWordWrap() {
    playClickSound();
    wordWrap = !wordWrap;
    persistToStorage();
  }

  function toggleSidebar() {
    playClickSound();
    isSidebarOpen = !isSidebarOpen;
  }

  // --- IMPORT / EXPORT ---
  function exportActiveNote(format: 'txt' | 'md' | 'json') {
    if (!activeNote || !isBrowser) return;
    playFloppySaveSound();

    let contentToExport = activeNote.content;
    let mimeType = 'text/plain';
    let ext = format;

    if (format === 'json') {
      contentToExport = JSON.stringify(activeNote, null, 2);
      mimeType = 'application/json';
    } else if (format === 'md') {
      mimeType = 'text/markdown';
    }

    const blob = new Blob([contentToExport], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = activeNote.title.replace(/\\.[^/.]+$/, '');
    a.download = `${baseName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    statusMessage = `Exported '${activeNote.title}' as .${ext}`;
  }

  function exportAllNotes(): string {
    playFloppySaveSound();
    const backup = {
      notes: notes.filter((n) => !n.isDeleted),
      folders,
      exportedAt: new Date().toISOString(),
      app: 'ufeek-will-remember',
      version: '1.0.0'
    };
    return JSON.stringify(backup, null, 2);
  }

  function importNotes(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.notes && Array.isArray(parsed.notes)) {
        notes = parsed.notes;
      }
      if (parsed.folders && Array.isArray(parsed.folders)) {
        folders = parsed.folders;
      }
      persistToStorage();
      playDingSound();
      statusMessage = 'Backup imported successfully!';
      return true;
    } catch {
      playDingSound();
      statusMessage = 'Import error: Invalid JSON format';
      return false;
    }
  }

  return {
    get notes() { return notes; },
    get folders() { return folders; },
    get openTabs() { return openTabs; },
    get activeTabId() { return activeTabId; },
    get activeNote() { return activeNote; },
    get editorMode() { return editorMode; },
    get isMuted() { return isMuted; },
    get wordWrap() { return wordWrap; },
    get isSidebarOpen() { return isSidebarOpen; },
    get statusMessage() { return statusMessage; },

    setStatusMessage,
    openNoteInTab,
    closeTab,
    switchTab,
    togglePinTab,
    createNewTab,
    updateActiveNoteContent,
    updateNoteTitle,
    saveActiveNote,
    deleteNote,
    createFolder,
    renameFolder,
    toggleFolder,
    deleteFolder,
    moveNoteToFolder,
    setEditorMode,
    toggleMute,
    toggleWordWrap,
    toggleSidebar,
    exportActiveNote,
    exportAllNotes,
    importNotes
  };
}

// Global Singleton Store for will-remember
export const willRememberStore = createWillRememberRepository();
