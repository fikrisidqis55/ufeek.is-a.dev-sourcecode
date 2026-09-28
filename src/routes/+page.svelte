<script lang="ts">
  import AboutMe from "$lib/components/AboutMe.svelte";
  import Experience from "$lib/components/Experience.svelte";
  import TechStack from "$lib/components/TechStack.svelte";
  import Projects from "$lib/components/Projects.svelte";
  import Contact from "$lib/components/Contact.svelte";
  import Hero from "$lib/components/Hero.svelte";
  import Doom from "$lib/components/Doom.svelte";
  import WillRemember from "$lib/components/will-remember/WillRemember.svelte";
  import GlitchingBackground from "$lib/components/GlitchingBackground.svelte";
  import CursorFollower from "$lib/components/CursorFollower.svelte";
  
  import DesktopIcon from "$lib/components/os/DesktopIcon.svelte";
  import DesktopContextMenu from "$lib/components/os/DesktopContextMenu.svelte";
  import Window from "$lib/components/os/Window.svelte";
  import AppRunner from "$lib/components/os/AppRunner.svelte";
  import { onMount } from "svelte";
  import { osState } from "$lib/stores/osState.svelte";

  onMount(() => {
    // Open a default welcome window centered at any resolution
    if (osState.windows.length === 0) {
      osState.openWindow({ 
        id: 'welcome', 
        title: 'Welcome to ufeek OS', 
        icon: '/icons/win98/computer.png', 
        center: true, 
        width: 520 
      });
    }
  });
</script>

<svelte:head>
  <title>ufeek | Software Engineer</title>
  <meta
    name="description"
    content="Personal portfolio of Fikri Sidqi, Software Engineer specializing in web development"
  />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<!-- Desktop Environment -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div 
  class="fixed inset-0 overflow-hidden bg-win98-bg select-none overscroll-none" 
  role="presentation" 
  onclick={() => {
    // Clicking desktop clears icon selection & context menu
    osState.selectIcon(null);
    osState.closeDesktopContextMenu();
  }}
  oncontextmenu={(e) => {
    e.preventDefault();
    osState.openDesktopContextMenu(e.clientX, e.clientY);
  }}
>
  <GlitchingBackground />
  <CursorFollower />

  <!-- Desktop Icons -->
  {#if osState.isMobile}
    <div class="absolute inset-0 p-4 pb-14 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-3 place-items-center auto-rows-max z-0">
      {#each osState.desktopIcons as icon (icon.id)}
        <DesktopIcon {...icon} windowId={icon.id} />
      {/each}
    </div>
  {:else}
    <!-- Snap to Grid Target Ghost Preview -->
    {#if osState.draggedIconId && osState.snapPreview}
      <div 
        class="absolute border border-dashed border-white/70 bg-white/10 pointer-events-none z-[5]"
        style="left: {osState.snapPreview.x}px; top: {osState.snapPreview.y}px; width: 80px; height: 84px;"
      ></div>
    {/if}

    {#each osState.desktopIcons as icon (icon.id)}
      <DesktopIcon {...icon} windowId={icon.id} />
    {/each}
  {/if}

  <!-- Desktop Context Menu (Right Click) -->
  <DesktopContextMenu />

  <!-- Windows -->
  <Window windowId="welcome">
    <div class="h-full w-full flex items-center justify-center p-2 sm:p-4 bg-win98-surface">
      <Hero />
    </div>
  </Window>

  <Window windowId="about">
    <div class="h-full w-full flex flex-col min-h-0 bg-win98-surface">
        <AboutMe />
    </div>
  </Window>

  <Window windowId="experience">
    <div class="h-full w-full flex flex-col min-h-0 bg-win98-surface">
        <Experience />
    </div>
  </Window>

  <Window windowId="techstack">
    <div class="h-full w-full flex flex-col min-h-0 bg-win98-surface">
        <TechStack />
    </div>
  </Window>

  <Window windowId="projects">
    <div class="h-full w-full flex flex-col min-h-0 bg-win98-surface">
        <Projects />
    </div>
  </Window>

  <Window windowId="contact">
    <div class="h-full w-full flex flex-col min-h-0 bg-win98-surface">
        <Contact />
    </div>
  </Window>

  <Window windowId="doom">
    <div class="h-full w-full flex flex-col min-h-0">
      <Doom />
    </div>
  </Window>

  <Window windowId="will-remember">
    <div class="h-full w-full flex flex-col min-h-0">
      <WillRemember />
    </div>
  </Window>

  <!-- Dynamic Project Executable Runner Windows -->
  {#each osState.windows.filter(w => w.id.startsWith('app-')) as appWin (appWin.id)}
    <Window windowId={appWin.id}>
      <AppRunner projectId={appWin.id.replace('app-', '')} />
    </Window>
  {/each}
</div>
