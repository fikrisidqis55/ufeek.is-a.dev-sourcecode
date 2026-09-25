<script lang="ts">
  import "../lib/styles/globals.css";
  import { onMount } from "svelte";
  import GlitchFavicon from "$lib/components/GlitchFavicon.svelte";
  import { inject } from "@vercel/analytics";
  import Taskbar from "$lib/components/os/Taskbar.svelte";

  onMount(() => {
    inject();
  });
</script>

<GlitchFavicon />
<slot />
<Taskbar />
