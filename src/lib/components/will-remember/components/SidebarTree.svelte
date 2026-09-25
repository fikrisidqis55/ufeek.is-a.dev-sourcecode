<script lang="ts">
  import { willRememberStore } from '../repository.svelte';
  import { playClickSound, playFloppySaveSound } from '../services/audioSynthesizer';

  let searchQuery = $state('');
  let isCreatingFolder = $state(false);
  let newFolderName = $state('');

  // Drag and Drop States
  let draggedNoteId = $state<string | null>(null);
  let dragOverTargetId = $state<string | null>(null);
  let hoverExpandTimer: ReturnType<typeof setTimeout> | null = null;

  let filteredNotes = $derived.by(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return willRememberStore.notes.filter((n) => !n.isDeleted);
    return willRememberStore.notes.filter(
      (n) => !n.isDeleted && (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
    );
  });

  function handleCreateFolderSubmit() {
    if (newFolderName.trim()) {
      willRememberStore.createFolder(newFolderName.trim());
      newFolderName = '';
    }
    isCreatingFolder = false;
  }

  function handleSelectNote(noteId: string) {
    willRememberStore.openNoteInTab(noteId);
  }

  // --- Drag & Drop Handlers ---
  function handleNoteDragStart(e: DragEvent, noteId: string) {
    draggedNoteId = noteId;
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', noteId);
      e.dataTransfer.effectAllowed = 'move';
    }
    playClickSound();
  }

  function handleDragEnd() {
    draggedNoteId = null;
    dragOverTargetId = null;
    if (hoverExpandTimer) {
      clearTimeout(hoverExpandTimer);
      hoverExpandTimer = null;
    }
  }

  function handleFolderDragOver(e: DragEvent, folderId: string) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  }

  function handleFolderDragEnter(e: DragEvent, folderId: string) {
    e.preventDefault();
    dragOverTargetId = folderId;

    // Windows Explorer Auto-Expand: if folder is collapsed, expand after 600ms hover
    const folder = willRememberStore.folders.find((f) => f.id === folderId);
    if (folder && !folder.isExpanded) {
      if (hoverExpandTimer) clearTimeout(hoverExpandTimer);
      hoverExpandTimer = setTimeout(() => {
        if (dragOverTargetId === folderId) {
          folder.isExpanded = true;
          playClickSound();
        }
      }, 600);
    }
  }

  function handleFolderDragLeave(e: DragEvent, folderId: string) {
    const related = e.relatedTarget as HTMLElement | null;
    if (related && (e.currentTarget as HTMLElement).contains(related)) {
      return;
    }
    if (dragOverTargetId === folderId) {
      dragOverTargetId = null;
    }
    if (hoverExpandTimer) {
      clearTimeout(hoverExpandTimer);
      hoverExpandTimer = null;
    }
  }

  function handleFolderDrop(e: DragEvent, folderId: string | null) {
    e.preventDefault();
    if (hoverExpandTimer) clearTimeout(hoverExpandTimer);

    // 1. Internal Note Drop
    const noteId = draggedNoteId || e.dataTransfer?.getData('text/plain');
    if (noteId && noteId.startsWith('note-')) {
      willRememberStore.moveNoteToFolder(noteId, folderId);
      draggedNoteId = null;
      dragOverTargetId = null;
      return;
    }

    // 2. External File Drop from Desktop OS
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = (event.target?.result as string) || '';
        const createdNoteId = willRememberStore.createNewTab(file.name, folderId);
        willRememberStore.updateActiveNoteContent(textContent);
        playFloppySaveSound();
      };
      reader.readAsText(file);
    }

    draggedNoteId = null;
    dragOverTargetId = null;
  }
</script>

<div class="w-56 h-full flex flex-col bg-win98-surface win98-border-inset flex-shrink-0 select-none text-xs">
  <!-- Sidebar Header / Actions -->
  <div class="p-1 flex items-center justify-between border-b border-win98-border-dark bg-win98-surface">
    <span class="font-bold text-[11px] text-gray-800 uppercase tracking-wider px-1">Explorer</span>
    <div class="flex items-center gap-1">
      <button 
        class="win98-button p-0.5 px-1 text-[11px] flex items-center gap-0.5" 
        onclick={() => willRememberStore.createNewTab()}
        title="Create Note"
      >
        <img src="/icons/win98/notepad.png" alt="" class="w-3.5 h-3.5 select-none pointer-events-none" style="image-rendering: pixelated;" />
        <span>+</span>
      </button>
      <button 
        class="win98-button p-0.5 px-1 text-[11px] flex items-center gap-0.5" 
        onclick={() => {
          isCreatingFolder = true;
          playClickSound();
        }}
        title="Create Folder"
      >
        <img src="/icons/win98/folder_closed.png" alt="" class="w-3.5 h-3.5 select-none pointer-events-none" style="image-rendering: pixelated;" />
        <span>+</span>
      </button>
    </div>
  </div>

  <!-- Search Filter -->
  <div class="p-1 border-b border-win98-border-dark bg-win98-surface">
    <div class="relative flex items-center">
      <input
        type="text"
        placeholder="Filter notes..."
        bind:value={searchQuery}
        class="win98-border-inset w-full bg-white px-2 py-0.5 text-xs text-black placeholder:text-gray-400 outline-none"
      />
      {#if searchQuery}
        <button 
          class="absolute right-1 text-gray-500 hover:text-black text-[10px]"
          onclick={() => (searchQuery = '')}
        >
          ✕
        </button>
      {/if}
    </div>
  </div>

  <!-- New Folder Inline Prompt -->
  {#if isCreatingFolder}
    <div class="p-1.5 bg-[#dfdfdf] border-b border-win98-border-dark flex flex-col gap-1">
      <span class="text-[10px] font-bold">New Folder Name:</span>
      <input
        type="text"
        bind:value={newFolderName}
        placeholder="Folder name..."
        class="win98-border-inset px-1.5 py-0.5 text-xs bg-white outline-none"
        onkeydown={(e) => {
          if (e.key === 'Enter') handleCreateFolderSubmit();
          if (e.key === 'Escape') isCreatingFolder = false;
        }}
      />
      <div class="flex justify-end gap-1">
        <button class="win98-button text-[10px] px-2" onclick={handleCreateFolderSubmit}>OK</button>
        <button class="win98-button text-[10px] px-2" onclick={() => (isCreatingFolder = false)}>Cancel</button>
      </div>
    </div>
  {/if}

  <!-- Tree View Body -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="flex-1 overflow-y-auto p-1 bg-white text-black font-sans flex flex-col"
    ondragover={(e) => e.preventDefault()}
    ondrop={(e) => {
      // If dropped in general empty tree body, move to root
      if (e.target === e.currentTarget) {
        handleFolderDrop(e, null);
      }
    }}
  >
    {#if searchQuery.trim()}
      <!-- Search Results Flat View -->
      <div class="text-[10px] text-gray-500 px-1 py-0.5">Search results ({filteredNotes.length}):</div>
      {#each filteredNotes as note (note.id)}
        {@const isSelected = willRememberStore.activeNote?.id === note.id}
        {@const isBeingDragged = draggedNoteId === note.id}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="flex items-center gap-1.5 px-1 py-0.5 cursor-move text-xs transition-opacity {isBeingDragged ? 'opacity-30 border border-dashed border-gray-600' : ''} {isSelected
            ? 'bg-win98-title-active text-white font-bold'
            : 'hover:bg-blue-100 text-black'}"
          draggable="true"
          ondragstart={(e) => handleNoteDragStart(e, note.id)}
          ondragend={handleDragEnd}
          onclick={() => handleSelectNote(note.id)}
          title="Drag to move to folder"
        >
          <img 
            src={note.title.endsWith('.md') ? '/icons/win98/notepad.png' : '/icons/win98/document.png'} 
            alt="" 
            class="w-3.5 h-3.5 pointer-events-none select-none flex-shrink-0" 
            style="image-rendering: pixelated;" 
          />
          <span class="truncate">{note.title}</span>
        </div>
      {/each}
      {#if filteredNotes.length === 0}
        <div class="text-[11px] text-gray-400 p-2 italic">No notes found.</div>
      {/if}
    {:else}
      <!-- Folder Tree Hierarchy -->
      {#each willRememberStore.folders as folder (folder.id)}
        {@const folderNotes = willRememberStore.notes.filter((n) => !n.isDeleted && n.folderId === folder.id)}
        {@const isDragOver = dragOverTargetId === folder.id}
        <div class="flex flex-col mb-0.5">
          <!-- Folder Node Drop Target -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="flex items-center gap-1.5 px-1 py-0.5 cursor-pointer transition-colors {isDragOver
              ? 'bg-win98-title-active text-white font-bold border-2 border-dashed border-white'
              : 'hover:bg-gray-100'}"
            ondragover={(e) => handleFolderDragOver(e, folder.id)}
            ondragenter={(e) => handleFolderDragEnter(e, folder.id)}
            ondragleave={(e) => handleFolderDragLeave(e, folder.id)}
            ondrop={(e) => handleFolderDrop(e, folder.id)}
            onclick={() => willRememberStore.toggleFolder(folder.id)}
            title="Drop files here to move into this folder"
          >
            <span class="w-3 text-[10px] font-mono text-center font-bold">
              {folder.isExpanded ? '[-]' : '[+]'}
            </span>
            <img 
              src={folder.isExpanded ? '/icons/win98/folder_open.png' : '/icons/win98/folder_closed.png'} 
              alt="" 
              class="w-4 h-4 pointer-events-none select-none flex-shrink-0" 
              style="image-rendering: pixelated;" 
            />
            <span class="font-bold truncate text-[11px]">{folder.name}</span>
            <span class="text-[10px] {isDragOver ? 'text-white' : 'text-gray-400'} ml-auto">({folderNotes.length})</span>
          </div>

          <!-- Notes under Folder -->
          {#if folder.isExpanded}
            <div class="pl-4 flex flex-col border-l border-dotted border-gray-300 ml-2">
              {#each folderNotes as note (note.id)}
                {@const isSelected = willRememberStore.activeNote?.id === note.id}
                {@const isBeingDragged = draggedNoteId === note.id}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="flex items-center gap-1.5 px-1 py-0.5 cursor-move text-xs {isBeingDragged ? 'opacity-30 border border-dashed border-gray-500 bg-gray-100' : ''} {isSelected
                    ? 'bg-win98-title-active text-white font-bold'
                    : 'hover:bg-blue-100 text-black'}"
                  draggable="true"
                  ondragstart={(e) => handleNoteDragStart(e, note.id)}
                  ondragend={handleDragEnd}
                  onclick={() => handleSelectNote(note.id)}
                  title="Drag file to another folder"
                >
                  <img 
                    src={note.title.endsWith('.md') ? '/icons/win98/notepad.png' : '/icons/win98/document.png'} 
                    alt="" 
                    class="w-3.5 h-3.5 pointer-events-none select-none flex-shrink-0" 
                    style="image-rendering: pixelated;" 
                  />
                  <span class="truncate">{note.title}</span>
                </div>
              {/each}
              {#if folderNotes.length === 0}
                <div class="text-[10px] text-gray-400 italic py-0.5 px-1">Empty folder</div>
              {/if}
            </div>
          {/if}
        </div>
      {/each}

      <!-- Unfiled Root Notes -->
      {@const rootNotes = willRememberStore.notes.filter((n) => !n.isDeleted && !n.folderId)}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div 
        class="mt-2 pt-1 border-t border-gray-200 flex-1 flex flex-col"
        ondragover={(e) => {
          e.preventDefault();
          dragOverTargetId = '__root__';
        }}
        ondragleave={() => {
          if (dragOverTargetId === '__root__') dragOverTargetId = null;
        }}
        ondrop={(e) => handleFolderDrop(e, null)}
      >
        <div class="flex items-center justify-between text-[10px] text-gray-500 px-1 font-bold">
          <span>ROOT NOTES</span>
          <span>({rootNotes.length})</span>
        </div>

        {#each rootNotes as note (note.id)}
          {@const isSelected = willRememberStore.activeNote?.id === note.id}
          {@const isBeingDragged = draggedNoteId === note.id}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="flex items-center gap-1.5 px-1 py-0.5 cursor-move text-xs {isBeingDragged ? 'opacity-30 border border-dashed border-gray-500 bg-gray-100' : ''} {isSelected
              ? 'bg-win98-title-active text-white font-bold'
              : 'hover:bg-blue-100 text-black'}"
            draggable="true"
            ondragstart={(e) => handleNoteDragStart(e, note.id)}
            ondragend={handleDragEnd}
            onclick={() => handleSelectNote(note.id)}
            title="Drag file to folder"
          >
            <img 
              src={note.title.endsWith('.md') ? '/icons/win98/notepad.png' : '/icons/win98/document.png'} 
              alt="" 
              class="w-3.5 h-3.5 pointer-events-none select-none flex-shrink-0" 
              style="image-rendering: pixelated;" 
            />
            <span class="truncate">{note.title}</span>
          </div>
        {/each}

        <!-- Dropzone indicator when dragging an item -->
        {#if draggedNoteId}
          <div 
            class="mt-2 p-2 win98-border-inset text-center text-[10px] flex items-center justify-center gap-1.5 transition-colors {dragOverTargetId === '__root__'
              ? 'bg-win98-title-active text-white font-bold border-2 border-dashed border-white'
              : 'bg-[#f4f4f4] text-gray-600 border border-dashed border-gray-400'}"
          >
            <img src="/icons/win98/folder_open.png" alt="" class="w-3.5 h-3.5 pointer-events-none select-none" style="image-rendering: pixelated;" />
            <span>Drop here for Root</span>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
