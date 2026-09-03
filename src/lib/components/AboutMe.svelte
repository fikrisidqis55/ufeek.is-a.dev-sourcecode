<script lang="ts">
  import { onMount } from "svelte";

  let imageLoaded: boolean = false;

  onMount(() => {
    const img = new Image();
    img.src = "/profile/profile-picture-glitched.jpeg";
    img.onload = () => {
      imageLoaded = true;
    };
    if (img.complete) {
      imageLoaded = true;
    }
  });
</script>

<section id="about" class="relative pt-24">
  <div class="container mx-auto flex flex-col md:flex-row items-center px-6 gap-10 md:gap-16 relative">
    <div class="w-full md:w-1/3 flex justify-center mb-8 md:mb-0">
      <div class="relative">
        <div class="absolute -inset-1 blur-md opacity-70 animate-pulse z-0"></div>
        <div
          class={`glitch-container relative w-[220px] h-[220px] z-10 ${
            imageLoaded ? "imgloaded" : ""
          }`}
        >
          <div class="glitch__img"></div>
          <div class="glitch__img"></div>
          <div class="glitch__img"></div>
          <div class="glitch__img"></div>
          <div class="glitch__img"></div>
        </div>
      </div>
    </div>

    <div class="w-full md:w-2/3 text-center md:text-left relative z-10 border border-primary/30 border-t-2 border-t-tertiary bg-card/80 backdrop-blur-md p-8 rounded-none">
      <h2 class="text-4xl md:text-5xl font-heading font-black mb-8 tracking-tight uppercase text-tertiary vaporwave-glow-orange">
        About Me
      </h2>
      <div class="space-y-7 text-[1.15rem] md:text-lg text-justify leading-relaxed font-mono text-foreground/90">
        <p>
          My name is Fikri. I go by the moniker{" "}
          <span class="font-extrabold">Ufeek</span> &mdash; a play on
          words for &quot;<span class="font-bold">You</span>&quot; &amp; &quot;<span class="font-black">Fik</span>&quot;.
          <br class="hidden md:inline" />
          <span class="block md:inline">
            {" "}
            It represents the synergy between{" "}
            <span class="font-bold">You</span> and{" "}
            <span class="font-bold">Fikri</span>, because I believe the
            best digital solutions are built through{" "}
            <span class="font-bold">strong collaboration</span>.
          </span>
        </p>
        <p>
          As a dedicated{" "}
          <span class="font-bold">Software Engineer</span>, I channel
          this mindset into crafting{" "}
          <span class="font-semibold">intuitive</span>
          and <span class="font-semibold">high-performance</span>{" "}
          applications.
          <br class="hidden md:inline" />
          My expertise spans various modern technologies, enabling me to
          develop <span class="font-bold">seamless</span> and{" "}
          <span class="font-bold">scalable</span> digital solutions that
          truly enhance user experiences.
        </p>
        <p>
          Constantly exploring the evolving tech landscape,{" "}
          <span class="font-semibold">
            I enjoy designing interactive interfaces
          </span>
          , optimizing web performance, and implementing{" "}
          <span class="font-extrabold">innovative</span> development
          techniques to create impactful digital products.
        </p>
      </div>
    </div>
  </div>
</section>
