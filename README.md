# HR Savage CV Reviewer & Roaster AI

> **Aplikasi Audit & Roasting CV Tingkat Lanjut Berstandar HR Industri Global.**  
> Memberikan kritik pedas, tajam, dan objektif dari sudut pandang *Talent Acquisition Director* 15+ tahun, dilengkapi verifikasi jejak digital, simulasi ATS (*Applicant Tracking System*), audit portofolio GitHub, serta penulisan ulang poin pengalaman menggunakan **Google X-Y-Z Formula**.

---

## Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Rubrik & Matriks Penilaian](#-rubrik--matriks-penilaian)
- [Tech Stack & Arsitektur](#️-tech-stack--arsitektur)
- [Panduan Instalasi & Menjalankan Lokal](#-panduan-instalasi--menjalankan-lokal)
- [Konfigurasi Environment Variables](#️-konfigurasi-environment-variables)
-  Ringkasan API Endpoints](#-ringkasan-api-endpoints)
- [CI/CD Workflows](#-cicd-workflows)
-  Dokumentasi Lanjutan](#-dokumentasi-lanjutan)

---

## Fitur Utama

### 1. Savage & Constructive CV Roaster
- **Zero-Hallucination Evidence-Based Audit:** AI hanya mengkritik fakta dan kata-kata yang benar-benar ada di dalam CV. Dilarang keras menuduh atau mengarang kesalahan yang tidak tertera.
- **Multimodal Support:** Menerima input teks mentah (*raw paste*) maupun dokumen PDF / gambar CV beresolusi tinggi.
- **Job Description (JD) Target Matcher:** Mendukung input deskripsi lowongan kerja untuk menghitung kecocokan kata kunci dan kesenjangan kompetensi (*skill gap*) secara presisi.
- **Multi-Level Seniority Calibration:** Penilaian disesuaikan otomatis dengan tingkat pengalaman (*Fresh Graduate*, *Junior*, *Mid-Level*, *Senior*, *Lead/Executive*).

### 2.  Digital Footprint & Inconsistency Auditor
- Mengaudit konsistensi klaim antara CV dengan profil online (**LinkedIn**, **GitHub**, **Portofolio Web**, dan **Twitter/X**).
- Mendeteksi *Red Flags* seperti perbedaan riwayat jabatan, periode kerja tumpang tindih, klaim tech stack palsu, hingga risiko reputasi online.
- Menghitung **Digital Hygiene Score** dengan rekomendasi perbaikan privasi dan profesionalisme.

### 3. GitHub Programmer Roaster & Technical Audit
- Audit repositori GitHub khusus developer / engineer berdasarkan data nyata (bukan tebak-tebakan).
- Mendeteksi *Tutorial Purgatory* (apakah repo cuma tiruan tutorial YouTube/Udemy sederhana seperti Todo App atau Calculator).
- Menilai kualitas komit, kebersihan kode (*code smells*), unit testing, CI/CD, dokumentasi README, serta arsitektur backend/frontend.
- Memberikan rekomendasi proyek portofolio berkelas dunia untuk menembus wawancara kerja *top-tier tech*.

### 4. AI Bullet Point Rewriter (Google X-Y-Z & STAR Formula)
- Mengubah poin pengalaman kerja yang pasif (*"Bertanggung jawab atas..."*) menjadi kalimat berdaya pengaruh tinggi (*high-impact action verbs*).
- Menerapkan rumus baku: **"Accomplished [X], as measured by [Y], by doing [Z]"**.

### 5. Interactive AI HR Consultant (Chat Interaktif)
- Sesi tanya jawab langsung dengan persona HR Director veteran untuk konsultasi strategi negosiasi gaji, alasan pindah kerja, dan taktik wawancara.

### 6. Instant Audit Report PDF Export
- Unduh laporan hasil audit dan roasting lengkap dalam format PDF rapi, siap simpan dan bagikan.

---

## Rubrik & Matriks Penilaian

Sistem penilaian menggunakan skala **0 - 100 poin** yang terbagi dalam 5 dimensi utama (masing-masing bernilai maksimal 20 poin):

| Kategori Dimensi | Bobot | Deskripsi Penilaian |
| :--- | :---: | :--- |
| **Impact & Metrics** | 0 - 20 | Keberadaan metrik kuantitatif (persentase efisiensi, nominal uang, skala pengguna, waktu). |
| **ATS Compatibility** | 0 - 20 | Keterbacaan format parsing, struktur heading standar, bebas elemen dekorasi perusak scanner ATS. |
| **Action Verbs & Clarity** | 0 - 20 | Penggunaan kata kerja aktif tegas; bebas dari frasa pasif ("Responsible for", "Tasked to"). |
| **Skills & Keywords** | 0 - 20 | Kepadatan dan relevansi kata kunci teknis/industri terhadap target posisi yang dilamar. |
| **Career Story & Relevance** | 0 - 20 | Alur perkembangan karir yang logis, narasi kepemimpinan, dan relevansi pengalaman. |

### Klasifikasi Grade
- **90 - 100 (Grade S):** Portofolio & CV kelas dunia, sangat kompetitif di FAANG / Global Unicorn.
- **80 - 89 (Grade A):** Sangat kuat, profil terstruktur dengan metrik bisnis yang jelas.
- **70 - 79 (Grade B):** Bagus, terdapat metrik namun perlu penajaman formula Google X-Y-Z.
- **55 - 69 (Grade C):** Rata-rata / Medioker, banyak deskripsi tugas pasif dan minim dampak bisnis.
- **40 - 54 (Grade D):** Penuh *buzzwords*, layout berantakan, risiko tinggi ditolak dalam 6 detik.
- **0 - 39 (Grade F):** Format rusak, nol metrik, auto-reject instan.

---

## Tech Stack & Arsitektur

### Frontend
- **React 19** & **TypeScript**
- **Vite 6** (Modern Fast Bundler)
- **Tailwind CSS v4** (Desain Bento Grid Modern & Dark Mode Glassmorphism)
- **Motion (`motion/react`)** (Animasi interaktif dan transisi fluid)
- **Lucide React** (Ikonografi komprehensif)
- **jspdf** & **canvas-confetti** (Generator laporan PDF & efek visual selebrasi)

### Backend
- **Express.js** (Server API & Middleware Handler)
- **`@google/genai` (Google Gen AI SDK)** dengan model **Gemini 2.5 Flash / Gemini 3.7 Flash**
- **esbuild** (Single-bundle CJS compilation untuk *production runtime*)

---

## Panduan Instalasi & Menjalankan Lokal

### Prasyarat
- **Node.js**: Versi `18.x`, `20.x`, atau `22.x`
- **NPM** atau **Bun**
- **Gemini API Key** (didapatkan gratis melalui [Google AI Studio](https://aistudio.google.com/))

### 1. Clone Repository
```bash
git clone https://github.com/username/hr-savage-cv-roaster.git
cd hr-savage-cv-roaster
```

### 2. Pasang Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka `.env` dan masukkan API Key Anda:
```env
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
APP_URL=http://localhost:3000
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser pada alamat `http://localhost:3000`.

### 5. Build & Jalankan untuk Production
```bash
# Kompilasi frontend (Vite) dan backend (esbuild)
npm run build

# Menjalankan server hasil build
npm run start
```

---

## Konfigurasi Environment Variables

| Variable | Wajib | Deskripsi |
| :--- | :---: | :--- |
| `GEMINI_API_KEY` | **Ya** | API Key Google Gemini untuk mengakses model AI server-side. |
| `APP_URL` | Opsional | URL dasar tempat aplikasi di-host (default: `http://localhost:3000`). |

 **Catatan Keamanan:** Kunci API `GEMINI_API_KEY` hanya berjalan pada *server-side* (`server.ts`) dan tidak pernah diekspos ke peramban client.

---

## Ringkasan API Endpoints

Semua endpoint backend diawali dengan prefix `/api/*`:

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/review-cv` | Analisis mendalam, grading 5 dimensi, roasting tajam, dan simulasi ATS. |
| `POST` | `/api/digital-footprint` | Audit jejak digital, cross-check profil LinkedIn, GitHub, & portofolio. |
| `POST` | `/api/roast-github` | Roasting teknis profil dan repositori GitHub programmer. |
| `POST` | `/api/hr-chat` | Chat interaktif tanya-jawab konsultasi karir dengan AI HR Director. |
| `POST` | `/api/rewrite-bullet` | Penulisan ulang satu baris pengalaman dengan formula Google X-Y-Z. |
| `POST` | `/api/quick-roast` | Roasting kilat 1-2 kalimat untuk preview instan. |
| `GET` | `/api/health` | Healthcheck status server. |

*Lihat [Dokumentasi Lengkap API](docs/API.md) untuk spesifikasi JSON Schema dan contoh payload.*

---

## CI/CD Workflows

Aplikasi ini dilengkapi dengan pipeline otomatisasi GitHub Actions:
- **`ci.yml` (Continuous Integration):** Menjalankan *Type-Checking (`tsc --noEmit`)*, *Linting*, dan *Production Build Check* pada Node.js versi 18.x, 20.x, dan 22.x.
- **`cd.yml` (Continuous Deployment):** Memastikan kesiapan bundle produksi `dist/server.cjs` dan aset statis `dist/` untuk deploy ke Google Cloud Run atau container environment.

---

## Dokumentasi Lanjutan

- [Spesifikasi API Lengkap (docs/API.md)](docs/API.md)
- [Arsitektur Sistem & Data Flow (docs/ARCHITECTURE.md)](docs/ARCHITECTURE.md)

---

## Lisensi

Didistribusikan di bawah lisensi MIT. Silakan gunakan dan modifikasi secara bebas untuk kebutuhan edukasi dan peningkatan karir.
