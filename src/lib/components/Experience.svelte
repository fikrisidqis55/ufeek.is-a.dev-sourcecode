<script lang="ts">
  interface ExperienceItem {
    id: string;
    title: string;
    roleType: string;
    company: string;
    location: string;
    date: string;
    description: string;
    bullets: string[];
    skills: string[];
    icon: string;
  }

  const experiences: ExperienceItem[] = [
    {
      id: "qsi-fe",
      title: "Frontend Engineer",
      roleType: "Full-time",
      company: "Quadrant Synergy International",
      location: "Jakarta, Indonesia",
      date: "Jun 2022 – Present",
      description:
        "Developing enterprise-grade web applications for premier insurance, government, and logistics clients including Manulife, Zurich, and Badan Pertanahan Nasional (BPN).",
      bullets: [
        "Developed and maintained scalable web applications using React.js, Next.js, and TypeScript for enterprise insurance, government, and logistics clients.",
        "Modernized legacy frontend systems through refactoring, dependency upgrades, and migration to scalable React.js architecture.",
        "Built reusable UI components and design systems to accelerate development speed and improve consistency across multiple client projects.",
        "Implemented server-side rendering (SSR) and dynamic routing in Next.js to improve SEO and initial page performance for public-facing portals.",
        "Improved frontend performance and maintainability through code-splitting, dependency cleanup, and modular architecture."
      ],
      skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Ant Design", "Zustand", "React Query", "SSR", "Code Splitting"],
      icon: "/icons/win98/network.png"
    },
    {
      id: "qsi-be",
      title: "Backend Developer",
      roleType: "Full-time",
      company: "Quadrant Synergy International",
      location: "Jakarta, Indonesia",
      date: "Dec 2020 – Jun 2022",
      description:
        "Engineered RESTful APIs and backend services for insurance agent recruitment platforms (My Zurich Advisor & Manulife MiRecruit).",
      bullets: [
        "Developed RESTful APIs using C# and .NET, gaining deep understanding of API contracts and authentication flows that directly informs frontend integration work.",
        "Engineered database schemas and secure authorization flows to support mission-critical corporate recruitment workflows."
      ],
      skills: ["C#", ".NET Core", "RESTful APIs", "Authentication", "SQL Server", "API Contracts"],
      icon: "/icons/win98/techstack.png"
    },
    {
      id: "telkom-intern",
      title: "Back End Developer (Intern)",
      roleType: "Internship",
      company: "Telkom Indonesia",
      location: "Bandung, Indonesia",
      date: "Oct 2019 – Mar 2020",
      description:
        "Supported backend microservices and database integration for enterprise telecommunication products.",
      bullets: [
        "Created several RESTful APIs and integrated them with NoSQL databases for high-throughput data processing.",
        "Collaborated within Agile/Scrum cross-functional team sprints and active code reviews."
      ],
      skills: ["Node.js", "REST APIs", "NoSQL", "Git", "Agile/Scrum"],
      icon: "/icons/win98/executable.png"
    }
  ];

  const education = {
    degree: "Bachelor of Computer Science (S.Kom.)",
    institution: "Bina Nusantara University",
    location: "Jakarta, Indonesia",
    period: "2021 – 2025",
    gpa: "3.63 / 4.00",
    description: "Specialized in Computer Science, Software Engineering architecture, and scalable system design.",
    icon: "/icons/win98/computer.png"
  };
</script>

<div class="h-full w-full bg-win98-surface p-3 flex flex-col gap-3 text-black font-[Tahoma,sans-serif] min-h-0 select-text">
  <!-- Window Top Banner / Summary -->
  <div class="flex items-center gap-3 p-2 bg-win98-surface win98-border-outset flex-shrink-0">
    <img 
      src="/icons/win98/experience.png" 
      alt="" 
      class="w-8 h-8 select-none pointer-events-none flex-shrink-0" 
      style="image-rendering: pixelated;" 
    />
    <div class="flex flex-col min-w-0">
      <h2 class="text-base font-bold leading-tight">Professional Experience & Track Record</h2>
      <p class="text-xs text-gray-700 leading-snug mt-0.5">
        5+ years of engineering scalable, responsive web applications with React.js, Next.js, and TypeScript.
      </p>
    </div>
  </div>

  <!-- Sunken Scrollable Content Area -->
  <div class="win98-border-inset bg-white p-3.5 overflow-y-auto flex-1 flex flex-col gap-5 min-h-0">
    <!-- Work Experience Section -->
    <div class="flex flex-col gap-4">
      {#each experiences as exp (exp.id)}
        <fieldset class="border-2 border-gray-400 p-3 pt-3 relative bg-white">
          <legend class="px-2 text-xs font-bold bg-white text-gray-900 ml-1 flex items-center gap-1.5">
            <span class="text-win98-title-active">{exp.title}</span>
            <span class="text-gray-400 font-normal">|</span>
            <span class="text-gray-600 font-normal text-[11px]">{exp.company}</span>
          </legend>

          <div class="flex flex-col gap-2.5">
            <!-- Header Meta: Company, Location, Date & Role Type -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-2 gap-1.5">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gray-100 win98-border-inset p-0.5">
                  <img 
                    src={exp.icon} 
                    alt="" 
                    class="w-4 h-4 select-none pointer-events-none" 
                    style="image-rendering: pixelated;" 
                  />
                </div>
                <div class="flex flex-col">
                  <span class="font-bold text-xs text-black">{exp.company}</span>
                  <span class="text-[10px] text-gray-500">{exp.location}</span>
                </div>
              </div>

              <div class="flex items-center gap-1.5 self-start sm:self-auto">
                <span class="win98-border-inset bg-gray-100 text-gray-800 text-[11px] px-2 py-0.5 font-mono">
                  {exp.date}
                </span>
                <span class="win98-border-outset bg-win98-surface text-gray-700 text-[10px] px-1.5 py-0.5 font-semibold">
                  {exp.roleType}
                </span>
              </div>
            </div>

            <!-- Role Summary -->
            <p class="text-xs text-gray-800 leading-relaxed font-sans italic bg-blue-50/50 p-1.5 border-l-2 border-win98-title-active">
              "{exp.description}"
            </p>

            <!-- Detailed Bullet Points from CV -->
            <div class="flex flex-col gap-1.5 pl-1">
              {#each exp.bullets as bullet}
                <div class="flex items-start gap-2 text-xs leading-relaxed text-gray-900 font-sans">
                  <span class="text-win98-title-active font-mono text-[10px] mt-0.5 flex-shrink-0 select-none">■</span>
                  <span>{bullet}</span>
                </div>
              {/each}
            </div>

            <!-- Skills / Technologies Chips -->
            <div class="mt-1 pt-2 border-t border-dotted border-gray-300 flex flex-wrap items-center gap-1.5">
              <span class="text-[10px] font-bold text-gray-600 select-none mr-0.5">Dependencies:</span>
              {#each exp.skills as skill}
                <span class="win98-border-outset bg-[#e8e8e8] px-1.5 py-0.5 text-[10px] text-gray-800 font-sans hover:bg-white select-none">
                  {skill}
                </span>
              {/each}
            </div>
          </div>
        </fieldset>
      {/each}
    </div>

    <!-- Education Section -->
    <fieldset class="border-2 border-gray-400 p-3 pt-3 relative bg-white mt-1">
      <legend class="px-2 text-xs font-bold bg-white text-gray-900 ml-1 flex items-center gap-1.5">
        <span class="text-win98-title-active">🎓 Education</span>
      </legend>

      <div class="flex flex-col gap-2">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-2 gap-1.5">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gray-100 win98-border-inset p-0.5">
              <img 
                src={education.icon} 
                alt="" 
                class="w-4 h-4 select-none pointer-events-none" 
                style="image-rendering: pixelated;" 
              />
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-xs text-black">{education.institution}</span>
              <span class="text-[11px] font-semibold text-win98-title-active">{education.degree}</span>
            </div>
          </div>

          <div class="flex items-center gap-1.5 self-start sm:self-auto">
            <span class="win98-border-inset bg-emerald-50 text-emerald-800 border-emerald-400 text-[11px] px-2 py-0.5 font-bold font-mono">
              GPA: {education.gpa}
            </span>
            <span class="win98-border-inset bg-gray-100 text-gray-800 text-[11px] px-2 py-0.5 font-mono">
              {education.period}
            </span>
          </div>
        </div>

        <p class="text-xs text-gray-700 leading-relaxed font-sans">
          {education.description}
        </p>
      </div>
    </fieldset>
  </div>

  <!-- Status Bar Footer -->
  <div class="win98-border-inset bg-win98-surface px-2 py-1 text-[11px] flex justify-between items-center text-gray-700 font-mono flex-shrink-0 select-none">
    <span>Verified from Curriculum Vitae (CV)</span>
    <span>3 Roles | 1 Degree</span>
  </div>
</div>
