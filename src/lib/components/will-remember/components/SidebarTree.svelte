<script lang="ts">
  import { willRememberStore } from '../repository.svelte';
  import { playClickSound } from '../services/audioSynthesizer';

  let searchQuery = $state('');
  let isCreatingFolder = $state(false);
  let newFolderName = $state('');

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
</script>

<div class="w-56 h-full flex flex-col bg-win98-surface win98-border-inset flex-shrink-0 select-none text-xs">
  <!-- Sidebar Header / Actions -->
  <div class="p-1 flex items-center justify-between border-b border-win98-border-dark bg-win98-surface">
    <span class="font-bold text-[11px] text-gray-800 uppercase tracking-wider px-1">Explorer</span>
    <div class="flex items-center gap-1">
      <button 
        class="win98-button p-0.5 px-1 text-[11px]" 
        onclick={() => willRememberStore.createNewTab()}
        title="Create Note"
      >
        📄+
      </button>
      <button 
        class="win98-button p-0.5 px-1 text-[11px]" 
        onclick={() => {
          isCreatingFolder = true;
          playClickSound();
        }}
        title="Create Folder"
      >
        📁+
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
  <div class="flex-1 overflow-y-auto p-1 bg-white text-black font-sans">
    {#if searchQuery.trim()}
      <!-- Search Results Flat View -->
      <div class="text-[10px] text-gray-500 px-1 py-0.5">Search results ({filteredNotes.length}):</div>
      {#each filteredNotes as note (note.id)}
        {@const isSelected = willRememberStore.activeNote?.id === note.id}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="flex items-center gap-1.5 px-1 py-0.5 cursor-pointer text-xs {isSelected
            ? 'bg-win98-title-active text-white font-bold'
            : 'hover:bg-blue-100 text-black'}"
          onclick={() => handleSelectNote(note.id)}
        >
          <span>{note.title.endsWith('.md') ? '📝' : '📄'}</span>
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
        <div class="flex flex-col">
          <!-- Folder Node -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="flex items-center gap-1 px-0.5 py-0.5 cursor-pointer hover:bg-gray-100"
            onclick={() => willRememberStore.toggleFolder(folder.id)}
          >
            <span class="w-3 text-[10px] font-mono text-center font-bold">
              {folder.isExpanded ? '[-]' : '[+]'}
            </span>
            <span>{folder.icon || '📁'}</span>
            <span class="font-bold truncate text-[11px]">{folder.name}</span>
            <span class="text-[10px] text-gray-400 ml-auto">({folderNotes.length})</span>
          </div>

          <!-- Notes under Folder -->
          {#if folder.isExpanded}
            <div class="pl-4 flex flex-col border-l border-dotted border-gray-300 ml-2">
              {#each folderNotes as note (note.id)}
                {@const isSelected = willRememberStore.activeNote?.id === note.id}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="flex items-center gap-1.5 px-1 py-0.5 cursor-pointer text-xs {isSelected
                    ? 'bg-win98-title-active text-white font-bold'
                    : 'hover:bg-blue-100 text-black'}"
                  onclick={() => handleSelectNote(note.id)}
                >
                  <span class="text-[11px]">{note.title.endsWith('.md') ? '📝' : '📄'}</span>
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
      {#if rootNotes.length > 0}
        <div class="mt-2 pt-1 border-t border-gray-200">
          <div class="text-[10px] text-gray-400 px-1 font-bold">ROOT NOTES</div>
          {#each rootNotes as note (note.id)}
            {@const isSelected = willRememberStore.activeNote?.id === note.id}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="flex items-center gap-1.5 px-1 py-0.5 cursor-pointer text-xs {isSelected
                ? 'bg-win98-title-active text-white font-bold'
                : 'hover:bg-blue-100 text-black'}"
              onclick={() => handleSelectNote(note.id)}
            >
              <span>{note.title.endsWith('.md') ? '📝' : '📄'}</span>
              <span class="truncate">{note.title}</span>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>
