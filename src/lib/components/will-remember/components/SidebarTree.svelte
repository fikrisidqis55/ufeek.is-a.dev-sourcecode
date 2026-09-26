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

  // --- Inline Rename & Context Menu States ---
  let editingTarget = $state<{ type: 'folder' | 'note'; id: string } | null>(null);
  let editingName = $state('');
  let contextMenu = $state<{
    type: 'folder' | 'note';
    id: string;
    name: string;
    x: number;
    y: number;
  } | null>(null);

  function selectOnFocus(node: HTMLInputElement) {
    node.focus();
    node.select();
  }

  function startRename(type: 'folder' | 'note', id: string, currentName: string) {
    playClickSound();
    editingTarget = { type, id };
    editingName = currentName;
    closeContextMenu();
  }

  function commitRename() {
    if (!editingTarget) return;
    const trimmed = editingName.trim();
    if (trimmed) {
      if (editingTarget.type === 'folder') {
        willRememberStore.renameFolder(editingTarget.id, trimmed);
      } else {
        willRememberStore.updateNoteTitle(editingTarget.id, trimmed);
      }
    }
    editingTarget = null;
    editingName = '';
  }

  function cancelRename() {
    editingTarget = null;
    editingName = '';
  }

  function openContextMenu(e: MouseEvent, type: 'folder' | 'note', id: string, name: string) {
    e.preventDefault();
    e.stopPropagation();
    playClickSound();
    contextMenu = {
      type,
      id,
      name,
      x: e.clientX,
      y: e.clientY
    };
  }

  function closeContextMenu() {
    contextMenu = null;
  }

  function handleWindowKeydown(e: KeyboardEvent) {
    if (e.key === 'F2') {
      if (!editingTarget && willRememberStore.activeNote) {
        e.preventDefault();
        startRename('note', willRememberStore.activeNote.id, willRememberStore.activeNote.title);
      }
    } else if (e.key === 'Escape') {
      if (contextMenu) closeContextMenu();
      if (editingTarget) cancelRename();
    }
  }
</script>

<svelte:window onclick={closeContextMenu} onkeydown={handleWindowKeydown} />

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
        class="win98-border-inset w-full bg-white px-2 py-0.5 text-xs text-black placeholder:text-gray-400 outline-none select-text cursor-text"
        onkeydown={(e) => e.stopPropagation()}
        onkeypress={(e) => e.stopPropagation()}
        onkeyup={(e) => e.stopPropagation()}
        onmousedown={(e) => e.stopPropagation()}
        onpointerdown={(e) => e.stopPropagation()}
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
        class="win98-border-inset px-1.5 py-0.5 text-xs bg-white outline-none select-text cursor-text"
        use:selectOnFocus
        onmousedown={(e) => e.stopPropagation()}
        onpointerdown={(e) => e.stopPropagation()}
        onkeypress={(e) => e.stopPropagation()}
        onkeyup={(e) => e.stopPropagation()}
        onkeydown={(e) => {
          e.stopPropagation();
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
        {@const isEditing = editingTarget?.type === 'note' && editingTarget?.id === note.id}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="group flex items-center gap-1.5 px-1 py-0.5 cursor-move text-xs transition-opacity {isBeingDragged ? 'opacity-30 border border-dashed border-gray-600' : ''} {isSelected
            ? 'bg-win98-title-active text-white font-bold'
            : 'hover:bg-blue-100 text-black'}"
          draggable={!isEditing}
          ondragstart={(e) => handleNoteDragStart(e, note.id)}
          ondragend={handleDragEnd}
          onclick={() => {
            if (!isEditing) handleSelectNote(note.id);
          }}
          oncontextmenu={(e) => openContextMenu(e, 'note', note.id, note.title)}
          title="Drag to move to folder, right click to rename"
        >
          <img 
            src={note.title.endsWith('.md') ? '/icons/win98/notepad.png' : '/icons/win98/document.png'} 
            alt="" 
            class="w-3.5 h-3.5 pointer-events-none select-none flex-shrink-0" 
            style="image-rendering: pixelated;" 
          />
          {#if isEditing}
            <!-- svelte-ignore a11y_autofocus -->
            <input
              type="text"
              bind:value={editingName}
              class="win98-border-inset bg-white text-black px-1 py-0 text-xs outline-none flex-1 min-w-0 select-text cursor-text"
              use:selectOnFocus
              autofocus
              onclick={(e) => e.stopPropagation()}
              ondblclick={(e) => e.stopPropagation()}
              onmousedown={(e) => e.stopPropagation()}
              onpointerdown={(e) => e.stopPropagation()}
              onkeypress={(e) => e.stopPropagation()}
              onkeyup={(e) => e.stopPropagation()}
              onkeydown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') cancelRename();
              }}
              onblur={commitRename}
            />
          {:else}
            <span class="truncate flex-1">{note.title}</span>
            <button
              class="opacity-0 group-hover:opacity-100 hover:bg-gray-200 px-1 text-[10px] {isSelected ? 'text-black bg-white' : 'text-gray-700'} ml-1 rounded-none win98-button py-0"
              onclick={(e) => {
                e.stopPropagation();
                startRename('note', note.id, note.title);
              }}
              title="Rename note (F2)"
            >
              ✎
            </button>
          {/if}
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
        {@const isEditingFolder = editingTarget?.type === 'folder' && editingTarget?.id === folder.id}
        <div class="flex flex-col mb-0.5">
          <!-- Folder Node Drop Target -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="group flex items-center gap-1.5 px-1 py-0.5 cursor-pointer transition-colors {isDragOver
              ? 'bg-win98-title-active text-white font-bold border-2 border-dashed border-white'
              : 'hover:bg-gray-100'}"
            ondragover={(e) => handleFolderDragOver(e, folder.id)}
            ondragenter={(e) => handleFolderDragEnter(e, folder.id)}
            ondragleave={(e) => handleFolderDragLeave(e, folder.id)}
            ondrop={(e) => handleFolderDrop(e, folder.id)}
            onclick={() => {
              if (!isEditingFolder) willRememberStore.toggleFolder(folder.id);
            }}
            oncontextmenu={(e) => openContextMenu(e, 'folder', folder.id, folder.name)}
            title="Right click or press F2 to rename"
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

            {#if isEditingFolder}
              <!-- svelte-ignore a11y_autofocus -->
              <input
                type="text"
                bind:value={editingName}
                class="win98-border-inset bg-white text-black px-1 py-0 text-[11px] font-bold outline-none flex-1 min-w-0 select-text cursor-text"
                use:selectOnFocus
                autofocus
                onclick={(e) => e.stopPropagation()}
                ondblclick={(e) => e.stopPropagation()}
                onmousedown={(e) => e.stopPropagation()}
                onpointerdown={(e) => e.stopPropagation()}
                onkeypress={(e) => e.stopPropagation()}
                onkeyup={(e) => e.stopPropagation()}
                onkeydown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') commitRename();
                  if (e.key === 'Escape') cancelRename();
                }}
                onblur={commitRename}
              />
            {:else}
              <span class="font-bold truncate text-[11px] flex-1">{folder.name}</span>
              <button
                class="opacity-0 group-hover:opacity-100 hover:bg-gray-200 px-1 text-[10px] text-gray-700 ml-1 rounded-none win98-button py-0"
                onclick={(e) => {
                  e.stopPropagation();
                  startRename('folder', folder.id, folder.name);
                }}
                title="Rename folder (F2)"
              >
                ✎
              </button>
              <span class="text-[10px] {isDragOver ? 'text-white' : 'text-gray-400'} ml-1">({folderNotes.length})</span>
            {/if}
          </div>

          <!-- Notes under Folder -->
          {#if folder.isExpanded}
            <div class="pl-4 flex flex-col border-l border-dotted border-gray-300 ml-2">
              {#each folderNotes as note (note.id)}
                {@const isSelected = willRememberStore.activeNote?.id === note.id}
                {@const isBeingDragged = draggedNoteId === note.id}
                {@const isEditingNote = editingTarget?.type === 'note' && editingTarget?.id === note.id}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="group flex items-center gap-1.5 px-1 py-0.5 cursor-move text-xs {isBeingDragged ? 'opacity-30 border border-dashed border-gray-500 bg-gray-100' : ''} {isSelected
                    ? 'bg-win98-title-active text-white font-bold'
                    : 'hover:bg-blue-100 text-black'}"
                  draggable={!isEditingNote}
                  ondragstart={(e) => handleNoteDragStart(e, note.id)}
                  ondragend={handleDragEnd}
                  onclick={() => {
                    if (!isEditingNote) handleSelectNote(note.id);
                  }}
                  oncontextmenu={(e) => openContextMenu(e, 'note', note.id, note.title)}
                  title="Drag file to another folder, right click to rename"
                >
                  <img 
                    src={note.title.endsWith('.md') ? '/icons/win98/notepad.png' : '/icons/win98/document.png'} 
                    alt="" 
                    class="w-3.5 h-3.5 pointer-events-none select-none flex-shrink-0" 
                    style="image-rendering: pixelated;" 
                  />
                  {#if isEditingNote}
                    <!-- svelte-ignore a11y_autofocus -->
                    <input
                      type="text"
                      bind:value={editingName}
                      class="win98-border-inset bg-white text-black px-1 py-0 text-xs outline-none flex-1 min-w-0 select-text cursor-text"
                      use:selectOnFocus
                      autofocus
                      onclick={(e) => e.stopPropagation()}
                      ondblclick={(e) => e.stopPropagation()}
                      onmousedown={(e) => e.stopPropagation()}
                      onpointerdown={(e) => e.stopPropagation()}
                      onkeypress={(e) => e.stopPropagation()}
                      onkeyup={(e) => e.stopPropagation()}
                      onkeydown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter') commitRename();
                        if (e.key === 'Escape') cancelRename();
                      }}
                      onblur={commitRename}
                    />
                  {:else}
                    <span class="truncate flex-1">{note.title}</span>
                    <button
                      class="opacity-0 group-hover:opacity-100 hover:bg-gray-200 px-1 text-[10px] {isSelected ? 'text-black bg-white' : 'text-gray-700'} ml-1 rounded-none win98-button py-0"
                      onclick={(e) => {
                        e.stopPropagation();
                        startRename('note', note.id, note.title);
                      }}
                      title="Rename note (F2)"
                    >
                      ✎
                    </button>
                  {/if}
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
          {@const isEditingRootNote = editingTarget?.type === 'note' && editingTarget?.id === note.id}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="group flex items-center gap-1.5 px-1 py-0.5 cursor-move text-xs {isBeingDragged ? 'opacity-30 border border-dashed border-gray-500 bg-gray-100' : ''} {isSelected
              ? 'bg-win98-title-active text-white font-bold'
              : 'hover:bg-blue-100 text-black'}"
            draggable={!isEditingRootNote}
            ondragstart={(e) => handleNoteDragStart(e, note.id)}
            ondragend={handleDragEnd}
            onclick={() => {
              if (!isEditingRootNote) handleSelectNote(note.id);
            }}
            oncontextmenu={(e) => openContextMenu(e, 'note', note.id, note.title)}
            title="Drag file to folder, right click to rename"
          >
            <img 
              src={note.title.endsWith('.md') ? '/icons/win98/notepad.png' : '/icons/win98/document.png'} 
              alt="" 
              class="w-3.5 h-3.5 pointer-events-none select-none flex-shrink-0" 
              style="image-rendering: pixelated;" 
            />
            {#if isEditingRootNote}
              <!-- svelte-ignore a11y_autofocus -->
              <input
                type="text"
                bind:value={editingName}
                class="win98-border-inset bg-white text-black px-1 py-0 text-xs outline-none flex-1 min-w-0 select-text cursor-text"
                use:selectOnFocus
                autofocus
                onclick={(e) => e.stopPropagation()}
                ondblclick={(e) => e.stopPropagation()}
                onmousedown={(e) => e.stopPropagation()}
                onpointerdown={(e) => e.stopPropagation()}
                onkeypress={(e) => e.stopPropagation()}
                onkeyup={(e) => e.stopPropagation()}
                onkeydown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') commitRename();
                  if (e.key === 'Escape') cancelRename();
                }}
                onblur={commitRename}
              />
            {:else}
              <span class="truncate flex-1">{note.title}</span>
              <button
                class="opacity-0 group-hover:opacity-100 hover:bg-gray-200 px-1 text-[10px] {isSelected ? 'text-black bg-white' : 'text-gray-700'} ml-1 rounded-none win98-button py-0"
                onclick={(e) => {
                  e.stopPropagation();
                  startRename('note', note.id, note.title);
                }}
                title="Rename note (F2)"
              >
                ✎
              </button>
            {/if}
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

<!-- Windows 98 Context Menu -->
{#if contextMenu}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="fixed win98-window win98-border-outset bg-win98-surface shadow-xl z-[99999] py-1 flex flex-col text-xs text-black min-w-[150px]"
    style="top: {contextMenu.y}px; left: {contextMenu.x}px;"
    onclick={(e) => e.stopPropagation()}
  >
    {#if contextMenu.type === 'folder'}
      <button 
        class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white flex items-center gap-2"
        onclick={() => {
          if (!contextMenu) return;
          const folderId = contextMenu.id;
          closeContextMenu();
          willRememberStore.createNewTab('Untitled.txt', folderId);
        }}
      >
        <img src="/icons/win98/notepad.png" alt="" class="w-3.5 h-3.5" style="image-rendering: pixelated;" />
        <span>New Note</span>
      </button>
      <button 
        class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white flex items-center justify-between"
        onclick={() => {
          if (!contextMenu) return;
          startRename('folder', contextMenu.id, contextMenu.name);
        }}
      >
        <span>Rename</span>
        <span class="text-gray-500 text-[10px]">F2</span>
      </button>
      <div class="h-px bg-win98-border-dark border-b border-white my-1"></div>
      <button 
        class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white text-red-700"
        onclick={() => {
          if (!contextMenu) return;
          const id = contextMenu.id;
          closeContextMenu();
          willRememberStore.deleteFolder(id);
        }}
      >
        <span>Delete Folder</span>
      </button>
    {:else}
      <button 
        class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white font-bold flex items-center gap-2"
        onclick={() => {
          if (!contextMenu) return;
          const id = contextMenu.id;
          closeContextMenu();
          willRememberStore.openNoteInTab(id);
        }}
      >
        <img src="/icons/win98/document.png" alt="" class="w-3.5 h-3.5" style="image-rendering: pixelated;" />
        <span>Open</span>
      </button>
      <button 
        class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white flex items-center justify-between"
        onclick={() => {
          if (!contextMenu) return;
          startRename('note', contextMenu.id, contextMenu.name);
        }}
      >
        <span>Rename</span>
        <span class="text-gray-500 text-[10px]">F2</span>
      </button>
      <div class="h-px bg-win98-border-dark border-b border-white my-1"></div>
      <button 
        class="px-3 py-1 text-left hover:bg-win98-title-active hover:text-white text-red-700"
        onclick={() => {
          if (!contextMenu) return;
          const id = contextMenu.id;
          closeContextMenu();
          willRememberStore.deleteNote(id);
        }}
      >
        <span>Delete</span>
      </button>
    {/if}
  </div>
{/if}
