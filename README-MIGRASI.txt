FILE HASIL MIGRASI FRONTEND GAS -> VERCEL

File statis untuk Vercel:
- index.html
- style.css
- config.js
- api.js
- js.js

Backend Google Apps Script:
- Code.gs (tambahan doPost dispatcher)

PENTING:
1. Isi URL Web App GAS yang berakhiran /exec pada config.js.
2. Deploy Code.gs sebagai Web App, akses sesuai kebutuhan frontend (umumnya Execute as: Me; Who has access: Anyone).
3. Deploy ulang GAS setiap kali Code.gs diubah.
4. Letakkan file statis di root folder publik Vercel (atau sesuaikan path asset di index.html).
5. File JS.html, CSS.html, dan Index(20261113-140511).html asli adalah format include/template GAS. Vercel menggunakan js.js, style.css, dan index.html hasil konversi.
