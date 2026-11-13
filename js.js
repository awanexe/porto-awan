// Global State
  let portfolioState = {
    profile: {},
    skills: [],
    experience: [],
    projects: []
  };

  // Mock Data Fallback jika API GAS tidak tersedia atau gagal diakses
  const mockState = {
    profile: {
      full_name: "Moh. Kurniawan Sobari, S.H.",
      title: "Legal Drafter & Public Sector Tech Practitioner",
      tagline: "Menyelaraskan kepatuhan hukum administrasi negara dengan efisiensi otomatisasi teknologi publik.",
      about_text: "Saya seorang profesional di bidang Hukum Administrasi Negara dan Legal Drafting di Biro Hukum Pemprov Sulawesi Tengah. Berfokus pada penyusunan regulasi yang presisi, naskah kebijakan berbasis bukti, serta modernisasi alur birokrasi melalui pemrograman web dan otomatisasi Google Workspace.",
      cv_drive_link: "https://drive.google.com",
      email: "contact@kurniawan.dev",
      linkedin_url: "https://linkedin.com",
      github_url: "https://github.com",
      availability: "Available for Advisory & Consultation"
    },
    skills: [
      { id: "S1", category: "Legal & Regulatory", name: "Administrative Legal Drafting", level: "Expert", order: 1 },
      { id: "S2", category: "Legal & Regulatory", name: "Regional Regulation (Perda/Pergub)", level: "Expert", order: 2 },
      { id: "S3", category: "Legal & Regulatory", name: "Public Policy Analysis", level: "Advanced", order: 3 },
      { id: "S4", category: "Tech & Automation", name: "Google Apps Script", level: "Advanced", order: 4 },
      { id: "S5", category: "Tech & Automation", name: "Workflow Automation", level: "Advanced", order: 5 },
      { id: "S6", category: "Tech & Automation", name: "HTML5 / CSS3 / JavaScript", level: "Intermediate", order: 6 },
      { id: "S7", category: "Management", name: "Public Asset (BMD) Management", level: "Advanced", order: 7 },
      { id: "S8", category: "Management", name: "Strategic Talent Pool Framework", level: "Advanced", order: 8 }
    ],
    experience: [
      {
        id: "E1",
        role: "PNS / Legal Drafter",
        company: "Biro Hukum Sekretariat Daerah Prov. Sulawesi Tengah",
        period: "2024 - Sekarang",
        location: "Palu, Indonesia",
        description: "Penyusunan draft Keputusan Gubernur, Peraturan Gubernur, analisis normatif regulasi daerah, serta otomatisasi kearsipan hukum.",
        highlights: "SK Gubernur Standar Harga Barang Milik Daerah; Naskah Integrasi Talent Pool Daerah",
        order: 1
      },
      {
        id: "E2",
        role: "Advocate Apprentice / Legal Associate",
        company: "FHP Law School & Legal Associates",
        period: "2023 - 2024",
        location: "Indonesia",
        description: "Penyusunan pendapat hukum (legal opinion), penyelarasan draft kontrak, dan riset regulasi teknis.",
        highlights: "Lulus Pendidikan Khusus Profesi Advokat (PKPA)",
        order: 2
      }
    ],
    projects: [
      {
        id: "P1",
        title: "E-Legis: Otomatisasi Draft SK Gubernur",
        category: "Legal Tech",
        shortDesc: "Platform otomatisasi pembuatan dan standarisasi konsiderans & diktum SK Gubernur.",
        fullDesc: "Sistem otomatisasi penyusunan draft Keputusan Gubernur berbasis Google Workspace API. Fitur mencakup penyesuaian kode akun retribusi, alokasi tarif denda administratif, dan pemastian kepatuhan asas-asas umum pemerintahan yang baik (AUPB).",
        imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80",
        techStack: "Google Apps Script, Google Docs API, JavaScript",
        demoUrl: "#",
        repoUrl: "#",
        featured: "TRUE",
        order: 1
      },
      {
        id: "P2",
        title: "Integrasi Ekosistem Alumni & Talent Pool Daerah",
        category: "Public Policy",
        shortDesc: "Naskah kebijakan dan model arsitektur talent management untuk akselerasi pembangunan daerah.",
        fullDesc: "Formulasi kerangka kerja strategis untuk memetakan, mengidentifikasi, dan mendistribusikan talenta alumni perguruan tinggi ke dalam sektor prioritas daerah Sulawesi Tengah.",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
        techStack: "Policy Paper, Strategic Planning, Data Analytics",
        demoUrl: "#",
        repoUrl: "#",
        featured: "TRUE",
        order: 2
      },
      {
        id: "P3",
        title: "Dashboard Analisis Retribusi & Asset Management",
        category: "Web Apps",
        shortDesc: "Sistem monitoring pencatatan pendapatan denda serta klasifikasi harga standar barang milik daerah.",
        fullDesc: "Aplikasi web internal untuk rekapitulasi real-time denda pelanggaran administratif dan klasifikasi barang daerah menggunakan integrasi Apps Script dan Google Sheets.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
        techStack: "Google Sheets API, JavaScript, Tailwind CSS",
        demoUrl: "#",
        repoUrl: "#",
        featured: "TRUE",
        order: 3
      }
    ]
  };

  // Initialization
  document.addEventListener("DOMContentLoaded", function() {
    initTheme();
    initClock();
    initLucide();
    loadPortfolioData();

    // Mobile menu toggle
    const menuBtn = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("mobile-menu");
    menuBtn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  });

  function initLucide() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function initClock() {
    function updateClock() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      document.getElementById("live-clock").textContent = `${hours}:${minutes} WITA`;
    }
    updateClock();
    setInterval(updateClock, 30000);
  }

  function initTheme() {
    const themeBtn = document.getElementById("theme-toggle");
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    themeBtn.addEventListener("click", () => {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
      } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
      }
    });
  }

  async function loadPortfolioData() {
    try {
      const response = await callGasApi("getPortfolioData");

      if (response.status === 'success' && response.data) {
        portfolioState = response.data;
        renderAllData();
      } else {
        console.error("[loadPortfolioData] Backend mengembalikan respons tidak berhasil:", response);
        useMockData();
      }
    } catch (error) {
      // Fallback ke mock data jika terjadi network error, HTTP error, atau JSON parsing error.
      console.error("[loadPortfolioData] Gagal mengambil data portofolio:", error);
      useMockData();
    }
  }

  function useMockData() {
    portfolioState = mockState;
    renderAllData();
  }

  function renderAllData() {
    renderProfile();
    renderSkills();
    renderExperience();
    renderProjects(portfolioState.projects);
    initLucide();
  }

  function renderProfile() {
    const p = portfolioState.profile;
    if (p.full_name) document.getElementById("hero-name").innerHTML = `${p.full_name.toUpperCase()}<span class="text-brand-accent">.</span>`;
    if (p.tagline) document.getElementById("hero-tagline").textContent = p.tagline;
    if (p.about_text) document.getElementById("about-text-content").textContent = p.about_text;
    if (p.email) document.getElementById("contact-email").textContent = p.email;
    if (p.cv_drive_link) document.getElementById("cv-download-link").href = p.cv_drive_link;
    if (p.linkedin_url) document.getElementById("link-linkedin").href = p.linkedin_url;
    if (p.github_url) document.getElementById("link-github").href = p.github_url;
    if (p.availability) document.getElementById("status-badge").textContent = p.availability.toUpperCase();
  }

  function renderSkills() {
    const grid = document.getElementById("skills-grid");
    grid.innerHTML = "";

    portfolioState.skills.forEach(skill => {
      const card = document.createElement("div");
      card.className = "p-6 bg-brand-card dark:bg-brand-darkCard border border-brand-border dark:border-brand-darkBorder space-y-3";
      card.innerHTML = `
        <span class="font-mono text-xs uppercase text-brand-accent tracking-wider font-semibold">${skill.category}</span>
        <h4 class="font-display font-bold text-lg">${skill.name}</h4>
        <div class="flex justify-between items-center text-xs font-mono text-gray-500 pt-2 border-t border-brand-border dark:border-brand-darkBorder">
          <span>LEVEL</span>
          <span class="font-bold text-brand-charcoal dark:text-gray-200">${skill.level}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderExperience() {
    const list = document.getElementById("experience-list");
    list.innerHTML = "";

    portfolioState.experience.forEach(exp => {
      const item = document.createElement("div");
      item.className = "grid grid-cols-1 md:grid-cols-12 gap-6 pb-12 border-b border-brand-border dark:border-brand-darkBorder";
      item.innerHTML = `
        <div class="md:col-span-4 space-y-1">
          <span class="font-mono text-xs text-brand-accent font-bold">${exp.period}</span>
          <h3 class="font-display font-bold text-2xl">${exp.role}</h3>
          <p class="font-mono text-xs text-gray-500">${exp.company} — ${exp.location}</p>
        </div>
        <div class="md:col-span-8 space-y-4">
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${exp.description}</p>
          ${exp.highlights ? `
            <div class="p-4 bg-brand-card dark:bg-brand-darkCard border-l-2 border-brand-accent font-mono text-xs text-gray-600 dark:text-gray-400">
              <span class="font-bold text-brand-charcoal dark:text-white block mb-1">KEY HIGHLIGHT:</span>
              ${exp.highlights}
            </div>
          ` : ''}
        </div>
      `;
      list.appendChild(item);
    });
  }

  function renderProjects(projectsList) {
    const grid = document.getElementById("projects-grid");
    grid.innerHTML = "";

    projectsList.forEach(proj => {
      const card = document.createElement("div");
      card.className = "project-card bg-brand-card dark:bg-brand-darkCard border border-brand-border dark:border-brand-darkBorder flex flex-col justify-between overflow-hidden cursor-pointer";
      card.onclick = () => openProjectModal(proj.id);

      card.innerHTML = `
        <div class="space-y-4">
          <div class="h-48 overflow-hidden relative">
            <img src="${proj.imageUrl}" alt="${proj.title}" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500">
            <span class="absolute top-3 left-3 px-3 py-1 bg-brand-charcoal text-white text-[10px] font-mono uppercase tracking-widest">${proj.category}</span>
          </div>
          <div class="p-6 space-y-3">
            <h3 class="font-display font-bold text-xl group-hover:text-brand-accent transition-colors">${proj.title}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">${proj.shortDesc}</p>
          </div>
        </div>
        <div class="p-6 pt-0 font-mono text-xs flex justify-between items-center text-brand-accent">
          <span>READ CASE STUDY</span>
          <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
        </div>
      `;
      grid.appendChild(card);
    });
    initLucide();
  }

  function filterProjects(category) {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(btn => {
      if (btn.textContent.trim() === category) {
        btn.classList.add("active-filter");
      } else {
        btn.classList.remove("active-filter");
      }
    });

    if (category === "ALL") {
      renderProjects(portfolioState.projects);
    } else {
      const filtered = portfolioState.projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
      renderProjects(filtered);
    }
  }

  function openProjectModal(id) {
    const proj = portfolioState.projects.find(p => p.id === id);
    if (!proj) return;

    document.getElementById("modal-project-category").textContent = proj.category;
    document.getElementById("modal-project-title").textContent = proj.title;
    document.getElementById("modal-project-image").src = proj.imageUrl;
    document.getElementById("modal-project-desc").textContent = proj.fullDesc;
    
    const techContainer = document.getElementById("modal-project-tech");
    techContainer.innerHTML = "";
    if (proj.techStack) {
      proj.techStack.split(",").forEach(t => {
        const badge = document.createElement("span");
        badge.className = "px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
        badge.textContent = t.trim();
        techContainer.appendChild(badge);
      });
    }

    document.getElementById("modal-project-demo").href = proj.demoUrl || "#";
    document.getElementById("modal-project-repo").href = proj.repoUrl || "#";

    document.getElementById("project-modal").classList.remove("hidden");
  }

  function closeProjectModal() {
    document.getElementById("project-modal").classList.add("hidden");
  }

  function openCvModal() {
    document.getElementById("cv-modal").classList.remove("hidden");
  }

  function closeCvModal() {
    document.getElementById("cv-modal").classList.add("hidden");
  }

  async function handleContactSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById("btn-submit-contact");
    btn.disabled = true;
    btn.innerHTML = `<span>MENGIRIM...</span>`;

    const formData = {
      name: document.getElementById("form-name").value,
      email: document.getElementById("form-email").value,
      subject: document.getElementById("form-subject").value,
      message: document.getElementById("form-message").value
    };

    try {
      const res = await callGasApi("submitContactForm", formData);

      if (res.status !== "success") {
        throw new Error(res.message || "Backend gagal menyimpan pesan.");
      }

      showToast(res.message || "Pesan berhasil dikirim!");
      document.getElementById("contact-form").reset();
    } catch (err) {
      console.error("[handleContactSubmit] Gagal mengirim pesan:", err);
      showToast(err.message || "Gagal mengirim pesan.");
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<span>KIRIM PESAN</span><i data-lucide="send" class="w-4 h-4"></i>`;
      initLucide();
    }
  }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    document.getElementById("toast-message").textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 4000);
  }
