<script lang="ts">
  import { FileText } from "@lucide/svelte";

  const resumeUrl = import.meta.env.PUBLIC_RESUME_URL || "";

  function scrollToSection(id: string) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }
</script>

<section
  id="hero"
  class="min-h-screen flex flex-col justify-center items-center text-foreground relative overflow-hidden"
>
  <!-- Floating Sun Background -->
  <div class="floating-sun"></div>

  <div class="z-10 text-center px-6 max-w-5xl animate-in fade-in duration-1000">
    <h1
      class="text-5xl md:text-7xl lg:text-9xl font-heading font-black mb-4 glitch-text text-white tracking-tight uppercase"
      style="text-shadow: 0 0 10px rgba(255,255,255,0.5), 0 0 30px rgba(255,0,255,0.6);"
    >
      UFEEK
    </h1>

    <p
      class="text-4xl md:text-6xl lg:text-7xl font-heading font-bold glitch-text-orange-pink vaporwave-gradient-text tracking-wider uppercase"
    >
      Software Engineer
    </p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center mt-12">
      <button
        on:click={() => scrollToSection("projects")}
        class="group relative px-8 py-4 h-14 border-2 border-secondary bg-transparent text-secondary font-mono uppercase tracking-wider rounded-none -skew-x-12 transition-all duration-200 ease-linear hover:skew-x-0 hover:bg-secondary hover:text-black hover:shadow-neon-cyan"
        type="button"
      >
        <span class="inline-block skew-x-12 group-hover:skew-x-0 transition-transform duration-200">
          View My Work
        </span>
      </button>

      {#if resumeUrl}
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="group relative px-8 py-4 h-14 border-2 border-primary bg-transparent text-primary font-mono uppercase tracking-wider rounded-none -skew-x-12 transition-all duration-200 ease-linear hover:skew-x-0 hover:bg-primary hover:text-white hover:shadow-neon-magenta flex items-center justify-center gap-2"
        >
          <span class="inline-block skew-x-12 group-hover:skew-x-0 transition-transform duration-200">
            View Resume
          </span>
          <FileText
            size={18}
            class="inline-block skew-x-12 group-hover:skew-x-0 transition-transform duration-200"
          />
        </a>
      {/if}

      <button
        on:click={() => scrollToSection("contact")}
        class="group relative px-8 py-4 h-14 border-2 border-tertiary bg-tertiary text-black font-mono uppercase tracking-wider rounded-none -skew-x-12 transition-all duration-200 ease-linear hover:skew-x-0 hover:scale-105 hover:opacity-90 hover:shadow-neon-orange"
        type="button"
      >
        <span class="inline-block skew-x-12 group-hover:skew-x-0 transition-transform duration-200">
          Contact Me
        </span>
      </button>
    </div>
  </div>
</section>
