<script lang="ts">
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;

  onMount(() => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 32;
    canvas.width = size;
    canvas.height = size;

    const noiseFrames = [
      { x: 0, y: 0 },
      { x: -1, y: 1 },
      { x: 1, y: -1 },
      { x: -2, y: 0 },
      { x: 2, y: 1 },
      { x: 0, y: -1 },
      { x: -1, y: 2 },
      { x: 1, y: -2 },
      { x: -2, y: 1 },
      { x: 2, y: -1 },
    ];

    let animationFrameId: number;
    let time = 0;

    const updateFavicon = () => {
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, size, size);

      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      time += 0.016;

      const noiseIndex = Math.floor((time * 10) % noiseFrames.length);
      const noiseFrame = noiseFrames[noiseIndex];

      const skewProgress = (time * 0.25) % 1;
      let skewX = 0;
      if (skewProgress > 0.4 && skewProgress < 0.41) skewX = 10;
      else if (skewProgress > 0.41 && skewProgress < 0.42) skewX = -10;
      else if (skewProgress > 0.58 && skewProgress < 0.59) skewX = 40;
      else if (skewProgress > 0.59 && skewProgress < 0.6) skewX = -40;
      else if (skewProgress > 0.63 && skewProgress < 0.64) skewX = 10;
      else if (skewProgress > 0.7 && skewProgress < 0.71) skewX = -50;
      else if (skewProgress > 0.71 && skewProgress < 0.72) skewX = 10;

      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.transform(1, 0, Math.tan((skewX * Math.PI) / 180), 1, 0, 0);
      ctx.translate(-size / 2, -size / 2);

      // Cyan glitch
      ctx.fillStyle = "#00ffff";
      ctx.fillText("U", size / 2 + noiseFrame.x - 1, size / 2 + noiseFrame.y);

      // Magenta glitch
      ctx.fillStyle = "#ff00ff";
      ctx.fillText("U", size / 2 + noiseFrame.x + 1, size / 2 + noiseFrame.y);

      // Main letter
      ctx.fillStyle = "#fff";
      ctx.fillText("U", size / 2 + noiseFrame.x, size / 2 + noiseFrame.y);

      ctx.restore();

      let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.type = "image/png";
        document.head.appendChild(favicon);
      }

      favicon.href = canvas.toDataURL("image/png");
      animationFrameId = requestAnimationFrame(updateFavicon);
    };

    updateFavicon();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  });
</script>

<canvas bind:this={canvas} style="display: none;"></canvas>
