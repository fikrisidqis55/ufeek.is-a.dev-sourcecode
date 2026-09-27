export interface ProjectExecutable {
  id: string;
  title: string;
  exeName: string;
  icon: string;
  description: string;
  type: 'sandbox' | 'live' | 'specs';
  liveUrl?: string;
  technologies: string[];
  client: string;
  role: string;
  year: string;
  image: string;
  details: string;
  specs: {
    overview: string;
    highlights: string[];
    metrics?: string[];
  };
  hasMock?: boolean;
  status?: 'active' | 'draft' | 'pending';
}

export const projectsList: ProjectExecutable[] = [
  {
    id: "cirrust-lite",
    title: "Cirrust Lite",
    exeName: "Cirrust_Lite.exe",
    icon: "/icons/win98/executable.png",
    description: "High-conversion registration portal for Cirrust Lite, offering free 6-month software licenses.",
    type: "sandbox",
    hasMock: true,
    status: "active",
    technologies: ["Next.js 15", "TypeScript", "React 19", "TanStack React Query", "Tailwind CSS", "Axios"],
    client: "PT Quadrant Synergy International",
    role: "Frontend Engineer",
    year: "2024 - 2025",
    image: "/projects/cirrust-lite-form.png",
    details: "/projects/cirrust-lite-form.png",
    specs: {
      overview: "Designed and engineered the customer acquisition portal for Cirrust Lite. Implemented multi-state form flow with micro-interaction hover labels, real-time phone number formatting, dynamic client-side validation, and instant license download delivery.",
      highlights: [
        "Built responsive split-screen layout with instant form validation and field formatters",
        "Integrated TanStack React Query mutation pipeline with optimistic loading states",
        "Crafted interactive hover/focus reveal label pattern for enhanced input ergonomics",
        "Implemented secure installer package download workflow with custom headers parsing"
      ],
      metrics: [
        "Conversion rate improved by +28%",
        "Client-side bundle optimized for < 100ms First Contentful Paint",
        "100% responsive across mobile, tablet, and widescreen desktop"
      ]
    }
  },
  {
    id: "liriq-rfid",
    title: "Liriq RFID",
    exeName: "Liriq_RFID.exe",
    icon: "/icons/win98/executable.png",
    description: "Enterprise RFID asset tracking and warehouse inventory management dashboard integrated with handheld RFID readers.",
    type: "sandbox",
    hasMock: true,
    status: "active",
    technologies: ["Next.js 15", "TypeScript", "Ant Design", "TanStack React Query", "Tailwind CSS", "Zustand"],
    client: "Quadrant System Integrator",
    role: "Frontend Engineer",
    year: "2024 - 2025",
    image: "/projects/liriq/assets/logo/liriqLogoOriginal.svg",
    details: "/projects/liriq/assets/logo/liriqLogoOriginal.svg",
    specs: {
      overview: "Comprehensive enterprise RFID asset tracking and warehouse inventory management dashboard integrated with handheld RFID readers (Zebra, Chainway, Urovo) for rapid stocktaking, inbound/outbound tag mapping, and discrepancy audits.",
      highlights: [
        "Built high-density tabular workflows with client-side sorting, status pills, and search filtering",
        "Engineered batch Excel (.xlsx) job importing with template validation and real-time reconciliation",
        "Implemented RFID scanner device telemetry monitoring battery status, reader health, and sync logs",
        "Designed modular workflow execution supporting Map Tag, Inventory Checking, and Discrepancy Audits"
      ],
      metrics: [
        "Scans Processed: 50,000+ RFID Tags/Hour",
        "Audit Time Reduction: 85% compared to manual barcodes",
        "Handheld Hardware Support: Zebra, Chainway, Urovo"
      ]
    }
  },
  {
    id: "zurich-cms",
    title: "Zurich CMS",
    exeName: "Zurich_CMS.exe",
    icon: "/icons/win98/executable.png",
    description: "Enterprise administration dashboard for Zurich insurance agent onboarding and policy management.",
    type: "specs",
    technologies: ["React", "TypeScript", "React Query", ".NET Core", "SQL Server", "Tailwind CSS"],
    client: "Zurich Insurance Indonesia",
    role: "Frontend Engineer",
    year: "2023 - 2024",
    image: "/projects/zurich-cms-dashboard.png",
    details: "/projects/zurich-cms-dashboard.png",
    specs: {
      overview: "Enterprise back-office dashboard serving Zurich sales agents, branch managers, and underwriters. Includes complex multi-filter agent tables, bulk document verification, and automated approval state machines.",
      highlights: [
        "Architected modular feature architecture with custom hooks and query invalidations",
        "Built high-density data tables handling 5,000+ agent records with virtualized scrolling",
        "Integrated role-based access control (RBAC) and enterprise session persistence"
      ],
      metrics: [
        "Used by 2,000+ active agents nationwide",
        "Decreased application processing time by 45%"
      ]
    }
  },
  {
    id: "mirecruit-cms",
    title: "Mirecruit CMS",
    exeName: "Mirecruit_CMS.exe",
    icon: "/icons/win98/executable.png",
    description: "Digital recruitment funnel and agent evaluation platform for Manulife financial advisors.",
    type: "specs",
    technologies: ["Next.js", "TypeScript", "React Query", "Ant Design", "Tailwind CSS"],
    client: "Manulife Indonesia",
    role: "Frontend Engineer",
    year: "2023",
    image: "/projects/mirecruit-cms-login.png",
    details: "/projects/mirecruit-cms-dashboard.png",
    specs: {
      overview: "End-to-end recruitment management system streamlining candidate screening, psychological test evaluations, and contract generation for financial agency recruitment.",
      highlights: [
        "Engineered Kanban-style candidate progress tracker with drag-and-drop transitions",
        "Integrated Ant Design enterprise design system with customized Manulife branding",
        "Implemented real-time stage analytics and recruitment pipeline reports"
      ],
      metrics: [
        "Streamlined candidate onboarding time from 14 days to 4 days",
        "Over 10,000+ applicant profiles managed"
      ]
    }
  },
  {
    id: "smartcourier",
    title: "Smartcourier",
    exeName: "Smartcourier.exe",
    icon: "/icons/win98/executable.png",
    description: "Logistics fleet management and real-time courier shipment tracking control center.",
    type: "specs",
    technologies: ["React.js", "React Query", "Ant Design", "React Redux", "Leaflet Maps"],
    client: "Enterprise Logistics",
    role: "Frontend Engineer",
    year: "2023",
    image: "/projects/smartcourier-ccc-login.png",
    details: "/projects/smartcourier-ccc-dashboard.png",
    specs: {
      overview: "Central Control Center (CCC) for logistics dispatchers to monitor deliveries, assign driver routes, and manage exceptions in real-time.",
      highlights: [
        "Developed interactive live map view with geo-fencing driver markers",
        "Integrated Redux store for fleet status updates and instant dispatching",
        "Constructed exportable shipping manifest generation and proof-of-delivery views"
      ],
      metrics: [
        "Handled 50,000+ daily package movements",
        "Zero-latency dispatch dispatching updates via WebSocket integration"
      ]
    }
  },
  {
    id: "cirrust-dms",
    title: "Cirrust DMS",
    exeName: "Cirrust_DMS.exe",
    icon: "/icons/win98/executable.png",
    description: "Cloud-based enterprise document management system with optical character recognition.",
    type: "specs",
    technologies: ["Next.js", "TypeScript", "React Query", "Tailwind CSS"],
    client: "PT Quadrant Synergy International",
    role: "Frontend Engineer",
    year: "2024",
    image: "/projects/cirrust-dms-login.png",
    details: "/projects/cirrust-dms-dashboard-admin.png",
    specs: {
      overview: "Enterprise digital repository with OCR document search, hierarchical folder permissions, version control, and multi-tenant access.",
      highlights: [
        "Built tree-structured folder explorer with drag-and-drop file organization",
        "Implemented in-browser PDF document viewer with annotation and highlight tools",
        "Integrated fine-grained department ACL permissions"
      ]
    }
  },
  {
    id: "cirrust-workflow",
    title: "Cirrust Workflow",
    exeName: "Cirrust_Workflow.exe",
    icon: "/icons/win98/executable.png",
    description: "Automated business process approval engine with visual step builder.",
    type: "specs",
    technologies: ["Next.js", "TypeScript", "React Query", "Tailwind CSS"],
    client: "PT Quadrant Synergy International",
    role: "Frontend Engineer",
    year: "2024",
    image: "/projects/cirrust-workflow-login.png",
    details: "/projects/cirrust-workflow-dashboard-admin.png",
    specs: {
      overview: "Customizable business process management engine that automates multi-tier approvals, purchase requisitions, and compliance audits.",
      highlights: [
        "Constructed visual workflow state inspector showing real-time approval stages",
        "Implemented conditional routing based on transaction values and department roles"
      ]
    }
  },
  {
    id: "kansai-custom",
    title: "Kansai Custom",
    exeName: "Kansai_Custom.exe",
    icon: "/icons/win98/executable.png",
    description: "[Draft / Pending Accuracy Polish] Custom enterprise manufacturing process portal powered by the Cirrust Engine.",
    type: "sandbox",
    hasMock: true,
    status: "draft",
    technologies: ["Next.js", "TypeScript", "React Query", "Tailwind CSS"],
    client: "Kansai Paint Indonesia",
    role: "Frontend Engineer",
    year: "2024",
    image: "/projects/kansai-custompage-form.png",
    details: "/projects/kansai-custompage-form.png",
    specs: {
      overview: "[DRAFT / PENDING TASK: Prototype currently pending accuracy alignment with production specs] Tailored manufacturing workflow for Kansai Paint, digitizing order dispatch and production quality control.",
      highlights: [
        "Created specialized paint formula order forms with dynamic matrix inputs",
        "Integrated audit log compliance with ISO manufacturing requirements"
      ]
    }
  },
  {
    id: "bpn-ekantah",
    title: "E-Kantah BPN",
    exeName: "EKantah_BPN.exe",
    icon: "/icons/win98/executable.png",
    description: "[Draft / Pending Accuracy Polish] Self-service land registration and certificate issuance portal for Ministry of Agrarian Affairs.",
    type: "sandbox",
    hasMock: true,
    status: "draft",
    technologies: ["Next.js", "TypeScript", "React Query", "Tailwind CSS"],
    client: "Kementerian ATR/BPN",
    role: "Frontend Engineer",
    year: "2023 - 2024",
    image: "/projects/bpn-landing-page.png",
    details: "/projects/bpn-landing-page.png",
    specs: {
      overview: "[DRAFT / PENDING TASK: Prototype currently pending accuracy alignment with production specs] Citizen-facing digital portal enabling property owners to register land rights, verify plot coordinates, and book appointments at land offices.",
      highlights: [
        "Designed accessible, high-contrast portal adhering to government service standards",
        "Integrated citizen identity verification (NIK/KTP) and land plot document uploads",
        "Optimized mobile layout for kiosk and smartphone usage"
      ]
    }
  },
  {
    id: "impulse-web",
    title: "Impulse Web",
    exeName: "Impulse_Web.exe",
    icon: "/icons/win98/executable.png",
    description: "Executive business intelligence dashboard with interactive sales charts and KPI metrics.",
    type: "specs",
    technologies: ["Next.js", "TypeScript", "React Query", "Chart.js", "Tailwind CSS"],
    client: "Impulse BI",
    role: "Frontend Engineer",
    year: "2024",
    image: "/projects/impulse-login.png",
    details: "/projects/impulse-dashboard.png",
    specs: {
      overview: "Real-time executive performance dashboard visualizing revenue projections, branch KPIs, and quarterly targets with dynamic time-series charts.",
      highlights: [
        "Implemented interactive charts with drill-down capability from year to individual invoice",
        "Built customizable drag-and-drop dashboard widget grid layout",
        "Optimized client-side data aggregation for instant report rendering"
      ]
    }
  }
];
