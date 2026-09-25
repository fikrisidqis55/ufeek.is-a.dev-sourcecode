<script lang="ts">
  import { onMount } from 'svelte';
  import { willRememberStore } from './repository.svelte';
  import MenuBar from './components/MenuBar.svelte';
  import TabBar from './components/TabBar.svelte';
  import SidebarTree from './components/SidebarTree.svelte';
  import StatusBar from './components/StatusBar.svelte';
  import RawEditor from './components/RawEditor.svelte';
  import NotionBlocksEditor from './components/NotionBlocksEditor.svelte';

  let containerEl = $state<HTMLDivElement | null>(null);

  function handleKeydown(e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey) {
      if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        willRememberStore.saveActiveNote();
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        willRememberStore.createNewTab();
      } else if (e.key.toLowerCase() === 'w') {
        e.preventDefault();
        if (willRememberStore.activeTabId) {
          willRememberStore.closeTab(willRememberStore.activeTabId);
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const tabs = willRememberStore.openTabs;
        if (tabs.length > 1) {
          const currentIndex = tabs.findIndex((t) => t.tabId === willRememberStore.activeTabId);
          const nextIndex = (currentIndex + 1) % tabs.length;
          willRememberStore.switchTab(tabs[nextIndex].tabId);
        }
      }
    }
  }

  onMount(() => {
    // Check initial window focus or attach listener
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div 
  bind:this={containerEl}
  class="w-full h-full flex flex-col bg-win98-surface select-none overflow-hidden text-black font-sans text-xs min-h-0"
>
  <!-- 1. Menu Bar & Toolbar -->
  <MenuBar />

  <!-- 2. Dynamic Tab Bar -->
  <TabBar />

  <!-- 3. Work Area: Explorer Sidebar + Editor -->
  <div class="flex-1 w-full flex min-h-0 overflow-hidden bg-win98-surface p-1 gap-1">
    <!-- Collapsible File Explorer Sidebar -->
    {#if willRememberStore.isSidebarOpen}
      <SidebarTree />
    {/if}

    <!-- Editor Workspace (Beveled Sunken Paper) -->
    <div class="flex-1 h-full flex flex-col min-h-0 bg-white win98-border-inset overflow-hidden relative">
      {#if willRememberStore.activeNote}
        {#if willRememberStore.editorMode === 'raw'}
          <RawEditor />
        {:else}
          <NotionBlocksEditor />
        {/if}
      {:else}
        <!-- Empty State -->
        <div class="flex-1 flex flex-col items-center justify-center p-6 text-gray-500 gap-2">
          <div class="text-4xl">📄</div>
          <div class="font-bold text-sm text-black">No Document Open</div>
          <div class="text-xs text-center max-w-sm">
            Select a note from the Explorer sidebar or create a new note tab to begin typing.
          </div>
          <button 
            class="win98-button mt-2 font-bold px-3 py-1 text-xs"
            onclick={() => willRememberStore.createNewTab()}
          >
            Create New Note (Ctrl+N)
          </button>
        </div>
      {/if}
    </div>
  </div>

  <!-- 4. 4-Panel Sunken Status Bar -->
  <StatusBar />
</div>
