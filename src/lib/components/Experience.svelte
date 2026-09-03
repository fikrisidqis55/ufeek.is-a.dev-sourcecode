<script lang="ts">
  import { onMount } from "svelte";
  import DraggableWrapper from "./DraggableWrapper.svelte";

  const experiences = [
    {
      title: "Frontend Web Developer",
      company: "Quadrant Synergy International",
      date: "June 2022 - Present",
      description:
        "Developing web applications using React.js and Next.js. Reworking old applications with modern tech stack.",
    },
    {
      title: "Backend Developer",
      company: "Quadrant Synergy International",
      date: "Des 2020 - June 2022",
      description:
        "Developing APIs for Agent Recruitment Applications (My Zurich Advisor & MiRecruit).",
    },
    {
      title: "Back End Developer (Intern)",
      company: "Telkom Indonesia",
      date: "Oct 2019 - Mar 2020",
      description:
        "Created several APIs and integrated them with NoSQL databases.",
    },
  ];

  let isMobile: boolean = true;

  onMount(() => {
    const checkMobile = () => {
      isMobile = window.innerWidth < 768;
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  });
</script>

<section id="experience" class="relative w-full h-fit pt-24">
  <div class="px-6 relative z-10 max-w-6xl mx-auto w-full">
    <h2 class="text-4xl md:text-5xl font-heading font-black text-center mb-8 uppercase text-tertiary vaporwave-glow-orange">
      Experience
    </h2>
    <div class="flex flex-col md:flex-row md:flex-wrap gap-y-6 md:gap-x-6 w-full">
      {#each experiences as experience (experience.title + experience.company)}
        <DraggableWrapper
          className="w-full md:flex-1 md:min-w-0 md:max-w-[calc(50%-12px)] lg:max-w-[calc(33.333%-16px)]"
          disabled={isMobile}
        >
          <div class="border border-primary/30 border-t-2 border-t-tertiary bg-card/80 backdrop-blur-md text-foreground px-4 py-6 min-h-[200px] overflow-y-auto w-full min-w-0 gap-y-2 flex flex-col rounded-none hover:shadow-neon-orange transition-all">
            <h3 class="text-lg font-heading font-bold uppercase text-tertiary vaporwave-glow-orange break-words">
              {experience.title}
            </h3>
            <h4 class="text-sm font-mono font-semibold uppercase tracking-wider text-foreground/90 break-words">
              {experience.company}
            </h4>
            <span class="text-xs font-mono font-extralight text-foreground/60">
              {experience.date}
            </span>
            <p class="text-sm font-mono font-light text-foreground/80 break-words">
              {experience.description}
            </p>
          </div>
        </DraggableWrapper>
      {/each}
    </div>
  </div>
</section>
