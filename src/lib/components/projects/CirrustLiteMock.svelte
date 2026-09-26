<script lang="ts">
  import { FileText, CheckCircle2, Download, ArrowLeft, RefreshCw } from "lucide-svelte";

  interface FormState {
    name: string;
    title: string;
    company: string;
    businessEmail: string;
    mobilePhone: string;
  }

  const initialForm: FormState = {
    name: "",
    title: "",
    company: "",
    businessEmail: "",
    mobilePhone: ""
  };

  let form = $state<FormState>({ ...initialForm });
  let touched = $state<Record<string, boolean>>({});
  let isSubmitting = $state(false);
  let isSuccess = $state(false);
  let hoverField = $state<string | null>(null);
  let focusField = $state<string | null>(null);
  let toast = $state<{ visible: boolean; message: string }>({ visible: false, message: "" });

  const standbyPh: Record<keyof FormState, string> = {
    name: "Name",
    company: "Company Name",
    title: "Title",
    businessEmail: "Email",
    mobilePhone: "Phone Number"
  };

  const examplePh: Record<keyof FormState, string> = {
    name: "John Doe",
    company: "PT Quadrant Synergy International",
    title: "Assistant Manager",
    businessEmail: "yourcompanymail@domain.com",
    mobilePhone: "8xx-xxxx-xxxx"
  };

  function isActive(field: keyof FormState): boolean {
    return focusField === field || hoverField === field || Boolean(form[field]);
  }

  // Client validation
  let clientErrors = $derived.by(() => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.company.trim()) errs.company = "Company Name is required";
    if (!form.title.trim()) errs.title = "Job Title is required";
    
    if (!form.businessEmail.trim()) {
      errs.businessEmail = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.businessEmail.trim())) {
        errs.businessEmail = "Invalid email format";
      }
    }

    if (!form.mobilePhone.trim()) {
      errs.mobilePhone = "Phone number is required";
    } else {
      const digits = form.mobilePhone.replace(/[^0-9]/g, "");
      if (digits.length < 8) {
        errs.mobilePhone = "Phone must have at least 8 digits";
      }
    }

    return errs;
  });

  function handlePhoneChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const digits = target.value.replace(/[^0-9]/g, "").slice(0, 12);
    const grouped = digits.replace(/(.{4})/g, "$1-").replace(/-$/, "");
    form.mobilePhone = grouped;
  }

  function handleBlur(field: keyof FormState) {
    touched[field] = true;
    focusField = null;
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    touched = {
      name: true,
      company: true,
      title: true,
      businessEmail: true,
      mobilePhone: true
    };

    if (Object.keys(clientErrors).length > 0) {
      toast = { visible: true, message: "Please resolve the highlighted form fields." };
      setTimeout(() => (toast.visible = false), 3000);
      return;
    }

    isSubmitting = true;

    // Simulate realistic asynchronous network call
    await new Promise((resolve) => setTimeout(resolve, 700));

    isSubmitting = false;
    isSuccess = true;
  }

  function handleReset() {
    form = { ...initialForm };
    touched = {};
    isSuccess = false;
    isSubmitting = false;
  }

  function handleDownloadInstaller() {
    // Generate an authentic installer archive mock file
    const content = `=====================================================
CIRRUST LITE — 6-MONTH FREE TRIAL LICENSE
=====================================================
Registered To: ${form.name || "Valued User"}
Company:       ${form.company || "Enterprise Partner"}
Email:         ${form.businessEmail || "user@domain.com"}
License Key:   CIRRUST-LITE-${Math.random().toString(36).substring(2, 10).toUpperCase()}-2026
Valid Until:   6 Months from today

Thank you for choosing Cirrust Lite!
For support, visit: https://cirrust.com
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Cirrust-Lite-Trial-License.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
</script>

<div class="h-full w-full bg-white text-gray-800 font-[sans-serif] overflow-y-auto select-text relative flex flex-col">
  <!-- Interactive Sandbox Notification Banner -->
  <div class="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-800 text-white text-[11px] px-3 py-1.5 flex items-center justify-between border-b border-teal-900 shadow-sm flex-shrink-0">
    <div class="flex items-center gap-2">
      <span class="bg-amber-400 text-black font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase">Live Mock</span>
      <span>Cirrust Lite Customer Acquisition Portal — Interactive State Sandbox</span>
    </div>
    <button 
      type="button" 
      onclick={handleReset} 
      class="hover:underline flex items-center gap-1 text-[11px] opacity-90 hover:opacity-100 cursor-pointer"
    >
      <RefreshCw size={11} />
      <span>Reset Form</span>
    </button>
  </div>

  <!-- Loading Overlay -->
  {#if isSubmitting}
    <div class="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-xl flex flex-col items-center gap-3 animate-fade-in">
        <div class="w-10 h-10 border-4 border-[#28A798]/20 border-t-[#28A798] rounded-full animate-spin"></div>
        <p class="text-sm font-semibold text-gray-700">Submitting registration...</p>
        <p class="text-xs text-gray-400">Allocating 6-month free license</p>
      </div>
    </div>
  {/if}

  <!-- Toast Message -->
  {#if toast.visible}
    <div class="fixed top-12 right-6 z-50 animate-bounce">
      <div class="bg-red-50 border border-red-300 text-red-700 px-4 py-2.5 rounded-lg text-xs shadow-lg flex items-center gap-2">
        <span>⚠️</span>
        <span>{toast.message}</span>
      </div>
    </div>
  {/if}

  {#if isSuccess}
    <!-- SUCCESS STATE SCREEN -->
    <div class="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 animate-fade-in">
      <div class="w-full max-w-lg flex flex-col items-center text-center">
        <!-- Top Canopy Graphic -->
        <div class="w-full max-w-md mb-6">
          <img 
            src="/projects/cirrust-lite/CanopywithLogo4x.png" 
            alt="Cirrust Lite Canopy" 
            class="w-full h-auto object-contain mx-auto"
            onerror={(e) => ((e.currentTarget as HTMLElement).style.display = 'none')}
          />
        </div>

        <div class="w-14 h-14 bg-teal-50 text-[#28A798] rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={36} />
        </div>

        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
        <div class="w-16 h-1 bg-[#28A798] rounded mb-4"></div>

        <p class="text-sm text-gray-600 mb-2">
          Thank you for registering with <strong class="text-gray-900">Cirrust Lite</strong>, {form.name}!
        </p>
        <p class="text-xs sm:text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
          Your account for <strong class="text-gray-800">{form.company}</strong> is approved. Enjoy <b>6 months of FREE</b> cloud service on your machine.
        </p>

        <!-- Download Action Button -->
        <button
          type="button"
          onclick={handleDownloadInstaller}
          class="w-full max-w-xs bg-[#28A798] hover:bg-[#208a7e] text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm cursor-pointer mb-4"
        >
          <Download size={18} />
          <span>Download installer package</span>
        </button>

        <button
          type="button"
          onclick={handleReset}
          class="text-xs text-gray-500 hover:text-[#28A798] underline transition-colors cursor-pointer"
        >
          Register another organization (Reset)
        </button>
      </div>

      <footer class="mt-auto pt-8 text-[11px] text-gray-400">
        Cirrust Lite © 2025 Copyright — Developed with Next.js, React Query & Tailwind CSS
      </footer>
    </div>
  {:else}
    <!-- FORM SCREEN (2 Columns Layout) -->
    <div class="flex-1 flex flex-col p-6 sm:p-10 max-w-6xl mx-auto w-full">
      <!-- Header Logo -->
      <header class="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
        <img 
          src="/projects/cirrust-lite/CirrustLiteLogo4x.png" 
          alt="Cirrust Lite" 
          class="h-8 sm:h-10 w-auto object-contain"
          onerror={(e) => ((e.currentTarget as HTMLElement).style.display = 'none')}
        />
        <div class="text-[11px] text-gray-400 font-mono">Build v1.0.4 • Demo Sandbox</div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start flex-1">
        <!-- Left Column: Headline & Hero Graphic -->
        <section class="flex flex-col gap-6">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-gray-900">
            Experience Cirrust for <span class="text-amber-500 font-bold">FREE</span> with
            Cirrust Lite — a time-limited, <span class="text-amber-500 font-bold">no-cost license</span>.
          </h1>

          <div class="w-full max-w-md">
            <img 
              src="/projects/cirrust-lite/ImageContent4x.png" 
              alt="Cirrust Lite Features" 
              class="w-full h-auto object-contain rounded-lg"
              onerror={(e) => ((e.currentTarget as HTMLElement).style.display = 'none')}
            />
          </div>

          <div class="bg-teal-50/60 border border-teal-100 rounded-xl p-4 text-xs leading-relaxed text-gray-700">
            <div class="font-medium text-gray-900 mb-1">
              Ready for the <b>Full Cirrust experience</b>?
            </div>
            <div class="text-[#28A798]">
              Contact enterprise sales at <span class="underline font-semibold cursor-pointer">sales@cirrust.com</span> or visit <span class="underline font-semibold cursor-pointer">cirrust.com</span>
            </div>
          </div>
        </section>

        <!-- Right Column: Registration Form with Floating Reveal Labels -->
        <section class="bg-gray-50/70 p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-sm">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Register Here</h2>

          <form onsubmit={handleSubmit} class="flex flex-col gap-4">
            <!-- Name Field -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div 
              class="flex flex-col"
              onmouseenter={() => (hoverField = "name")}
              onmouseleave={() => (hoverField = null)}
            >
              <label 
                for="cirrust-name" 
                class="text-[12px] font-semibold text-[#28A798] transition-all duration-200 {isActive('name') ? 'opacity-100 h-4 translate-y-0' : 'opacity-0 h-0 -translate-y-1 overflow-hidden'}"
              >
                Name
              </label>
              <input
                id="cirrust-name"
                type="text"
                bind:value={form.name}
                onfocus={() => (focusField = "name")}
                onblur={() => handleBlur("name")}
                placeholder={isActive("name") ? examplePh.name : standbyPh.name}
                class="w-full bg-transparent border-b py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors {touched.name && clientErrors.name ? 'border-red-500' : 'border-gray-400 focus:border-[#28A798]'}"
              />
              {#if touched.name && clientErrors.name}
                <span class="text-[11px] text-red-600 mt-1">{clientErrors.name}</span>
              {/if}
            </div>

            <!-- Company Name Field -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div 
              class="flex flex-col"
              onmouseenter={() => (hoverField = "company")}
              onmouseleave={() => (hoverField = null)}
            >
              <label 
                for="cirrust-company" 
                class="text-[12px] font-semibold text-[#28A798] transition-all duration-200 {isActive('company') ? 'opacity-100 h-4 translate-y-0' : 'opacity-0 h-0 -translate-y-1 overflow-hidden'}"
              >
                Company Name
              </label>
              <input
                id="cirrust-company"
                type="text"
                bind:value={form.company}
                onfocus={() => (focusField = "company")}
                onblur={() => handleBlur("company")}
                placeholder={isActive("company") ? examplePh.company : standbyPh.company}
                class="w-full bg-transparent border-b py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors {touched.company && clientErrors.company ? 'border-red-500' : 'border-gray-400 focus:border-[#28A798]'}"
              />
              {#if touched.company && clientErrors.company}
                <span class="text-[11px] text-red-600 mt-1">{clientErrors.company}</span>
              {/if}
            </div>

            <!-- Job Title Field -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div 
              class="flex flex-col"
              onmouseenter={() => (hoverField = "title")}
              onmouseleave={() => (hoverField = null)}
            >
              <label 
                for="cirrust-title" 
                class="text-[12px] font-semibold text-[#28A798] transition-all duration-200 {isActive('title') ? 'opacity-100 h-4 translate-y-0' : 'opacity-0 h-0 -translate-y-1 overflow-hidden'}"
              >
                Title
              </label>
              <input
                id="cirrust-title"
                type="text"
                bind:value={form.title}
                onfocus={() => (focusField = "title")}
                onblur={() => handleBlur("title")}
                placeholder={isActive("title") ? examplePh.title : standbyPh.title}
                class="w-full bg-transparent border-b py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors {touched.title && clientErrors.title ? 'border-red-500' : 'border-gray-400 focus:border-[#28A798]'}"
              />
              {#if touched.title && clientErrors.title}
                <span class="text-[11px] text-red-600 mt-1">{clientErrors.title}</span>
              {/if}
            </div>

            <!-- Email Field -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div 
              class="flex flex-col"
              onmouseenter={() => (hoverField = "businessEmail")}
              onmouseleave={() => (hoverField = null)}
            >
              <label 
                for="cirrust-email" 
                class="text-[12px] font-semibold text-[#28A798] transition-all duration-200 {isActive('businessEmail') ? 'opacity-100 h-4 translate-y-0' : 'opacity-0 h-0 -translate-y-1 overflow-hidden'}"
              >
                Email
              </label>
              <input
                id="cirrust-email"
                type="email"
                bind:value={form.businessEmail}
                onfocus={() => (focusField = "businessEmail")}
                onblur={() => handleBlur("businessEmail")}
                placeholder={isActive("businessEmail") ? examplePh.businessEmail : standbyPh.businessEmail}
                class="w-full bg-transparent border-b py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors {touched.businessEmail && clientErrors.businessEmail ? 'border-red-500' : 'border-gray-400 focus:border-[#28A798]'}"
              />
              {#if touched.businessEmail && clientErrors.businessEmail}
                <span class="text-[11px] text-red-600 mt-1">{clientErrors.businessEmail}</span>
              {/if}
            </div>

            <!-- Phone Number Field with Auto Formatting -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div 
              class="flex flex-col"
              onmouseenter={() => (hoverField = "mobilePhone")}
              onmouseleave={() => (hoverField = null)}
            >
              <label 
                for="cirrust-phone" 
                class="text-[12px] font-semibold text-[#28A798] transition-all duration-200 {isActive('mobilePhone') ? 'opacity-100 h-4 translate-y-0' : 'opacity-0 h-0 -translate-y-1 overflow-hidden'}"
              >
                Phone Number (+62)
              </label>
              <div class="flex items-center border-b {touched.mobilePhone && clientErrors.mobilePhone ? 'border-red-500' : 'border-gray-400 focus-within:border-[#28A798]'}">
                <span class="text-xs text-gray-500 font-semibold mr-2">+62</span>
                <input
                  id="cirrust-phone"
                  type="tel"
                  value={form.mobilePhone}
                  oninput={handlePhoneChange}
                  onfocus={() => (focusField = "mobilePhone")}
                  onblur={() => handleBlur("mobilePhone")}
                  placeholder={isActive("mobilePhone") ? examplePh.mobilePhone : standbyPh.mobilePhone}
                  class="w-full bg-transparent py-2 text-sm text-gray-900 placeholder-gray-400 outline-none"
                />
              </div>
              {#if touched.mobilePhone && clientErrors.mobilePhone}
                <span class="text-[11px] text-red-600 mt-1">{clientErrors.mobilePhone}</span>
              {/if}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="mt-6 w-full bg-[#28A798] hover:bg-[#208a7e] text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Submit Registration</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  {/if}
</div>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
</style>
