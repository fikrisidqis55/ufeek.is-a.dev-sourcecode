<script lang="ts">
  import { playClickSound } from '../services/audioSynthesizer';

  let { onClose }: { onClose: () => void } = $props();

  function handleOk() {
    playClickSound();
    onClose();
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  class="fixed inset-0 z-[10005] bg-black/25 flex items-center justify-center p-4 select-none"
  onclick={(e) => {
    if (e.target === e.currentTarget) handleOk();
  }}
>
  <div class="win98-window win98-border-outset w-[380px] max-w-full bg-win98-surface shadow-md">
    <!-- Title Bar -->
    <div class="win98-window-title flex justify-between items-center py-[2px] px-1">
      <div class="flex items-center gap-1.5 text-xs font-bold">
        <span>📝</span>
        <span>About will-remember</span>
      </div>
      <button 
        class="win98-button p-0 font-bold text-xs h-[18px] w-[18px] flex items-center justify-center"
        onclick={handleOk}
        aria-label="Close"
      >
        ✕
      </button>
    </div>

    <!-- Body -->
    <div class="p-4 flex flex-col gap-3">
      <div class="flex items-start gap-4">
        <div class="text-4xl p-2 win98-border-inset bg-white flex-shrink-0">
          📝
        </div>
        <div class="flex flex-col text-xs leading-relaxed text-black">
          <span class="font-bold text-sm">will-remember for ufeek OS</span>
          <span class="text-gray-700">Version 1.0.0 (Build 1998)</span>
          <span class="text-gray-700">Microsoft Windows 98 Second Edition</span>
          <span class="mt-2 italic text-[11px] text-gray-800">
            "Notepad speed, Notion flexibility — never forget what matters."
          </span>
        </div>
      </div>

      <div class="w-full h-px bg-win98-border-dark border-b border-white my-1"></div>

      <div class="win98-border-inset p-2 bg-[#dfdfdf] text-[11px] leading-tight text-gray-800">
        <div>Licensed to: <strong>Fikri Sidqi (Ufeek)</strong></div>
        <div>System Memory: <strong>64,000 KB RAM</strong></div>
        <div>Floppy Emulation: <strong>Web Audio Synthesizer (Active)</strong></div>
      </div>

      <div class="flex justify-end pt-1">
        <button 
          class="win98-button min-w-[70px] text-xs font-bold py-1 px-4"
          onclick={handleOk}
        >
          OK
        </button>
      </div>
    </div>
  </div>
</div>
