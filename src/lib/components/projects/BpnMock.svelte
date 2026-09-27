<script lang="ts">
  import { Search, CheckCircle2, QrCode, FileText, ArrowRight, ShieldCheck, MapPin, Building, RotateCcw, X } from "lucide-svelte";

  interface ServiceItem {
    id: string;
    title: string;
    description: string;
    icon: string;
    duration: string;
  }

  const services: ServiceItem[] = [
    {
      id: "peralihan-hak",
      title: "Peralihan Hak (Jual Beli / Waris)",
      description: "Pendaftaran peralihan hak atas tanah dan satuan rumah susun berdasarkan akta otentik PPAT.",
      icon: "/projects/bpn/service1.png",
      duration: "5 Hari Kerja"
    },
    {
      id: "perubahan-hak",
      title: "Perubahan Hak (HGB ke Hak Milik)",
      description: "Peningkatan status hak atas tanah untuk rumah tinggal dari Hak Guna Bangunan menjadi Sertipikat Hak Milik.",
      icon: "/projects/bpn/service2.png",
      duration: "3 Hari Kerja"
    },
    {
      id: "pengecekan-sertipikat",
      title: "Pengecekan Sertipikat Tanah",
      description: "Pemeriksaan keaslian dan kesesuaian data yuridis maupun fisik sertipikat di pangkalan data BPN.",
      icon: "/projects/bpn/service3.png",
      duration: "1 Hari Kerja"
    },
    {
      id: "skpt",
      title: "Surat Keterangan Pendaftaran (SKPT)",
      description: "Penerbitan surat keterangan resmi mengenai status hukum bidang tanah untuk keperluan hukum/perbankan.",
      icon: "/projects/bpn/service4.png",
      duration: "3 Hari Kerja"
    },
    {
      id: "roya",
      title: "Roya (Penghapusan Hak Tanggungan)",
      description: "Pencatatan pelunasan hutang dan penghapusan catatan hak tanggungan pada buku tanah dan sertipikat.",
      icon: "/projects/bpn/service5.png",
      duration: "1 Hari Kerja"
    },
    {
      id: "pemisahan-bidang",
      title: "Pemecahan / Pemisahan Bidang Tanah",
      description: "Pengukuran dan penerbitan sertipikat baru atas bidang tanah yang dipecah sesuai persetujuan teknis.",
      icon: "/projects/bpn/service6.png",
      duration: "7 Hari Kerja"
    }
  ];

  // Tracking state
  let trackingNumber = $state("19042/2024/JKT-PST");
  let trackingModalOpen = $state(false);

  // Registration Wizard state
  let selectedService = $state<ServiceItem | null>(null);
  let wizardStep = $state<1 | 2 | 3>(1);
  let nik = $state("3175082103980004");
  let applicantName = $state("Muhammad Fikri Sidqi");
  let applicantPhone = $state("081298765432");
  let certificateNo = $state("SHM No. 04821 / Menteng");
  let landArea = $state("185");
  let selectedKantah = $state("Kantor Pertanahan Jakarta Pusat");
  let isSubmitting = $state(false);
  let registrationSuccess = $state(false);
  let generatedBookingCode = $state("");

  function handleCheckTracking(e: SubmitEvent) {
    e.preventDefault();
    trackingModalOpen = true;
  }

  function openRegisterModal(service: ServiceItem) {
    selectedService = service;
    wizardStep = 1;
    registrationSuccess = false;
  }

  async function handleCompleteRegistration() {
    isSubmitting = true;
    await new Promise(r => setTimeout(r, 650));
    generatedBookingCode = `BPN-REG-${Math.floor(100000 + Math.random() * 900000)}`;
    isSubmitting = false;
    wizardStep = 3;
    registrationSuccess = true;
  }
</script>

<div class="h-full w-full bg-[#f4f7fb] text-gray-800 font-[sans-serif] overflow-y-auto select-text relative flex flex-col text-xs sm:text-sm">
  <!-- Top Sandbox Banner -->
  <div class="bg-gradient-to-r from-[#003057] via-[#0a3d62] to-[#00213b] text-white text-[11px] px-3 py-1.5 flex items-center justify-between border-b border-blue-900 shadow-sm flex-shrink-0">
    <div class="flex items-center gap-2">
      <span class="bg-[#e5b700] text-black font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase">Live Mock</span>
      <span>Kementerian ATR/BPN — Portal e-Registrasi Pelayanan Mandiri</span>
    </div>
    <span class="text-[10px] text-blue-200 hidden sm:inline">Pusat Data dan Informasi Pertanahan (Pusdatin)</span>
  </div>

  <!-- Hero Section with ATR/BPN Identity -->
  <div class="bg-gradient-to-r from-[#003057] to-[#075985] text-white p-6 sm:p-10 relative overflow-hidden flex-shrink-0">
    <!-- Background overlay illustrations -->
    <div class="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
      <div class="space-y-3 text-center lg:text-left">
        <div class="flex items-center justify-center lg:justify-start gap-3 mb-2">
          <img 
            src="/projects/bpn/bpnLogo.png" 
            alt="Logo ATR BPN" 
            class="h-10 sm:h-12 w-auto object-contain"
            onerror={(e) => ((e.currentTarget as HTMLElement).style.display = 'none')}
          />
          <div>
            <p class="text-[11px] text-amber-300 font-semibold tracking-wide uppercase">Kementerian Agraria dan Tata Ruang</p>
            <p class="text-[13px] sm:text-sm font-bold tracking-tight">Badan Pertanahan Nasional Republik Indonesia</p>
          </div>
        </div>

        <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight">
          e-Registrasi Pelayanan Mandiri<br />
          <span class="text-amber-400">Kantor Pertanahan (Kantah)</span>
        </h1>
        <p class="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
          Layanan mandiri tanpa perantara untuk pengecekan sertipikat, permohonan balik nama, dan pemecahan bidang tanah secara transparan, cepat, dan akuntabel.
        </p>
      </div>

      <!-- Quick Status Tracking Card -->
      <div class="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-full max-w-md shadow-xl text-white">
        <div class="flex items-center gap-2 mb-3">
          <Search size={16} class="text-amber-400" />
          <h2 class="text-sm font-bold">Lacak Status Berkas Pendaftaran</h2>
        </div>
        <form onsubmit={handleCheckTracking} class="flex flex-col gap-2.5">
          <div>
            <label for="tracking-no" class="block text-[11px] text-blue-200 mb-1">Nomor Berkas / Kode Registrasi</label>
            <input 
              id="tracking-no"
              type="text"
              bind:value={trackingNumber}
              class="w-full bg-white text-gray-900 px-3 py-2 rounded-lg text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Contoh: 19042/2024"
            />
          </div>
          <button
            type="submit"
            class="bg-amber-400 hover:bg-amber-500 text-black font-bold py-2 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
          >
            <span>Cek Status Berkas Sekarang</span>
            <ArrowRight size={13} />
          </button>
        </form>
      </div>
    </div>
  </div>

  <!-- Main Content: Catalog 6 Layanan Mandiri -->
  <div class="max-w-6xl mx-auto p-4 sm:p-8 w-full flex-1 space-y-6">
    <div class="flex items-center justify-between border-b border-gray-200 pb-3">
      <div>
        <h2 class="text-base sm:text-lg font-bold text-gray-900">Katalog Layanan Pertanahan Mandiri</h2>
        <p class="text-xs text-gray-500">Pilih jenis layanan untuk mengisi formulir e-Registrasi secara langsung</p>
      </div>
      <span class="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold border border-blue-200 hidden sm:inline">
        Standar Pelayanan ISO 9001:2015
      </span>
    </div>

    <!-- 6 Services Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each services as service}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
          class="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          onclick={() => openRegisterModal(service)}
        >
          <div>
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-105 transition-transform">
                <img 
                  src={service.icon} 
                  alt={service.title} 
                  class="w-full h-full object-contain"
                  onerror={(e) => ((e.currentTarget as HTMLElement).style.display = 'none')}
                />
              </div>
              <span class="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                {service.duration}
              </span>
            </div>
            <h3 class="font-bold text-sm text-gray-900 group-hover:text-blue-700 transition-colors mb-1.5 leading-snug">
              {service.title}
            </h3>
            <p class="text-xs text-gray-500 leading-relaxed mb-4">
              {service.description}
            </p>
          </div>

          <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-blue-700 font-semibold text-xs">
            <span>Daftar Mandiri</span>
            <ArrowRight size={13} class="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- MODAL 1: STATUS TRACKING MODAL -->
  {#if trackingModalOpen}
    <div class="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <div class="flex items-center gap-2">
            <ShieldCheck size={20} class="text-blue-700" />
            <h3 class="font-bold text-base text-gray-900">Hasil Pelacakan Berkas</h3>
          </div>
          <button 
            type="button" 
            onclick={() => (trackingModalOpen = false)}
            class="text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-500">Nomor Berkas:</span>
            <span class="font-bold font-mono text-gray-900">{trackingNumber}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Jenis Layanan:</span>
            <span class="font-bold text-gray-900">Perubahan Hak (HGB ke SHM)</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Nama Pemohon:</span>
            <span class="font-bold text-gray-900">Muhammad Fikri Sidqi</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Kantor Pertanahan:</span>
            <span class="font-bold text-gray-900">Kantah ATR/BPN Jakarta Pusat</span>
          </div>
        </div>

        <!-- Progress Timeline -->
        <div class="space-y-3 pt-2">
          <p class="text-xs font-bold text-gray-700">Tahapan Proses Verifikasi:</p>
          <div class="space-y-2 text-xs">
            <div class="flex items-center gap-2.5 text-green-700">
              <CheckCircle2 size={16} class="text-green-600 flex-shrink-0" />
              <span>1. Penerimaan Berkas & Validasi NIK Pemohon (Selesai)</span>
            </div>
            <div class="flex items-center gap-2.5 text-green-700">
              <CheckCircle2 size={16} class="text-green-600 flex-shrink-0" />
              <span>2. Pengukuran & Verifikasi Peta Bidang Tanah (Selesai)</span>
            </div>
            <div class="flex items-center gap-2.5 text-blue-700 font-bold">
              <div class="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center flex-shrink-0">
                <div class="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
              </div>
              <span>3. Pemeriksaan Buku Tanah oleh Kepala Seksi Penetapan Hak (Aktif)</span>
            </div>
            <div class="flex items-center gap-2.5 text-gray-400">
              <div class="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"></div>
              <span>4. Penerbitan & Penyerahan Sertipikat Elektronik</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onclick={() => (trackingModalOpen = false)}
          class="w-full bg-[#003057] hover:bg-[#00223f] text-white font-semibold py-2.5 rounded-xl text-xs cursor-pointer shadow transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  {/if}

  <!-- MODAL 2: INTERACTIVE REGISTRATION WIZARD -->
  {#if selectedService}
    <div class="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <div>
            <h3 class="font-bold text-base text-gray-900">Formulir e-Registrasi Mandiri</h3>
            <p class="text-xs text-blue-700 font-medium">{selectedService.title}</p>
          </div>
          <button 
            type="button" 
            onclick={() => (selectedService = null)}
            class="text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {#if wizardStep === 1}
          <!-- STEP 1: DATA PEMOHON -->
          <div class="space-y-3 text-xs">
            <p class="font-bold text-gray-700">Langkah 1: Identitas Pemohon (Sesuai KTP-el)</p>
            <div>
              <label for="reg-nik" class="block font-semibold text-gray-600 mb-1">Nomor Induk Kependudukan (NIK)</label>
              <input id="reg-nik" type="text" bind:value={nik} class="w-full border rounded-lg p-2 font-mono" />
            </div>
            <div>
              <label for="reg-name" class="block font-semibold text-gray-600 mb-1">Nama Lengkap Pemohon</label>
              <input id="reg-name" type="text" bind:value={applicantName} class="w-full border rounded-lg p-2" />
            </div>
            <div>
              <label for="reg-phone" class="block font-semibold text-gray-600 mb-1">Nomor WhatsApp (Untuk Notifikasi Berkas)</label>
              <input id="reg-phone" type="tel" bind:value={applicantPhone} class="w-full border rounded-lg p-2" />
            </div>
            <button
              type="button"
              onclick={() => (wizardStep = 2)}
              class="w-full bg-[#003057] hover:bg-[#00223f] text-white font-semibold py-2.5 rounded-xl mt-4 cursor-pointer"
            >
              Lanjutkan ke Data Tanah &rarr;
            </button>
          </div>

        {:else if wizardStep === 2}
          <!-- STEP 2: DATA BIDANG TANAH -->
          <div class="space-y-3 text-xs">
            <p class="font-bold text-gray-700">Langkah 2: Informasi Bidang Tanah</p>
            <div>
              <label for="reg-cert" class="block font-semibold text-gray-600 mb-1">Nomor Sertipikat / Hak</label>
              <input id="reg-cert" type="text" bind:value={certificateNo} class="w-full border rounded-lg p-2 font-mono" />
            </div>
            <div>
              <label for="reg-area" class="block font-semibold text-gray-600 mb-1">Luas Bidang Tanah (m²)</label>
              <input id="reg-area" type="number" bind:value={landArea} class="w-full border rounded-lg p-2" />
            </div>
            <div>
              <label for="reg-kantah" class="block font-semibold text-gray-600 mb-1">Kantor Pertanahan Tujuan</label>
              <select id="reg-kantah" bind:value={selectedKantah} class="w-full border rounded-lg p-2">
                <option value="Kantor Pertanahan Jakarta Pusat">Kantor Pertanahan Jakarta Pusat</option>
                <option value="Kantor Pertanahan Jakarta Selatan">Kantor Pertanahan Jakarta Selatan</option>
                <option value="Kantor Pertanahan Jakarta Barat">Kantor Pertanahan Jakarta Barat</option>
                <option value="Kantor Pertanahan Jakarta Timur">Kantor Pertanahan Jakarta Timur</option>
                <option value="Kantor Pertanahan Kota Bekasi">Kantor Pertanahan Kota Bekasi</option>
              </select>
            </div>
            <div class="flex gap-2 pt-2">
              <button
                type="button"
                onclick={() => (wizardStep = 1)}
                class="flex-1 border py-2.5 rounded-xl font-semibold text-gray-600"
              >
                Kembali
              </button>
              <button
                type="button"
                onclick={handleCompleteRegistration}
                disabled={isSubmitting}
                class="flex-2 bg-[#003057] hover:bg-[#00223f] text-white font-semibold py-2.5 rounded-xl cursor-pointer"
              >
                {isSubmitting ? "Mengirim Registrasi..." : "Kirim Permohonan Mandiri"}
              </button>
            </div>
          </div>

        {:else if wizardStep === 3}
          <!-- STEP 3: TANDA TERIMA / SUKSES -->
          <div class="text-center space-y-3 animate-fade-in text-xs">
            <div class="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={30} />
            </div>
            <h4 class="text-base font-bold text-gray-900">Registrasi Berhasil Terkirim!</h4>
            <div class="bg-gray-50 border rounded-xl p-3 text-left space-y-1.5 font-mono text-[11px]">
              <div>Kode Booking: <strong class="text-blue-700">{generatedBookingCode}</strong></div>
              <div>Pemohon: <strong>{applicantName}</strong></div>
              <div>Kantah: <strong>{selectedKantah}</strong></div>
              <div>Status: <strong>Menunggu Pengantaran Berkas Fisik</strong></div>
            </div>
            <p class="text-gray-500 text-[11px]">
              Silakan bawa sertipikat asli dan KTP ke loket mandiri Kantah dengan menunjukkan kode booking di atas.
            </p>
            <button
              type="button"
              onclick={() => (selectedService = null)}
              class="w-full bg-[#003057] text-white font-semibold py-2.5 rounded-xl mt-3"
            >
              Selesai (Kembali ke Beranda)
            </button>
          </div>
        {/if}
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
    animation: fadeIn 0.2s ease-out forwards;
  }
</style>
