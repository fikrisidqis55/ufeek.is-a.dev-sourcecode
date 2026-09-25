<script lang="ts">
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;

  onMount(() => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Glitch Palette: Authentic CRT phosphor & digital error artifacts
    const PALETTE = {
      bg: "#080312",
      scanline: "rgba(255, 255, 255, 0.025)",
      cyan: "#00f0ff",
      magenta: "#ff0055",
      yellow: "#ffe600",
      white: "#ffffff",
      darkPurple: "#1a082e",
      green: "#00ff66"
    };

    // Pre-rendered offscreen noise canvas for maximum 60fps performance
    const noiseCanvas = document.createElement("canvas");
    noiseCanvas.width = 160;
    noiseCanvas.height = 120;
    const noiseCtx = noiseCanvas.getContext("2d");
    if (noiseCtx) {
      const imgData = noiseCtx.createImageData(160, 120);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() > 0.5 ? 255 : 0;
        data[i] = val;     // R
        data[i + 1] = val; // G
        data[i + 2] = val; // B
        data[i + 3] = Math.random() * 35; // subtle alpha
      }
      noiseCtx.putImageData(imgData, 0, 0);
    }

    // State Machine: Glitches occur in realistic sporadic bursts
    let isGlitching = false;
    let glitchFramesLeft = 0;
    let glitchCooldown = Math.floor(Math.random() * 120 + 80); // 1.5 - 3.5 seconds
    let glitchIntensity = 1; // 1 to 3
    let humBarY = 0;
    let frame = 0;

    // Mouse velocity listener to trigger realistic micro-glitches on rapid moves
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastMouseMoveTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = now - lastMouseMoveTime;
      if (dt > 0 && dt < 100) {
        const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
        const speed = dist / dt;
        if (speed > 2.5 && !isGlitching && glitchCooldown > 20) {
          // Trigger a micro-glitch burst on sudden mouse whip
          triggerBurst(1, Math.floor(Math.random() * 4 + 2));
        }
      }
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      lastMouseMoveTime = now;
    };

    window.addEventListener("mousemove", handleMouseMove);

    function triggerBurst(intensity = 1, duration = 0) {
      isGlitching = true;
      glitchIntensity = intensity;
      glitchFramesLeft = duration || Math.floor(Math.random() * 8 + 3);
    }

    // Corrupted hex strings that occasionally flash during intense glitches
    const GLITCH_STRINGS = [
      "SYSTEM_INTERRUPT 0x008080",
      "FATAL_EXCEPTION 0E : 0028:C0034B23",
      "VRAM_PARITY_CHECK_FAIL",
      "DEEP_CORE_SYNC_LOST",
      "01001111 01010011",
      "BUFFER_UNDERRUN [TRK_0]",
      "CRC32_MISMATCH 0xFA49E2",
    ];

    let activeGlitchText: { text: string; x: number; y: number; opacity: number } | null = null;

    let animationFrameId: number;

    const render = () => {
      frame++;

      // 1. Draw Base Cyberpunk / CRT Background with subtle vertical gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#080312");
      bgGrad.addColorStop(0.5, "#0b051a");
      bgGrad.addColorStop(1, "#05010a");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle CRT Scanline Texture (every 3px)
      ctx.fillStyle = PALETTE.scanline;
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1);
      }

      // 3. Ambient Rolling Hum Bar (slow 60Hz CRT drift)
      humBarY = (humBarY + 1.2) % (height + 150);
      const humGrad = ctx.createLinearGradient(0, humBarY - 100, 0, humBarY);
      humGrad.addColorStop(0, "rgba(0, 240, 255, 0)");
      humGrad.addColorStop(0.5, "rgba(0, 240, 255, 0.025)");
      humGrad.addColorStop(1, "rgba(0, 240, 255, 0)");
      ctx.fillStyle = humGrad;
      ctx.fillRect(0, humBarY - 100, width, 100);

      // 4. Glitch State Manager (Realistic sporadic burst cycles)
      if (!isGlitching) {
        glitchCooldown--;
        if (glitchCooldown <= 0) {
          // Trigger a new burst
          const intensity = Math.random() > 0.7 ? 2 : 1;
          triggerBurst(intensity);
          // Set cooldown until next burst (clusters can happen)
          glitchCooldown = Math.random() > 0.4 
            ? Math.floor(Math.random() * 140 + 70) // Normal pause: 1.5 - 3.5s
            : Math.floor(Math.random() * 20 + 8);   // Fast stutter cluster
        }
      } else {
        glitchFramesLeft--;
        if (glitchFramesLeft <= 0) {
          isGlitching = false;
          activeGlitchText = null;
        }
      }

      // 5. Active Glitch Phenomena Rendering
      if (isGlitching) {
        const numSlices = glitchIntensity === 2 ? Math.floor(Math.random() * 7 + 4) : Math.floor(Math.random() * 4 + 2);

        // A. Horizontal Displacement Tears & Chromatic Aberration
        for (let i = 0; i < numSlices; i++) {
          const sliceY = Math.random() * height;
          const sliceH = Math.random() * (glitchIntensity === 2 ? 35 : 16) + 2;
          const shiftX = (Math.random() - 0.5) * (glitchIntensity === 2 ? 60 : 25);

          // Cyan chromatic edge
          ctx.fillStyle = PALETTE.cyan;
          ctx.globalAlpha = Math.random() * 0.4 + 0.2;
          ctx.fillRect(shiftX - 3, sliceY, width, sliceH);

          // Magenta chromatic edge
          ctx.fillStyle = PALETTE.magenta;
          ctx.globalAlpha = Math.random() * 0.4 + 0.2;
          ctx.fillRect(shiftX + 3, sliceY, width, sliceH);

          // Displaced slice core (dark band with noise)
          ctx.fillStyle = PALETTE.darkPurple;
          ctx.globalAlpha = 0.85;
          ctx.fillRect(shiftX, sliceY, width, sliceH);

          // High-frequency bright discharge streak inside tear
          if (Math.random() > 0.4) {
            ctx.fillStyle = Math.random() > 0.5 ? PALETTE.white : PALETTE.yellow;
            ctx.globalAlpha = Math.random() * 0.7 + 0.3;
            const streakW = Math.random() * (width * 0.6) + 80;
            const streakX = Math.random() * (width - streakW);
            ctx.fillRect(streakX + shiftX, sliceY + (sliceH / 2) - 0.5, streakW, 1.5);
          }
        }

        // B. Digital Macroblocks (Corrupted VRAM byte clusters)
        const blockCount = Math.floor(Math.random() * 12 + 4);
        for (let b = 0; b < blockCount; b++) {
          const bw = Math.floor(Math.random() * 48 + 12);
          const bh = Math.floor(Math.random() * 12 + 4);
          const bx = Math.random() * (width - bw);
          const by = Math.random() * (height - bh);

          const colors = [PALETTE.cyan, PALETTE.magenta, PALETTE.yellow, PALETTE.white, PALETTE.green];
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
          ctx.globalAlpha = Math.random() * 0.65 + 0.2;
          ctx.fillRect(bx, by, bw, bh);

          // Pixelated checkerboard effect inside macroblock
          if (Math.random() > 0.5) {
            ctx.fillStyle = "#000000";
            ctx.globalAlpha = 0.5;
            for (let px = 0; px < bw; px += 4) {
              ctx.fillRect(bx + px, by, 2, bh);
            }
          }
        }

        // C. Occasional Full-Width Phosphor Flash Line
        if (Math.random() > 0.65) {
          const flashY = Math.random() * height;
          ctx.fillStyle = "#ffffff";
          ctx.globalAlpha = Math.random() * 0.6 + 0.4;
          ctx.fillRect(0, flashY, width, Math.random() * 2 + 1);
        }

        // D. Corrupted ASCII / Hex Memory Dump Fragment
        if (!activeGlitchText && Math.random() > 0.7) {
          activeGlitchText = {
            text: GLITCH_STRINGS[Math.floor(Math.random() * GLITCH_STRINGS.length)],
            x: Math.random() * (width - 350) + 50,
            y: Math.random() * (height - 100) + 50,
            opacity: Math.random() * 0.6 + 0.3
          };
        }

        if (activeGlitchText) {
          ctx.font = '11px "Share Tech Mono", "Courier New", monospace';
          ctx.fillStyle = PALETTE.cyan;
          ctx.globalAlpha = activeGlitchText.opacity;
          ctx.fillText(activeGlitchText.text, activeGlitchText.x + (Math.random() * 2 - 1), activeGlitchText.y);

          ctx.fillStyle = PALETTE.magenta;
          ctx.globalAlpha = activeGlitchText.opacity * 0.7;
          ctx.fillText(activeGlitchText.text, activeGlitchText.x + 2, activeGlitchText.y);
        }

        // E. Static Noise Overlay during Glitch Peak
        ctx.globalAlpha = 0.12;
        const noisePattern = ctx.createPattern(noiseCanvas, "repeat");
        if (noisePattern) {
          ctx.fillStyle = noisePattern;
          ctx.fillRect(0, 0, width, height);
        }
      }

      // 6. Reset global alpha
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  });
</script>

<canvas
  bind:this={canvas}
  class="absolute inset-0 w-full h-full z-[-1] pointer-events-none select-none"
  style="image-rendering: pixelated;"
></canvas>

