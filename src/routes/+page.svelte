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

  const desktopIcons = [
    { id: 'welcome', title: 'My Computer', icon: '/icons/win98/computer.png', x: 20, y: 20 },
    { id: 'about', title: 'About Me', icon: '/icons/win98/about.png', x: 20, y: 120 },
    { id: 'experience', title: 'Experience', icon: '/icons/win98/experience.png', x: 20, y: 220 },
    { id: 'techstack', title: 'Tech Stack', icon: '/icons/win98/techstack.png', x: 20, y: 320 },
    { id: 'projects', title: 'Projects', icon: '/icons/win98/projects.png', x: 20, y: 420 },
    { id: 'contact', title: 'Contact', icon: '/icons/win98/contact.png', x: 20, y: 520 },
    { id: 'doom', title: 'DOOM.EXE', icon: '/icons/win98/doom.png', x: 20, y: 620 },
    { id: 'will-remember', title: 'will-remember', icon: '/icons/win98/notepad.png', x: 120, y: 20 },
    { id: 'app-cirrust-lite', title: 'Cirrust Lite.exe', icon: '/icons/win98/executable.png', x: 120, y: 120 },
    { id: 'app-liriq-rfid', title: 'Liriq RFID.exe', icon: '/icons/win98/executable.png', x: 120, y: 220 },
    { id: 'app-kansai-custom', title: 'Kansai.exe', icon: '/icons/win98/executable.png', x: 120, y: 320 },
    { id: 'app-bpn-ekantah', title: 'E-Kantah.exe', icon: '/icons/win98/executable.png', x: 120, y: 420 },
  ];
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
<div class="fixed inset-0 overflow-hidden bg-win98-bg select-none overscroll-none" role="presentation" onclick={() => {
    // Clicking desktop clears icon selection
    osState.selectIcon(null);
}}>
  <GlitchingBackground />
  <CursorFollower />

  <!-- Desktop Icons -->
  {#if osState.isMobile}
    <div class="absolute inset-0 p-4 pb-14 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-3 place-items-center auto-rows-max z-0">
      {#each desktopIcons as icon}
        <DesktopIcon {...icon} windowId={icon.id} />
      {/each}
    </div>
  {:else}
    {#each desktopIcons as icon}
      <DesktopIcon {...icon} windowId={icon.id} />
    {/each}
  {/if}

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
