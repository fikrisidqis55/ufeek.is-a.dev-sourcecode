<script lang="ts">
  import { willRememberStore } from '../repository.svelte';
  import { playClickSound } from '../services/audioSynthesizer';

  function handleCloseTab(e: MouseEvent, tabId: string) {
    e.stopPropagation();
    willRememberStore.closeTab(tabId);
  }

  function handleTogglePin(e: MouseEvent, tabId: string) {
    e.stopPropagation();
    willRememberStore.togglePinTab(tabId);
  }
</script>

<div class="h-7 bg-win98-surface flex items-end px-1 gap-1 border-b border-win98-border-dark select-none overflow-x-auto scrollbar-hide flex-shrink-0">
  {#each willRememberStore.openTabs as tab (tab.tabId)}
    {@const isActive = tab.tabId === willRememberStore.activeTabId}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="group relative flex items-center gap-1 px-2.5 py-1 text-xs cursor-pointer border-t-2 border-l-2 border-r-2 {isActive
        ? 'win98-border-outset bg-white font-bold text-black translate-y-[1px] z-10'
        : 'border-win98-border-light border-r-win98-border-dark bg-[#b0b0b0] text-gray-800 hover:bg-[#c8c8c8]'}"
      style="border-bottom: none; border-top-left-radius: 2px; border-top-right-radius: 2px; max-width: 180px;"
      onclick={() => willRememberStore.switchTab(tab.tabId)}
      ondblclick={(e) => {
        e.stopPropagation();
        const newTitle = prompt('Rename note to:', tab.title);
        if (newTitle && newTitle.trim()) {
          willRememberStore.updateNoteTitle(tab.noteId, newTitle.trim());
        }
      }}
      title="{tab.title} (Double click to rename)"
    >
      {#if tab.isPinned}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <span 
          class="text-[10px] cursor-pointer" 
          onclick={(e) => handleTogglePin(e, tab.tabId)}
          title="Pinned tab (Click to unpin)"
        >
          📌
        </span>
      {/if}

      <span class="truncate text-[11px]">
        {tab.title}{tab.isDirty ? ' *' : ''}
      </span>

      <!-- Pin / Unpin hover button -->
      {#if !tab.isPinned}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <button 
          class="text-[10px] text-gray-500 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
          onclick={(e) => handleTogglePin(e, tab.tabId)}
          title="Pin Tab"
        >
          📌
        </button>
      {/if}

      <!-- Close Button -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <button
        class="ml-1 text-[10px] font-bold text-gray-600 hover:text-black hover:bg-gray-300 w-3.5 h-3.5 flex items-center justify-center rounded-none"
        onclick={(e) => handleCloseTab(e, tab.tabId)}
        title="Close Tab (Ctrl+W)"
      >
        ✕
      </button>
    </div>
  {/each}

  <!-- Add New Tab Button -->
  <button 
    class="win98-button h-6 w-6 p-0 flex items-center justify-center font-bold text-xs mb-0.5 ml-0.5 flex-shrink-0"
    onclick={() => willRememberStore.createNewTab()}
    title="New Document Tab (Ctrl+T)"
  >
    +
  </button>
</div>
