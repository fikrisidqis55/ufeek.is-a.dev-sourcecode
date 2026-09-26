<script lang="ts">
  // Windows 98 style About Me
</script>

<div class="w-full bg-win98-surface p-3 sm:p-4 flex flex-col text-black flex-1 overflow-y-auto min-h-0 select-text">
  <div class="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
    <div class="w-24 h-24 shrink-0 win98-border-inset p-1 bg-white">
      <img src="/profile/profile-picture.jpeg" alt="Fikri Sidqi" class="w-full h-full object-cover grayscale" />
    </div>

    <div class="flex-1 flex flex-col gap-3 text-xs sm:text-sm leading-relaxed text-gray-900 font-[Tahoma,sans-serif]">
      <p>
        My name is Fikri. I go by the moniker <strong>Ufeek</strong> &mdash; a play on words for "You" & "Fik". It represents the synergy between You and Fikri, because I believe the best digital solutions are built through strong collaboration.
      </p>
      
      <p>
        As a dedicated <strong>Frontend Engineer</strong>, I channel this mindset into crafting intuitive and high-performance applications. My expertise spans modern web technologies (React.js, Next.js, TypeScript), enabling me to develop seamless and scalable digital solutions that truly enhance user experiences.
      </p>
      
      <p>
        Constantly exploring the evolving tech landscape, I enjoy designing interactive interfaces, optimizing web performance, and implementing innovative development techniques to create impactful digital products.
      </p>
    </div>
  </div>

  <div class="mt-4 pt-3 border-t border-gray-400 flex justify-end">
    <button class="win98-button font-bold px-8 py-1 text-xs" onclick={() => {
        import("$lib/stores/osState.svelte").then(({ osState }) => osState.closeWindow('about'));
    }}>
      OK
    </button>
  </div>
</div>
