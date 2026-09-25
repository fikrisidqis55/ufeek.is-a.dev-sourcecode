<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let canvas: HTMLCanvasElement;
  let dosContainer: HTMLDivElement;
  let dosInstance: any = null;
  let isScriptLoaded = false;
  
  // The locally hosted DOOM Shareware bundle (avoids CORS issues)
  const doomUrl = "/doom.jsdos";

  onMount(() => {
    // Aggressively strip inline width/height injected by wdosbox/Emscripten
    const cleanStyles = () => {
      const targetCanvas = dosContainer ? dosContainer.querySelector("canvas") : canvas;
      if (targetCanvas) {
        if (targetCanvas.style.width || targetCanvas.style.height) {
          targetCanvas.style.removeProperty("width");
          targetCanvas.style.removeProperty("height");
        }
      }
    };

    if (canvas) {
      const origSetProperty = canvas.style.setProperty.bind(canvas.style);
      canvas.style.setProperty = function (prop: string, val: string | null, priority?: string) {
        if (prop === "width" || prop === "height") {
          return; // Suppress wdosbox inline !important width/height locks
        }
        return origSetProperty(prop, val, priority);
      };
    }

    const observer = new MutationObserver(() => {
      cleanStyles();
    });

    if (dosContainer) {
      observer.observe(dosContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style"]
      });
    }

    const styleInterval = setInterval(cleanStyles, 50);

    // Wait for the Dos global to be available
    const checkInterval = setInterval(() => {
      if ((window as any).Dos && canvas) {
        clearInterval(checkInterval);
        isScriptLoaded = true;
        
        (window as any).Dos(canvas, {
            wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js"
        }).ready((fs: any, main: any) => {
            fs.extract(doomUrl).then(() => {
                main(["-c", "DOOM.EXE"]).then((ci: any) => {
                   dosInstance = ci;
                   cleanStyles();
                });
            });
        });
      }
    }, 100);

    return () => {
      clearInterval(checkInterval);
      clearInterval(styleInterval);
      observer.disconnect();
      if (dosInstance && typeof dosInstance.exit === "function") {
        dosInstance.exit();
      }
    };
  });

  // Prevent default key behaviors when playing so we don't scroll the page
  function handleKeyDown(e: KeyboardEvent) {
    const activeEl = document.activeElement;
    if (activeEl === canvas || (dosContainer && dosContainer.contains(activeEl))) {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Enter", "Alt", "Control"].includes(e.key)) {
         e.preventDefault();
      }
    }
  }
</script>

<svelte:head>
  <script src="https://js-dos.com/6.22/current/js-dos.js"></script>
</svelte:head>

<svelte:window on:keydown={handleKeyDown} />

<div class="h-full w-full flex flex-col bg-black win98-border-inset overflow-hidden select-none">
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    id="dos-container" 
    bind:this={dosContainer}
    class="flex-1 w-full h-full relative bg-black flex items-center justify-center overflow-hidden cursor-crosshair"
    onclick={() => canvas?.focus()}
  >
    <!-- svelte-ignore a11y_autofocus -->
    <canvas 
      bind:this={canvas} 
      tabindex="0" 
      autofocus>
    </canvas>
    
    {#if !isScriptLoaded}
      <div class="absolute inset-0 flex items-center justify-center text-white font-[Tahoma,sans-serif] pointer-events-none z-20">
        <div class="flex flex-col items-center gap-4">
          <span class="text-4xl animate-bounce">💀</span>
          <span class="tracking-widest text-sm text-yellow-400">LOADING DOOM SHAREWARE...</span>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Retro Win98 Status Bar -->
  <div class="bg-win98-surface win98-border-outset px-2 py-1 text-[11px] flex justify-between items-center text-win98-text font-mono flex-shrink-0">
    <span class="flex items-center gap-1.5">
      <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      Click inside window to lock keyboard controls
    </span>
    <span class="text-gray-600">MS-DOS 6.22 / JS-DOS</span>
  </div>
</div>

<style>
  /* Force js-dos container and canvas to fill 100% of available window space */
  :global(#dos-container),
  :global(#dos-container .dosbox-container) {
    width: 100% !important;
    height: 100% !important;
    min-width: 0 !important;
    min-height: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex: 1 1 0% !important;
    position: relative !important;
    background-color: black !important;
  }

  :global(#dos-container canvas) {
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: contain !important;
    image-rendering: pixelated !important;
    image-rendering: crisp-edges !important;
    background-color: black !important;
    outline: none !important;
    display: block !important;
  }

  /* Hide any residual overlay that blocks canvas interactions */
  :global(#dos-container .dosbox-overlay) {
    display: none !important;
    pointer-events: none !important;
  }
</style>
