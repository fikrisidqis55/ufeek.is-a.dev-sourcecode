<script lang="ts">
  interface Project {
    title: string;
    description: string;
    image: string;
    details: string;
    technologies?: string[];
  }

  const projects: Project[] = [
    {
      title: "Cirrust Lite",
      description: "Registration portal for Cirrust Lite, the free version of the Cirrust application.",
      image: "/projects/cirrust-lite-form.png",
      details: "/projects/cirrust-lite-form.png",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "React Query"],
    },
    {
      title: "Mirecruit CMS",
      description: "Recruitment platform for Manulife agents.",
      image: "/projects/mirecruit-cms-login.png",
      details: "/projects/mirecruit-cms-dashboard.png",
      technologies: ["Next.js", "TypeScript", "React Query", "ANT Design"],
    },
    {
      title: "Smartcourier",
      description: "Logistics management system for efficient courier tracking.",
      image: "/projects/smartcourier-ccc-login.png",
      details: "/projects/smartcourier-ccc-dashboard.png",
      technologies: ["React.js", "React Query", "ANT Design", "React Redux"],
    },
    {
      title: "Cirrust DMS",
      description: "Cloud-based document management system.",
      image: "/projects/cirrust-dms-login.png",
      details: "/projects/cirrust-dms-dashboard-admin.png",
      technologies: ["Next.js", "TypeScript", "React Query", "Tailwind CSS"],
    },
    {
      title: "Cirrust Workflow",
      description: "Automated approval workflow system.",
      image: "/projects/cirrust-workflow-login.png",
      details: "/projects/cirrust-workflow-dashboard-admin.png",
      technologies: ["Next.js", "TypeScript", "React Query", "Tailwind CSS"],
    },
    {
      title: "Kansai Custom",
      description: "Custom web solution for Kansai using Cirrust Engine",
      image: "/projects/kansai-custompage-form.png",
      details: "/projects/kansai-custompage-form.png",
      technologies: ["Next.js", "TypeScript", "React Query", "Tailwind CSS"],
    },
    {
      title: "E-Kantah BPN",
      description: "E-Registration for Self-Service Land Office.",
      image: "/projects/bpn-landing-page.png",
      details: "/projects/bpn-landing-page.png",
      technologies: ["Next.js", "TypeScript", "React Query", "Tailwind CSS"],
    },
    {
      title: "Impulse Web",
      description: "Business analytics dashboard with real-time insights.",
      image: "/projects/impulse-login.png",
      details: "/projects/impulse-dashboard.png",
      technologies: ["Next.js", "TypeScript", "React Query", "Tailwind CSS"],
    },
    {
      title: "Zurich CMS",
      description: "Admin dashboard for Zurich agents application management.",
      image: "/projects/zurich-cms-dashboard.png",
      details: "/projects/zurich-cms-dashboard.png",
      technologies: ["React", "TypeScript", "React Query", ".Net Core", "SQL Server"],
    },
  ];

  let selectedProject: Project | null = null;
</script>

<div class="h-full w-full bg-white flex flex-col text-black font-[Tahoma,sans-serif]">
  {#if !selectedProject}
    <!-- Toolbar -->
    <div class="flex items-center gap-4 p-1 bg-win98-surface win98-border-outset mb-1">
      <div class="text-sm px-2">C:\Projects\></div>
      <div class="text-xs text-gray-600 italic">Select an executable to view details</div>
    </div>

    <!-- Explorer Grid -->
    <div class="flex-1 overflow-y-auto win98-border-inset bg-white p-4">
      <div class="flex flex-wrap gap-8">
        {#each projects as project}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div 
            class="flex flex-col items-center gap-1 w-24 cursor-pointer group"
            on:click={() => (selectedProject = project)}
          >
            <div class="w-12 h-12 flex items-center justify-center group-active:brightness-75">
              <img src="/icons/win98/executable.png" alt="" class="w-8 h-8 select-none pointer-events-none" style="image-rendering: pixelated;" />
            </div>
            <span class="text-xs text-center px-1 leading-tight group-hover:underline group-active:bg-win98-title-active group-active:text-white">
              {project.title}.exe
            </span>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <!-- Project Details View -->
    <div class="flex-1 flex flex-col bg-win98-surface p-2">
      <!-- Top Menu Bar -->
      <div class="flex gap-2 mb-2">
        <button class="win98-button flex items-center gap-1 font-bold" on:click={() => selectedProject = null}>
          ⬅ Back
        </button>
      </div>

      <!-- Main Content -->
      <div class="flex-1 win98-border-inset bg-white p-4 overflow-y-auto flex flex-col gap-4">
        <div class="flex gap-4 items-start border-b border-gray-300 pb-4">
          <img src="/icons/win98/executable.png" alt="" class="w-12 h-12 select-none pointer-events-none flex-shrink-0" style="image-rendering: pixelated;" />
          <div>
            <h2 class="text-2xl font-bold">{selectedProject.title}</h2>
            <p class="text-sm text-gray-600 mt-1">{selectedProject.description}</p>
          </div>
        </div>

        <div class="win98-border-inset p-1 bg-gray-200">
          <!-- We can use the image as a screenshot preview -->
          <img 
            src={selectedProject.details || selectedProject.image} 
            alt={selectedProject.title} 
            class="w-full h-auto object-contain win98-border-inset bg-white"
            on:error={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
          />
        </div>

        {#if selectedProject.technologies}
          <fieldset class="border-2 border-gray-400 p-2 mt-2">
            <legend class="px-2 text-sm font-bold bg-white text-gray-800 ml-2">Dependencies (.dll)</legend>
            <div class="flex flex-wrap gap-2 pt-2">
              {#each selectedProject.technologies as tech}
                <div class="flex items-center gap-1.5 bg-gray-200 win98-border-outset px-2 py-1 text-xs">
                  <img src="/icons/win98/techstack.png" alt="" class="w-3.5 h-3.5 select-none pointer-events-none" style="image-rendering: pixelated;" />
                  <span>{tech}</span>
                </div>
              {/each}
            </div>
          </fieldset>
        {/if}
      </div>
    </div>
  {/if}
</div>
