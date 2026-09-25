<script lang="ts">
  const experiences = [
    {
      title: "Frontend Web Developer",
      company: "Quadrant Synergy International",
      date: "June 2022 - Present",
      description:
        "Developing web applications using React.js and Next.js. Reworking old applications with modern tech stack.",
      icon: "/icons/win98/network.png"
    },
    {
      title: "Backend Developer",
      company: "Quadrant Synergy International",
      date: "Des 2020 - June 2022",
      description:
        "Developing APIs for Agent Recruitment Applications (My Zurich Advisor & MiRecruit).",
      icon: "/icons/win98/techstack.png"
    },
    {
      title: "Back End Developer (Intern)",
      company: "Telkom Indonesia",
      date: "Oct 2019 - Mar 2020",
      description:
        "Created several APIs and integrated them with NoSQL databases.",
      icon: "/icons/win98/executable.png"
    },
  ];
</script>

<div class="h-full w-full bg-win98-surface p-4 flex flex-col gap-4 text-black">
  <div class="flex gap-2 items-center mb-2">
    <img src="/icons/win98/experience.png" alt="" class="w-8 h-8 select-none pointer-events-none" style="image-rendering: pixelated;" />
    <h2 class="text-2xl font-bold">Professional Experience</h2>
  </div>

  <div class="win98-border-inset bg-white p-4 overflow-y-auto flex-1 flex flex-col gap-6">
    {#each experiences as experience}
      <fieldset class="border-2 border-gray-400 p-4 relative pt-6 group">
        <legend class="px-2 text-sm font-bold bg-white ml-2 text-gray-800">
          {experience.title}
        </legend>
        
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center">
            <img src={experience.icon} alt="" class="w-8 h-8 select-none pointer-events-none" style="image-rendering: pixelated;" />
          </div>
          <div class="flex-1 flex flex-col gap-2">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 pb-2 gap-1 sm:gap-0">
              <span class="font-bold text-base text-win98-title-active">{experience.company}</span>
              <span class="bg-gray-200 px-2 py-1 text-xs border border-gray-400 self-start sm:self-auto">{experience.date}</span>
            </div>
            <p class="text-sm pt-1 leading-relaxed">
              {experience.description}
            </p>
          </div>
        </div>
      </fieldset>
    {/each}
  </div>
</div>
