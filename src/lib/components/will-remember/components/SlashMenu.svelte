<script lang="ts">
  import { onMount } from 'svelte';
  import { playClickSound } from '../services/audioSynthesizer';

  let { onSelect, onClose }: { onSelect: (insertText: string) => void; onClose: () => void } = $props();

  const commands = [
    { id: 'todo', label: 'To-Do Checklist', icon: '☑️', insert: '- [ ] ' },
    { id: 'h1', label: 'Heading 1', icon: 'H1', insert: '# ' },
    { id: 'h2', label: 'Heading 2', icon: 'H2', insert: '## ' },
    { id: 'h3', label: 'Heading 3', icon: 'H3', insert: '### ' },
    { id: 'code', label: 'Code Fence', icon: '💻', insert: '```typescript\n\n```' },
    { id: 'callout', label: 'Retro Callout', icon: '💡', insert: '> [!NOTE]\n> ' },
    { id: 'divider', label: 'Divider Line', icon: '➖', insert: '\n---\n\n' },
    { id: 'date', label: 'Timestamp', icon: '🕒', insert: `[${new Date().toLocaleDateString()}] ` }
  ];

  let selectedIndex = $state(0);

  function handleSelect(cmd: typeof commands[0]) {
    playClickSound();
    onSelect(cmd.insert);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % commands.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + commands.length) % commands.length;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(commands[selectedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="win98-window win98-border-outset bg-win98-surface shadow-lg w-52 p-1 flex flex-col gap-0.5 select-none text-xs z-[10002]">
  <div class="px-1.5 py-0.5 text-[10px] font-bold text-gray-600 bg-[#dfdfdf] border-b border-win98-border-dark flex justify-between">
    <span>INSERT BLOCK</span>
    <span>ESC to exit</span>
  </div>

  <div class="flex flex-col max-h-48 overflow-y-auto">
    {#each commands as cmd, i}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="flex items-center gap-2 px-2 py-1 cursor-pointer {i === selectedIndex
          ? 'bg-win98-title-active text-white font-bold'
          : 'hover:bg-blue-100 text-black'}"
        onclick={() => handleSelect(cmd)}
      >
        <span class="w-5 text-center font-mono text-xs">{cmd.icon}</span>
        <span class="truncate">{cmd.label}</span>
      </div>
    {/each}
  </div>
</div>
