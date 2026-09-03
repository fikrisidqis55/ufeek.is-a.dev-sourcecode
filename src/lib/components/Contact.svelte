<script lang="ts">
  import { Send, MessageSquare } from "@lucide/svelte";

  let formData = {
    name: "",
    email: "",
    message: "",
  };
  let loading = false;
  let success = false;
  let error = false;

  async function handleSubmit() {
    loading = true;
    success = false;
    error = false;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      loading = false;

      if (data.success) {
        success = true;
        formData = { name: "", email: "", message: "" };
      } else {
        error = true;
      }
    } catch (err) {
      console.error("err", err);
      loading = false;
      error = true;
    }
  }
</script>

<section id="contact" class="relative pt-24">
  <div class="container mx-auto px-6 relative z-6s">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-heading font-black mb-4 uppercase text-tertiary vaporwave-glow-orange">
        Let's Connect
      </h2>
      <p class="max-w-2xl mx-auto font-mono text-foreground/70">
        Have a project in mind or want to chat? Feel free to reach out using the form below.
      </p>
    </div>

    <div class="max-w-2xl mx-auto">
      <div class="p-8 border border-primary/30 border-t-2 border-t-tertiary bg-card/80 backdrop-blur-md rounded-none shadow-neon-orange">
        <div class="flex items-center justify-center mb-8">
          <div class="w-16 h-16 border-2 border-tertiary rounded-none flex items-center justify-center text-tertiary rotate-45 hover:rotate-90 transition-transform duration-200 shadow-neon-orange">
            <MessageSquare size={28} class="-rotate-45" />
          </div>
        </div>

        {#if success}
          <div class="mb-6 p-4 bg-card border-2 border-tertiary rounded-none font-mono text-tertiary shadow-[0_0_15px_rgba(255,153,0,0.4)] animate-in fade-in">
            Your message has been sent successfully! I'll get back to you soon.
          </div>
        {/if}

        {#if error}
          <div class="mb-6 p-4 bg-card border-2 border-primary rounded-none font-mono text-primary shadow-[0_0_15px_rgba(255,0,255,0.3)] animate-in fade-in">
            There was an error sending your message. Please try again later.
          </div>
        {/if}

        <form on:submit|preventDefault={handleSubmit}>
          <div class="mb-6">
            <label for="contact-name" class="block text-lg font-mono uppercase tracking-wider mb-2 text-tertiary">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              bind:value={formData.name}
              class="w-full px-3 py-2 border-b-2 border-tertiary bg-black text-tertiary font-mono text-lg rounded-none focus-visible:border-tertiary focus-visible:shadow-neon-orange focus-visible:outline-none placeholder:text-tertiary/50"
              required
              disabled={loading}
            />
          </div>

          <div class="mb-6">
            <label for="contact-email" class="block text-lg font-mono uppercase tracking-wider mb-2 text-tertiary">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              bind:value={formData.email}
              class="w-full px-3 py-2 border-b-2 border-tertiary bg-black text-tertiary font-mono text-lg rounded-none focus-visible:border-tertiary focus-visible:shadow-neon-orange focus-visible:outline-none placeholder:text-tertiary/50"
              required
              disabled={loading}
            />
          </div>

          <div class="mb-6">
            <label for="contact-message" class="block text-lg font-mono uppercase tracking-wider mb-2 text-tertiary">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              bind:value={formData.message}
              rows="5"
              class="w-full px-3 py-2 border-b-2 border-tertiary bg-black text-tertiary font-mono text-lg rounded-none resize-none focus-visible:border-tertiary focus-visible:shadow-neon-orange focus-visible:outline-none placeholder:text-tertiary/50"
              required
              disabled={loading}
            ></textarea>
          </div>

          <button
            type="submit"
            class="group w-full px-6 py-4 h-14 text-lg font-mono uppercase tracking-wider border-2 border-tertiary bg-transparent text-tertiary rounded-none -skew-x-12 transition-all duration-200 ease-linear hover:skew-x-0 hover:bg-tertiary hover:text-black hover:shadow-neon-orange flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <span class="inline-block skew-x-12 group-hover:skew-x-0 transition-transform duration-200">
              {loading ? "Sending..." : "Send Message"}
            </span>
            {#if !loading}
              <Send size={18} class="inline-block skew-x-12 group-hover:skew-x-0 transition-transform duration-200" />
            {/if}
          </button>
        </form>
      </div>
    </div>
  </div>
</section>
