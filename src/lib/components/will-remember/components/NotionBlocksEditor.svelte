<script lang="ts">
  import { willRememberStore } from '../repository.svelte';
  import { playClickSound } from '../services/audioSynthesizer';

  let activeNote = $derived(willRememberStore.activeNote);
  let content = $derived(activeNote?.content || '');

  interface ParsedBlock {
    id: string;
    type: 'h1' | 'h2' | 'h3' | 'todo' | 'code' | 'callout' | 'divider' | 'paragraph';
    raw: string;
    lineIndex: number;
    text?: string;
    checked?: boolean;
    language?: string;
  }

  // Parse lines into structured blocks
  let parsedBlocks = $derived.by(() => {
    if (!content) return [];
    const lines = content.split('\n');
    const blocks: ParsedBlock[] = [];

    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let codeLanguage = '';
    let codeStartLine = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code block boundary
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.trim().replace(/^```/, '') || 'code';
          codeStartLine = i;
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          blocks.push({
            id: `code-${codeStartLine}`,
            type: 'code',
            raw: lines.slice(codeStartLine, i + 1).join('\n'),
            lineIndex: codeStartLine,
            text: codeBuffer.join('\n'),
            language: codeLanguage
          });
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Checklist item: - [ ] or - [x]
      const todoMatch = line.match(/^(\s*)-\s*\[([ xX])\]\s*(.*)$/);
      if (todoMatch) {
        blocks.push({
          id: `todo-${i}`,
          type: 'todo',
          raw: line,
          lineIndex: i,
          checked: todoMatch[2].toLowerCase() === 'x',
          text: todoMatch[3]
        });
        continue;
      }

      // Headings
      if (line.startsWith('# ')) {
        blocks.push({
          id: `h1-${i}`,
          type: 'h1',
          raw: line,
          lineIndex: i,
          text: line.substring(2)
        });
        continue;
      }
      if (line.startsWith('## ')) {
        blocks.push({
          id: `h2-${i}`,
          type: 'h2',
          raw: line,
          lineIndex: i,
          text: line.substring(3)
        });
        continue;
      }
      if (line.startsWith('### ')) {
        blocks.push({
          id: `h3-${i}`,
          type: 'h3',
          raw: line,
          lineIndex: i,
          text: line.substring(4)
        });
        continue;
      }

      // Callouts / Blockquotes
      if (line.startsWith('>')) {
        blocks.push({
          id: `callout-${i}`,
          type: 'callout',
          raw: line,
          lineIndex: i,
          text: line.replace(/^>\s*(\[!NOTE\]\s*)?/, '')
        });
        continue;
      }

      // Divider
      if (line.trim() === '---' || line.trim() === '***') {
        blocks.push({
          id: `divider-${i}`,
          type: 'divider',
          raw: line,
          lineIndex: i
        });
        continue;
      }

      // Paragraph / generic line
      if (line.trim()) {
        blocks.push({
          id: `p-${i}`,
          type: 'paragraph',
          raw: line,
          lineIndex: i,
          text: line
        });
      }
    }

    return blocks;
  });

  // Toggle todo item directly in the raw markdown text
  function handleToggleTodo(block: ParsedBlock) {
    playClickSound();
    const lines = content.split('\n');
    const targetLine = lines[block.lineIndex];
    if (!targetLine) return;

    if (block.checked) {
      // Uncheck
      lines[block.lineIndex] = targetLine.replace(/\[[xX]\]/, '[ ]');
    } else {
      // Check
      lines[block.lineIndex] = targetLine.replace(/\[\s*\]/, '[x]');
    }

    willRememberStore.updateActiveNoteContent(lines.join('\n'));
  }

  // Quick Append block
  function handleAppendBlock(textToAppend: string) {
    playClickSound();
    const newContent = content.trimEnd() + '\n' + textToAppend + '\n';
    willRememberStore.updateActiveNoteContent(newContent);
  }

  function handleCopyCode(codeText: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(codeText);
      willRememberStore.setStatusMessage('Code copied to clipboard! 📋');
    }
  }
</script>

<div class="flex-1 w-full h-full flex flex-col bg-white overflow-y-auto p-4 select-text">
  <!-- Note Header Bar in Paper -->
  <div class="mb-4 pb-2 border-b border-win98-border-light flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="text-xl">📝</span>
      <h1 class="text-base font-bold text-black font-sans">
        {activeNote?.title || 'Untitled Note'}
      </h1>
    </div>
    <div class="flex items-center gap-1">
      <button 
        class="win98-button text-[11px] px-2 py-0.5" 
        onclick={() => willRememberStore.setEditorMode('raw')}
        title="Switch to Raw Monospace Textarea"
      >
        ✏️ Edit Raw
      </button>
    </div>
  </div>

  <!-- Rendered Blocks Container -->
  <div class="flex-1 flex flex-col gap-2 max-w-3xl">
    {#each parsedBlocks as block (block.id)}
      {#if block.type === 'h1'}
        <div class="mt-2 mb-1">
          <h2 class="text-lg font-bold text-black font-sans pb-1 border-b border-gray-300">
            {block.text}
          </h2>
        </div>
      {:else if block.type === 'h2'}
        <div class="mt-2 mb-0.5">
          <h3 class="text-base font-bold text-gray-900 font-sans">
            {block.text}
          </h3>
        </div>
      {:else if block.type === 'h3'}
        <div class="mt-1 mb-0.5">
          <h4 class="text-sm font-bold text-gray-800 font-sans">
            {block.text}
          </h4>
        </div>
      {:else if block.type === 'todo'}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
          class="flex items-start gap-2 py-0.5 px-1 rounded-none hover:bg-blue-50 cursor-pointer group select-none"
          onclick={() => handleToggleTodo(block)}
        >
          <input
            type="checkbox"
            checked={block.checked}
            class="mt-1 cursor-pointer accent-[#000080]"
            onclick={(e) => {
              e.stopPropagation();
              handleToggleTodo(block);
            }}
          />
          <span class="text-xs text-black font-sans leading-relaxed {block.checked ? 'line-through text-gray-400' : ''}">
            {block.text}
          </span>
        </div>
      {:else if block.type === 'code'}
        <div class="win98-border-inset bg-[#f4f4f4] my-1 p-2 font-mono text-xs relative group text-black">
          <div class="flex justify-between items-center pb-1 mb-1 border-b border-gray-300 text-[10px] text-gray-500 font-sans">
            <span>CODE ({block.language || 'text'})</span>
            <button 
              class="win98-button text-[10px] px-1 py-0.2"
              onclick={() => handleCopyCode(block.text || '')}
            >
              Copy
            </button>
          </div>
          <pre class="overflow-x-auto whitespace-pre leading-relaxed select-text font-mono"><code>{block.text}</code></pre>
        </div>
      {:else if block.type === 'callout'}
        <div class="win98-border-inset bg-[#ffffdf] my-1 p-2 flex items-start gap-2 text-xs font-sans text-black border-l-4 border-l-[#ffaa00]">
          <span class="text-sm">💡</span>
          <div class="leading-relaxed select-text">
            {block.text}
          </div>
        </div>
      {:else if block.type === 'divider'}
        <div class="my-2 h-0.5 bg-win98-border-dark border-b border-white"></div>
      {:else if block.type === 'paragraph'}
        <p class="text-xs text-black font-sans leading-relaxed select-text">
          {block.text}
        </p>
      {/if}
    {/each}

    {#if parsedBlocks.length === 0}
      <div class="text-xs text-gray-400 italic py-4">
        This document is empty. Use the quick block buttons below or switch to Raw Mode to write!
      </div>
    {/if}
  </div>

  <!-- Bottom Quick Add Block Toolbar -->
  <div class="mt-6 pt-2 border-t border-win98-border-light flex flex-wrap items-center gap-1 select-none">
    <span class="text-[11px] font-bold text-gray-500 mr-1">+ Add Block:</span>
    <button 
      class="win98-button text-[11px] px-2 py-0.5" 
      onclick={() => handleAppendBlock('- [ ] New checklist item')}
    >
      ☑️ To-Do
    </button>
    <button 
      class="win98-button text-[11px] px-2 py-0.5" 
      onclick={() => handleAppendBlock('### New Section Header')}
    >
      H3 Heading
    </button>
    <button 
      class="win98-button text-[11px] px-2 py-0.5" 
      onclick={() => handleAppendBlock('```javascript\n// code here\n```')}
    >
      💻 Code
    </button>
    <button 
      class="win98-button text-[11px] px-2 py-0.5" 
      onclick={() => handleAppendBlock('> 💡 Important retro memo')}
    >
      💡 Callout
    </button>
  </div>
</div>
