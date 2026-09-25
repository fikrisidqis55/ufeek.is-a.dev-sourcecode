<script lang="ts">
  import { willRememberStore } from '../repository.svelte';

  let activeTab = $derived(willRememberStore.openTabs.find((t) => t.tabId === willRememberStore.activeTabId));
  let activeNote = $derived(willRememberStore.activeNote);

  let wordCount = $derived.by(() => {
    if (!activeNote || !activeNote.content) return 0;
    const words = activeNote.content.trim().split(/\s+/);
    return words[0] === '' ? 0 : words.length;
  });

  let charCount = $derived(activeNote?.content?.length || 0);
  let cursorLine = $derived(activeTab?.cursorLine || 1);
  let cursorCol = $derived(activeTab?.cursorCol || 1);
</script>

<div class="h-6 bg-win98-surface flex items-center gap-1 px-1 text-[11px] select-none text-black border-t border-win98-border-light">
  <!-- Panel 1: Status -->
  <div class="win98-border-inset flex-1 px-2 h-full flex items-center truncate bg-win98-surface">
    <span class="truncate">{willRememberStore.statusMessage}</span>
  </div>

  <!-- Panel 2: Cursor Position -->
  <div class="win98-border-inset w-24 px-2 h-full flex items-center justify-center truncate bg-win98-surface flex-shrink-0">
    <span>Ln {cursorLine}, Col {cursorCol}</span>
  </div>

  <!-- Panel 3: Stats -->
  <div class="win98-border-inset w-36 px-2 h-full flex items-center justify-center truncate bg-win98-surface flex-shrink-0 hidden sm:flex">
    <span>{wordCount} words, {charCount} ch</span>
  </div>

  <!-- Panel 4: Hardware / Floppy Synced -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="win98-border-inset px-2 h-full flex items-center justify-center gap-1 bg-win98-surface flex-shrink-0 cursor-pointer hover:bg-[#e0e0e0]"
    onclick={() => willRememberStore.toggleMute()}
    title="Click to toggle Web Audio sound effects"
  >
    <span class="text-xs">{willRememberStore.isMuted ? '🔇 Muted' : '💾 Floppy: OK'}</span>
  </div>
</div>
