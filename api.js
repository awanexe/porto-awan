// api.js — helper reusable untuk memanggil backend Google Apps Script
// Nilai URL dibaca dari konstanta global yang disediakan oleh config.js.
// Untuk build tool seperti Vite, konfigurasi ini juga dapat diganti dengan
// import.meta.env.VITE_GAS_API_URL pada saat build.
const GAS_API_URL = window.__ENV__?.GAS_API_URL || "GANTI_DENGAN_URL_WEB_APP_GAS_ANDA/exec";

async function callGasApi(action, payload) {
  if (!GAS_API_URL || GAS_API_URL.includes("GANTI_DENGAN_URL")) {
    throw new Error("GAS_API_URL belum dikonfigurasi. Isi URL Web App GAS pada config.js.");
  }

  try {
    const requestBody = { action };
    // Fungsi GAS tanpa parameter dikirim tanpa properti payload.
    if (payload !== undefined) {
      requestBody.payload = payload;
    }

    const response = await fetch(GAS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(requestBody),
      redirect: "follow"
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`Respons GAS bukan JSON yang valid: ${parseError.message}`);
    }

    if (data && data.error) {
      throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
    }

    return data;
  } catch (error) {
    // Termasuk network error, HTTP error, dan error parsing JSON.
    console.error(`[callGasApi] Gagal memanggil action "${action}":`, error);
    throw error;
  }
}

// Dipasang pada window agar dapat digunakan oleh js.js tanpa bundler/module.
window.callGasApi = callGasApi;
