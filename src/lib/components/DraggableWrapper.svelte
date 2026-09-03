<script lang="ts">
  import { onMount } from "svelte";
  import { Terminal, X } from "@lucide/svelte";

  export let className: string = "";
  export let disabled: boolean = false;

  let wrapperEl: HTMLDivElement;
  let handleEl: HTMLDivElement;
  let position = { x: 0, y: 0 };
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  function onMouseDown(e: MouseEvent) {
    if (disabled) return;
    // Don't drag if clicking buttons inside handle
    if ((e.target as HTMLElement).closest("button")) return;

    isDragging = true;
    startX = e.clientX - position.x;
    startY = e.clientY - position.y;
    document.body.style.userSelect = "none";
  }

  function onMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    position = {
      x: e.clientX - startX,
      y: e.clientY - startY,
    };
  }

  function onMouseUp() {
    if (isDragging) {
      isDragging = false;
      document.body.style.userSelect = "auto";
    }
  }

  onMount(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });
</script>

{#if disabled}
  <div
    bind:this={wrapperEl}
    class="w-full min-w-0 {className} pixel-corners"
  >
    <div class="w-full h-8 flex items-center gap-2 bg-white/90 text-tertiary px-4 cursor-grab">
      <Terminal size={16} />
      <span class="text-sm font-medium font-mono uppercase tracking-wider">terminal</span>
    </div>
    <div class="w-full min-w-0 min-h-[200px] bg-white/90 p-1">
      <slot />
    </div>
  </div>
{:else}
  <div
    bind:this={wrapperEl}
    class="w-full min-w-0 {className} pixel-corners !shadow-lg shadow-tertiary/70 transition-transform duration-75"
    style="transform: translate({position.x}px, {position.y}px);"
  >
    <div
      bind:this={handleEl}
      on:mousedown={onMouseDown}
      role="toolbar"
      tabindex="0"
      class="w-full h-8 flex items-center gap-2 bg-white/90 text-tertiary px-4 cursor-grab justify-between min-w-0 select-none active:cursor-grabbing"
    >
      <div class="flex items-center gap-2 min-w-0">
        <Terminal size={16} />
        <span class="truncate font-mono text-sm font-semibold uppercase tracking-wider">Record</span>
      </div>
      <X size={16} class="text-red-500 ml-2 flex-shrink-0" />
    </div>
    <div class="w-full min-w-0 min-h-[200px] bg-white/90 p-1">
      <slot />
    </div>
  </div>
{/if}
