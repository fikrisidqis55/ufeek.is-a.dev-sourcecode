<script lang="ts">
  import { osState } from "$lib/stores/osState.svelte";
  import { fade } from "svelte/transition";
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  class="fixed inset-0 z-[9998]"
  onclick={() => osState.toggleStartMenu()}
></div>

<div 
  transition:fade={{ duration: 100 }}
  class="fixed left-0 bottom-10 w-64 win98-border-outset z-[9999] flex flex-col bg-win98-surface"
>
  <div class="flex items-center gap-2 p-2 bg-win98-title-active text-win98-title-text font-bold">
    <span>🪟</span>
    <span>Ufeek 98</span>
  </div>
  
  <div class="flex-1 flex flex-col p-1 gap-1">
    <a href="https://github.com/fikrisidqis" target="_blank" class="flex items-center gap-3 p-2 hover:bg-win98-title-active hover:text-win98-title-text cursor-pointer">
      <span class="text-xl">🐱</span>
      <span>GitHub</span>
    </a>
    
    <a href="https://www.linkedin.com/in/fikrisidqis/" target="_blank" class="flex items-center gap-3 p-2 hover:bg-win98-title-active hover:text-win98-title-text cursor-pointer">
      <span class="text-xl">💼</span>
      <span>LinkedIn</span>
    </a>

    <div class="h-px bg-win98-border-dark border-b border-white my-1"></div>

    <button 
      class="flex items-center gap-3 p-2 hover:bg-win98-title-active hover:text-win98-title-text cursor-pointer text-left"
      onclick={() => osState.openWindow({ id: 'about', title: 'About Me', icon: '📝', x: 200, y: 150 })}
    >
      <span class="text-xl">📝</span>
      <span>About Me</span>
    </button>
    
    <button 
      class="flex items-center gap-3 p-2 hover:bg-win98-title-active hover:text-win98-title-text cursor-pointer text-left"
      onclick={() => osState.openWindow({ id: 'contact', title: 'Contact', icon: '✉️', x: 250, y: 200 })}
    >
      <span class="text-xl">✉️</span>
      <span>Contact</span>
    </button>
  </div>
</div>
