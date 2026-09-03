<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";
  import Hero from "$lib/components/Hero.svelte";
  import AboutMe from "$lib/components/AboutMe.svelte";
  import Experience from "$lib/components/Experience.svelte";
  import TechStack from "$lib/components/TechStack.svelte";
  import Projects from "$lib/components/Projects.svelte";
  import Contact from "$lib/components/Contact.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import GlitchingBackground from "$lib/components/GlitchingBackground.svelte";
  import CursorFollower from "$lib/components/CursorFollower.svelte";
</script>

<svelte:head>
  <title>ufeek | Software Engineer</title>
  <meta
    name="description"
    content="Personal portfolio of Fikri Sidqi, Software Engineer specializing in web development"
  />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="relative z-10">
  <GlitchingBackground />
  <CursorFollower />
  <Navbar />
  <Hero />
  <div class="flex flex-col items-center justify-center">
    <AboutMe />
    <Experience />
    <TechStack />
    <Projects />
    <Contact />
  </div>
  <Footer />
</div>
