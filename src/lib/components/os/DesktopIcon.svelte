<script lang="ts">
  import { osState } from "$lib/stores/osState.svelte";
  import { onDestroy } from "svelte";

  let { icon, title, windowId, x, y } = $props<{ icon: string, title: string, windowId: string, x: number, y: number }>();
  let isSelected = $derived(osState.selectedIconId === windowId);
  let lastClickTime = 0;

  let isDragging = $state(false);
  let dragPos = $state<{ x: number; y: number } | null>(null);
  let currentPos = $derived(isDragging && dragPos ? dragPos : { x, y });
  let justDragged = false;

  let startPointer = { x: 0, y: 0 };
  let startIconPos = { x: 0, y: 0 };
  let hasMoved = false;

  function handleDblClick() {
    let width: number | undefined = undefined;
    let height: number | undefined = undefined;
    let center: boolean | undefined = undefined;
    if (windowId === 'doom') {
      width = 680;
      height = 520;
    } else if (windowId === 'will-remember') {
      width = 780;
      height = 560;
    } else if (windowId === 'welcome') {
      width = 520;
      center = true;
    } else if (windowId === 'experience') {
      width = 660;
      height = 560;
    } else if (windowId.startsWith('app-')) {
      width = 960;
      height = 680;
      center = true;
    }
    osState.openWindow({ 
      id: windowId, 
      title, 
      icon, 
      x: center ? undefined : x + 100, 
      y: center ? undefined : 20, 
      width, 
      height, 
      center 
    });
    osState.selectIcon(null);
  }

  function handlePointerDown(e: PointerEvent) {
    if (osState.isMobile || e.button !== 0) return;

    startPointer = { x: e.clientX, y: e.clientY };
    startIconPos = { x: currentPos.x, y: currentPos.y };
    hasMoved = false;

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  }

  function handlePointerMove(e: PointerEvent) {
    if (osState.isMobile) return;
    const dx = e.clientX - startPointer.x;
    const dy = e.clientY - startPointer.y;

    if (!hasMoved && Math.hypot(dx, dy) >= 5) {
      hasMoved = true;
      isDragging = true;
      osState.selectIcon(windowId);
    }

    if (isDragging) {
      const rawX = startIconPos.x + dx;
      const rawY = startIconPos.y + dy;
      dragPos = osState.clampCoordinate(rawX, rawY);
      osState.setDraggingState(windowId, dragPos.x, dragPos.y);
    }
  }

  function handlePointerUp() {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);

    if (isDragging) {
      const finalPos = dragPos ?? { x, y };
      isDragging = false;
      dragPos = null;
      justDragged = true;
      osState.dropIcon(windowId, finalPos.x, finalPos.y);
      setTimeout(() => {
        justDragged = false;
      }, 100);
    }
  }

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    }
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  class="{osState.isMobile ? 'relative flex flex-col items-center justify-center w-24 p-2 gap-1.5 cursor-pointer active:scale-95 transition-transform' : 'absolute flex flex-col items-center justify-center w-20 gap-1 select-none'} {isSelected ? 'opacity-90' : ''} {isDragging ? 'z-30 opacity-80 cursor-move' : 'z-10 cursor-pointer'}"
  style={osState.isMobile ? '' : `top: ${currentPos.y}px; left: ${currentPos.x}px; touch-action: none;`}
  onpointerdown={handlePointerDown}
  onclick={(e) => {
    e.stopPropagation();
    if (justDragged || isDragging) return;

    if (osState.isMobile) {
      handleDblClick();
    } else {
      const now = Date.now();
      if (now - lastClickTime < 400) {
        handleDblClick();
        lastClickTime = 0;
      } else {
        osState.selectIcon(windowId);
        lastClickTime = now;
      }
    }
  }}
  ondblclick={(e) => {
    e.stopPropagation();
    if (justDragged || isDragging) return;
    handleDblClick();
  }}
>
  <div class="w-11 h-11 flex items-center justify-center {isSelected ? 'bg-win98-title-active/40' : ''}">
    {#if icon.startsWith('/') || icon.endsWith('.png')}
      <img 
        src={icon} 
        alt={title} 
        class="w-9 h-9 pointer-events-none select-none object-contain" 
        style="image-rendering: pixelated;" 
      />
    {:else}
      <span class="text-3xl">{icon}</span>
    {/if}
  </div>
  <div 
    class="text-white text-xs text-center px-1 font-[Tahoma,sans-serif] {isSelected ? 'bg-win98-title-active' : ''} {isDragging ? 'outline-1 outline-dotted outline-white' : ''}" 
    style="text-shadow: 1px 1px 0px #000;"
  >
    {title}
  </div>
</div>

