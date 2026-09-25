<script lang="ts">
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

<div class="h-full w-full bg-win98-surface p-4 flex flex-col text-black font-[Tahoma,sans-serif]">
  <div class="flex items-center gap-3 mb-6">
    <div class="text-4xl">✉️</div>
    <div>
      <h2 class="text-xl font-bold">Internet Mail</h2>
      <p class="text-sm">Compose New Message</p>
    </div>
  </div>

  <div class="flex-1 win98-border-inset bg-win98-surface p-4 flex flex-col gap-4">
    {#if success}
      <div class="bg-blue-100 border border-blue-400 text-blue-800 p-2 text-sm flex gap-2 items-center">
        <span>ℹ️</span> Message sent successfully.
      </div>
    {/if}

    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-800 p-2 text-sm flex gap-2 items-center">
        <span>❌</span> Error sending message.
      </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4 h-full">
      <div class="flex flex-col gap-1">
        <label for="contact-name" class="text-sm">To:</label>
        <input
          id="contact-name"
          type="text"
          name="name"
          bind:value={formData.name}
          class="w-full px-2 py-1 win98-border-inset bg-white text-black outline-none focus:bg-blue-50"
          placeholder="Your Name..."
          required
          disabled={loading}
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="contact-email" class="text-sm">Reply-To (Email):</label>
        <input
          id="contact-email"
          type="email"
          name="email"
          bind:value={formData.email}
          class="w-full px-2 py-1 win98-border-inset bg-white text-black outline-none focus:bg-blue-50"
          placeholder="Your Email..."
          required
          disabled={loading}
        />
      </div>

      <div class="flex flex-col gap-1 flex-1">
        <label for="contact-message" class="text-sm">Message:</label>
        <textarea
          id="contact-message"
          name="message"
          bind:value={formData.message}
          class="w-full flex-1 px-2 py-1 win98-border-inset bg-white text-black outline-none focus:bg-blue-50 resize-none"
          placeholder="Type your message here..."
          required
          disabled={loading}
        ></textarea>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-gray-400">
        <button
          type="submit"
          class="win98-button font-bold px-6 py-1 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  </div>
</div>
