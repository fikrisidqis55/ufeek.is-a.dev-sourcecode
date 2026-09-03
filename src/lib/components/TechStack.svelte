<script lang="ts">
  import Icon from "@iconify/svelte";

  const skills = [
    { name: "React", icon: "fa6-brands:react" },
    { name: "Next.js", icon: "simple-icons:nextdotjs" },
    { name: "Node.js", icon: "fa6-brands:node-js" },
    { name: "TypeScript", icon: "simple-icons:typescript" },
    { name: "JavaScript", icon: "fa6-brands:js" },
    { name: "Tailwind CSS", icon: "simple-icons:tailwindcss" },
    { name: "Database", icon: "fa6-solid:database" },
    { name: "HTML5", icon: "fa6-brands:html5" },
    { name: "CSS3", icon: "fa6-brands:css3-alt" },
    { name: "Git", icon: "fa6-brands:git-alt" },
  ];
</script>

<section id="tech-stack" class="relative pt-24">
  <!-- Perspective Grid Background -->
  <div class="perspective-grid overflow-hidden"></div>

  <!-- Dot Pattern Background -->
  <div
    class="absolute inset-0 opacity-10"
    style="background-image: radial-gradient(#FF00FF 1px, transparent 1px); background-size: 20px 20px;"
  ></div>

  <div class="container mx-auto px-6 relative z-10">
    <h2 class="text-4xl md:text-5xl font-heading font-black mb-4 text-center uppercase text-tertiary vaporwave-glow-orange">
      Tech Stack & Skills
    </h2>
    <p class="text-center mb-12 max-w-2xl mx-auto font-mono text-foreground/70">
      The technologies and tools I use to bring ideas to life
    </p>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
      {#each skills as skill}
        <div
          class="flex flex-col items-center p-6 border border-primary/30 border-t-2 border-t-tertiary bg-card/80 backdrop-blur-md rounded-none transition-all group hover:-translate-y-2 hover:shadow-neon-orange"
        >
          <div class="text-5xl mb-4 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110 text-tertiary flex items-center justify-center h-14 w-14">
            <Icon icon={skill.icon} class="w-12 h-12" />
          </div>
          <p class="text-lg font-mono uppercase tracking-wider transition-colors text-foreground group-hover:text-tertiary">
            {skill.name}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>
