<script lang="ts">
  import { osState } from "$lib/stores/osState.svelte";
  import type { Snippet } from "svelte";

  let { windowId, children }: { windowId: string; children: Snippet } = $props();

  let winConfig = $derived(osState.windows.find((w) => w.id === windowId));
  let isActive = $derived(osState.activeWindowId === windowId);

  let isDragging = $state(false);
  let dragOffset = $state({ x: 0, y: 0 });
  let position = $state({ x: 0, y: 0 });
  let isMaximized = $state(false);
  let preMaxPosition = $state({ x: 0, y: 0 });
  let windowEl = $state<HTMLDivElement | null>(null);
  let hasManualPosition = $state(false);

  function calculateCenterPosition() {
    if (typeof window === 'undefined') return { x: 50, y: 50 };
    const screenW = window.innerWidth;
    const screenH = window.innerHeight - 40; // Exclude bottom taskbar (40px)
    const winW = windowEl?.offsetWidth || winConfig?.width || 520;
    const winH = windowEl?.offsetHeight || winConfig?.height || 540;

    const x = Math.max(10, Math.floor((screenW - winW) / 2));
    const y = Math.max(10, Math.floor((screenH - winH) / 2));
    return { x, y };
  }

  // Initialize position when config or window element becomes available
  $effect(() => {
    if (winConfig && winConfig.isOpen && !winConfig.isMinimized && !hasManualPosition) {
      if (winConfig.center || (winConfig.x === undefined && winConfig.y === undefined)) {
        position = calculateCenterPosition();
      } else if (winConfig.x !== undefined && position.x === 0 && position.y === 0) {
        position = { x: winConfig.x, y: winConfig.y ?? 50 };
      }
    }
  });

  // Handle window resize dynamically when window is centered and hasn't been manually dragged
  $effect(() => {
    function handleResize() {
      if (
        !hasManualPosition &&
        winConfig?.isOpen &&
        !winConfig?.isMinimized &&
        !isMaximized &&
        (winConfig?.center || (winConfig?.x === undefined && winConfig?.y === undefined))
      ) {
        position = calculateCenterPosition();
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  function handleMousedown(e: MouseEvent) {
    if (isMaximized || osState.isMobile) return;
    osState.focusWindow(windowId);
    hasManualPosition = true;
    isDragging = true;
    dragOffset = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    
    // Add listeners to window
    window.addEventListener('mousemove', handleMousemove);
    window.addEventListener('mouseup', handleMouseup);
  }

  function handleMousemove(e: MouseEvent) {
    if (!isDragging || osState.isMobile) return;
    position = {
      x: e.clientX - dragOffset.x,
      y: Math.max(0, e.clientY - dragOffset.y) // Don't drag above screen
    };
  }

  function handleMouseup() {
    isDragging = false;
    window.removeEventListener('mousemove', handleMousemove);
    window.removeEventListener('mouseup', handleMouseup);
  }

  function toggleMaximize() {
    if (osState.isMobile) return;
    if (isMaximized) {
      isMaximized = false;
      position = preMaxPosition;
    } else {
      isMaximized = true;
      preMaxPosition = { ...position };
      position = { x: 0, y: 0 };
    }
  }

  function handleClose() {
    osState.closeWindow(windowId);
  }

  function handleMinimize() {
    osState.minimizeWindow(windowId);
  }
</script>

{#if winConfig?.isOpen && !winConfig?.isMinimized}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    bind:this={windowEl}
    class="win98-window win98-border-outset absolute flex flex-col pointer-events-auto"
    role="presentation"
    style="
      z-index: {winConfig.zIndex};
      {osState.isMobile
        ? 'top: 0; left: 0; width: 100vw; height: calc(100dvh - 40px); max-width: 100vw; max-height: calc(100dvh - 40px);'
        : isMaximized
        ? 'top: 0; left: 0; width: 100vw; height: calc(100vh - 40px);'
        : `top: ${position.y}px; left: ${position.x}px; min-width: ${winConfig?.width ? winConfig.width + 'px' : '300px'}; ${winConfig?.width ? `width: ${winConfig.width}px;` : ''} ${winConfig?.height ? `height: ${winConfig.height}px;` : ''} max-width: 90vw; max-height: 85vh;`}
    "
    onmousedown={() => osState.focusWindow(windowId)}
    onclick={() => osState.focusWindow(windowId)}
  >
    <!-- Title Bar -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="win98-window-title flex justify-between items-center cursor-default select-none {isActive ? '' : 'inactive'} {osState.isMobile ? 'py-1 px-1.5 min-h-[34px]' : ''}"
      role="presentation"
      onmousedown={handleMousedown}
      ondblclick={toggleMaximize}
    >
      <div class="flex items-center gap-2 px-1 min-w-0">
        {#if winConfig?.icon}
          {#if winConfig.icon.startsWith('/') || winConfig.icon.endsWith('.png')}
            <img src={winConfig.icon} alt="" class="w-4 h-4 pointer-events-none select-none flex-shrink-0 object-contain" style="image-rendering: pixelated;" />
          {:else}
            <span class="text-sm">{winConfig.icon}</span>
          {/if}
        {/if}
        <span class="text-sm truncate">{winConfig?.title}</span>
      </div>
      
      <div class="flex items-center gap-1 flex-shrink-0">
        <button 
          class="win98-button p-0 font-bold text-xs leading-none {osState.isMobile ? 'h-[28px] w-[28px]' : 'h-[22px] w-[22px]'} flex items-center justify-center" 
          onclick={handleMinimize} 
          aria-label="Minimize"
          title="Minimize Window"
        >
          <div class="w-[12px] h-[2px] bg-black translate-y-[4px] flex-shrink-0"></div>
        </button>
        {#if !osState.isMobile}
          <button 
            class="win98-button p-0 font-bold text-xs leading-none h-[22px] w-[22px] flex items-center justify-center relative" 
            onclick={toggleMaximize} 
            aria-label={isMaximized ? "Restore" : "Maximize"}
          >
             {#if isMaximized}
               <div class="relative w-[12px] h-[12px] translate-y-[-1px] flex-shrink-0">
                 <div class="absolute top-0 right-0 w-[9px] h-[9px] border-[1px] border-black border-t-[2px]"></div>
                 <div class="absolute bottom-0 left-0 w-[9px] h-[9px] border-[1px] border-black border-t-[2px] bg-win98-surface"></div>
               </div>
             {:else}
               <div class="w-[12px] h-[12px] border-[1px] border-black border-t-[2px] translate-y-[-1px] flex-shrink-0"></div>
             {/if}
          </button>
        {/if}
        <button 
          class="win98-button p-0 font-bold text-xs leading-none {osState.isMobile ? 'h-[28px] w-[28px]' : 'h-[22px] w-[22px]'} flex items-center justify-center" 
          onclick={handleClose} 
          aria-label="Close"
          title="Close Window"
        >
          <span class="translate-y-[-1px] ml-[1px]">X</span>
        </button>
      </div>
    </div>

    <!-- Window Content -->
    <div class="bg-win98-surface p-1 flex-1 overflow-auto overflow-x-hidden min-h-0 win98-border-inset flex flex-col" style="-webkit-overflow-scrolling: touch;">
        <div class="flex-1 w-full h-full flex flex-col min-h-0">
            {@render children()}
        </div>
    </div>
  </div>
{/if}
