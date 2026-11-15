/**
 * Vercel Serverless Proxy — NEXFOLIO → Google Apps Script
 *
 * - Meneruskan request frontend ke GAS Web App.
 * - Menambahkan header CORS.
 * - Menormalkan POST body → text/plain (yang dimengerti GAS doPost).
 *
 * ENV: GAS_WEB_APP_URL (wajib) — URL deployment GAS, harus diakhiri "/exec".
 */

const GAS_URL = process.env.GAS_WEB_APP_URL;

export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  if (!GAS_URL || typeof GAS_URL !== 'string' || !GAS_URL.trim()) {
    return res.status(500).json({
      status: 'error',
      message: 'GAS_WEB_APP_URL environment variable is not configured.'
    });
  }

  try {
    let targetUrl;
    let fetchOptions;

    if (req.method === 'GET') {
      // Forward semua query param (termasuk ?action=...)
      const url = new URL(GAS_URL);
      const query = req.query || {};
      Object.keys(query).forEach((key) => {
        const value = Array.isArray(query[key]) ? query[key][0] : query[key];
        if (value !== undefined) url.searchParams.set(key, value);
      });
      targetUrl = url.toString();
      fetchOptions = { method: 'GET', redirect: 'follow' };
    } else {
      // POST: teruskan body JSON sebagai text/plain (format yang aman untuk GAS)
      let bodyObj = req.body;
      if (typeof bodyObj === 'string') {
        try { bodyObj = JSON.parse(bodyObj); }
        catch { bodyObj = {}; }
      }
      if (!bodyObj || typeof bodyObj !== 'object') bodyObj = {};

      // Sisipkan action dari query string jika belum ada di body
      if (!bodyObj.action && req.query && req.query.action) {
        bodyObj.action = Array.isArray(req.query.action) ? req.query.action[0] : req.query.action;
      }

      targetUrl = GAS_URL;
      fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(bodyObj),
        redirect: 'follow'
      };
    }

    const upstream = await fetch(targetUrl, fetchOptions);
    const text = await upstream.text();

    // Pastikan response valid JSON; kalau tidak, balut sebagai error.
    try {
      JSON.parse(text);
      res.status(upstream.status || 200)
         .setHeader('Content-Type', 'application/json; charset=utf-8')
         .send(text);
    } catch {
      res.status(502).json({
        status: 'error',
        message: 'Invalid JSON response from GAS backend.',
        raw: text.slice(0, 800)
      });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message || String(err) });
  }
}