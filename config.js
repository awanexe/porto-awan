// config.js — konfigurasi frontend statis untuk Vercel
// Isi GAS_API_URL dengan URL Web App Google Apps Script yang berakhiran /exec.
// File ini sengaja terpisah agar URL backend tidak ditanam di dalam logika aplikasi.
window.__ENV__ = window.__ENV__ || {};
window.__ENV__.GAS_API_URL = window.__ENV__.GAS_API_URL || "GANTI_DENGAN_URL_WEB_APP_GAS_ANDA/exec";
