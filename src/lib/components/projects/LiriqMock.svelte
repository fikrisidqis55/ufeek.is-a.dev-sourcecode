<script lang="ts">
  import { onMount } from "svelte";
  import { 
    Search, 
    Plus, 
    Download, 
    Trash2, 
    Eye, 
    Radio, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    ChevronLeft, 
    ChevronRight, 
    ChevronDown, 
    Settings, 
    FileText, 
    Layers, 
    Sliders, 
    X, 
    UploadCloud,
    FileSpreadsheet,
    Activity,
    Bell,
    Check,
    RefreshCw,
    Filter
  } from "lucide-svelte";

  interface JobHistoryItem {
    stepName: string;
    startTime: string | null;
    lastUpdatedTime: string | null;
    lastUpdatedBy: string;
    deviceName: string;
    deviceType: string;
    totalRemaining: number;
    totalDone: number;
  }

  interface JobItem {
    id: string;
    name: string;
    owner: string;
    storageName: string;
    type: "MapTag" | "InventoryChecking";
    status: "New" | "Ongoing" | "Finish";
    createdAt: string;
    lastModifiedOn: string;
    totalItems: number;
    totalDone: number;
    totalRemaining: number;
    createdBy: string;
    history: JobHistoryItem[];
  }

  // Pre-populated authentic RFID jobs from production system
  let jobs = $state<JobItem[]>([
    {
      id: "job-001",
      name: "Stock Opname Finished Goods Q3",
      owner: "PT Quadrant Synergy",
      storageName: "Warehouse Jakarta Main - Rack A1-A4",
      type: "InventoryChecking",
      status: "Ongoing",
      createdAt: "2025-08-14 09:30",
      lastModifiedOn: "2025-08-14 14:15",
      totalItems: 480,
      totalDone: 360,
      totalRemaining: 120,
      createdBy: "Ufeek (Fikri Sidqi)",
      history: [
        {
          stepName: "RFID Handheld Bulk Scan",
          startTime: "2025-08-14 09:45",
          lastUpdatedTime: "2025-08-14 14:15",
          lastUpdatedBy: "Operator Wahyu",
          deviceName: "Zebra MC3300R #02",
          deviceType: "Handheld Reader",
          totalRemaining: 120,
          totalDone: 360
        },
        {
          stepName: "Discrepancy Audit",
          startTime: "2025-08-14 14:20",
          lastUpdatedTime: "2025-08-14 14:45",
          lastUpdatedBy: "Supervisor Budi",
          deviceName: "Chainway C72 #01",
          deviceType: "Handheld Reader",
          totalRemaining: 120,
          totalDone: 0
        }
      ]
    },
    {
      id: "job-002",
      name: "Pallet RFID Mapping - Inbound Raw Material",
      owner: "Astra Otoparts Tbk",
      storageName: "Inbound Staging Bay 03",
      type: "MapTag",
      status: "Finish",
      createdAt: "2025-08-12 08:00",
      lastModifiedOn: "2025-08-12 16:40",
      totalItems: 250,
      totalDone: 250,
      totalRemaining: 0,
      createdBy: "Ufeek (Fikri Sidqi)",
      history: [
        {
          stepName: "EPC Tag Encode & Bind",
          startTime: "2025-08-12 08:15",
          lastUpdatedTime: "2025-08-12 11:30",
          lastUpdatedBy: "Operator Dedi",
          deviceName: "Zebra ZD621R",
          deviceType: "RFID Desktop Printer",
          totalRemaining: 0,
          totalDone: 150
        },
        {
          stepName: "Pallet Gate Verification",
          startTime: "2025-08-12 13:00",
          lastUpdatedTime: "2025-08-12 16:40",
          lastUpdatedBy: "Operator Arif",
          deviceName: "Zebra MC3300R #01",
          deviceType: "Handheld Reader",
          totalRemaining: 0,
          totalDone: 100
        }
      ]
    },
    {
      id: "job-003",
      name: "Asset Audit IT & Datacenter Equipment",
      owner: "Bank Mandiri IT Infrastructure",
      storageName: "Server Room Lantai 4 - Gedung Plaza",
      type: "InventoryChecking",
      status: "New",
      createdAt: "2025-08-15 11:00",
      lastModifiedOn: "2025-08-15 11:00",
      totalItems: 145,
      totalDone: 0,
      totalRemaining: 145,
      createdBy: "Ufeek (Fikri Sidqi)",
      history: [
        {
          stepName: "Pre-Scan Initialization",
          startTime: null,
          lastUpdatedTime: null,
          lastUpdatedBy: "-",
          deviceName: "Urovo DT50P #01",
          deviceType: "Handheld Reader",
          totalRemaining: 145,
          totalDone: 0
        }
      ]
    },
    {
      id: "job-004",
      name: "Cold Storage Vaccine Batch Verification",
      owner: "Bio Farma Distribution",
      storageName: "Cold Storage Unit -20°C Zone B",
      type: "MapTag",
      status: "Ongoing",
      createdAt: "2025-08-14 13:20",
      lastModifiedOn: "2025-08-15 08:10",
      totalItems: 600,
      totalDone: 450,
      totalRemaining: 150,
      createdBy: "Ufeek (Fikri Sidqi)",
      history: [
        {
          stepName: "Cryo RFID Tag Verification",
          startTime: "2025-08-14 14:00",
          lastUpdatedTime: "2025-08-15 08:10",
          lastUpdatedBy: "Operator Rizky",
          deviceName: "Chainway C72 Rugged",
          deviceType: "Handheld Reader",
          totalRemaining: 150,
          totalDone: 450
        }
      ]
    },
    {
      id: "job-005",
      name: "Returnable Transport Item (RTI) Cycle Count",
      owner: "Indofood Sukses Makmur",
      storageName: "Distribution Center Cikarang Yard",
      type: "InventoryChecking",
      status: "Finish",
      createdAt: "2025-08-10 07:45",
      lastModifiedOn: "2025-08-10 17:30",
      totalItems: 1200,
      totalDone: 1200,
      totalRemaining: 0,
      createdBy: "Ufeek (Fikri Sidqi)",
      history: [
        {
          stepName: "Dock Door Portal Scan",
          startTime: "2025-08-10 08:00",
          lastUpdatedTime: "2025-08-10 17:30",
          lastUpdatedBy: "Portal Daemon",
          deviceName: "Zebra FX9600 Fixed",
          deviceType: "4-Port Fixed Reader",
          totalRemaining: 0,
          totalDone: 1200
        }
      ]
    }
  ]);

  // UI Navigation & Layout States
  let activeMenu = $state<"job-in" | "job-out" | "job-template" | "item-template" | "setting">("job-in");
  let isSidebarCollapsed = $state(false);
  let openSubmenus = $state<Record<string, boolean>>({ job: true, maintenance: false });

  // Filtering & Pagination States
  let searchQuery = $state("");
  let selectedStatuses = $state<string[]>([]);
  let jobTypeFilter = $state<"" | "MapTag" | "InventoryChecking">("");
  let pageSize = $state(10);
  let currentPage = $state(1);
  let sortField = $state<"lastModifiedOn" | "name" | "createdAt">("lastModifiedOn");
  let sortAsc = $state(false);

  // Modal & Dialog States
  let isDetailModalOpen = $state(false);
  let activeDetailJob = $state<JobItem | null>(null);
  let activeDetailTab = $state<"info" | "history">("info");

  let isCreateModalOpen = $state(false);
  let isDeleteModalOpen = $state(false);
  let jobToDelete = $state<JobItem | null>(null);

  // Toast / Notification State
  let toast = $state<{ title: string; desc: string; type: "success" | "info" | "warning" } | null>(null);
  let toastTimer: any = null;

  function showToast(title: string, desc: string, type: "success" | "info" | "warning" = "success") {
    if (toastTimer) clearTimeout(toastTimer);
    toast = { title, desc, type };
    toastTimer = setTimeout(() => {
      toast = null;
    }, 4500);
  }

  // Create Job Form Reactive State
  let formJobName = $state("");
  let formOwner = $state("");
  let formStorage = $state("");
  let formType = $state<"MapTag" | "InventoryChecking">("InventoryChecking");
  let formTemplate = $state("DEFAULT_STOCK_TAKE_V2");
  let formFile = $state<File | null>(null);
  let formFileName = $state<string>("");
  let formItemCount = $state<number>(85);
  let isSubmittingJob = $state(false);

  // Filtered & Sorted Jobs
  const filteredJobs = $derived(
    jobs.filter((j) => {
      // Job Type filter
      if (jobTypeFilter && j.type !== jobTypeFilter) return false;
      // Status filter
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(j.status)) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = j.name.toLowerCase().includes(q);
        const matchOwner = j.owner.toLowerCase().includes(q);
        const matchStorage = j.storageName.toLowerCase().includes(q);
        if (!matchName && !matchOwner && !matchStorage) return false;
      }
      return true;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    })
  );

  const totalFiltered = $derived(filteredJobs.length);
  const totalPages = $derived(Math.max(1, Math.ceil(totalFiltered / pageSize)));
  const paginatedJobs = $derived(
    filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  );

  // Telemetry Aggregates
  const totalItemsAllJobs = $derived(jobs.reduce((acc, j) => acc + j.totalItems, 0));
  const totalDoneAllJobs = $derived(jobs.reduce((acc, j) => acc + j.totalDone, 0));
  const activeReaderCount = $state(3);

  function toggleStatusFilter(status: string) {
    if (selectedStatuses.includes(status)) {
      selectedStatuses = selectedStatuses.filter((s) => s !== status);
    } else {
      selectedStatuses = [...selectedStatuses, status];
    }
    currentPage = 1;
  }

  function handleSort(field: "lastModifiedOn" | "name" | "createdAt") {
    if (sortField === field) {
      sortAsc = !sortAsc;
    } else {
      sortField = field;
      sortAsc = false;
    }
  }

  function openJobDetails(job: JobItem) {
    activeDetailJob = job;
    activeDetailTab = "info";
    isDetailModalOpen = true;
  }

  function promptDeleteJob(job: JobItem) {
    jobToDelete = job;
    isDeleteModalOpen = true;
  }

  function confirmDeleteJob() {
    if (!jobToDelete) return;
    const name = jobToDelete.name;
    jobs = jobs.filter((j) => j.id !== jobToDelete?.id);
    if (activeDetailJob?.id === jobToDelete.id) {
      isDetailModalOpen = false;
    }
    isDeleteModalOpen = false;
    jobToDelete = null;
    showToast("Job Successfully Deleted", `Job "${name}" was permanently removed.`, "success");
  }

  function handleCreateJobSubmit(e: Event) {
    e.preventDefault();
    if (!formJobName.trim()) {
      showToast("Validation Error", "Please provide a valid Job Name.", "warning");
      return;
    }
    if (!formOwner.trim()) {
      showToast("Validation Error", "Owner Name is required.", "warning");
      return;
    }

    isSubmittingJob = true;
    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toISOString().replace("T", " ").slice(0, 16);
      const newJob: JobItem = {
        id: `job-00${jobs.length + 1}`,
        name: formJobName.trim(),
        owner: formOwner.trim(),
        storageName: formStorage.trim() || "Warehouse Area Beta - Zone 1",
        type: formType,
        status: "New",
        createdAt: dateStr,
        lastModifiedOn: dateStr,
        totalItems: formItemCount || 100,
        totalDone: 0,
        totalRemaining: formItemCount || 100,
        createdBy: "Ufeek (Quadrant SI)",
        history: [
          {
            stepName: formType === "MapTag" ? "Tag Association & Print" : "Initial Stocktake Pass",
            startTime: null,
            lastUpdatedTime: null,
            lastUpdatedBy: "-",
            deviceName: "Zebra MC3300R #01",
            deviceType: "Handheld Reader",
            totalRemaining: formItemCount || 100,
            totalDone: 0
          }
        ]
      };

      jobs = [newJob, ...jobs];
      isSubmittingJob = false;
      isCreateModalOpen = false;

      // Reset form
      formJobName = "";
      formOwner = "";
      formStorage = "";
      formFileName = "";

      showToast(
        "Job Created Successfully",
        `Job "${newJob.name}" with ${newJob.totalItems} RFID items is ready for handheld sync.`,
        "success"
      );
    }, 600);
  }

  function downloadReportCsv(job: JobItem) {
    const csvContent = [
      "Asset_ID,EPC_RFID,Item_Name,Storage_Zone,Status,Scanned_By,Timestamp",
      `AST-901,E28011606000021004C901,Industrial Router Switch,${job.storageName},Matched,Field Operator,${job.lastModifiedOn}`,
      `AST-902,E28011606000021004C902,UPS High Voltage 3000VA,${job.storageName},Matched,Field Operator,${job.lastModifiedOn}`,
      `AST-903,E28011606000021004C903,Server Rack Unit Blade 2U,${job.storageName},Matched,Field Operator,${job.lastModifiedOn}`,
      `AST-904,E28011606000021004C904,Patch Panel Cat6A Shielded,${job.storageName},Pending,Field Operator,-`
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Liriq_Report_${job.name.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("Report Exported", `Excel/CSV report for "${job.name}" downloaded.`, "info");
  }

  function handleSimulatedFileUpload(e: any) {
    const files = e.target.files;
    if (files && files.length > 0) {
      formFileName = files[0].name;
      formItemCount = Math.floor(Math.random() * 150) + 50;
    } else {
      formFileName = "sample_rfid_items_manifest.xlsx";
      formItemCount = 120;
    }
  }
</script>

<!-- Outer Container with Authentic Liriq Typography & Clean Minimal Colors -->
<div class="h-full w-full bg-[#f6f6f6] text-[#1e1e1e] flex flex-col font-['Inter',system-ui,sans-serif] text-xs select-none overflow-hidden relative">

  <!-- TOP HEADER (Authentic Liriq Dark Charcoal #1e1e1e Bar) -->
  <header class="h-14 bg-[#1e1e1e] text-white flex items-center justify-between px-4 z-20 shrink-0 border-b border-neutral-800 shadow-sm">
    <div class="flex items-center gap-3">
      <!-- Collapse Sidebar Toggle Button -->
      <button 
        type="button" 
        onclick={() => (isSidebarCollapsed = !isSidebarCollapsed)}
        class="text-neutral-400 hover:text-white p-1.5 rounded hover:bg-neutral-800 transition-colors"
        title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {#if isSidebarCollapsed}
          <ChevronRight size={18} />
        {:else}
          <ChevronLeft size={18} />
        {/if}
      </button>

      <!-- RFID Handheld Live Telemetry Indicator -->
      <div class="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700/60 text-[11px]">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-neutral-300 font-medium">RFID Reader:</span>
        <span class="text-white font-mono font-semibold">Zebra MC3300R</span>
        <span class="text-emerald-400 text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">ONLINE • 94%</span>
      </div>
    </div>

    <!-- Right Topbar Profile & Notifications -->
    <div class="flex items-center gap-2">
      <!-- Notification Icon -->
      <button 
        type="button"
        onclick={() => showToast("Notifications", "All 3 RFID handheld readers are synchronized.", "info")}
        class="relative p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
      >
        <Bell size={18} />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-[#fd510f] rounded-full"></span>
      </button>

      <div class="h-4 w-[1px] bg-neutral-700 mx-1"></div>

      <!-- User Profile Badge -->
      <div class="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-neutral-800/70 cursor-pointer transition-colors">
        <div class="w-8 h-8 rounded-full bg-[#ffefe4] text-[#fd510f] font-bold flex items-center justify-center text-xs border border-[#fd510f]/20">
          Q
        </div>
        <div class="hidden md:flex flex-col text-left">
          <span class="text-xs font-semibold text-white leading-tight">Quadrant SI</span>
          <span class="text-[10px] text-neutral-400 leading-tight">Ufeek (Lead Dev)</span>
        </div>
        <ChevronDown size={14} class="text-neutral-400 hidden sm:block ml-0.5" />
      </div>
    </div>
  </header>

  <!-- BODY: SIDER + CONTENT -->
  <div class="flex-1 flex overflow-hidden">
    
    <!-- DASHBOARD SIDER (Authentic Liriq #e1e1e1 Sidebar) -->
    <aside class="{isSidebarCollapsed ? 'w-16' : 'w-56'} bg-[#e1e1e1] flex flex-col shrink-0 transition-all duration-200 border-r border-neutral-300 z-10 select-none">
      <!-- Top Sider Logo Container -->
      <div class="h-16 bg-[#1e1e1e] flex items-center justify-center px-3 border-b border-neutral-800 overflow-hidden">
        {#if isSidebarCollapsed}
          <div class="w-8 h-8 rounded bg-[#fd510f] flex items-center justify-center font-black text-white text-base">
            L
          </div>
        {:else}
          <img 
            src="/projects/liriq/assets/logo/liriqLogoWhite.svg" 
            alt="LIRIQ Logo" 
            class="h-9 w-auto object-contain drop-shadow"
          />
        {/if}
      </div>

      <!-- Navigation Menus -->
      <div class="flex-1 py-3 flex flex-col gap-1 overflow-y-auto">
        <!-- 1. JOB SECTION -->
        <div>
          <button 
            type="button"
            onclick={() => {
              if (isSidebarCollapsed) {
                activeMenu = 'job-in';
              } else {
                openSubmenus.job = !openSubmenus.job;
              }
            }}
            class="w-full flex items-center justify-between px-4 py-2.5 hover:bg-black/5 text-[#1e1e1e] transition-colors font-medium text-left"
          >
            <div class="flex items-center gap-3">
              <FileText size={18} class="text-[#1e1e1e] shrink-0" />
              {#if !isSidebarCollapsed}
                <span class="text-sm">Job</span>
              {/if}
            </div>
            {#if !isSidebarCollapsed}
              <ChevronDown 
                size={14} 
                class="text-[#fd510f] transition-transform duration-200 {openSubmenus.job ? 'rotate-0' : '-rotate-90'}" 
              />
            {/if}
          </button>

          <!-- Job Submenus -->
          {#if (!isSidebarCollapsed && openSubmenus.job) || isSidebarCollapsed}
            <div class="flex flex-col">
              <button 
                type="button"
                onclick={() => (activeMenu = 'job-in')}
                class="{isSidebarCollapsed ? 'px-0 justify-center' : 'pl-11 pr-4 justify-start'} h-10 flex items-center text-xs transition-colors font-medium {activeMenu === 'job-in' ? 'bg-white font-bold text-black border-b-2 border-[#f6b73c]' : 'text-neutral-700 hover:bg-black/5'}"
                title="Job In"
              >
                <span>{isSidebarCollapsed ? 'IN' : 'Job In'}</span>
              </button>
              <button 
                type="button"
                onclick={() => (activeMenu = 'job-out')}
                class="{isSidebarCollapsed ? 'px-0 justify-center' : 'pl-11 pr-4 justify-start'} h-10 flex items-center text-xs transition-colors font-medium {activeMenu === 'job-out' ? 'bg-white font-bold text-black border-b-2 border-[#f6b73c]' : 'text-neutral-700 hover:bg-black/5'}"
                title="Job Out"
              >
                <span>{isSidebarCollapsed ? 'OUT' : 'Job Out'}</span>
              </button>
            </div>
          {/if}
        </div>

        <!-- 2. MAINTENANCE SECTION -->
        <div>
          <button 
            type="button"
            onclick={() => {
              if (isSidebarCollapsed) {
                activeMenu = 'job-template';
              } else {
                openSubmenus.maintenance = !openSubmenus.maintenance;
              }
            }}
            class="w-full flex items-center justify-between px-4 py-2.5 hover:bg-black/5 text-[#1e1e1e] transition-colors font-medium text-left"
          >
            <div class="flex items-center gap-3">
              <Layers size={18} class="text-[#1e1e1e] shrink-0" />
              {#if !isSidebarCollapsed}
                <span class="text-sm">Maintenance</span>
              {/if}
            </div>
            {#if !isSidebarCollapsed}
              <ChevronDown 
                size={14} 
                class="text-[#fd510f] transition-transform duration-200 {openSubmenus.maintenance ? 'rotate-0' : '-rotate-90'}" 
              />
            {/if}
          </button>

          <!-- Maintenance Submenus -->
          {#if (!isSidebarCollapsed && openSubmenus.maintenance) || isSidebarCollapsed}
            <div class="flex flex-col">
              <button 
                type="button"
                onclick={() => (activeMenu = 'job-template')}
                class="{isSidebarCollapsed ? 'px-0 justify-center' : 'pl-11 pr-4 justify-start'} h-10 flex items-center text-xs transition-colors font-medium {activeMenu === 'job-template' ? 'bg-white font-bold text-black border-b-2 border-[#f6b73c]' : 'text-neutral-700 hover:bg-black/5'}"
                title="Job Template"
              >
                <span>{isSidebarCollapsed ? 'JT' : 'Job Template'}</span>
              </button>
              <button 
                type="button"
                onclick={() => (activeMenu = 'item-template')}
                class="{isSidebarCollapsed ? 'px-0 justify-center' : 'pl-11 pr-4 justify-start'} h-10 flex items-center text-xs transition-colors font-medium {activeMenu === 'item-template' ? 'bg-white font-bold text-black border-b-2 border-[#f6b73c]' : 'text-neutral-700 hover:bg-black/5'}"
                title="Item Template"
              >
                <span>{isSidebarCollapsed ? 'IT' : 'Item Template'}</span>
              </button>
            </div>
          {/if}
        </div>

        <!-- 3. SETTING SECTION -->
        <button 
          type="button"
          onclick={() => (activeMenu = 'setting')}
          class="{isSidebarCollapsed ? 'justify-center px-0' : 'justify-start px-4'} flex items-center gap-3 py-2.5 transition-colors font-medium {activeMenu === 'setting' ? 'bg-white font-bold text-black border-b-2 border-[#f6b73c]' : 'text-[#1e1e1e] hover:bg-black/5'}"
          title="Setting"
        >
          <Settings size={18} class="text-[#1e1e1e] shrink-0" />
          {#if !isSidebarCollapsed}
            <span class="text-sm">Setting</span>
          {/if}
        </button>
      </div>

      <!-- Reader Hardware Status in Sidebar footer -->
      {#if !isSidebarCollapsed}
        <div class="p-3 border-t border-neutral-300 text-[11px] bg-neutral-200/50">
          <div class="flex items-center justify-between text-neutral-600 mb-1">
            <span>Synced Tags:</span>
            <span class="font-bold text-neutral-900">{totalDoneAllJobs} / {totalItemsAllJobs}</span>
          </div>
          <div class="w-full bg-neutral-300 rounded-full h-1.5 overflow-hidden">
            <div class="bg-[#fd510f] h-full" style="width: {(totalDoneAllJobs / totalItemsAllJobs * 100).toFixed(0)}%"></div>
          </div>
        </div>
      {/if}
    </aside>

    <!-- MAIN VIEWPORT (White/Off-white Canvas) -->
    <main class="flex-1 flex flex-col bg-[#f6f6f6] overflow-y-auto">
      
      {#if activeMenu === 'job-in' || activeMenu === 'job-out'}
        <!-- ==================== JOB IN / JOB OUT VIEW ==================== -->
        <div class="p-4 sm:p-6 flex-1 flex flex-col max-w-7xl w-full mx-auto">
          
          <!-- Page Header & Action Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-gray-200">
            <div class="flex items-center gap-2.5">
              <div class="p-2 bg-white rounded-lg border border-gray-200 shadow-xs text-neutral-800">
                <FileText size={20} />
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900 leading-tight">
                  {activeMenu === 'job-in' ? 'Job In' : 'Job Out'}
                </h1>
                <p class="text-[11px] text-gray-500">
                  {activeMenu === 'job-in' ? 'Inbound asset RFID tagging, registration, and warehouse audits' : 'Outbound dispatch and gate verification records'}
                </p>
              </div>
            </div>

            <!-- Create New Job Primary Button (Liriq Signature #fd510f) -->
            <button 
              type="button"
              onclick={() => (isCreateModalOpen = true)}
              class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#fd510f] hover:bg-[#e0480d] active:bg-[#c93e09] text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Create New Job</span>
            </button>
          </div>

          <!-- Filter & Controls Toolbar -->
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-xs mb-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            <!-- Left: Job Type Pills & Page Size -->
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-gray-500 font-medium">Job type:</span>
              <button 
                type="button"
                onclick={() => (jobTypeFilter = jobTypeFilter === 'MapTag' ? '' : 'MapTag')}
                class="px-3.5 py-1 rounded-full text-xs font-semibold transition-all border {jobTypeFilter === 'MapTag' ? 'border-[#fd510f] bg-[#ffeae2] text-[#fd510f]' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}"
              >
                Map Tag
              </button>
              <button 
                type="button"
                onclick={() => (jobTypeFilter = jobTypeFilter === 'InventoryChecking' ? '' : 'InventoryChecking')}
                class="px-3.5 py-1 rounded-full text-xs font-semibold transition-all border {jobTypeFilter === 'InventoryChecking' ? 'border-[#fd510f] bg-[#ffeae2] text-[#fd510f]' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}"
              >
                Inventory Checking
              </button>

              <div class="h-4 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

              <div class="flex items-center gap-1.5 text-xs text-gray-600">
                <span>Show:</span>
                <select 
                  bind:value={pageSize}
                  onchange={() => (currentPage = 1)}
                  class="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs font-medium focus:outline-none focus:border-[#fd510f]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <!-- Right: Status Badges & Search -->
            <div class="flex flex-wrap items-center gap-3">
              <div class="flex items-center gap-1.5">
                <span class="text-gray-500 font-medium">Status:</span>
                {#each ["New", "Ongoing", "Finish"] as status}
                  {@const isSelected = selectedStatuses.includes(status)}
                  <button 
                    type="button"
                    onclick={() => toggleStatusFilter(status)}
                    class="px-2.5 py-1 rounded-full text-xs transition-all border font-medium {isSelected ? 'bg-[#fd510f] text-white border-[#fd510f] shadow-xs' : 'bg-white text-gray-600 border-gray-300 hover:border-[#fd510f] hover:text-[#fd510f]'}"
                  >
                    {status}
                  </button>
                {/each}
              </div>

              <!-- Search Bar -->
              <div class="relative min-w-[200px] flex-1 md:flex-initial">
                <Search size={14} class="absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  bind:value={searchQuery}
                  placeholder="Search job name or owner..." 
                  class="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-full text-xs focus:bg-white focus:outline-none focus:border-[#fd510f] transition-all"
                />
                {#if searchQuery}
                  <button 
                    type="button" 
                    onclick={() => (searchQuery = '')}
                    class="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={12} />
                  </button>
                {/if}
              </div>
            </div>
          </div>

          <!-- TABLE CONTAINER (Ant Design Style Modern High-Density Table) -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex-1 flex flex-col">
            <div class="overflow-x-auto flex-1">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-[#f0f0f0] border-b border-gray-200 text-gray-700 font-semibold select-none">
                    <th class="p-3 text-center w-12 border-r border-gray-200">No.</th>
                    <th 
                      class="p-3 cursor-pointer hover:bg-gray-200/80 transition-colors border-r border-gray-200"
                      onclick={() => handleSort('name')}
                    >
                      <div class="flex items-center gap-1.5">
                        <span>Job Name</span>
                        <Sliders size={12} class="text-gray-400 {sortField === 'name' ? 'text-[#fd510f]' : ''}" />
                      </div>
                    </th>
                    <th class="p-3 border-r border-gray-200">Owner Name</th>
                    <th class="p-3 border-r border-gray-200">Storage Name</th>
                    <th 
                      class="p-3 cursor-pointer hover:bg-gray-200/80 transition-colors border-r border-gray-200"
                      onclick={() => handleSort('createdAt')}
                    >
                      <div class="flex items-center gap-1.5">
                        <span>Created On</span>
                        <Sliders size={12} class="text-gray-400 {sortField === 'createdAt' ? 'text-[#fd510f]' : ''}" />
                      </div>
                    </th>
                    <th 
                      class="p-3 cursor-pointer hover:bg-gray-200/80 transition-colors border-r border-gray-200"
                      onclick={() => handleSort('lastModifiedOn')}
                    >
                      <div class="flex items-center gap-1.5">
                        <span>Last Updated On</span>
                        <Sliders size={12} class="text-gray-400 {sortField === 'lastModifiedOn' ? 'text-[#fd510f]' : ''}" />
                      </div>
                    </th>
                    <th class="p-3 text-center border-r border-gray-200 w-24">Status</th>
                    <th class="p-3 text-center w-24">Action</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-200 bg-white">
                  {#if paginatedJobs.length === 0}
                    <tr>
                      <td colspan="8" class="p-12 text-center text-gray-400">
                        <div class="flex flex-col items-center justify-center gap-2">
                          <AlertCircle size={28} class="text-gray-300" />
                          <p class="font-medium text-sm text-gray-500">No jobs match your filter criteria</p>
                          <p class="text-[11px] text-gray-400">Try adjusting your search terms or status toggles.</p>
                        </div>
                      </td>
                    </tr>
                  {:else}
                    {#each paginatedJobs as job, idx}
                      <tr class="hover:bg-gray-50/80 transition-colors group">
                        <!-- 1. Index -->
                        <td class="p-3 text-center text-gray-500 border-r border-gray-100 font-mono">
                          {(currentPage - 1) * pageSize + idx + 1}.
                        </td>

                        <!-- 2. Job Name with Type pill -->
                        <td class="p-3 font-semibold text-gray-900 border-r border-gray-100">
                          <div class="flex flex-col gap-0.5">
                            <button type="button" class="text-left font-semibold text-gray-900 hover:text-[#fd510f] cursor-pointer" onclick={() => openJobDetails(job)}>
                              {job.name}
                            </button>
                            <span class="text-[10px] font-normal text-gray-400">
                              {job.type === 'MapTag' ? '🏷️ Map Tag' : '📦 Stock Audit'} • {job.totalItems} tags
                            </span>
                          </div>
                        </td>

                        <!-- 3. Owner -->
                        <td class="p-3 text-gray-700 border-r border-gray-100">
                          {job.owner}
                        </td>

                        <!-- 4. Storage -->
                        <td class="p-3 text-gray-600 border-r border-gray-100 font-mono text-[11px]">
                          {job.storageName}
                        </td>

                        <!-- 5. Created On -->
                        <td class="p-3 text-gray-600 border-r border-gray-100 text-[11px]">
                          {job.createdAt}
                        </td>

                        <!-- 6. Last Updated On -->
                        <td class="p-3 text-gray-600 border-r border-gray-100 text-[11px]">
                          {job.lastModifiedOn}
                        </td>

                        <!-- 7. Status Pill -->
                        <td class="p-3 text-center border-r border-gray-100">
                          {#if job.status === 'New'}
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              New
                            </span>
                          {:else if job.status === 'Ongoing'}
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-[#fd510f] border border-orange-200">
                              Ongoing
                            </span>
                          {:else}
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Finish
                            </span>
                          {/if}
                        </td>

                        <!-- 8. Actions (Details & Delete) -->
                        <td class="p-3 text-center">
                          <div class="flex items-center justify-center gap-1.5">
                            <!-- View Details -->
                            <button 
                              type="button"
                              onclick={() => openJobDetails(job)}
                              class="p-1.5 rounded-md bg-[#fd510f] hover:bg-[#e0480d] text-white shadow-xs transition-colors"
                              title="Inspect Job Details"
                            >
                              <Eye size={13} />
                            </button>

                            <!-- Delete Job -->
                            <button 
                              type="button"
                              onclick={() => promptDeleteJob(job)}
                              class="p-1.5 rounded-md bg-[#941e2c] hover:bg-[#7a1824] text-white shadow-xs transition-colors"
                              title="Delete Job"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    {/each}
                  {/if}
                </tbody>
              </table>
            </div>

            <!-- PAGINATION BAR -->
            <div class="p-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
              <div>
                Showing 
                <strong class="text-gray-900">
                  {totalFiltered > 0 ? (currentPage - 1) * pageSize + 1 : 0}
                </strong>
                to 
                <strong class="text-gray-900">
                  {Math.min(currentPage * pageSize, totalFiltered)}
                </strong>
                of <strong class="text-gray-900">{totalFiltered}</strong> entries
              </div>

              <!-- Page navigation numbers -->
              <div class="flex items-center gap-1">
                <button 
                  type="button"
                  disabled={currentPage <= 1}
                  onclick={() => (currentPage -= 1)}
                  class="px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                </button>

                {#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNum}
                  <button 
                    type="button"
                    onclick={() => (currentPage = pageNum)}
                    class="w-7 h-7 rounded border text-xs font-semibold transition-all {currentPage === pageNum ? 'bg-[#fd510f] border-[#fd510f] text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-[#fd510f] hover:text-[#fd510f]'}"
                  >
                    {pageNum}
                  </button>
                {/each}

                <button 
                  type="button"
                  disabled={currentPage >= totalPages}
                  onclick={() => (currentPage += 1)}
                  class="px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

      {:else if activeMenu === 'job-template' || activeMenu === 'item-template'}
        <!-- ==================== MAINTENANCE (TEMPLATES) VIEW ==================== -->
        <div class="p-6 flex-1 flex flex-col max-w-5xl w-full mx-auto">
          <div class="flex items-center justify-between pb-4 mb-5 border-b border-gray-200">
            <div>
              <h1 class="text-lg font-bold text-gray-900">
                {activeMenu === 'job-template' ? 'Job Templates Configuration' : 'Item Field Template Master'}
              </h1>
              <p class="text-xs text-gray-500">Configure workflow step automation and dynamic RFID metadata schema</p>
            </div>
            <button 
              type="button"
              onclick={() => showToast("Template Saved", "Template configuration updated successfully.", "success")}
              class="px-4 py-2 rounded-lg bg-[#fd510f] hover:bg-[#e0480d] text-white font-medium text-xs shadow-xs"
            >
              + Create Template
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
              <div class="flex items-center justify-between mb-3">
                <span class="font-bold text-gray-900 text-sm">STANDARD_STOCKTAKE_FLOW</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">Active</span>
              </div>
              <p class="text-xs text-gray-500 mb-4">Step sequence: 1. RFID Handheld Bulk Scan -> 2. Discrepancy Reconciliation -> 3. Gate Sign-off</p>
              <div class="text-[11px] text-gray-400 space-y-1">
                <div>Device Target: Zebra MC3300R, Chainway C72</div>
                <div>Created by: Admin • Applied to 42 jobs</div>
              </div>
            </div>

            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
              <div class="flex items-center justify-between mb-3">
                <span class="font-bold text-gray-900 text-sm">TAG_MAPPING_INBOUND_V1</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">Active</span>
              </div>
              <p class="text-xs text-gray-500 mb-4">Step sequence: 1. Scan Barcode -> 2. Encode EPC RFID Tag -> 3. Verification Reader</p>
              <div class="text-[11px] text-gray-400 space-y-1">
                <div>Device Target: Zebra ZD621R Printer + Fixed Readers</div>
                <div>Created by: Admin • Applied to 18 jobs</div>
              </div>
            </div>
          </div>
        </div>

      {:else}
        <!-- ==================== SETTINGS VIEW ==================== -->
        <div class="p-6 flex-1 flex flex-col max-w-4xl w-full mx-auto">
          <div class="pb-4 mb-5 border-b border-gray-200">
            <h1 class="text-lg font-bold text-gray-900">System & RFID Reader Settings</h1>
            <p class="text-xs text-gray-500">Manage connected handheld devices, power transmission levels, and auto-idle timers</p>
          </div>

          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Auto Idle Timeout</h3>
                <p class="text-xs text-gray-500">Automatically lock active session when handheld reader is docked</p>
              </div>
              <select class="border border-gray-300 rounded px-3 py-1.5 text-xs">
                <option>15 Minutes</option>
                <option selected>30 Minutes</option>
                <option>60 Minutes</option>
              </select>
            </div>

            <div class="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Default RFID Antenna Power</h3>
                <p class="text-xs text-gray-500">Transmission output power level (10dBm to 30dBm max range)</p>
              </div>
              <span class="font-bold font-mono text-[#fd510f] text-sm">30.0 dBm (Max)</span>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-gray-900 text-sm">Real-time Telemetry Push</h3>
                <p class="text-xs text-gray-500">WebSocket sync with field scanners on warehouse Wi-Fi network</p>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Connected • Port 8080
              </span>
            </div>
          </div>
        </div>
      {/if}

      <!-- FOOTER -->
      <footer class="h-10 bg-[#f0f0f0] border-t border-gray-300 px-6 flex items-center justify-between text-[11px] text-gray-500 shrink-0">
        <span>All Rights Reserved © Quadrant Synergy {new Date().getFullYear()}</span>
        <div class="flex items-center gap-3">
          <span>Enterprise RFID Suite</span>
          <span class="font-mono text-gray-400">v1.2.4-prod</span>
        </div>
      </footer>
    </main>
  </div>

  <!-- ==================== MODAL 1: JOB DETAILS (Tabs: Info & History) ==================== -->
  {#if isDetailModalOpen && activeDetailJob}
    <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#f6f6f6] rounded-xl shadow-2xl border border-gray-300 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Modal Title Bar -->
        <div class="p-5 border-b border-gray-200 bg-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h2 class="text-base font-bold text-gray-900">Job Details</h2>
            <span class="text-xs font-mono text-gray-400">[{activeDetailJob.id}]</span>
          </div>
          <button 
            type="button"
            onclick={() => (isDetailModalOpen = false)}
            class="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <!-- Modal Tabs Header -->
        <div class="flex items-center px-6 bg-white border-b border-gray-200 text-xs font-semibold gap-6">
          <button 
            type="button"
            onclick={() => (activeDetailTab = 'info')}
            class="py-3 border-b-2 transition-all cursor-pointer {activeDetailTab === 'info' ? 'border-[#fd510f] text-[#fd510f]' : 'border-transparent text-gray-500 hover:text-gray-800'}"
          >
            Detail Info
          </button>
          <button 
            type="button"
            onclick={() => (activeDetailTab = 'history')}
            class="py-3 border-b-2 transition-all cursor-pointer {activeDetailTab === 'history' ? 'border-[#fd510f] text-[#fd510f]' : 'border-transparent text-gray-500 hover:text-gray-800'}"
          >
            Scan History ({activeDetailJob.history.length})
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto flex-1 text-xs">
          {#if activeDetailTab === 'info'}
            <!-- 2-Column Key Value Grid matching Liriq's exact layout -->
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-6 pb-4 border-b border-gray-200">
                <div>
                  <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">JOB NAME</div>
                  <div class="text-sm font-semibold text-gray-900">{activeDetailJob.name}</div>
                </div>
                <div>
                  <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">STATUS</div>
                  <div>
                    {#if activeDetailJob.status === 'New'}
                      <span class="text-blue-600 font-semibold">New</span>
                    {:else if activeDetailJob.status === 'Ongoing'}
                      <span class="text-[#fd510f] font-semibold">Ongoing</span>
                    {:else}
                      <span class="text-emerald-700 font-semibold">Finish</span>
                    {/if}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-6 pb-4 border-b border-gray-200">
                <div>
                  <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">CREATED BY</div>
                  <div class="font-medium text-gray-800">{activeDetailJob.createdBy}</div>
                </div>
                <div>
                  <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">OWNER</div>
                  <div class="font-medium text-gray-800">{activeDetailJob.owner}</div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-6 pb-4 border-b border-gray-200">
                <div>
                  <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">CREATED ON</div>
                  <div class="font-mono text-gray-700">{activeDetailJob.createdAt}</div>
                </div>
                <div>
                  <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">STORAGE NAME</div>
                  <div class="font-medium text-gray-800">{activeDetailJob.storageName}</div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-6 pb-4 border-b border-gray-200">
                <div>
                  <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">LAST UPDATE ON</div>
                  <div class="font-mono text-gray-700">{activeDetailJob.lastModifiedOn}</div>
                </div>
                <div>
                  <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">TOTAL DATA ITEMS</div>
                  <div class="font-bold text-gray-900 text-sm">{activeDetailJob.totalItems} RFID Tags</div>
                </div>
              </div>

              <!-- Real-time Progress Bar -->
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <div class="flex justify-between items-center mb-1 text-[11px]">
                  <span class="font-semibold text-gray-700">Scan Reconciliation Progress:</span>
                  <span class="font-mono font-bold text-[#fd510f]">
                    {activeDetailJob.totalDone} / {activeDetailJob.totalItems} ({(activeDetailJob.totalDone / activeDetailJob.totalItems * 100).toFixed(0)}%)
                  </span>
                </div>
                <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div class="bg-[#fd510f] h-full" style="width: {(activeDetailJob.totalDone / activeDetailJob.totalItems * 100).toFixed(0)}%"></div>
                </div>
              </div>
            </div>

          {:else}
            <!-- Scan History Tab -->
            <div class="space-y-4">
              <div class="flex items-center justify-between pb-2">
                <span class="font-semibold text-gray-800">
                  {activeDetailJob.name} <span class="text-gray-400 font-normal">({activeDetailJob.totalItems} items)</span>
                </span>
                <button 
                  type="button"
                  onclick={() => { if (activeDetailJob) downloadReportCsv(activeDetailJob); }}
                  class="px-3 py-1.5 rounded-lg bg-[#fd510f] hover:bg-[#e0480d] text-white font-semibold text-xs inline-flex items-center gap-1 shadow-xs"
                >
                  <Download size={13} />
                  <span>Download Report (.csv)</span>
                </button>
              </div>

              <div class="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-gray-100 border-b border-gray-200 text-gray-700 font-semibold">
                      <th class="p-2.5 border-r border-gray-200">Step Name</th>
                      <th class="p-2.5 border-r border-gray-200">Start Time</th>
                      <th class="p-2.5 border-r border-gray-200">Device</th>
                      <th class="p-2.5 border-r border-gray-200">Operator</th>
                      <th class="p-2.5 text-center border-r border-gray-200">Remaining</th>
                      <th class="p-2.5 text-center">Done</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    {#each activeDetailJob.history as hist}
                      <tr class="hover:bg-gray-50">
                        <td class="p-2.5 font-medium text-gray-900 border-r border-gray-100">{hist.stepName}</td>
                        <td class="p-2.5 text-gray-500 font-mono text-[11px] border-r border-gray-100">{hist.startTime || '-'}</td>
                        <td class="p-2.5 text-gray-700 font-mono text-[11px] border-r border-gray-100">{hist.deviceName}</td>
                        <td class="p-2.5 text-gray-700 border-r border-gray-100">{hist.lastUpdatedBy}</td>
                        <td class="p-2.5 text-center text-amber-700 font-semibold border-r border-gray-100">{hist.totalRemaining}</td>
                        <td class="p-2.5 text-center text-emerald-700 font-semibold">{hist.totalDone}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          {/if}
        </div>

        <!-- Modal Footer Actions -->
        <div class="p-4 bg-white border-t border-gray-200 flex items-center justify-between">
          <button 
            type="button"
            onclick={() => {
              isDetailModalOpen = false;
              if (activeDetailJob) promptDeleteJob(activeDetailJob);
            }}
            class="text-[#941e2c] hover:underline font-semibold flex items-center gap-1.5"
          >
            <Trash2 size={14} />
            <span>Delete Job</span>
          </button>

          <div class="flex items-center gap-2">
            <button 
              type="button"
              onclick={() => { if (activeDetailJob) downloadReportCsv(activeDetailJob); }}
              class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-xs inline-flex items-center gap-1.5 border border-gray-300"
            >
              <Download size={14} />
              <span>Export Report</span>
            </button>
            <button 
              type="button"
              onclick={() => (isDetailModalOpen = false)}
              class="px-4 py-2 rounded-lg bg-[#fd510f] hover:bg-[#e0480d] text-white font-semibold text-xs shadow-xs"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  {/if}

  <!-- ==================== MODAL 2: CREATE NEW JOB ==================== -->
  {#if isCreateModalOpen}
    <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-[#f6f6f6] rounded-xl shadow-2xl border border-gray-300 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Header -->
        <div class="p-5 border-b border-gray-200 bg-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Plus size={18} class="text-[#fd510f]" />
            <h2 class="text-base font-bold text-gray-900">Upload & Create New Job</h2>
          </div>
          <button 
            type="button"
            onclick={() => (isCreateModalOpen = false)}
            class="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <!-- Form Body -->
        <form onsubmit={handleCreateJobSubmit} class="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <!-- Job Name -->
          <div>
            <label class="block font-semibold text-gray-700 mb-1" for="jobName">Job Name *</label>
            <input 
              id="jobName"
              type="text" 
              bind:value={formJobName}
              placeholder="e.g. Audit Finished Goods Area C"
              required
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#fd510f]"
            />
          </div>

          <!-- Owner -->
          <div>
            <label class="block font-semibold text-gray-700 mb-1" for="ownerName">Owner / Company *</label>
            <input 
              id="ownerName"
              type="text" 
              bind:value={formOwner}
              placeholder="e.g. PT Quadrant Synergy / Client Corp"
              required
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#fd510f]"
            />
          </div>

          <!-- Storage Name -->
          <div>
            <label class="block font-semibold text-gray-700 mb-1" for="storageName">Storage / Warehouse Location</label>
            <input 
              id="storageName"
              type="text" 
              bind:value={formStorage}
              placeholder="e.g. Warehouse 01 - Rack B12"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#fd510f]"
            />
          </div>

          <!-- Job Type & Template Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="formTypeSelect" class="block font-semibold text-gray-700 mb-1">Job Type</label>
              <select 
                id="formTypeSelect"
                bind:value={formType}
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#fd510f]"
              >
                <option value="InventoryChecking">Inventory Checking</option>
                <option value="MapTag">Map Tag (Asset Binding)</option>
              </select>
            </div>
            <div>
              <label for="formTemplateSelect" class="block font-semibold text-gray-700 mb-1">Template Code</label>
              <select 
                id="formTemplateSelect"
                bind:value={formTemplate}
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#fd510f]"
              >
                <option value="DEFAULT_STOCK_TAKE_V2">DEFAULT_STOCK_TAKE_V2</option>
                <option value="TAG_MAPPING_INBOUND_V1">TAG_MAPPING_INBOUND_V1</option>
                <option value="CUSTOM_RFID_CYCLE">CUSTOM_RFID_CYCLE</option>
              </select>
            </div>
          </div>

          <!-- File Upload Simulation Area -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="font-semibold text-gray-700">Upload Asset Manifest (.xlsx)</span>
              <button 
                type="button"
                onclick={() => showToast("Template Downloaded", "Standard Liriq RFID Excel template downloaded.", "info")}
                class="text-[11px] text-[#fd510f] hover:underline flex items-center gap-1 font-medium"
              >
                <Download size={12} /> Download Template (.xlsx)
              </button>
            </div>

            <label class="border-2 border-dashed border-gray-300 hover:border-[#fd510f] bg-white rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
              <input 
                type="file" 
                accept=".xlsx,.csv" 
                class="hidden" 
                onchange={handleSimulatedFileUpload} 
              />
              <UploadCloud size={28} class="text-gray-400 group-hover:text-[#fd510f] mb-2 transition-colors" />
              {#if formFileName}
                <div class="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
                  <FileSpreadsheet size={16} />
                  <span>{formFileName} ({formItemCount} items detected)</span>
                </div>
              {:else}
                <div class="text-xs text-gray-600">
                  <span class="font-semibold text-[#fd510f]">Click to browse</span> or drag Excel sheet here
                </div>
                <span class="text-[10px] text-gray-400 mt-1">Supports standard .xlsx or .csv asset manifests</span>
              {/if}
            </label>
          </div>

          <!-- Submit Buttons -->
          <div class="pt-4 border-t border-gray-200 flex items-center justify-end gap-2">
            <button 
              type="button"
              onclick={() => (isCreateModalOpen = false)}
              class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-xs"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmittingJob}
              class="px-5 py-2 rounded-lg bg-[#fd510f] hover:bg-[#e0480d] active:bg-[#c93e09] text-white font-semibold text-xs shadow-sm inline-flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {#if isSubmittingJob}
                <RefreshCw size={13} class="animate-spin" />
                <span>Importing Job...</span>
              {:else}
                <Check size={14} />
                <span>Create Job</span>
              {/if}
            </button>
          </div>
        </form>

      </div>
    </div>
  {/if}

  <!-- ==================== MODAL 3: DELETE CONFIRMATION ==================== -->
  {#if isDeleteModalOpen && jobToDelete}
    <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl border border-gray-300 max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
        <div class="w-12 h-12 rounded-full bg-red-100 text-[#941e2c] flex items-center justify-center mx-auto mb-3">
          <Trash2 size={24} />
        </div>
        <h3 class="text-base font-bold text-gray-900 mb-1">Delete This Job?</h3>
        <p class="text-xs text-gray-600 mb-2 font-medium">"{jobToDelete.name}"</p>
        <p class="text-[11px] text-gray-400 mb-6">
          This will unbind all active RFID scan records and remove the job from connected handheld devices.
        </p>

        <div class="flex items-center justify-between gap-3">
          <button 
            type="button"
            onclick={() => (isDeleteModalOpen = false)}
            class="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs"
          >
            Cancel
          </button>
          <button 
            type="button"
            onclick={confirmDeleteJob}
            class="flex-1 py-2 rounded-lg bg-[#941e2c] hover:bg-[#7a1824] text-white font-semibold text-xs shadow-xs"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- ==================== TOAST NOTIFICATION ==================== -->
  {#if toast}
    <div class="absolute bottom-5 right-5 z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-4 max-w-sm flex items-start gap-3 animate-in slide-in-from-bottom-3 duration-200">
      <div class="p-1 rounded-full {toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : toast.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}">
        {#if toast.type === 'success'}
          <CheckCircle2 size={16} />
        {:else if toast.type === 'warning'}
          <AlertCircle size={16} />
        {:else}
          <Activity size={16} />
        {/if}
      </div>
      <div class="flex-1 text-xs">
        <h4 class="font-bold text-gray-900 leading-tight">{toast.title}</h4>
        <p class="text-gray-500 mt-0.5 leading-snug">{toast.desc}</p>
      </div>
      <button 
        type="button" 
        onclick={() => (toast = null)}
        class="text-gray-400 hover:text-gray-600"
      >
        <X size={14} />
      </button>
    </div>
  {/if}

</div>
