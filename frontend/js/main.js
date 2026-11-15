/* =========================================================
   NEXFOLIO — Frontend Engine (Vercel / Hybrid)
   Backend  : Google Apps Script (via /api/proxy)
   Fallback : Mock data (jika backend tidak tersedia)
   ========================================================= */

// Global State
let portfolioState = {
  profile: {},
  skills: [],
  experience: [],
  projects: []
};

// API Base Path (Vercel Serverless Proxy → GAS)
const API_BASE = '/api/proxy';

// Mock Data Fallback jika dijalankan di luar environment hybrid
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

// =========================================================
// API ADAPTER (fetch → Vercel Proxy → GAS)
// =========================================================

/**
 * GET request ke backend.
 * @param {string} action - nama action GAS
 * @returns {Promise<object>}
 */
async function apiGet(action) {
  const res = await fetch(`${API_BASE}?action=${encodeURIComponent(action)}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * POST request ke backend (text/plain agar aman di GAS).
 * @param {string} action - nama action GAS
 * @param {object} data   - payload data
 * @returns {Promise<object>}
 */
async function apiPost(action, data) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: action, data: data || {} })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// =========================================================
// INITIALIZATION
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  initClock();
  initLucide();
  loadPortfolioData();

  // Mobile menu toggle
  const menuBtn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }

  // Close mobile menu when clicking a navigation link
  document.querySelectorAll(".mobile-nav-link").forEach(link => {
    link.addEventListener("click", () => {
      menu && menu.classList.add("hidden");
    });
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
    const el = document.getElementById("live-clock");
    if (el) el.textContent = `${hours}:${minutes} WITA`;
  }
  updateClock();
  setInterval(updateClock, 30000);
}

function initTheme() {
  const themeBtn = document.getElementById("theme-toggle");
  if (localStorage.theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  if (themeBtn) {
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
}

// =========================================================
// DATA LOADING
// =========================================================

async function loadPortfolioData() {
  try {
    const response = await apiGet('getPortfolioData');
    if (response && response.status === 'success' && response.data) {
      portfolioState = response.data;
      renderAllData();
    } else {
      console.warn('[NEXFOLIO] Backend returned non-success:', response);
      useMockData();
    }
  } catch (err) {
    console.warn('[NEXFOLIO] API fetch failed — using mock data:', err.message);
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

// =========================================================
// RENDERERS (unchanged logic from original)
// =========================================================

function renderProfile() {
  const p = portfolioState.profile;
  if (p.full_name) document.getElementById("hero-name").innerHTML = `${p.full_name.toUpperCase()}<span class="text-sketch-red">.</span>`;
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
  if (!grid) return;
  grid.innerHTML = "";

  const tilts = ["-rotate-1", "rotate-1", "-rotate-1", "rotate-1"];

  portfolioState.skills.forEach((skill, idx) => {
    const isSticky = idx % 3 === 1;
    const tilt = tilts[idx % tilts.length];
    const bgClass = isSticky ? "bg-sketch-yellow" : "bg-sketch-surface";
    const shapeClass = idx % 2 === 0 ? "sketch-box" : "sketch-box-alt";

    const card = document.createElement("div");
    card.className = `p-6 ${bgClass} border-2 border-sketch-ink ${shapeClass} shadow-hard ${tilt} hover:rotate-0 transition-transform duration-200 flex flex-col justify-between space-y-4`;
    card.innerHTML = `
      <div class="space-y-2">
        <span class="inline-block px-2.5 py-0.5 bg-sketch-bg border border-sketch-ink sketch-pill text-sm text-sketch-blue font-bold">${skill.category}</span>
        <h4 class="font-display font-bold text-2xl leading-snug">${skill.name}</h4>
      </div>
      <div class="flex justify-between items-center text-base pt-3 border-t-2 border-dashed border-sketch-ink/30">
        <span class="text-sketch-ink/70">Proficiency:</span>
        <span class="font-bold px-2.5 py-0.5 bg-sketch-surface border border-sketch-ink sketch-pill text-sketch-red">${skill.level}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderExperience() {
  const list = document.getElementById("experience-list");
  if (!list) return;
  list.innerHTML = "";

  portfolioState.experience.forEach((exp, idx) => {
    const tilt = idx % 2 === 0 ? "rotate-[0.5deg]" : "-rotate-[0.5deg]";
    const item = document.createElement("div");
    item.className = `bg-sketch-surface p-6 sm:p-8 border-2 border-sketch-ink sketch-box shadow-hard ${tilt} hover:rotate-0 transition-transform duration-200 grid grid-cols-1 md:grid-cols-12 gap-6 relative`;
    item.innerHTML = `
      <div class="md:col-span-4 space-y-2 md:border-r-2 md:border-dashed md:border-sketch-ink/30 md:pr-4">
        <span class="inline-block px-3 py-0.5 bg-sketch-yellow border-2 border-sketch-ink sketch-pill text-base font-bold text-sketch-ink">${exp.period}</span>
        <h3 class="font-display font-bold text-2xl sm:text-3xl pt-1">${exp.role}</h3>
        <p class="text-lg font-bold text-sketch-blue">${exp.company}</p>
        <p class="text-base text-sketch-ink/75">📍 ${exp.location}</p>
      </div>
      <div class="md:col-span-8 space-y-4 flex flex-col justify-between">
        <p class="text-xl text-sketch-ink/90 leading-relaxed">${exp.description}</p>
        ${exp.highlights ? `
          <div class="p-4 bg-sketch-yellow/75 border-2 border-sketch-ink sketch-box-alt text-lg">
            <span class="font-display font-bold text-sketch-red block mb-1">★ Key Highlight:</span>
            <span>${exp.highlights}</span>
          </div>
        ` : ''}
      </div>
    `;
    list.appendChild(item);
  });
}

function renderProjects(projectsList) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;
  grid.innerHTML = "";

  projectsList.forEach((proj, idx) => {
    const isSticky = idx % 2 === 1;
    const cardBg = isSticky ? "bg-sketch-yellow/60" : "bg-sketch-surface";
    const card = document.createElement("div");
    card.className = `project-card ${cardBg} flex flex-col justify-between overflow-hidden cursor-pointer relative`;
    card.onclick = () => openProjectModal(proj.id);

    card.innerHTML = `
      <div class="space-y-4">
        <div class="h-52 overflow-hidden relative border-b-2 border-sketch-ink">
          <img src="${proj.imageUrl}" alt="${proj.title}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105">
          <span class="absolute top-3 left-3 px-3 py-1 bg-sketch-yellow text-sketch-ink border-2 border-sketch-ink sketch-pill shadow-hard-sm text-sm font-bold -rotate-2">${proj.category}</span>
        </div>
        <div class="px-6 pt-2 space-y-2">
          <h3 class="font-display font-bold text-2xl leading-snug text-sketch-ink">${proj.title}</h3>
          <p class="text-lg text-sketch-ink/85 line-clamp-2">${proj.shortDesc}</p>
        </div>
      </div>
      <div class="p-6 pt-4 mt-2 border-t-2 border-dashed border-sketch-ink/30 text-lg font-bold flex justify-between items-center text-sketch-blue">
        <span>Read Case Study</span>
        <span class="sketch-icon-circle bg-sketch-surface text-sketch-red"><i data-lucide="arrow-up-right" stroke-width="2.5" class="w-4 h-4"></i></span>
      </div>
    `;
    grid.appendChild(card);
  });
  initLucide();
}

// =========================================================
// PROJECT FILTER & MODAL
// =========================================================

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
    proj.techStack.split(",").forEach((t, idx) => {
      const badge = document.createElement("span");
      const tilt = idx % 2 === 0 ? "-rotate-1" : "rotate-1";
      badge.className = `px-3.5 py-1 bg-sketch-yellow border-2 border-sketch-ink sketch-pill font-bold text-sketch-ink ${tilt}`;
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

// =========================================================
// CONTACT FORM (POST → Proxy → GAS)
// =========================================================

async function handleContactSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById("btn-submit-contact");
  btn.disabled = true;
  btn.innerHTML = `<span>Mengirim Catatan...</span>`;

  const formData = {
    name: document.getElementById("form-name").value,
    email: document.getElementById("form-email").value,
    subject: document.getElementById("form-subject").value,
    message: document.getElementById("form-message").value
  };

  try {
    const res = await apiPost('submitContactForm', formData);
    if (res && res.status === 'success') {
      showToast(res.message || "Pesan berhasil dikirim!");
      document.getElementById("contact-form").reset();
    } else {
      showToast((res && res.message) || "Gagal mengirim pesan.");
    }
  } catch (err) {
    showToast("Gagal mengirim pesan: " + (err.message || err));
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span>Kirim Pesan Sekarang</span><i data-lucide="send" stroke-width="2.5" class="w-5 h-5"></i>`;
    initLucide();
  }
}

// =========================================================
// TOAST
// =========================================================

function showToast(msg) {
  const toast = document.getElementById("toast");
  document.getElementById("toast-message").textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 4000);
}