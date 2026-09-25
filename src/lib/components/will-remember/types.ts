export type EditorMode = 'raw' | 'blocks';

export interface NoteEntity {
  id: string;
  title: string;
  content: string;
  format: 'plain' | 'markdown';
  folderId: string | null;
  tags: string[];
  isPinned: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FolderEntity {
  id: string;
  name: string;
  icon?: string;
  parentId: string | null;
  isExpanded?: boolean;
}

export interface EditorTab {
  tabId: string;
  noteId: string;
  title: string;
  isDirty: boolean;
  isPinned?: boolean;
  cursorLine: number;
  cursorCol: number;
}

export interface INoteRepository {
  readonly notes: NoteEntity[];
  readonly folders: FolderEntity[];
  readonly openTabs: EditorTab[];
  readonly activeTabId: string | null;
  readonly activeNote: NoteEntity | null;
  readonly editorMode: EditorMode;
  readonly isMuted: boolean;
  readonly wordWrap: boolean;

  // Tabs
  openNoteInTab(noteId: string): void;
  closeTab(tabId: string): void;
  switchTab(tabId: string): void;
  togglePinTab(tabId: string): void;
  createNewTab(title?: string, folderId?: string | null): string;

  // Notes
  updateActiveNoteContent(content: string): void;
  updateNoteTitle(noteId: string, title: string): void;
  saveActiveNote(): void;
  deleteNote(noteId: string): void;

  // Folders
  createFolder(name: string, parentId?: string | null): FolderEntity;
  toggleFolder(folderId: string): void;
  deleteFolder(folderId: string): void;
  moveNoteToFolder(noteId: string, targetFolderId: string | null): void;

  // Settings
  setEditorMode(mode: EditorMode): void;
  toggleMute(): void;
  toggleWordWrap(): void;

  // Import / Export
  exportActiveNote(format: 'txt' | 'md' | 'json'): void;
  exportAllNotes(): string;
  importNotes(jsonData: string): boolean;
}
