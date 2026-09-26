<script lang="ts">
  import { willRememberStore } from '../repository.svelte';
  import SlashMenu from './SlashMenu.svelte';

  let textareaEl = $state<HTMLTextAreaElement | null>(null);
  let gutterEl = $state<HTMLDivElement | null>(null);
  let showSlashMenu = $state(false);
  let slashMenuCoords = $state({ top: 40, left: 60 });

  let activeTab = $derived(willRememberStore.openTabs.find((t) => t.tabId === willRememberStore.activeTabId));
  let activeNote = $derived(willRememberStore.activeNote);

  let content = $derived(activeNote?.content || '');

  // Calculate line numbers
  let lineCount = $derived.by(() => {
    if (!content) return 1;
    return content.split('\n').length;
  });

  function updateCursor() {
    if (!textareaEl || !activeTab) return;
    const text = textareaEl.value.substring(0, textareaEl.selectionStart);
    const lines = text.split('\n');
    activeTab.cursorLine = lines.length;
    activeTab.cursorCol = lines[lines.length - 1].length + 1;
  }

  function handleScroll() {
    if (textareaEl && gutterEl) {
      gutterEl.scrollTop = textareaEl.scrollTop;
    }
  }

  function handleInput(e: Event) {
    const val = (e.target as HTMLTextAreaElement).value;
    willRememberStore.updateActiveNoteContent(val);
    updateCursor();

    // Check for slash command at current line start
    if (textareaEl) {
      const pos = textareaEl.selectionStart;
      const textBefore = val.substring(0, pos);
      const currentLine = textBefore.split('\n').pop() || '';

      if (currentLine === '/') {
        // Trigger slash menu
        showSlashMenu = true;
        // Approximate position
        const lineNum = textBefore.split('\n').length;
        slashMenuCoords = {
          top: Math.min(lineNum * 18 + 10, 240),
          left: 60
        };
      } else {
        showSlashMenu = false;
      }
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!textareaEl) return;
      const start = textareaEl.selectionStart;
      const end = textareaEl.selectionEnd;
      const currentVal = textareaEl.value;

      // Insert 2 spaces
      const newVal = currentVal.substring(0, start) + '  ' + currentVal.substring(end);
      willRememberStore.updateActiveNoteContent(newVal);

      setTimeout(() => {
        if (textareaEl) {
          textareaEl.selectionStart = textareaEl.selectionEnd = start + 2;
          updateCursor();
        }
      }, 0);
    } else if (e.key === 'Escape' && showSlashMenu) {
      showSlashMenu = false;
    }
  }

  function handleSlashSelect(insertText: string) {
    if (!textareaEl) return;
    const pos = textareaEl.selectionStart;
    const val = textareaEl.value;
    // Replace the slash with insertText
    const beforeSlash = val.substring(0, pos - 1);
    const afterPos = val.substring(pos);
    const updated = beforeSlash + insertText + afterPos;

    willRememberStore.updateActiveNoteContent(updated);
    showSlashMenu = false;

    setTimeout(() => {
      if (textareaEl) {
        textareaEl.focus();
        textareaEl.selectionStart = textareaEl.selectionEnd = beforeSlash.length + insertText.length;
        updateCursor();
      }
    }, 10);
  }
</script>

<div class="relative flex-1 w-full h-full flex bg-white min-h-0 overflow-hidden select-text">
  <!-- Line Number Gutter -->
  <div
    bind:this={gutterEl}
    class="w-10 bg-[#f0f0f0] border-r border-[#d0d0d0] text-gray-400 font-mono text-xs select-none py-2 text-right pr-2 overflow-hidden flex-shrink-0"
    style="line-height: 1.5rem;"
  >
    {#each Array(lineCount) as _, idx}
      <div>{idx + 1}</div>
    {/each}
  </div>

  <!-- Raw Textarea Editor -->
  <textarea
    bind:this={textareaEl}
    value={content}
    oninput={handleInput}
    onkeydown={(e) => {
      if (!e.ctrlKey && !e.metaKey) {
        e.stopPropagation();
      }
      handleKeydown(e);
    }}
    onkeypress={(e) => e.stopPropagation()}
    onkeyup={(e) => {
      e.stopPropagation();
      updateCursor();
    }}
    onclick={updateCursor}
    onscroll={handleScroll}
    class="flex-1 w-full h-full p-2 font-mono text-xs text-black bg-white outline-none resize-none {willRememberStore.wordWrap
      ? 'whitespace-pre-wrap break-words'
      : 'whitespace-pre overflow-x-auto'}"
    style="line-height: 1.5rem; tab-size: 2; font-family: 'Share Tech Mono', Consolas, 'Courier New', monospace;"
    placeholder="Write your note here... (Tip: type '/' on empty line for blocks)"
    spellcheck="false"
  ></textarea>

  <!-- Slash Commands Popover -->
  {#if showSlashMenu}
    <div 
      class="absolute" 
      style="top: {slashMenuCoords.top}px; left: {slashMenuCoords.left}px;"
    >
      <SlashMenu 
        onSelect={handleSlashSelect} 
        onClose={() => (showSlashMenu = false)} 
      />
    </div>
  {/if}
</div>
