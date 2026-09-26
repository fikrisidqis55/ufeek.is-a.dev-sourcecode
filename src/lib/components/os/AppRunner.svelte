<script lang="ts">
  import { projectsList, type ProjectExecutable } from "$lib/data/projects";
  import CirrustLiteMock from "$lib/components/projects/CirrustLiteMock.svelte";
  import { Play, Info, Image as ImageIcon, RotateCcw, ExternalLink, Cpu, CheckCircle2 } from "lucide-svelte";

  interface Props {
    projectId: string;
  }

  let { projectId }: Props = $props();

  const project: ProjectExecutable = $derived(
    projectsList.find((p) => p.id === projectId) || projectsList[0]
  );

  let activeTab = $state<'run' | 'specs' | 'screenshots'>('run');
  let reloadKey = $state(0);

  function resetApp() {
    reloadKey += 1;
  }
</script>

<div class="h-full w-full bg-win98-surface flex flex-col text-black font-[Tahoma,sans-serif] select-none text-xs">
  <!-- Win98 Classic Menu Bar -->
  <div class="flex items-center gap-3 px-2 py-0.5 border-b border-gray-400 text-xs bg-win98-surface">
    <span class="hover:bg-win98-title-active hover:text-white px-1 cursor-pointer">File</span>
    <span class="hover:bg-win98-title-active hover:text-white px-1 cursor-pointer">Edit</span>
    <span class="hover:bg-win98-title-active hover:text-white px-1 cursor-pointer">View</span>
    <span class="hover:bg-win98-title-active hover:text-white px-1 cursor-pointer">Options</span>
    <span class="hover:bg-win98-title-active hover:text-white px-1 cursor-pointer">Help</span>
  </div>

  <!-- Win98 App Action Toolbar -->
  <div class="flex items-center gap-1.5 p-1 bg-win98-surface border-b border-gray-400 overflow-x-auto flex-wrap">
    <!-- Run Demo Button -->
    <button
      type="button"
      onclick={() => (activeTab = 'run')}
      class="px-2.5 py-1 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all {activeTab === 'run' ? 'win98-border-inset bg-gray-200' : 'win98-border-outset bg-win98-surface'}"
    >
      <Play size={13} class="text-green-700 fill-green-700" />
      <span>Run Demo</span>
    </button>

    <!-- Specs Button -->
    <button
      type="button"
      onclick={() => (activeTab = 'specs')}
      class="px-2.5 py-1 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all {activeTab === 'specs' ? 'win98-border-inset bg-gray-200' : 'win98-border-outset bg-win98-surface'}"
    >
      <Info size={13} class="text-blue-700" />
      <span>System Specs (.NFO)</span>
    </button>

    <!-- Screenshots Button -->
    <button
      type="button"
      onclick={() => (activeTab = 'screenshots')}
      class="px-2.5 py-1 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all {activeTab === 'screenshots' ? 'win98-border-inset bg-gray-200' : 'win98-border-outset bg-win98-surface'}"
    >
      <ImageIcon size={13} class="text-amber-700" />
      <span>Screenshots</span>
    </button>

    <div class="h-4 w-[1px] bg-gray-400 mx-1 hidden sm:block"></div>

    <!-- Reload Button -->
    <button
      type="button"
      onclick={resetApp}
      class="win98-border-outset px-2 py-1 flex items-center gap-1 text-xs cursor-pointer hover:bg-gray-100 active:bg-gray-200"
      title="Reset Runtime State"
    >
      <RotateCcw size={12} />
      <span class="hidden sm:inline">Reset</span>
    </button>

    {#if project.liveUrl}
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="win98-border-outset px-2 py-1 flex items-center gap-1 text-xs cursor-pointer hover:bg-gray-100 text-black no-underline"
      >
        <ExternalLink size={12} />
        <span>Live Web</span>
      </a>
    {/if}
  </div>

  <!-- Win98 Address Bar -->
  <div class="flex items-center gap-2 px-2 py-1 bg-win98-surface border-b border-gray-400 text-[11px]">
    <span class="font-bold text-gray-700">Address:</span>
    <div class="win98-border-inset bg-white px-2 py-0.5 flex-1 flex items-center justify-between overflow-hidden text-ellipsis whitespace-nowrap">
      <span class="text-gray-900 font-mono">C:\Projects\{project.exeName}</span>
      <span class="text-gray-400 font-mono text-[10px] hidden md:inline">[{project.client} • {project.year}]</span>
    </div>
  </div>

  <!-- Main Viewport Area -->
  <div class="flex-1 min-h-0 bg-white win98-border-inset relative overflow-hidden">
    {#key reloadKey}
      {#if activeTab === 'run'}
        <!-- TAB: RUN PROGRAM -->
        {#if project.id === 'cirrust-lite'}
          <CirrustLiteMock />
        {:else if project.liveUrl}
          <iframe 
            src={project.liveUrl} 
            title={project.title}
            class="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms"
          ></iframe>
        {:else}
          <!-- Standalone Launcher Fallback when mock is not yet created -->
          <div class="h-full w-full p-6 sm:p-10 flex flex-col items-center justify-center text-center bg-gray-50 overflow-y-auto">
            <div class="w-16 h-16 win98-border-inset bg-gray-200 flex items-center justify-center mb-4 p-2">
              <img src="/icons/win98/executable.png" alt="" class="w-10 h-10 pixelated" />
            </div>
            <h2 class="text-xl font-bold mb-1">{project.title}</h2>
            <p class="text-xs text-gray-500 mb-4">{project.client} • {project.role}</p>

            <div class="win98-border-inset p-4 bg-white max-w-md w-full text-left text-xs leading-relaxed mb-6 space-y-2">
              <p><strong>Status:</strong> Proprietary Enterprise Application (Confidential Backend).</p>
              <p>{project.description}</p>
              <p class="text-gray-500 text-[11px]">
                Click <strong>"System Specs (.NFO)"</strong> above to inspect technical architecture, or <strong>"Screenshots"</strong> for verified production views.
              </p>
            </div>

            <div class="flex gap-2">
              <button
                type="button"
                onclick={() => (activeTab = 'specs')}
                class="win98-button px-4 py-1.5 font-bold text-xs"
              >
                View Architecture Specs
              </button>
              <button
                type="button"
                onclick={() => (activeTab = 'screenshots')}
                class="win98-button px-4 py-1.5 text-xs"
              >
                Inspect Screenshots
              </button>
            </div>
          </div>
        {/if}

      {:else if activeTab === 'specs'}
        <!-- TAB: SYSTEM SPECS (.NFO) -->
        <div class="h-full w-full p-4 sm:p-6 bg-black text-green-400 font-mono text-xs overflow-y-auto select-text leading-relaxed">
          <pre class="text-[11px] leading-tight text-green-500 mb-4">
======================================================================
  UFEEK OS — SYSTEM SPECIFICATION VIEWER (.NFO)
  APPLICATION: {project.exeName.toUpperCase()}
======================================================================
          </pre>

          <div class="space-y-4 max-w-3xl">
            <div>
              <p class="text-white font-bold text-sm mb-1">[PROJECT OVERVIEW]</p>
              <p class="text-green-300 leading-relaxed">{project.specs.overview}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-green-900 pt-3">
              <div>
                <span class="text-white font-bold block mb-1">CLIENT / ORGANIZATION:</span>
                <span class="text-gray-300">{project.client}</span>
              </div>
              <div>
                <span class="text-white font-bold block mb-1">ROLE & TENURE:</span>
                <span class="text-gray-300">{project.role} ({project.year})</span>
              </div>
            </div>

            <div class="border-t border-green-900 pt-3">
              <p class="text-white font-bold mb-2">[KEY ENGINEERING ACHIEVEMENTS & SOLUTIONS]</p>
              <ul class="space-y-1.5">
                {#each project.specs.highlights as highlight}
                  <li class="flex items-start gap-2">
                    <span class="text-green-400 font-bold">&gt;</span>
                    <span class="text-green-200">{highlight}</span>
                  </li>
                {/each}
              </ul>
            </div>

            {#if project.specs.metrics && project.specs.metrics.length > 0}
              <div class="border-t border-green-900 pt-3">
                <p class="text-white font-bold mb-2">[VERIFIED METRICS & BUSINESS IMPACT]</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {#each project.specs.metrics as metric}
                    <div class="bg-green-950/40 border border-green-800 p-2 text-green-300 flex items-center gap-2">
                      <CheckCircle2 size={13} class="text-green-400 flex-shrink-0" />
                      <span>{metric}</span>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}

            <div class="border-t border-green-900 pt-3">
              <p class="text-white font-bold mb-2">[DYNAMIC LINK LIBRARIES (.DLL / DEPENDENCIES)]</p>
              <div class="flex flex-wrap gap-1.5">
                {#each project.technologies as tech}
                  <span class="bg-gray-800 text-white px-2 py-0.5 text-[11px] border border-gray-600">
                    {tech}.dll
                  </span>
                {/each}
              </div>
            </div>
          </div>
        </div>

      {:else if activeTab === 'screenshots'}
        <!-- TAB: SCREENSHOTS GALLERY -->
        <div class="h-full w-full p-4 sm:p-6 bg-gray-200 overflow-y-auto flex flex-col items-center">
          <div class="w-full max-w-4xl bg-white win98-border-inset p-2 shadow">
            <div class="mb-2 text-xs font-bold text-gray-700 flex justify-between items-center px-1">
              <span>Preview: {project.title} Production Screen</span>
              <span class="text-gray-500 font-mono text-[10px]">100% Native Resolution</span>
            </div>
            <img 
              src={project.details || project.image} 
              alt={project.title}
              class="w-full h-auto object-contain win98-border-inset"
            />
          </div>
        </div>
      {/if}
    {/key}
  </div>

  <!-- Win98 Status Bar -->
  <div class="bg-win98-surface px-2 py-0.5 border-t border-gray-400 flex items-center justify-between text-[11px] text-gray-700">
    <div class="flex items-center gap-1.5">
      <span class="w-2 h-2 rounded-full {activeTab === 'run' ? 'bg-green-600 animate-pulse' : 'bg-blue-600'}"></span>
      <span>State: {activeTab === 'run' ? 'Executable Running (200 OK)' : activeTab.toUpperCase()}</span>
    </div>
    <div class="flex items-center gap-3">
      <span class="hidden sm:inline">Framework: {project.technologies[0]}</span>
      <span>Runtime: Svelte 5 Sandboxed</span>
    </div>
  </div>
</div>
