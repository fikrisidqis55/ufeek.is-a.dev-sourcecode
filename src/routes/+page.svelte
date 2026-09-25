<script lang="ts">
  import AboutMe from "$lib/components/AboutMe.svelte";
  import Experience from "$lib/components/Experience.svelte";
  import TechStack from "$lib/components/TechStack.svelte";
  import Projects from "$lib/components/Projects.svelte";
  import Contact from "$lib/components/Contact.svelte";
  import Hero from "$lib/components/Hero.svelte";
  import Doom from "$lib/components/Doom.svelte";
  import GlitchingBackground from "$lib/components/GlitchingBackground.svelte";
  import CursorFollower from "$lib/components/CursorFollower.svelte";
  
  import DesktopIcon from "$lib/components/os/DesktopIcon.svelte";
  import Window from "$lib/components/os/Window.svelte";
  import { onMount } from "svelte";
  import { osState } from "$lib/stores/osState.svelte";

  onMount(() => {
    // Open a default welcome window
    if (osState.windows.length === 0) {
      osState.openWindow({ id: 'welcome', title: 'Welcome to ufeek OS', icon: '💻', x: 50, y: 10 });
    }
  });

  const desktopIcons = [
    { id: 'welcome', title: 'My Computer', icon: '💻', x: 20, y: 20 },
    { id: 'about', title: 'About Me', icon: '📝', x: 20, y: 120 },
    { id: 'experience', title: 'Experience', icon: '📈', x: 20, y: 220 },
    { id: 'techstack', title: 'Tech Stack', icon: '⚙️', x: 20, y: 320 },
    { id: 'projects', title: 'Projects', icon: '📂', x: 20, y: 420 },
    { id: 'contact', title: 'Contact', icon: '✉️', x: 20, y: 520 },
    { id: 'doom', title: 'DOOM.EXE', icon: '💀', x: 20, y: 620 },
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
<div class="fixed inset-0 overflow-hidden bg-win98-bg select-none" role="presentation" onclick={() => {
    // Clicking desktop clears icon selection
    osState.selectIcon(null);
}}>
  <GlitchingBackground />
  <CursorFollower />

  <!-- Desktop Icons -->
  {#each desktopIcons as icon}
    <DesktopIcon {...icon} windowId={icon.id} />
  {/each}

  <!-- Windows -->
  <Window windowId="welcome">
    <div class="h-[500px] w-full flex items-center justify-center p-4" style="background: var(--background);">
      <Hero />
    </div>
  </Window>

  <Window windowId="about">
    <div class="p-4" style="background: var(--background);">
        <AboutMe />
    </div>
  </Window>

  <Window windowId="experience">
    <div class="p-4" style="background: var(--background);">
        <Experience />
    </div>
  </Window>

  <Window windowId="techstack">
    <div class="p-4" style="background: var(--background);">
        <TechStack />
    </div>
  </Window>

  <Window windowId="projects">
    <div class="p-4" style="background: var(--background);">
        <Projects />
    </div>
  </Window>

  <Window windowId="contact">
    <div class="p-4" style="background: var(--background);">
        <Contact />
    </div>
  </Window>

  <Window windowId="doom">
    <div class="h-full w-full flex flex-col min-h-0">
      <Doom />
    </div>
  </Window>
</div>
