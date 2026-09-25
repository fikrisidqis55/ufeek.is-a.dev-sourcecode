<script lang="ts">
  // Windows 98 style About Me
</script>

<div class="w-full md:w-[50vw] bg-win98-surface p-4 flex flex-col text-black">
  <div class="flex gap-4 items-start">
    <div class="w-24 h-24 shrink-0 win98-border-inset p-1 bg-white">
      <img src="/profile/profile-picture.jpeg" alt="Fikri Sidqi" class="w-full h-full object-cover grayscale" />
    </div>

    <div class="flex-1 flex flex-col gap-4 text-sm leading-relaxed">
      <p>
        My name is Fikri. I go by the moniker <strong>Ufeek</strong> &mdash; a play on words for "You" & "Fik". It represents the synergy between You and Fikri, because I believe the best digital solutions are built through strong collaboration.
      </p>
      
      <p>
        As a dedicated <strong>Software Engineer</strong>, I channel this mindset into crafting intuitive and high-performance applications. My expertise spans various modern technologies, enabling me to develop seamless and scalable digital solutions that truly enhance user experiences.
      </p>
      
      <p>
        Constantly exploring the evolving tech landscape, I enjoy designing interactive interfaces, optimizing web performance, and implementing innovative development techniques to create impactful digital products.
      </p>
    </div>
  </div>

  <div class="mt-6 pt-4 border-t border-gray-400 flex justify-end">
    <button class="win98-button font-bold px-8" onclick={() => {
        import("$lib/stores/osState.svelte").then(({ osState }) => osState.closeWindow('about'));
    }}>
      OK
    </button>
  </div>
</div>
