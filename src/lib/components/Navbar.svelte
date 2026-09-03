<script lang="ts">
  import { onMount } from "svelte";
  import { slide, fade } from "svelte/transition";
  import { Menu, X } from "@lucide/svelte";

  let activeSection: string = "hero";
  let scrolled: boolean = false;
  let mobileMenuOpen: boolean = false;

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Skills", href: "#tech-stack" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 50;

      const sections = [
        "hero",
        "about",
        "experience",
        "tech-stack",
        "projects",
        "contact",
      ];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 100) {
          activeSection = section;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<nav
  class={`fixed top-0 w-full z-50 transition-all duration-300 ${
    scrolled
      ? "bg-card/90 backdrop-blur-md shadow-neon-cyan border-b-2 border-secondary/30 py-3"
      : "bg-transparent py-5"
  }`}
>
  <div class="container mx-auto flex justify-between items-center px-6">
    <a
      href="/"
      class="text-2xl font-heading font-bold font-mono text-tertiary hover:text-tertiary/80 transition-colors glitch-text-orange-small vaporwave-glow-orange uppercase tracking-wider"
    >
      ufeek.is-a.dev
    </a>

    <ul class="hidden md:flex space-x-8">
      {#each navLinks as link}
        <li>
          <a
            href={link.href}
            class={`font-mono uppercase tracking-wider glitch-text-orange-pink-small transition-colors relative ${
              activeSection === link.href.substring(1)
                ? "text-secondary font-medium vaporwave-glow-cyan"
                : "text-foreground/70 hover:text-secondary"
            }`}
          >
            {link.name}
            {#if activeSection === link.href.substring(1)}
              <span
                class="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary shadow-[0_0_10px_#00FFFF] transition-all"
              ></span>
            {/if}
          </a>
        </li>
      {/each}
    </ul>

    <button
      class="md:hidden text-secondary hover:text-secondary/80 transition-colors"
      on:click={toggleMobileMenu}
      aria-label="Toggle menu"
      type="button"
    >
      {#if mobileMenuOpen}
        <X size={24} />
      {:else}
        <Menu size={24} />
      {/if}
    </button>
  </div>
</nav>

{#if mobileMenuOpen}
  <div
    transition:slide={{ duration: 300 }}
    class="fixed inset-0 bg-card/95 backdrop-blur-md z-40 md:hidden flex flex-col pt-24 px-6 border-r-2 border-secondary/30"
  >
    <ul class="flex flex-col space-y-6 items-center">
      {#each navLinks as link}
        <li in:fade={{ delay: 100 }}>
          <a
            href={link.href}
            class={`text-xl font-mono uppercase tracking-wider transition-colors ${
              activeSection === link.href.substring(1)
                ? "text-secondary font-medium vaporwave-glow-cyan"
                : "text-foreground/70"
            }`}
            on:click={closeMobileMenu}
          >
            {link.name}
          </a>
        </li>
      {/each}
    </ul>
  </div>
{/if}
