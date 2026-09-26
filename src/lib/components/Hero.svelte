<script lang="ts">
  import { FileText } from "@lucide/svelte";

  const resumeUrl =
    import.meta.env.PUBLIC_RESUME_URL ||
    import.meta.env.NEXT_PUBLIC_RESUME_URL ||
    import.meta.env.VITE_RESUME_URL ||
    "";

  function openSection(id: string) {
    import("$lib/stores/osState.svelte").then(({ osState }) => {
        let title = id.charAt(0).toUpperCase() + id.slice(1);
        let icon = id === 'projects' ? '/icons/win98/projects.png' : id === 'contact' ? '/icons/win98/contact.png' : '/icons/win98/about.png';
        osState.openWindow({ id, title, icon });
    });
  }
</script>

<div class="h-full w-full flex flex-col justify-center items-center text-black bg-white p-3 sm:p-4 overflow-y-auto min-h-0 select-text">
  <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
    <div class="w-24 h-24 sm:w-32 sm:h-32 border-[3px] win98-border-inset bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
        <img src="/profile/profile-picture.jpeg" alt="Ufeek" class="w-full h-full object-cover" />
    </div>
    <div class="flex flex-col items-center sm:items-start text-center sm:text-left">
        <h1 class="text-3xl sm:text-4xl font-bold mb-1">UFEEK</h1>
        <p class="text-base sm:text-lg text-win98-title-active font-semibold">Frontend Engineer</p>
    </div>
  </div>

  <div class="win98-border-inset w-full max-w-md p-3 sm:p-4 bg-gray-100 flex flex-col gap-2 text-center text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
    <p>Welcome to ufeek OS! Explore my experience, skills, and projects using the desktop icons or the Start Menu.</p>
    <p class="text-[11px] text-gray-500 font-mono">System Memory: 64,000 KB RAM</p>
  </div>

  <div class="flex flex-wrap gap-2.5 sm:gap-4 justify-center w-full max-w-xs sm:max-w-none">
    <button
      on:click={() => openSection("projects")}
      class="win98-button font-bold px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm flex-1 sm:flex-none"
      type="button"
    >
      View My Work
    </button>

    {#if resumeUrl}
      <a
        href={resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="win98-button font-bold px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
      >
        <span>Resume</span>
        <FileText size={14} />
      </a>
    {/if}

    <button
      on:click={() => openSection("contact")}
      class="win98-button font-bold px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm flex-1 sm:flex-none"
      type="button"
    >
      Contact Me
    </button>
  </div>
</div>
