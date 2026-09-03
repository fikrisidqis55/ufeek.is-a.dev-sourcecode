<script lang="ts">
  import { Mail, ArrowUp } from "@lucide/svelte";
  import Icon from "@iconify/svelte";

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const currentYear = new Date().getFullYear();
</script>

<footer class="bg-card/80 backdrop-blur-md text-foreground/70 py-12 border-t-2 border-secondary/30 z-12 relative mt-10">
  <div class="container mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="md:col-span-2">
        <a
          href="/"
          class="text-2xl font-heading font-bold text-secondary hover:text-secondary/80 transition-colors glitch-text-orange-small vaporwave-glow-cyan uppercase tracking-wider"
        >
          ufeek.is-a.dev
        </a>
        <p class="mt-4 max-w-md font-mono text-foreground/70">
          Software Engineer specializing in creating exceptional digital
          experiences with modern web technologies.
        </p>
      </div>
      <div>
        <h3 class="text-lg font-heading font-semibold text-secondary mb-4 uppercase tracking-wider vaporwave-glow-cyan">
          Quick Links
        </h3>
        <ul class="space-y-2 font-mono uppercase tracking-wider">
          <li>
            <a
              href="#about"
              class="hover:text-secondary transition-colors text-foreground/70 hover:underline"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#experience"
              class="hover:text-secondary transition-colors text-foreground/70 hover:underline"
            >
              Experience
            </a>
          </li>
          <li>
            <a
              href="#tech-stack"
              class="hover:text-secondary transition-colors text-foreground/70 hover:underline"
            >
              Skills
            </a>
          </li>
          <li>
            <a
              href="#projects"
              class="hover:text-secondary transition-colors text-foreground/70 hover:underline"
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="#contact"
              class="hover:text-secondary transition-colors text-foreground/70 hover:underline"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-heading font-semibold text-secondary mb-4 uppercase tracking-wider vaporwave-glow-cyan">
          Contact
        </h3>
        <ul class="space-y-2 font-mono text-sm">
          <li class="flex items-center gap-2 text-foreground/70">
            <Mail size={16} class="text-secondary" />
            <a
              href="mailto:fikrisidqis55@gmail.com"
              class="transition-colors hover:text-secondary"
            >
              fikrisidqis55@gmail.com
            </a>
          </li>
          <li class="flex items-center gap-2 text-foreground/70">
            <Icon icon="simple-icons:linkedin" class="w-4 h-4 text-secondary" />
            <a
              href="https://www.linkedin.com/in/fikrisidqi"
              target="_blank"
              rel="noopener noreferrer"
              class="transition-colors hover:text-secondary"
            >
              linkedin.com/in/fikrisidqi
            </a>
          </li>
          <li class="flex items-center gap-2 text-foreground/70">
            <Icon icon="simple-icons:github" class="w-4 h-4 text-secondary" />
            <a
              href="https://github.com/fikrisidqis55"
              target="_blank"
              rel="noopener noreferrer"
              class="transition-colors hover:text-secondary"
            >
              github.com/fikrisidqis55
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t-2 border-secondary/30 my-8"></div>

    <div class="flex flex-col md:flex-row justify-between items-center font-mono text-foreground/60">
      <p>© {currentYear} Fikri Sidqi. All rights reserved.</p>

      <button
        on:click={scrollToTop}
        class="mt-4 md:mt-0 flex items-center gap-2 transition-transform duration-200 hover:-translate-y-1 hover:text-secondary uppercase tracking-wider"
        type="button"
      >
        Back to top <ArrowUp size={16} />
      </button>
    </div>
  </div>
</footer>
