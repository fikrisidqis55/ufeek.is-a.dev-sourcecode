<script lang="ts">
  import { onMount } from "svelte";
  import { Bug } from "@lucide/svelte";

  let position = { x: 0, y: 0 };
  let isVisible = false;
  let isMobile = true;
  let isInPort = false;

  let targetPosition = { x: 0, y: 0 };
  let requestRef: number | undefined;

  onMount(() => {
    const checkMobile = () => {
      isMobile = window.innerWidth < 768;
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (!isMobile) {
      const PROXIMITY_THRESHOLD = 50;

      const handleMouseMove = (e: MouseEvent) => {
        targetPosition = { x: e.clientX, y: e.clientY };
        isVisible = true;
      };

      const handleMouseLeave = () => {
        isVisible = false;
        isInPort = false;
      };

      const animate = () => {
        const dx = targetPosition.x - position.x;
        const dy = targetPosition.y - position.y;
        position = {
          x: position.x + dx * 0.04,
          y: position.y + dy * 0.04,
        };

        const distance = Math.sqrt(
          Math.pow(targetPosition.x - position.x, 2) +
            Math.pow(targetPosition.y - position.y, 2)
        );

        isInPort = distance <= PROXIMITY_THRESHOLD;
        requestRef = requestAnimationFrame(animate);
      };

      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);
      requestRef = requestAnimationFrame(animate);

      return () => {
        window.removeEventListener("resize", checkMobile);
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
        if (requestRef) {
          cancelAnimationFrame(requestRef);
        }
      };
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  });
</script>

{#if !isMobile}
  <div
    class="fixed pointer-events-none z-[0] transition-opacity duration-300"
    style="left: {position.x}px; top: {position.y}px; transform: translate(-50%, -50%); opacity: {isVisible ? 1 : 0}; will-change: transform;"
  >
    <div class="relative">
      <div
        class="relative filter hover:scale-110 transition-all duration-200 {isInPort
          ? 'drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]'
          : 'drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]'}"
      >
        <Bug
          size={36}
          class="transition-colors duration-200 {isInPort ? 'text-red-500' : 'text-secondary'}"
        />
      </div>
    </div>
  </div>
{/if}
