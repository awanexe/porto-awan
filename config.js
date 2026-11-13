// config.js — konfigurasi frontend statis untuk Vercel
// Isi GAS_API_URL dengan URL Web App Google Apps Script yang berakhiran /exec.
// File ini sengaja terpisah agar URL backend tidak ditanam di dalam logika aplikasi.
window.__ENV__.GAS_API_URL =
  "https://script.google.com/macros/s/AKfycbwSF6XGAwMugFOq8ffUneZcSwq8LkS5To4GXsjWHBZ1qX12iKmVrb5XKiH9YJ-uk41JSA/exec";
