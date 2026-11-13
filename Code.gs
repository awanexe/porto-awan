/**
 * NEXFOLIO - Personal Portfolio Web Application
 * Backend Engine for Google Apps Script
 */

const SPREADSHEET_ID = ""; // Masukkan ID Google Sheets Anda di sini (opsional jika ditaruh pada spreadsheet yang sama)

function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('NEXFOLIO — Personal Portfolio')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * API endpoint untuk frontend Vercel.
 * Frontend mengirim JSON melalui POST dengan Content-Type text/plain
 * agar request sederhana tidak memicu preflight CORS.
 */
function doPost(e) {
  try {
    const requestText = e && e.postData && e.postData.contents
      ? e.postData.contents
      : "{}";
    const request = JSON.parse(requestText);
    const action = request.action;
    const payload = request.payload;

    let result;

    switch (action) {
      case "getPortfolioData":
        // Fungsi asli tidak menerima parameter; payload sengaja tidak diteruskan.
        result = getPortfolioData();
        break;

      case "submitContactForm":
        result = submitContactForm(payload || {});
        break;

      default:
        throw new Error("Action tidak dikenal: " + action);
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        error: error.toString(),
        message: error.message || "Terjadi kesalahan pada API GAS."
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Mendapatkan referensi Spreadsheet aktif atau via ID
 */
function getDb() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Inisialisasi awal database di Google Sheets
 */
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
      ["cv_drive_link", "https://drive.google.com"],
      ["email", "contact@kurniawan.dev"],
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
  let projSheet = ss.getSheetByName("Projects");
  if (!projSheet) {
    projSheet = ss.insertSheet("Projects");
    projSheet.appendRow(["id", "title", "category", "short_desc", "full_desc", "image_url", "tech_stack", "database", "repo_url", "featured", "display_order"]);
    const defaultProjects = [
      [
        "PRJ-01",
        "E-Legis: Sistem Otomatisasi Draft SK Gubernur",
        "Legal Tech",
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
        "Integrasi Ekosistem Alumni & Talent Pool Daerah",
        "Public Policy",
        "Naskah kebijakan dan model arsitektur talent management untuk akselerasi pembangunan daerah.",
        "Formulasi kerangka kerja strategis untuk memetakan, mengidentifikasi, dan mendistribusikan talenta alumni perguruan tinggi ke dalam sektor prioritas daerah Sulawesi Tengah.",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
        "Policy Paper, Strategic Planning, Data Analytics",
        "#",
        "#",
        "TRUE",
        2
      ],
      [
        "PRJ-03",
        "Dashboard Analisis Retribusi & Asset Management",
        "Web Apps",
        "Sistem monitoring dan pencatatan pendapatan denda serta klasifikasi harga standar barang milik daerah.",
        "Aplikasi web internal untuk rekapitulasi real-time denda pelanggaran administratif dan klasifikasi barang daerah menggunakan integrasi Apps Script dan Google Sheets.",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
        "Google Sheets API, JavaScript, Tailwind CSS",
        "#",
        "#",
        "TRUE",
        3
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

/**
 * Mengambil seluruh data portofolio secara efisien dalam 1 batch
 */
function getPortfolioData() {
  try {
    const ss = getDb();
    
    // Fallback jika database belum di-setup
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

/**
 * Menyimpan pesan kontak pengunjung ke sheet ContactMessages
 */
function submitContactForm(formData) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = getDb();
    let contactSheet = ss.getSheetByName("ContactMessages");
    if (!contactSheet) {
      setupDatabase();
      contactSheet = ss.getSheetByName("ContactMessages");
    }

    const id = "MSG-" + new Date().getTime();
    const timestamp = new Date().toISOString();
    
    contactSheet.appendRow([
      id,
      timestamp,
      formData.name || "",
      formData.email || "",
      formData.subject || "",
      formData.message || "",
      "UNREAD"
    ]);

    return { status: "success", message: "Pesan Anda telah berhasil dikirim!" };
  } catch (error) {
    return { status: "error", message: "Gagal mengirim pesan: " + error.toString() };
  } finally {
    lock.releaseLock();
  }
}