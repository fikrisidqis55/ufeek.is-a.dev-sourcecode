<script lang="ts">
  import { Plus, Trash2, CheckCircle2, RotateCcw, Building2, Paintbrush, FileText, Send, Sparkles } from "lucide-svelte";

  interface OrderItem {
    id: string;
    product: string;
    colorCode: string;
    packSize: string;
    quantity: number;
    unitPrice: number;
    discountPercent: number;
  }

  const initialItems: OrderItem[] = [
    {
      id: "1",
      product: "ALES SHIKKUI - Antibacterial Interior",
      colorCode: "KP-Pure-White-01",
      packSize: "15 L",
      quantity: 12,
      unitPrice: 1450000,
      discountPercent: 5
    },
    {
      id: "2",
      product: "PARACEM - High Quality Acrylic Emulsion",
      colorCode: "KP-Sky-Blue-14",
      packSize: "20 L",
      quantity: 8,
      unitPrice: 980000,
      discountPercent: 10
    },
    {
      id: "3",
      product: "KANSAI RUBBER PAINT - Weatherproof Exterior",
      colorCode: "KP-Terracotta-08",
      packSize: "20 L",
      quantity: 5,
      unitPrice: 1850000,
      discountPercent: 5
    }
  ];

  let submissionType = $state<"new" | "existing">("existing");
  let customerNo = $state("KP-882103");
  let customerName = $state("PT Mitra Bangun Persada");
  let division = $state("Decorative Coatings");
  let decorativeArea = $state("Jabodetabek & Banten");
  let deliveryAddress = $state("Kawasan Industri Pulogadung Blok B No. 12, Jakarta Timur");
  let items = $state<OrderItem[]>([...initialItems]);
  let isSubmitting = $state(false);
  let isSuccess = $state(false);
  let orderNumber = $state("");

  // Supporting docs checklist
  let docs = $state([
    { name: "Surat Pemesanan / Purchase Order (PO)", attached: true, size: "1.4 MB" },
    { name: "NPWP Perusahaan & NIB", attached: true, size: "850 KB" },
    { name: "Formulir Spesifikasi Warna Khusus (Matrix)", attached: true, size: "420 KB" }
  ]);

  function formatIDR(amount: number): string {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  }

  function calculateSubtotal(item: OrderItem): number {
    const gross = item.quantity * item.unitPrice;
    const discount = gross * (item.discountPercent / 100);
    return gross - discount;
  }

  let grandTotal = $derived(
    items.reduce((sum, item) => sum + calculateSubtotal(item), 0)
  );

  let totalCans = $derived(
    items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  );

  function addItem() {
    const newId = (items.length + 1).toString();
    items.push({
      id: newId,
      product: "PARACEM - High Quality Acrylic Emulsion",
      colorCode: "KP-Stone-Gray-03",
      packSize: "20 L",
      quantity: 4,
      unitPrice: 980000,
      discountPercent: 0
    });
  }

  function removeItem(id: string) {
    if (items.length <= 1) return;
    items = items.filter(it => it.id !== id);
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    isSubmitting = true;
    await new Promise(r => setTimeout(r, 700));
    orderNumber = `KS-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    isSubmitting = false;
    isSuccess = true;
  }

  function handleReset() {
    items = [...initialItems];
    isSuccess = false;
    isSubmitting = false;
  }
</script>

<div class="h-full w-full bg-[#f8f9fa] text-gray-800 font-[sans-serif] overflow-y-auto select-text relative flex flex-col text-xs sm:text-sm">
  <!-- Top Sandbox Banner -->
  <div class="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white text-[11px] px-3 py-1.5 flex items-center justify-between border-b border-red-900 shadow-sm flex-shrink-0">
    <div class="flex items-center gap-2">
      <span class="bg-amber-400 text-black font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase">Live Mock</span>
      <span>Kansai Paint Indonesia — Custom Order Profile Workflow Engine</span>
    </div>
    <button 
      type="button" 
      onclick={handleReset} 
      class="hover:underline flex items-center gap-1 text-[11px] opacity-90 hover:opacity-100 cursor-pointer text-white"
    >
      <RotateCcw size={11} />
      <span>Reset Form</span>
    </button>
  </div>

  <!-- Loading Overlay -->
  {#if isSubmitting}
    <div class="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-xl flex flex-col items-center gap-3 animate-fade-in">
        <div class="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p class="text-sm font-semibold text-gray-800">Memproses Verifikasi Matrix Order...</p>
        <p class="text-xs text-gray-400">Menghubungkan Cirrust Workflow Engine</p>
      </div>
    </div>
  {/if}

  {#if isSuccess}
    <!-- SUCCESS / SUBMISSION COMPLETE SCREEN -->
    <div class="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 animate-fade-in">
      <div class="w-full max-w-lg bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-md flex flex-col items-center text-center">
        <div class="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={36} />
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mb-1">Permohonan Order Berhasil Diajukan!</h2>
        <p class="text-xs text-gray-500 font-mono mb-4">Nomor Order: <strong class="text-red-600 font-bold">{orderNumber}</strong></p>

        <div class="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-xs mb-6 space-y-2">
          <div class="flex justify-between border-b border-gray-200 pb-1.5">
            <span class="text-gray-500">Customer:</span>
            <span class="font-bold text-gray-800">{customerName} ({customerNo})</span>
          </div>
          <div class="flex justify-between border-b border-gray-200 pb-1.5">
            <span class="text-gray-500">Total Volume:</span>
            <span class="font-bold text-gray-800">{totalCans} Kaleng / Pails ({items.length} Baris Cat)</span>
          </div>
          <div class="flex justify-between border-b border-gray-200 pb-1.5">
            <span class="text-gray-500">Alamat Kirim:</span>
            <span class="font-bold text-gray-800 max-w-[240px] truncate">{deliveryAddress}</span>
          </div>
          <div class="flex justify-between pt-1">
            <span class="text-gray-500 font-bold">Total Nilai Order:</span>
            <span class="font-bold text-red-600 text-sm">{formatIDR(grandTotal)}</span>
          </div>
        </div>

        <p class="text-xs text-gray-500 mb-6 leading-relaxed">
          Order ini telah masuk ke dalam antrean persetujuan multi-tier Cirrust Workflow (Sales Manager & Finance Approval).
        </p>

        <div class="flex gap-3 w-full">
          <button
            type="button"
            onclick={handleReset}
            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs cursor-pointer shadow transition-all"
          >
            Buat Permohonan Baru (Reset)
          </button>
        </div>
      </div>
    </div>
  {:else}
    <!-- MAIN CUSTOM PAGE FORM -->
    <div class="flex-1 flex flex-col p-4 sm:p-8 max-w-6xl mx-auto w-full gap-6">
      <!-- Header -->
      <header class="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <img 
            src="/projects/kansai/KansaiPaintLogo.png" 
            alt="Kansai Paint" 
            class="h-9 sm:h-11 w-auto object-contain"
            onerror={(e) => ((e.currentTarget as HTMLElement).style.display = 'none')}
          />
          <div>
            <h1 class="text-base sm:text-lg font-bold text-gray-900 leading-tight">Formulir Pesanan Cat & Profiling Custom Page</h1>
            <p class="text-xs text-gray-500">Cirrust Enterprise Engine • PT Kansai Paint Indonesia</p>
          </div>
        </div>
        <div class="flex items-center gap-2 self-end sm:self-center">
          <span class="bg-red-50 text-red-700 border border-red-200 text-xs px-2.5 py-1 rounded-md font-semibold">
            Status: Draft Pengajuan
          </span>
        </div>
      </header>

      <form onsubmit={handleSubmit} class="flex flex-col gap-6">
        <!-- Section 1: Customer & Classification -->
        <div class="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div class="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Building2 size={16} class="text-red-600" />
            <h2 class="text-sm sm:text-base font-bold text-gray-900">1. Informasi Pelanggan & Wilayah</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <span class="block text-xs font-semibold text-gray-600 mb-1">Tipe Pengajuan</span>
              <div class="flex gap-2">
                <button
                  type="button"
                  onclick={() => (submissionType = 'existing')}
                  class="flex-1 py-1.5 px-2 text-xs rounded border text-center transition-all cursor-pointer {submissionType === 'existing' ? 'bg-red-50 border-red-500 text-red-700 font-bold' : 'border-gray-300 text-gray-600'}"
                >
                  Pelanggan Tetap
                </button>
                <button
                  type="button"
                  onclick={() => (submissionType = 'new')}
                  class="flex-1 py-1.5 px-2 text-xs rounded border text-center transition-all cursor-pointer {submissionType === 'new' ? 'bg-red-50 border-red-500 text-red-700 font-bold' : 'border-gray-300 text-gray-600'}"
                >
                  Pelanggan Baru
                </button>
              </div>
            </div>

            <div>
              <label for="cust-no" class="block text-xs font-semibold text-gray-600 mb-1">Nomor Customer</label>
              <input
                id="cust-no"
                type="text"
                bind:value={customerNo}
                class="w-full bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 font-mono focus:border-red-500 outline-none"
              />
            </div>

            <div class="sm:col-span-2">
              <label for="cust-name" class="block text-xs font-semibold text-gray-600 mb-1">Nama Perusahaan / Distributor</label>
              <input
                id="cust-name"
                type="text"
                bind:value={customerName}
                class="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-red-500 outline-none font-semibold"
              />
            </div>

            <div>
              <label for="div-select" class="block text-xs font-semibold text-gray-600 mb-1">Divisi Produk</label>
              <select
                id="div-select"
                bind:value={division}
                class="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-red-500 outline-none"
              >
                <option value="Decorative Coatings">Decorative Coatings (Retail/Project)</option>
                <option value="Industrial Coating">Industrial & Heavy Duty Coating</option>
                <option value="Automotive Refinish">Automotive OEM & Refinish</option>
              </select>
            </div>

            <div>
              <label for="area-select" class="block text-xs font-semibold text-gray-600 mb-1">Wilayah Distribusi</label>
              <select
                id="area-select"
                bind:value={decorativeArea}
                class="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-red-500 outline-none"
              >
                <option value="Jabodetabek & Banten">Jabodetabek & Banten</option>
                <option value="Jawa Barat & Sekitarnya">Jawa Barat & Sekitarnya</option>
                <option value="Jawa Tengah & DIY">Jawa Tengah & DIY</option>
                <option value="Jawa Timur & Bali">Jawa Timur & Bali</option>
                <option value="Sumatera & Luar Jawa">Sumatera & Luar Jawa</option>
              </select>
            </div>

            <div class="sm:col-span-2">
              <label for="addr-input" class="block text-xs font-semibold text-gray-600 mb-1">Alamat Pengiriman (Gudang/Site)</label>
              <input
                id="addr-input"
                type="text"
                bind:value={deliveryAddress}
                class="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:border-red-500 outline-none"
              />
            </div>
          </div>
        </div>

        <!-- Section 2: Paint Order Matrix Table (Interactive Array Calculation) -->
        <div class="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-gray-100 pb-3 flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <Paintbrush size={16} class="text-red-600" />
              <h2 class="text-sm sm:text-base font-bold text-gray-900">2. Rincian Matrix Pesanan Cat</h2>
            </div>
            <button
              type="button"
              onclick={addItem}
              class="bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Tambah Baris Cat</span>
            </button>
          </div>

          <!-- Dynamic Items Table -->
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="w-full text-left border-collapse text-xs">
              <thead class="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th class="p-2.5">Produk Cat Kansai</th>
                  <th class="p-2.5">Kode Warna</th>
                  <th class="p-2.5">Kemasan</th>
                  <th class="p-2.5 w-20">Qty (Kaleng)</th>
                  <th class="p-2.5">Harga Satuan</th>
                  <th class="p-2.5 w-16">Disc (%)</th>
                  <th class="p-2.5 text-right">Subtotal</th>
                  <th class="p-2.5 w-10 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {#each items as item (item.id)}
                  <tr class="hover:bg-gray-50/80 transition-colors">
                    <td class="p-2">
                      <select
                        bind:value={item.product}
                        class="w-full bg-transparent border border-gray-300 rounded p-1 text-xs focus:border-red-500 outline-none"
                      >
                        <option value="ALES SHIKKUI - Antibacterial Interior">ALES SHIKKUI - Antibacterial Interior</option>
                        <option value="PARACEM - High Quality Acrylic Emulsion">PARACEM - High Quality Acrylic Emulsion</option>
                        <option value="KANSAI RUBBER PAINT - Weatherproof Exterior">KANSAI RUBBER PAINT - Weatherproof Exterior</option>
                        <option value="PROPERTY - Economic Wall Paint">PROPERTY - Economic Wall Paint</option>
                        <option value="ZINC CHROMATE PRIMER - Anti-Corrosive">ZINC CHROMATE PRIMER - Anti-Corrosive</option>
                      </select>
                    </td>
                    <td class="p-2">
                      <input
                        type="text"
                        bind:value={item.colorCode}
                        class="w-28 border border-gray-300 rounded p-1 text-xs font-mono focus:border-red-500 outline-none"
                      />
                    </td>
                    <td class="p-2">
                      <select
                        bind:value={item.packSize}
                        class="border border-gray-300 rounded p-1 text-xs focus:border-red-500 outline-none"
                      >
                        <option value="5 L">5 L (Galon)</option>
                        <option value="15 L">15 L</option>
                        <option value="20 L">20 L (Pail)</option>
                        <option value="200 L">200 L (Drum)</option>
                      </select>
                    </td>
                    <td class="p-2">
                      <input
                        type="number"
                        min="1"
                        bind:value={item.quantity}
                        class="w-16 border border-gray-300 rounded p-1 text-xs text-center font-bold focus:border-red-500 outline-none"
                      />
                    </td>
                    <td class="p-2 text-gray-700 font-mono">
                      {formatIDR(item.unitPrice)}
                    </td>
                    <td class="p-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        bind:value={item.discountPercent}
                        class="w-12 border border-gray-300 rounded p-1 text-xs text-center focus:border-red-500 outline-none"
                      />
                    </td>
                    <td class="p-2 text-right font-bold text-gray-900 font-mono">
                      {formatIDR(calculateSubtotal(item))}
                    </td>
                    <td class="p-2 text-center">
                      <button
                        type="button"
                        onclick={() => removeItem(item.id)}
                        disabled={items.length <= 1}
                        class="text-gray-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Hapus Baris"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>

          <!-- Summary & Grand Total Bar -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="text-xs text-gray-600">
              Total Volume: <strong class="text-gray-900">{totalCans} Kaleng / Pails</strong> ({items.length} Macam Warna)
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs text-gray-600 font-semibold">Total Estimasi Nilai:</span>
              <span class="text-base sm:text-lg font-bold text-red-600 font-mono">{formatIDR(grandTotal)}</span>
            </div>
          </div>
        </div>

        <!-- Section 3: Supporting Documents -->
        <div class="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div class="flex items-center gap-2 border-b border-gray-100 pb-3">
            <FileText size={16} class="text-red-600" />
            <h2 class="text-sm sm:text-base font-bold text-gray-900">3. Kelengkapan Berkas Pendukung (ISO Audit Compliance)</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {#each docs as doc}
              <div class="border border-gray-200 rounded-lg p-3 flex items-center justify-between bg-gray-50/50">
                <div class="flex items-center gap-2 min-w-0">
                  <CheckCircle2 size={16} class="text-green-600 flex-shrink-0" />
                  <div class="truncate">
                    <p class="text-xs font-semibold text-gray-800 truncate">{doc.name}</p>
                    <p class="text-[10px] text-gray-400 font-mono">{doc.size}</p>
                  </div>
                </div>
                <span class="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-bold">Attached</span>
              </div>
            {/each}
          </div>
        </div>

        <!-- Action Submit Bar -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onclick={() => alert("Draft permohonan berhasil disimpan di local cache.")}
            class="px-4 py-2 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 text-xs transition-colors cursor-pointer"
          >
            Simpan Draft
          </button>
          <button
            type="submit"
            class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send size={13} />
            <span>Kirim Permohonan Order (Submit)</span>
          </button>
        </div>
      </form>
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
