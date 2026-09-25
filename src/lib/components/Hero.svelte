<script lang="ts">
  import { FileText } from "@lucide/svelte";

  const resumeUrl = import.meta.env.PUBLIC_RESUME_URL || "";

  function openSection(id: string) {
    // In Win98 theme, we just dispatch an event or use osState to open the window
    // Since osState is available globally, we can use it.
    import("$lib/stores/osState.svelte").then(({ osState }) => {
        let title = id.charAt(0).toUpperCase() + id.slice(1);
        let icon = id === 'projects' ? '/icons/win98/projects.png' : id === 'contact' ? '/icons/win98/contact.png' : '/icons/win98/about.png';
        osState.openWindow({ id, title, icon, x: 200, y: 150 });
    });
  }
</script>

<div class="h-full w-full flex flex-col justify-center items-center text-black bg-white p-4">
  <div class="flex flex-col md:flex-row items-center gap-6 mb-8">
    <div class="w-32 h-32 border-[3px] win98-border-inset bg-gray-200 flex items-center justify-center overflow-hidden">
        <img src="/profile/profile-picture.jpeg" alt="Ufeek" class="w-full h-full object-cover" />
    </div>
    <div class="flex flex-col items-center md:items-start">
        <h1 class="text-4xl md:text-5xl font-bold mb-2">UFEEK</h1>
        <p class="text-lg md:text-xl text-gray-700">Software Engineer</p>
    </div>
  </div>

  <div class="win98-border-inset w-full max-w-md p-4 bg-gray-100 flex flex-col gap-4 text-center text-sm mb-8">
    <p>Welcome to ufeek OS! Explore my experience, skills, and projects using the desktop icons or the Start Menu.</p>
    <p>System Memory: 64,000 KB RAM</p>
  </div>

  <div class="flex flex-wrap gap-4 justify-center">
    <button
      on:click={() => openSection("projects")}
      class="win98-button font-bold px-6 py-2"
      type="button"
    >
      View My Work
    </button>

    {#if resumeUrl}
      <a
        href={resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="win98-button font-bold px-6 py-2 flex items-center justify-center gap-2"
      >
        View Resume
        <FileText size={16} />
      </a>
    {/if}

    <button
      on:click={() => openSection("contact")}
      class="win98-button font-bold px-6 py-2"
      type="button"
    >
      Contact Me
    </button>
  </div>
</div>
