<script lang="ts">
  import { willRememberStore } from '../repository.svelte';
  import { playClickSound } from '../services/audioSynthesizer';
  import AboutDialog from './AboutDialog.svelte';

  let activeMenu = $state<string | null>(null);
  let showAbout = $state(false);

  function toggleMenu(menu: string) {
    playClickSound();
    activeMenu = activeMenu === menu ? null : menu;
  }

  function closeMenu() {
    activeMenu = null;
  }

  function handleAction(action: () => void) {
    action();
    closeMenu();
  }

  function handleImportFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          willRememberStore.importNotes(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
    closeMenu();
  }
</script>

<svelte:window onclick={(e) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.win98-menubar')) {
    closeMenu();
  }
}} />

{#if showAbout}
  <AboutDialog onClose={() => (showAbout = false)} />
{/if}

<div class="win98-menubar flex flex-col bg-win98-surface select-none border-b border-win98-border-dark">
  <!-- Top Menu Dropdowns -->
  <div class="flex items-center text-xs px-1 py-0.5 gap-0.5 relative text-black">
    <!-- File Menu -->
    <div class="relative">
      <button 
        class="px-2 py-0.5 hover:bg-win98-title-active hover:text-white cursor-pointer {activeMenu === 'file' ? 'bg-win98-title-active text-white' : ''}"
        onclick={() => toggleMenu('file')}
      >
        <span class="underline">F</span>ile
      </button>

      {#if activeMenu === 'file'}
        <div class="win98-window win98-border-outset absolute left-0 top-full mt-0.5 w-48 bg-win98-surface shadow-md z-[10001] py-1 flex flex-col text-xs text-black">
          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white flex justify-between" onclick={() => handleAction(() => willRememberStore.createNewTab())}>
            <span>New Note</span>
            <span class="text-gray-500">Ctrl+N</span>
          </button>
          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white flex justify-between" onclick={() => handleAction(() => willRememberStore.createNewTab())}>
            <span>New Tab</span>
            <span class="text-gray-500">Ctrl+T</span>
          </button>
          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white flex justify-between" onclick={() => handleAction(() => willRememberStore.saveActiveNote())}>
            <span>Save to Floppy</span>
            <span class="text-gray-500">Ctrl+S</span>
          </button>
          
          <div class="h-px bg-win98-border-dark border-b border-white my-1"></div>

          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white" onclick={() => handleAction(() => willRememberStore.exportActiveNote('md'))}>
            Export active as .md
          </button>
          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white" onclick={() => handleAction(() => willRememberStore.exportActiveNote('txt'))}>
            Export active as .txt
          </button>
          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white" onclick={() => handleAction(() => willRememberStore.exportActiveNote('json'))}>
            Export active as .json
          </button>

          <div class="h-px bg-win98-border-dark border-b border-white my-1"></div>

          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white" onclick={() => handleAction(() => {
            const data = willRememberStore.exportAllNotes();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `will-remember-backup-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
          })}>
            Backup All Notes (.json)
          </button>
          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white" onclick={handleImportFile}>
            Restore Notes Backup...
          </button>
        </div>
      {/if}
    </div>

    <!-- Edit Menu -->
    <div class="relative">
      <button 
        class="px-2 py-0.5 hover:bg-win98-title-active hover:text-white cursor-pointer {activeMenu === 'edit' ? 'bg-win98-title-active text-white' : ''}"
        onclick={() => toggleMenu('edit')}
      >
        <span class="underline">E</span>dit
      </button>

      {#if activeMenu === 'edit'}
        <div class="win98-window win98-border-outset absolute left-0 top-full mt-0.5 w-44 bg-win98-surface shadow-md z-[10001] py-1 flex flex-col text-xs text-black">
          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white" onclick={() => handleAction(() => willRememberStore.setEditorMode('raw'))}>
            Mode: Raw Notepad {willRememberStore.editorMode === 'raw' ? '✓' : ''}
          </button>
          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white" onclick={() => handleAction(() => willRememberStore.setEditorMode('blocks'))}>
            Mode: Notion Blocks {willRememberStore.editorMode === 'blocks' ? '✓' : ''}
          </button>
          
          <div class="h-px bg-win98-border-dark border-b border-white my-1"></div>

          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white" onclick={() => handleAction(() => {
            if (willRememberStore.activeNote) {
              const stamp = `\n[${new Date().toLocaleString()}]\n`;
              willRememberStore.updateActiveNoteContent(willRememberStore.activeNote.content + stamp);
            }
          })}>
            Insert Timestamp (F5)
          </button>

          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white text-red-700" onclick={() => handleAction(() => {
            if (willRememberStore.activeNote) {
              willRememberStore.deleteNote(willRememberStore.activeNote.id);
            }
          })}>
            Delete Current Note
          </button>
        </div>
      {/if}
    </div>

    <!-- View Menu -->
    <div class="relative">
      <button 
        class="px-2 py-0.5 hover:bg-win98-title-active hover:text-white cursor-pointer {activeMenu === 'view' ? 'bg-win98-title-active text-white' : ''}"
        onclick={() => toggleMenu('view')}
      >
        <span class="underline">V</span>iew
      </button>

      {#if activeMenu === 'view'}
        <div class="win98-window win98-border-outset absolute left-0 top-full mt-0.5 w-48 bg-win98-surface shadow-md z-[10001] py-1 flex flex-col text-xs text-black">
          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white flex justify-between" onclick={() => handleAction(() => willRememberStore.toggleSidebar())}>
            <span>Explorer Sidebar</span>
            <span>{willRememberStore.isSidebarOpen ? '✓' : ''}</span>
          </button>
          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white flex justify-between" onclick={() => handleAction(() => willRememberStore.toggleWordWrap())}>
            <span>Word Wrap</span>
            <span>{willRememberStore.wordWrap ? '✓' : ''}</span>
          </button>
          
          <div class="h-px bg-win98-border-dark border-b border-white my-1"></div>

          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white flex justify-between" onclick={() => handleAction(() => willRememberStore.toggleMute())}>
            <span>Floppy Sound Effects</span>
            <span>{!willRememberStore.isMuted ? '✓' : ''}</span>
          </button>
        </div>
      {/if}
    </div>

    <!-- Help Menu -->
    <div class="relative">
      <button 
        class="px-2 py-0.5 hover:bg-win98-title-active hover:text-white cursor-pointer {activeMenu === 'help' ? 'bg-win98-title-active text-white' : ''}"
        onclick={() => toggleMenu('help')}
      >
        <span class="underline">H</span>elp
      </button>

      {#if activeMenu === 'help'}
        <div class="win98-window win98-border-outset absolute left-0 top-full mt-0.5 w-44 bg-win98-surface shadow-md z-[10001] py-1 flex flex-col text-xs text-black">
          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white" onclick={() => handleAction(() => {
            const welcome = willRememberStore.notes.find((n) => n.id === 'note-welcome');
            if (welcome) willRememberStore.openNoteInTab(welcome.id);
          })}>
            Help Topics / Guide
          </button>
          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white" onclick={() => handleAction(() => {
            const shortcuts = willRememberStore.notes.find((n) => n.id === 'note-shortcuts');
            if (shortcuts) willRememberStore.openNoteInTab(shortcuts.id);
          })}>
            Keyboard Shortcuts
          </button>
          
          <div class="h-px bg-win98-border-dark border-b border-white my-1"></div>

          <button class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white font-bold" onclick={() => handleAction(() => (showAbout = true))}>
            About will-remember...
          </button>
        </div>
      {/if}
    </div>
  </div>

  <!-- Quick Action Toolbar -->
  <div class="flex items-center gap-1 px-1 py-1 bg-win98-surface border-t border-win98-border-light text-xs overflow-x-auto scrollbar-hide">
    <button 
      class="win98-button flex items-center gap-1 py-0.5 px-2 text-[11px]"
      onclick={() => willRememberStore.createNewTab()}
      title="Create new note (Ctrl+N)"
    >
      <span>📄</span>
      <span>New</span>
    </button>

    <button 
      class="win98-button flex items-center gap-1 py-0.5 px-2 text-[11px]"
      onclick={() => willRememberStore.saveActiveNote()}
      title="Save to Floppy Disk (Ctrl+S)"
    >
      <span>💾</span>
      <span>Save</span>
    </button>

    <div class="w-px h-5 bg-win98-border-dark border-r border-white mx-0.5"></div>

    <button 
      class="win98-button flex items-center gap-1 py-0.5 px-2 text-[11px] {willRememberStore.isSidebarOpen ? 'win98-border-inset bg-[#dfdfdf]' : ''}"
      onclick={() => willRememberStore.toggleSidebar()}
      title="Toggle Explorer Sidebar"
    >
      <span>📁</span>
      <span class="hidden sm:inline">Explorer</span>
    </button>

    <div class="w-px h-5 bg-win98-border-dark border-r border-white mx-0.5"></div>

    <!-- Mode Toggle Switch -->
    <div class="flex items-center gap-0.5">
      <button 
        class="win98-button py-0.5 px-2 text-[11px] font-bold {willRememberStore.editorMode === 'raw' ? 'win98-border-inset bg-[#dfdfdf]' : ''}"
        onclick={() => willRememberStore.setEditorMode('raw')}
        title="Mode: Raw Monospace Notepad"
      >
        Raw
      </button>
      <button 
        class="win98-button py-0.5 px-2 text-[11px] font-bold {willRememberStore.editorMode === 'blocks' ? 'win98-border-inset bg-[#dfdfdf]' : ''}"
        onclick={() => willRememberStore.setEditorMode('blocks')}
        title="Mode: Notion Blocks (Checklists, Headings, Callouts)"
      >
        Blocks
      </button>
    </div>

    <div class="w-px h-5 bg-win98-border-dark border-r border-white mx-0.5"></div>

    <button 
      class="win98-button py-0.5 px-2 text-[11px] {willRememberStore.wordWrap ? 'win98-border-inset bg-[#dfdfdf]' : ''}"
      onclick={() => willRememberStore.toggleWordWrap()}
      title="Toggle Word Wrap"
    >
      Wrap: {willRememberStore.wordWrap ? 'ON' : 'OFF'}
    </button>

    <div class="flex-1"></div>

    <button 
      class="win98-button py-0.5 px-2 text-[11px]"
      onclick={() => willRememberStore.toggleMute()}
      title="Toggle Floppy Audio"
    >
      {willRememberStore.isMuted ? '🔇' : '🔊'}
    </button>
  </div>
</div>
