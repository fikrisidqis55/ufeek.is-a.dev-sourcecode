<script lang="ts">
  import { osState } from "$lib/stores/osState.svelte";
  import { onMount } from "svelte";

  let menuEl = $state<HTMLDivElement | null>(null);
  let adjustedPos = $state({ x: 0, y: 0 });

  $effect(() => {
    if (osState.desktopContextMenu.isOpen && typeof window !== 'undefined') {
      const menuW = 180;
      const menuH = 140;
      const x = Math.min(osState.desktopContextMenu.x, window.innerWidth - menuW - 10);
      const y = Math.min(osState.desktopContextMenu.y, window.innerHeight - 40 - menuH - 10);
      adjustedPos = { x: Math.max(10, x), y: Math.max(10, y) };
    }
  });

  onMount(() => {
    function handleGlobalClick(e: MouseEvent) {
      if (osState.desktopContextMenu.isOpen) {
        osState.closeDesktopContextMenu();
      }
    }
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  });
</script>

{#if osState.desktopContextMenu.isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="fixed inset-0 z-[9995]" 
    onclick={() => osState.closeDesktopContextMenu()}
    oncontextmenu={(e) => {
      e.preventDefault();
      osState.closeDesktopContextMenu();
    }}
  ></div>

  <!-- Context Menu Box -->
  <div
    bind:this={menuEl}
    class="fixed z-[9996] win98-border-outset bg-win98-surface shadow-md py-1 px-0.5 flex flex-col font-[Tahoma,sans-serif] text-xs select-none w-48 text-black"
    style="left: {adjustedPos.x}px; top: {adjustedPos.y}px;"
    role="menu"
    tabindex="-1"
  >
    <button
      class="flex items-center gap-2 px-3 py-1.5 hover:bg-win98-title-active hover:text-win98-title-text active:bg-win98-title-active active:text-win98-title-text text-left cursor-pointer transition-none"
      onclick={() => osState.autoArrangeIcons()}
    >
      <span class="w-4 text-center">⚡</span>
      <span>Auto Arrange</span>
    </button>

    <button
      class="flex items-center gap-2 px-3 py-1.5 hover:bg-win98-title-active hover:text-win98-title-text active:bg-win98-title-active active:text-win98-title-text text-left cursor-pointer transition-none"
      onclick={() => osState.lineUpIcons()}
    >
      <span class="w-4 text-center">📐</span>
      <span>Line Up Icons</span>
    </button>

    <button
      class="flex items-center gap-2 px-3 py-1.5 hover:bg-win98-title-active hover:text-win98-title-text active:bg-win98-title-active active:text-win98-title-text text-left cursor-pointer transition-none"
      onclick={() => osState.resetDesktopIcons()}
    >
      <span class="w-4 text-center">🔄</span>
      <span>Reset Layout</span>
    </button>

    <div class="h-px bg-win98-border-dark border-b border-white my-1 mx-1"></div>

    <button
      class="flex items-center gap-2 px-3 py-1.5 hover:bg-win98-title-active hover:text-win98-title-text active:bg-win98-title-active active:text-win98-title-text text-left cursor-pointer transition-none"
      onclick={() => {
        osState.openWindow({
          id: 'welcome',
          title: 'Welcome to ufeek OS',
          icon: '/icons/win98/computer.png',
          center: true,
          width: 520
        });
      }}
    >
      <img src="/icons/win98/computer.png" alt="" class="w-4 h-4 object-contain" style="image-rendering: pixelated;" />
      <span>Properties</span>
    </button>
  </div>
{/if}
