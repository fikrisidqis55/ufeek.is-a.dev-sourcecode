<script lang="ts">
  import { osState } from "$lib/stores/osState.svelte";

  let { icon, title, windowId, x, y } = $props<{ icon: string, title: string, windowId: string, x: number, y: number }>();
  let isSelected = $derived(osState.selectedIconId === windowId);
  let lastClickTime = 0;

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
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  class="absolute flex flex-col items-center justify-center w-20 gap-1 cursor-pointer {isSelected ? 'opacity-90' : ''}"
  style="top: {y}px; left: {x}px;"
  onclick={(e) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastClickTime < 400) {
      handleDblClick();
      lastClickTime = 0;
    } else {
      osState.selectIcon(windowId);
      lastClickTime = now;
    }
  }}
  ondblclick={handleDblClick}
>
  <div class="w-10 h-10 flex items-center justify-center {isSelected ? 'bg-win98-title-active/40' : ''}">
    {#if icon.startsWith('/') || icon.endsWith('.png')}
      <img 
        src={icon} 
        alt={title} 
        class="w-8 h-8 pointer-events-none select-none" 
        style="image-rendering: pixelated;" 
      />
    {:else}
      <span class="text-3xl">{icon}</span>
    {/if}
  </div>
  <div class="text-white text-xs text-center px-1 {isSelected ? 'bg-win98-title-active' : ''}" style="text-shadow: 1px 1px 0px #000;">
    {title}
  </div>
</div>
