<script lang="ts">
  import Icon from "@iconify/svelte";

  const skills = [
    { name: "React", icon: "fa6-brands:react", size: "1.44MB" },
    { name: "Next.js", icon: "simple-icons:nextdotjs", size: "2.1MB" },
    { name: "Node.js", icon: "fa6-brands:node-js", size: "4.0MB" },
    { name: "TypeScript", icon: "simple-icons:typescript", size: "840KB" },
    { name: "JavaScript", icon: "fa6-brands:js", size: "1.2MB" },
    { name: "Tailwind", icon: "simple-icons:tailwindcss", size: "320KB" },
    { name: "Database", icon: "fa6-solid:database", size: "10MB" },
    { name: "HTML5", icon: "fa6-brands:html5", size: "45KB" },
    { name: "CSS3", icon: "fa6-brands:css3-alt", size: "30KB" },
    { name: "Git", icon: "fa6-brands:git-alt", size: "1.5MB" },
  ];

  let viewMode: 'icons' | 'details' = 'icons';
</script>

<div class="h-full w-full bg-white flex flex-col text-black font-[Tahoma,sans-serif]">
  <!-- Toolbar -->
  <div class="flex items-center gap-2 p-1 bg-win98-surface win98-border-outset mb-1">
    <button class="win98-button flex items-center gap-1.5" on:click={() => viewMode = 'icons'}>
      <img src="/icons/win98/projects.png" alt="" class="w-3.5 h-3.5 select-none pointer-events-none" style="image-rendering: pixelated;" />
      <span class="text-xs">Icons</span>
    </button>
    <button class="win98-button flex items-center gap-1.5" on:click={() => viewMode = 'details'}>
      <img src="/icons/win98/document.png" alt="" class="w-3.5 h-3.5 select-none pointer-events-none" style="image-rendering: pixelated;" />
      <span class="text-xs">Details</span>
    </button>
  </div>

  <!-- Content Area -->
  <div class="flex-1 overflow-y-auto win98-border-inset bg-white p-2">
    {#if viewMode === 'icons'}
      <div class="flex flex-wrap gap-6 p-4">
        {#each skills as skill}
          <div class="flex flex-col items-center gap-1 w-20 cursor-pointer group">
            <div class="w-10 h-10 flex items-center justify-center text-4xl group-active:brightness-75 group-focus:brightness-75">
              <Icon icon={skill.icon} />
            </div>
            <span class="text-xs text-center px-1 group-active:bg-win98-title-active group-active:text-white group-focus:bg-win98-title-active group-focus:text-white">
              {skill.name}
            </span>
          </div>
        {/each}
      </div>
    {:else}
      <div class="w-full overflow-x-auto">
        <table class="w-full text-sm text-left border-collapse cursor-default min-w-[300px]">
          <thead class="bg-win98-surface">
            <tr>
              <th class="win98-border-outset font-normal px-2 py-1 sticky top-0 whitespace-nowrap">Name</th>
              <th class="win98-border-outset font-normal px-2 py-1 sticky top-0 whitespace-nowrap">Type</th>
              <th class="win98-border-outset font-normal px-2 py-1 sticky top-0 whitespace-nowrap">Size</th>
            </tr>
          </thead>
          <tbody>
            {#each skills as skill}
              <tr class="hover:bg-win98-title-active hover:text-white">
                <td class="px-2 py-1 flex items-center gap-2 whitespace-nowrap">
                  <span class="text-lg"><Icon icon={skill.icon} /></span>
                  {skill.name}
                </td>
                <td class="px-2 py-1 whitespace-nowrap">Skill Module</td>
                <td class="px-2 py-1 whitespace-nowrap">{skill.size}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
