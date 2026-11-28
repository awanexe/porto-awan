/**
 * NEXFOLIO - Personal Portfolio Web Application
 * Backend Engine for Google Apps Script
 *
 * Hybrid Architecture:
 *  - Backend : Google Apps Script (REST JSON API)
 *  - Database: Google Sheets
 *  - Frontend: Vercel (static)
 *
 * Deploy: Deploy as Web App → Execute as: "Me" → Access: "Anyone".
 * Endpoint format: https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec
 */

const SPREADSHEET_ID = ""; // (opsional) ID Spreadsheet. Kosongkan jika script di-bound ke spreadsheet.

// ============================================================
// HTTP ROUTING (REST API LAYER)
// ============================================================

/**
 * GET endpoint.
 * Usage:
 *   ?action=getPortfolioData
 *   ?action=setupDatabase
 *   ?action=getDatabaseSnapshot
 *   ?action=ping
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';
    let result;

    switch (action) {
      case 'getPortfolioData':
        result = getPortfolioData();
        break;
      case 'setupDatabase':
        result = setupDatabase();
        break;
      case 'getDatabaseSnapshot':
        result = getDatabaseSnapshot();
        break;
      case 'ping':
        result = { status: 'success', message: 'pong', timestamp: new Date().toISOString() };
        break;
      default:
        result = { status: 'error', message: 'Unknown GET action: ' + (action || '(none)') };
    }

    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * POST endpoint.
 * Body (JSON): { "action": "submitContactForm", "data": { name, email, subject, message } }
 * NOTE: Accept Content-Type text/plain (recommended for GAS to avoid preflight).
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try { payload = JSON.parse(e.postData.contents); }
      catch (parseErr) { payload = {}; }
    }

    const action = payload.action || (e && e.parameter ? e.parameter.action : '');
    let result;

    switch (action) {
      case 'submitContactForm':
        result = submitContactForm(payload.data || payload);
        break;
      case 'setupDatabase':
        result = setupDatabase();
        break;
      default:
        result = { status: 'error', message: 'Unknown POST action: ' + (action || '(none)') };
    }

    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// DATABASE ACCESS
// ============================================================

function getDb() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

// ============================================================
// INIT DATABASE (idempotent)
// ============================================================

function setupDatabase() {
  const ss = getDb();

  // 1. Profile Sheet
  let profileSheet = ss.getSheetByName("Profile");
  if (!profileSheet) {
    profileSheet = ss.insertSheet("Profile");
    profileSheet.appendRow(["key", "value"]);
    const defaultProfile = [
      ["full_name", "Moh. Kurniawan Sobari, S.H."],
      ["title", "Legal Drafter & Public Sector Technology Specialist"],
      ["tagline", "Designing precise legal frameworks & digital governance solutions."],
      ["about_text", "Saya seorang profesional di bidang Hukum Administrasi Negara dan Legal Drafting dengan fokus pada penyusunan regulasi daerah, analisis kebijakan publik, serta integrasi teknologi dalam birokrasi pemerintahan."],
      ["cv_drive_link", "https://drive.google.com/file/d/1LKQPcdFauAEhaHtb1cX1xWBjXoRRgcGE/view?usp=drivesdk"],
      ["email", "mohkurniawan575@gmail.com"],
      ["linkedin_url", "https://linkedin.com"],
      ["github_url", "https://github.com"],
      ["location", "Palu, Sulawesi Tengah, Indonesia"],
      ["availability", "Available for Advisory & Consultation"]
    ];
    defaultProfile.forEach(row => profileSheet.appendRow(row));
  }

  // 2. Skills Sheet
  let skillsSheet = ss.getSheetByName("Skills");
  if (!skillsSheet) {
    skillsSheet = ss.insertSheet("Skills");
    skillsSheet.appendRow(["id", "category", "skill_name", "level", "display_order"]);
    const defaultSkills = [
      ["SKL-01", "Legal & Regulatory", "Administrative Legal Drafting", "Expert", 1],
      ["SKL-02", "Legal & Regulatory", "Regional Regulation Formulation", "Expert", 2],
      ["SKL-03", "Legal & Regulatory", "Public Policy Analysis", "Advanced", 3],
      ["SKL-04", "Tech & Automation", "Google Apps Script", "Advanced", 4],
      ["SKL-05", "Tech & Automation", "Workflow Automation", "Advanced", 5],
      ["SKL-06", "Tech & Automation", "HTML5 / CSS3 / JavaScript", "Intermediate", 6],
      ["SKL-07", "Management", "Public Asset (BMD) Management", "Advanced", 7],
      ["SKL-08", "Management", "Strategic Talent Pool Framework", "Advanced", 8]
    ];
    defaultSkills.forEach(row => skillsSheet.appendRow(row));
  }

  // 3. Experience Sheet
  let expSheet = ss.getSheetByName("Experience");
  if (!expSheet) {
    expSheet = ss.insertSheet("Experience");
    expSheet.appendRow(["id", "role", "company", "period", "location", "description", "highlights", "display_order"]);
    const defaultExp = [
      [
        "EXP-01",
        "PNS / Legal Drafter",
        "Biro Hukum Sekretariat Daerah Prov. Sulawesi Tengah",
        "2024 - Sekarang",
        "Palu, Indonesia",
        "Bertanggung jawab dalam penyusunan draft Keputusan Gubernur, Peraturan Gubernur, analisis normatif regulasi daerah, serta otomatisasi arsip hukum.",
        "Formulasi SK Gubernur Standar Harga Barang Milik Daerah; Penyusunan Kebijakan Integrasi Talent Pool Daerah",
        1
      ],
      [
        "EXP-02",
        "Advocate Apprentice / Legal Consultant",
        "FHP Law School & Legal Associates",
        "2023 - 2024",
        "Indonesia",
        "Menyusun pendapat hukum (legal opinion), menyelaraskan dokumen kontrak, dan melakukan kajian regulasi teknis birokrasi.",
        "Sertifikasi Pendidikan Khusus Profesi Advokat (PKPA)",
        2
      ]
    ];
    defaultExp.forEach(row => expSheet.appendRow(row));
  }

  // 4. Projects Sheet
  // Columns: id | title | category | short_desc | full_desc | image_url | tech_stack | database | repo_url | featured | display_order
  // Categories: Web App | Logo Design | Social Media | Shirt Design | Magazine
  let projSheet = ss.getSheetByName("Projects");
  if (!projSheet) {
    projSheet = ss.insertSheet("Projects");
    projSheet.appendRow(["id", "title", "category", "short_desc", "full_desc", "image_url", "tech_stack", "database", "repo_url", "featured", "display_order"]);
    const defaultProjects = [
      // — Web App —
      [
        "PRJ-01",
        "E-Legis: Sistem Otomatisasi Draft SK Gubernur",
        "Web App",
        "Platform otomatisasi pembuatan dan standarisasi konsiderans & diktum SK Gubernur berbasis Google Workspace.",
        "Proyek ini merestrukturisasi alur penyusunan draft Keputusan Gubernur dengan templating otomatis, validasi kode akun retribusi/denda administrasi, dan sistem audit trail berbasis Apps Script.",
        "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80",
        "Google Apps Script, Google Docs API, JavaScript",
        "#",
        "#",
        "TRUE",
        1
      ],
      [
        "PRJ-02",
        "Dashboard Analisis Retribusi & Asset Management",
        "Web App",
        "Sistem monitoring dan pencatatan pendapatan denda serta klasifikasi harga standar barang milik daerah.",
        "Aplikasi web internal untuk rekapitulasi real-time denda pelanggaran administratif dan klasifikasi barang daerah menggunakan integrasi Apps Script dan Google Sheets.",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
        "Google Sheets API, JavaScript, Tailwind CSS",
        "#",
        "#",
        "TRUE",
        2
      ],
      [
        "PRJ-03",
        "Integrasi Ekosistem Alumni & Talent Pool Daerah",
        "Web App",
        "Naskah kebijakan dan model arsitektur talent management untuk akselerasi pembangunan daerah.",
        "Formulasi kerangka kerja strategis untuk memetakan, mengidentifikasi, dan mendistribusikan talenta alumni perguruan tinggi ke dalam sektor prioritas daerah Sulawesi Tengah.",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
        "Policy Paper, Strategic Planning, Data Analytics",
        "#",
        "#",
        "FALSE",
        3
      ],
      // — Logo Design —
      [
        "PRJ-04",
        "Branding Logo — Pemprov Sulteng Event",
        "Logo Design",
        "Desain logo resmi untuk acara tahunan Pemerintah Provinsi Sulawesi Tengah.",
        "Perancangan identitas visual event: konsep sketsa, digitalisasi vektor, palet warna institusional, dan panduan penggunaan logo (brand guidelines).",
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1000&q=80",
        "Adobe Illustrator, Brand Identity, Vector Design",
        "#",
        "#",
        "FALSE",
        4
      ],
      [
        "PRJ-05",
        "Logo Komunitas Hukum Digital",
        "Logo Design",
        "Identitas visual komunitas lintas profesi: hukum + teknologi.",
        "Desain logotype dan logomark yang mencerminkan sinergi hukum administrasi dan digitalisasi layanan publik. Tersedia dalam variasi warna terang dan gelap.",
        "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=80",
        "Figma, Typography, Brand Design",
        "#",
        "#",
        "FALSE",
        5
      ],
      // — Social Media —
      [
        "PRJ-06",
        "Konten Infografis Hukum — Instagram",
        "Social Media",
        "Seri infografis edukasi hukum administrasi negara untuk platform Instagram.",
        "Produksi 12 konten infografis yang menjelaskan konsep hukum administrasi, regulasi daerah, dan hak warga negara secara visual dan mudah dipahami masyarakat umum.",
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1000&q=80",
        "Canva Pro, Adobe Express, Copywriting",
        "#",
        "#",
        "FALSE",
        6
      ],
      [
        "PRJ-07",
        "Kampanye Digital Kesadaran Regulasi",
        "Social Media",
        "Paket konten media sosial untuk kampanye kesadaran peraturan daerah.",
        "Desain visual dan teks kampanye lintas platform (Instagram, Facebook, Twitter/X) mencakup poster, carousel post, dan story template untuk diseminasi informasi regulasi daerah.",
        "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1000&q=80",
        "Adobe Photoshop, Canva, Social Media Strategy",
        "#",
        "#",
        "FALSE",
        7
      ],
      // — Shirt Design —
      [
        "PRJ-08",
        "Desain Kaos — Tim Hukum Pemprov",
        "Shirt Design",
        "Desain seragam kasual tim Biro Hukum untuk kegiatan non-formal.",
        "Perancangan desain sablon kaos bertemakan identitas institusi dengan elemen visual yang mencerminkan profesionalisme dan semangat kebersamaan tim Biro Hukum Sulteng.",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80",
        "Adobe Illustrator, Print Design, Mockup",
        "#",
        "#",
        "FALSE",
        8
      ],
      [
        "PRJ-09",
        "Merchandise Kaos Event Legal Summit",
        "Shirt Design",
        "Koleksi kaos merchandise untuk peserta Legal Summit Sulawesi Tengah.",
        "Desain 3 varian kaos event Legal Summit dengan tema 'Hukum untuk Semua': front print, back print, dan label custom. Dicetak dalam 3 warna pilihan.",
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1000&q=80",
        "Illustrator, DTF Print, Mockup Design",
        "#",
        "#",
        "FALSE",
        9
      ],
      // — Magazine —
      [
        "PRJ-10",
        "Buletin Hukum Daerah — Edisi Perdana",
        "Magazine",
        "Desain layout buletin resmi Biro Hukum Prov. Sulawesi Tengah.",
        "Perancangan layout editorial buletin hukum triwulanan: tipografi, grid sistem, ilustrasi, dan tata letak artikel. Mencakup rubrik regulasi terbaru, opini hukum, dan profil ASN.",
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80",
        "Adobe InDesign, Editorial Design, Typography",
        "#",
        "#",
        "FALSE",
        10
      ],
      [
        "PRJ-11",
        "Annual Report Biro Hukum 2024",
        "Magazine",
        "Desain laporan tahunan visual Biro Hukum Pemprov Sulawesi Tengah.",
        "Transformasi data capaian kinerja tahunan menjadi dokumen visual yang menarik: infografis data hukum, timeline regulasi, dan ringkasan pencapaian program kerja.",
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1000&q=80",
        "InDesign, Data Visualization, Report Design",
        "#",
        "#",
        "FALSE",
        11
      ]
    ];
    defaultProjects.forEach(row => projSheet.appendRow(row));
  }

  // 5. Contact Messages Sheet
  let contactSheet = ss.getSheetByName("ContactMessages");
  if (!contactSheet) {
    contactSheet = ss.insertSheet("ContactMessages");
    contactSheet.appendRow(["id", "timestamp", "sender_name", "sender_email", "subject", "message", "status"]);
  }

  return { status: "success", message: "Database berhasil diinisialisasi!" };
}

// ============================================================
// READ — Portfolio data (single batch)
// ============================================================

function getPortfolioData() {
  try {
    const ss = getDb();

    if (!ss.getSheetByName("Profile")) {
      setupDatabase();
    }

    const profileRows = ss.getSheetByName("Profile").getDataRange().getValues();
    const profile = {};
    for (let i = 1; i < profileRows.length; i++) {
      if (profileRows[i][0]) {
        profile[profileRows[i][0]] = profileRows[i][1];
      }
    }

    const skillsRows = ss.getSheetByName("Skills").getDataRange().getValues();
    const skills = [];
    for (let i = 1; i < skillsRows.length; i++) {
      skills.push({
        id: skillsRows[i][0],
        category: skillsRows[i][1],
        name: skillsRows[i][2],
        level: skillsRows[i][3],
        order: skillsRows[i][4]
      });
    }

    const expRows = ss.getSheetByName("Experience").getDataRange().getValues();
    const experience = [];
    for (let i = 1; i < expRows.length; i++) {
      experience.push({
        id: expRows[i][0],
        role: expRows[i][1],
        company: expRows[i][2],
        period: expRows[i][3],
        location: expRows[i][4],
        description: expRows[i][5],
        highlights: expRows[i][6],
        order: expRows[i][7]
      });
    }

    const projRows = ss.getSheetByName("Projects").getDataRange().getValues();
    const projects = [];
    for (let i = 1; i < projRows.length; i++) {
      projects.push({
        id: projRows[i][0],
        title: projRows[i][1],
        category: projRows[i][2],
        shortDesc: projRows[i][3],
        fullDesc: projRows[i][4],
        imageUrl: projRows[i][5],
        techStack: projRows[i][6],
        demoUrl: projRows[i][7],
        repoUrl: projRows[i][8],
        featured: projRows[i][9],
        order: projRows[i][10]
      });
    }

    return {
      status: "success",
      data: { profile, skills, experience, projects }
    };
  } catch (error) {
    return { status: "error", message: error.toString() };
  }
}

// ============================================================
// WRITE — Contact form submission (validated + deduplicated)
// ============================================================

function submitContactForm(formData) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    if (!formData || typeof formData !== "object") {
      return { status: "error", message: "Payload tidak valid." };
    }

    const name    = String(formData.name    || "").trim().slice(0, 200);
    const email   = String(formData.email   || "").trim().slice(0, 200);
    const subject = String(formData.subject || "").trim().slice(0, 300);
    const message = String(formData.message || "").trim().slice(0, 5000);

    // Validasi wajib
    if (!name || !email || !message) {
      return { status: "error", message: "Nama, email, dan pesan wajib diisi." };
    }
    // Validasi email sederhana
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { status: "error", message: "Format email tidak valid." };
    }

    const ss = getDb();
    let contactSheet = ss.getSheetByName("ContactMessages");
    if (!contactSheet) {
      setupDatabase();
      contactSheet = ss.getSheetByName("ContactMessages");
    }

    // Anti-duplikasi: email+subject yang sama dalam 60 detik terakhir.
    const existing = contactSheet.getDataRange().getValues();
    const now = Date.now();
    for (let i = existing.length - 1; i >= 1; i--) {
      const row = existing[i];
      const rowTs = new Date(row[1]).getTime();
      if (!isNaN(rowTs) && (now - rowTs) < 60000 &&
          String(row[3]) === email && String(row[4]) === subject) {
        return {
          status: "error",
          message: "Pesan duplikat terdeteksi. Mohon tunggu sebentar sebelum mengirim lagi."
        };
      }
    }

    const id = "MSG-" + now;
    const timestamp = new Date().toISOString();

    contactSheet.appendRow([id, timestamp, name, email, subject, message, "UNREAD"]);

    return { status: "success", message: "Pesan Anda telah berhasil dikirim!" };
  } catch (error) {
    return { status: "error", message: "Gagal mengirim pesan: " + error.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================
// UTIL — Backup / Snapshot seluruh sheet (read-only)
// ============================================================

function getDatabaseSnapshot() {
  try {
    const ss = getDb();
    if (!ss.getSheetByName("Profile")) setupDatabase();

    const snapshot = {};
    const sheets = ["Profile", "Skills", "Experience", "Projects", "ContactMessages"];
    sheets.forEach(function (name) {
      const sh = ss.getSheetByName(name);
      snapshot[name] = sh ? sh.getDataRange().getValues() : [];
    });

    return {
      status: "success",
      timestamp: new Date().toISOString(),
      data: snapshot
    };
  } catch (err) {
    return { status: "error", message: err.toString() };
  }
}