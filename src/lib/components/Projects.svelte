<script lang="ts">
  import { projectsList, type ProjectExecutable } from "$lib/data/projects";
  import { osState } from "$lib/stores/osState.svelte";
  import { Play, FileText, ArrowLeft, CheckCircle2, Sparkles } from "lucide-svelte";

  let selectedProject = $state<ProjectExecutable | null>(null);

  function launchProject(project: ProjectExecutable) {
    const appId = `app-${project.id}`;
    osState.openWindow({
      id: appId,
      title: `${project.exeName} - ${project.title}`,
      icon: project.icon,
      width: 960,
      height: 680,
      center: true
    });
    osState.focusWindow(appId);
    setTimeout(() => {
      osState.focusWindow(appId);
    }, 20);
  }

  let lastClickTime = 0;
  let clickedId: string | null = null;

  function handleIconClick(project: ProjectExecutable, e?: MouseEvent) {
    if (e) e.stopPropagation();
    const now = Date.now();
    if (osState.isMobile) {
      // On mobile, single tap opens details, with option to run
      selectedProject = project;
      return;
    }

    // On desktop: double-click launches .exe directly, single click selects for preview
    if (clickedId === project.id && now - lastClickTime < 350) {
      launchProject(project);
    } else {
      selectedProject = project;
    }
    lastClickTime = now;
    clickedId = project.id;
  }
</script>

<div class="h-full w-full bg-white flex flex-col text-black font-[Tahoma,sans-serif]">
  {#if !selectedProject}
    <!-- Explorer Address & Information Toolbar -->
    <div class="flex items-center justify-between p-1 bg-win98-surface win98-border-outset mb-1 text-xs">
      <div class="flex items-center gap-2 px-2">
        <span class="font-bold">Address:</span>
        <span class="font-mono bg-white px-2 py-0.5 win98-border-inset">C:\Projects\</span>
      </div>
      <div class="text-[11px] text-gray-600 italic px-2 hidden sm:block">
        {osState.isMobile ? "Tap an executable to view details" : "Double-click executable to execute"}
      </div>
    </div>

    <!-- Explorer Grid -->
    <div class="flex-1 overflow-y-auto win98-border-inset bg-white p-3 sm:p-5">
      <div class="grid grid-cols-3 sm:grid-cols-4 md:flex md:flex-wrap gap-4 sm:gap-8 justify-items-center">
        {#each projectsList as project}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div 
            class="flex flex-col items-center gap-1.5 w-20 sm:w-28 cursor-pointer group active:scale-95 transition-transform relative p-1 rounded hover:bg-blue-50/50"
            onclick={() => handleIconClick(project)}
          >
            {#if project.hasMock}
              <div class="absolute -top-1 -right-1 bg-amber-400 text-black text-[9px] font-bold px-1 rounded-sm shadow-sm flex items-center gap-0.5 border border-amber-600">
                <Sparkles size={8} />
                <span>MOCK</span>
              </div>
            {/if}

            <div class="w-12 h-12 flex items-center justify-center group-active:brightness-75">
              <img 
                src="/icons/win98/executable.png" 
                alt="" 
                class="w-9 h-9 select-none pointer-events-none" 
                style="image-rendering: pixelated;" 
              />
            </div>
            <span class="text-xs text-center px-1 leading-tight group-hover:underline group-active:bg-win98-title-active group-active:text-white line-clamp-2">
              {project.exeName}
            </span>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <!-- Project Details & Launcher View -->
    <div class="flex-1 flex flex-col bg-win98-surface p-2 overflow-hidden">
      <!-- Top Navigation & Action Bar -->
      <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <button 
          class="win98-button flex items-center gap-1.5 font-bold px-3 py-1 text-xs" 
          onclick={() => (selectedProject = null)}
          type="button"
        >
          <ArrowLeft size={13} />
          <span>Back to C:\Projects</span>
        </button>

        <!-- Prominent Launch / Run Executable Button -->
        <button
          type="button"
          onmousedown={(e) => e.stopPropagation()}
          onclick={(e) => {
            e.stopPropagation();
            if (selectedProject) launchProject(selectedProject);
          }}
          class="win98-button bg-green-100 hover:bg-green-200 border-2 font-bold px-4 py-1 text-xs flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Play size={13} class="text-green-700 fill-green-700" />
          <span>Launch {selectedProject.exeName}</span>
          {#if selectedProject.hasMock}
            <span class="bg-amber-400 text-black text-[10px] px-1 py-0.2 rounded font-mono font-bold">Interactive</span>
          {/if}
        </button>
      </div>

      <!-- Main Content Details Pane -->
      <div class="flex-1 win98-border-inset bg-white p-4 overflow-y-auto flex flex-col gap-4">
        <div class="flex gap-4 items-start border-b border-gray-300 pb-4">
          <img 
            src="/icons/win98/executable.png" 
            alt="" 
            class="w-12 h-12 select-none pointer-events-none flex-shrink-0" 
            style="image-rendering: pixelated;" 
          />
          <div class="flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-xl sm:text-2xl font-bold">{selectedProject.title}</h2>
              <span class="text-xs bg-gray-200 px-2 py-0.5 win98-border-outset font-mono font-semibold">
                {selectedProject.exeName}
              </span>
              {#if selectedProject.hasMock}
                <span class="bg-teal-600 text-white text-[11px] px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Interactive Sandbox Ready</span>
                </span>
              {/if}
            </div>
            <p class="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">{selectedProject.description}</p>
            <p class="text-xs text-gray-500 mt-0.5 font-mono">
              Client: <strong>{selectedProject.client}</strong> • Role: <strong>{selectedProject.role}</strong> ({selectedProject.year})
            </p>
          </div>
        </div>

        <!-- Screenshot Preview -->
        <div class="win98-border-inset p-1.5 bg-gray-100 flex flex-col items-center">
          <div class="w-full flex justify-between items-center text-[11px] text-gray-500 mb-1 px-1">
            <span>Verified Screen Capture</span>
            <button 
              type="button" 
              onmousedown={(e) => e.stopPropagation()}
              onclick={(e) => {
                e.stopPropagation();
                if (selectedProject) launchProject(selectedProject);
              }}
              class="text-blue-700 hover:underline font-semibold cursor-pointer"
            >
              [▶ Execute in AppRunner Window]
            </button>
          </div>
          <img 
            src={selectedProject.details || selectedProject.image} 
            alt={selectedProject.title} 
            class="w-full h-auto max-h-[360px] object-contain win98-border-inset bg-white"
            onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
          />
        </div>

        <!-- Specifications and Highlights -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <fieldset class="border-2 border-gray-400 p-3">
            <legend class="px-2 text-xs font-bold bg-white text-gray-800 ml-2">Architecture Highlights</legend>
            <ul class="text-xs space-y-1.5 pt-1 text-gray-700">
              {#each selectedProject.specs.highlights as item}
                <li class="flex items-start gap-1.5">
                  <span class="text-win98-title-active font-bold">▪</span>
                  <span>{item}</span>
                </li>
              {/each}
            </ul>
          </fieldset>

          <fieldset class="border-2 border-gray-400 p-3">
            <legend class="px-2 text-xs font-bold bg-white text-gray-800 ml-2">Dependencies (.dll)</legend>
            <div class="flex flex-wrap gap-1.5 pt-1">
              {#each selectedProject.technologies as tech}
                <div class="flex items-center gap-1 bg-gray-200 win98-border-outset px-2 py-1 text-[11px]">
                  <img src="/icons/win98/techstack.png" alt="" class="w-3.5 h-3.5 select-none pointer-events-none" style="image-rendering: pixelated;" />
                  <span>{tech}</span>
                </div>
              {/each}
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  {/if}
</div>
