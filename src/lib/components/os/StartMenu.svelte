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
  class="fixed left-0 bottom-10 w-64 max-w-[90vw] win98-border-outset z-[9999] flex flex-col bg-win98-surface shadow-2xl font-[Tahoma,sans-serif] text-xs text-black select-none"
>
  <!-- Start Menu Left Title Strip -->
  <div class="flex items-center gap-2 p-2 bg-win98-title-active text-win98-title-text font-bold">
    <img src="/icons/win98/windows_flag.png" alt="" class="w-4 h-4 pointer-events-none select-none" style="image-rendering: pixelated;" />
    <span class="tracking-wide">Ufeek 98</span>
  </div>
  
  <div class="flex-1 flex flex-col p-1 gap-0.5">
    <a 
      href="https://github.com/fikrisidqis" 
      target="_blank" 
      class="flex items-center gap-3 p-2 hover:bg-win98-title-active hover:text-win98-title-text active:bg-win98-title-active active:text-win98-title-text cursor-pointer min-h-[36px]"
      onclick={() => osState.toggleStartMenu()}
    >
      <img src="/icons/win98/network.png" alt="" class="w-5 h-5 pointer-events-none select-none flex-shrink-0" style="image-rendering: pixelated;" />
      <span>GitHub</span>
    </a>
    
    <a 
      href="https://www.linkedin.com/in/fikrisidqis/" 
      target="_blank" 
      class="flex items-center gap-3 p-2 hover:bg-win98-title-active hover:text-win98-title-text active:bg-win98-title-active active:text-win98-title-text cursor-pointer min-h-[36px]"
      onclick={() => osState.toggleStartMenu()}
    >
      <img src="/icons/win98/briefcase.png" alt="" class="w-5 h-5 pointer-events-none select-none flex-shrink-0" style="image-rendering: pixelated;" />
      <span>LinkedIn</span>
    </a>

    <div class="h-px bg-win98-border-dark border-b border-white my-1"></div>

    <button 
      class="flex items-center gap-3 p-2 hover:bg-win98-title-active hover:text-win98-title-text active:bg-win98-title-active active:text-win98-title-text cursor-pointer text-left font-bold min-h-[36px]"
      onclick={() => osState.openWindow({ id: 'will-remember', title: 'will-remember', icon: '/icons/win98/notepad.png', width: 780, height: 560 })}
    >
      <img src="/icons/win98/notepad.png" alt="" class="w-5 h-5 pointer-events-none select-none flex-shrink-0" style="image-rendering: pixelated;" />
      <span>will-remember</span>
    </button>

    <button 
      class="flex items-center gap-3 p-2 hover:bg-win98-title-active hover:text-win98-title-text active:bg-win98-title-active active:text-win98-title-text cursor-pointer text-left min-h-[36px]"
      onclick={() => osState.openWindow({ id: 'about', title: 'About Me', icon: '/icons/win98/about.png' })}
    >
      <img src="/icons/win98/about.png" alt="" class="w-5 h-5 pointer-events-none select-none flex-shrink-0" style="image-rendering: pixelated;" />
      <span>About Me</span>
    </button>

    <button 
      class="flex items-center gap-3 p-2 hover:bg-win98-title-active hover:text-win98-title-text active:bg-win98-title-active active:text-win98-title-text cursor-pointer text-left min-h-[36px]"
      onclick={() => osState.openWindow({ id: 'experience', title: 'Experience', icon: '/icons/win98/experience.png', width: 660, height: 560 })}
    >
      <img src="/icons/win98/experience.png" alt="" class="w-5 h-5 pointer-events-none select-none flex-shrink-0" style="image-rendering: pixelated;" />
      <span>Experience</span>
    </button>

    <button 
      class="flex items-center gap-3 p-2 hover:bg-win98-title-active hover:text-win98-title-text active:bg-win98-title-active active:text-win98-title-text cursor-pointer text-left min-h-[36px]"
      onclick={() => osState.openWindow({ id: 'projects', title: 'Projects', icon: '/icons/win98/projects.png' })}
    >
      <img src="/icons/win98/projects.png" alt="" class="w-5 h-5 pointer-events-none select-none flex-shrink-0" style="image-rendering: pixelated;" />
      <span>Projects</span>
    </button>
    
    <button 
      class="flex items-center gap-3 p-2 hover:bg-win98-title-active hover:text-win98-title-text active:bg-win98-title-active active:text-win98-title-text cursor-pointer text-left min-h-[36px]"
      onclick={() => osState.openWindow({ id: 'contact', title: 'Contact', icon: '/icons/win98/contact.png' })}
    >
      <img src="/icons/win98/contact.png" alt="" class="w-5 h-5 pointer-events-none select-none flex-shrink-0" style="image-rendering: pixelated;" />
      <span>Contact</span>
    </button>
  </div>
</div>
