<script lang="ts">
  import { osState } from "$lib/stores/osState.svelte";
  import StartMenu from "./StartMenu.svelte";

  let timeString = $state(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  $effect(() => {
    const timer = setInterval(() => {
      timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);
    return () => clearInterval(timer);
  });
</script>

<div class="fixed bottom-0 left-0 right-0 h-10 bg-win98-surface win98-border-outset z-[9999] flex items-center justify-between px-1" style="border-bottom: none; border-left: none; border-right: none;">
  <div class="flex-1 flex items-center gap-1 h-full py-1 min-w-0">
    <!-- Start Button -->
    <button 
      class="win98-button flex-shrink-0 flex items-center gap-2 h-full font-bold px-2 {osState.startMenuOpen ? 'win98-border-inset' : ''}"
      onclick={() => osState.toggleStartMenu()}
    >
      <span class="text-[10px]">🪟</span>
      Start
    </button>
    <div class="flex-shrink-0 w-px h-full bg-win98-border-dark mx-1 border-r border-white"></div>
    
    <!-- Open Windows Tabs -->
    <div class="flex-1 flex gap-1 overflow-x-auto h-full scrollbar-hide">
      {#each osState.windows as win}
        {#if win.isOpen}
          <button 
            class="win98-button flex-shrink-0 flex items-center gap-1 px-2 min-w-[100px] max-w-[150px] truncate h-full {osState.activeWindowId === win.id && !win.isMinimized ? 'win98-border-inset font-bold bg-[#e0e0e0]' : ''}"
            onclick={() => osState.toggleMinimize(win.id)}
            title={win.title}
          >
            {#if win.icon}
              <span class="text-xs">{win.icon}</span>
            {/if}
            <span class="text-xs truncate">{win.title}</span>
          </button>
        {/if}
      {/each}
    </div>
  </div>

  <!-- System Tray -->
  <div class="win98-border-inset h-full py-1 px-3 flex-shrink-0 flex items-center bg-win98-surface mr-1 ml-1">
    <span class="text-xs">{timeString}</span>
  </div>

  {#if osState.startMenuOpen}
    <StartMenu />
  {/if}
</div>
