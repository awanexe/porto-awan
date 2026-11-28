# NEXFOLIO — Personal Portfolio Web Application

**NEXFOLIO** adalah aplikasi web portofolio modern dengan backend nir-server (*serverless*) berbasis **Google Apps Script** dan **Google Sheets** sebagai basis data terstruktur, dipadukan dengan antarmuka web editorial modern yang responsif dan interaktif.

---

## 🌟 Fitur Utama

- **Google Sheets as Database**: Data profil, keahlian (*skills*), pengalaman kerja (*experience*), proyek (*projects*), serta pesan kontak pengunjung dikelola langsung dari spreadsheet Google.
- **Modern & Responsive UI**: Dibangun dengan Tailwind CSS, tipografi editorial (*Syne*, *Inter*, *Space Grotesk*), dan ikon dari Lucide.
- **Dark / Light Mode**: Dukungan mode gelap/terang otomatis sesuai preferensi sistem pengguna atau diubah secara manual.
- **Dynamic Case Study Modal**: Tampilan interaktif untuk melihat rincian studi kasus proyek beserta *tech stack* dan tautan terkait.
- **Form Kontak Terintegrasi**: Mengirim pesan langsung ke lembar *ContactMessages* di Google Sheets dengan mekanisme penguncian (*LockService*) untuk keandalan data.
- **Standalone / Mock Mode**: Berjalan lancar baik di dalam lingkungan Google Apps Script (`google.script.run`) maupun secara mandiri (*preview*) dengan data simulasi bawaan (*fallback*).

---

## 📁 Struktur Direktori

```text
Nexfolio/
├── Code.gs         # Backend Google Apps Script (routing doGet, batch fetch, submit pesan)
├── Index.html      # Struktur utama HTML portofolio (Tailwind CSS, komponen UI)
├── CSS.html        # Kustomisasi CSS & efek visual tambahan
├── JS.html         # Logika interaktif sisi klien & integrasi Google Apps Script
├── .gitignore      # Daftar file yang diabaikan dalam version control
└── README.md       # Dokumentasi proyek
```

---

## 🚀 Panduan Instalasi & Penerapan

### 1. Menggunakan Google Apps Script Editor

1. Buka [Google Sheets](https://sheets.google.com) baru atau yang sudah ada.
2. Buka menu **Ekstensi** > **Apps Script**.
3. Buat file-file berikut di dalam editor Apps Script:
   - `Code.gs` (file skrip) -> salin isi dari `Code.gs`.
   - `Index.html` (file HTML) -> salin isi dari `Index.html`.
   - `CSS.html` (file HTML) -> salin isi dari `CSS.html`.
   - `JS.html` (file HTML) -> salin isi dari `JS.html`.
4. Jika Apps Script dibuat terpisah dari Google Sheets, masukkan ID spreadsheet Anda ke variabel `SPREADSHEET_ID` di dalam `Code.gs`:
   ```javascript
   const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
   ```
5. Jalankan fungsi `setupDatabase()` sekali melalui dropdown fungsi di editor Apps Script untuk membuat lembar data default (`Profile`, `Skills`, `Experience`, `Projects`, `ContactMessages`).
6. Klik **Terapkan (Deploy)** > **Penerapan Baru (New Deployment)**:
   - Pilih jenis: **Aplikasi Web (Web app)**
   - Jalankan sebagai: **Saya (Me)**
   - Siapa yang memiliki akses: **Siapa saja (Anyone)**
7. Salin URL Aplikasi Web yang dihasilkan untuk mengakses portofolio Anda secara publik.

---

## 🔒 Keamanan & Praktik Terbaik

- File konfigurasi tidak menyimpan token, password, atau API key rahasia.
- Akses penulisan form kontak dilindungi menggunakan `LockService` di sisi server Apps Script untuk mencegah tabrakan data (*concurrency*).

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi [MIT](LICENSE).

