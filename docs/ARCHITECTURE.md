# Arsitektur Sistem & Desain Teknis (Architecture Guide)

Dokumen ini menjelaskan arsitektur perangkat lunak, komponen antarmuka pengguna, pipeline backend, strategi *Zero-Hallucination AI*, serta alur data aplikasi **HR Savage CV Reviewer & Roaster AI**.

---

## Gambaran Umum Sistem (System Overview)

Aplikasi ini menggunakan arsitektur **Full-Stack Single-Page Application (SPA)** yang didukung oleh server terintegrasi **Node.js Express + Vite**. 

```
┌────────────────────────────────────────────────────────┐
│               Client Tier (React 19 SPA)               │
│  - Bento Grid Dashboard   - Interactive HR Consultant   │
│  - CV Input & Multimodal  - Digital Footprint Auditor   │
│  - GitHub Roaster View    - Client-Side PDF Generator   │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP JSON / Multimodal Base64
                            ▼
┌────────────────────────────────────────────────────────┐
│             Server Tier (Express API Server)            │
│  - /api/review-cv         - /api/digital-footprint     │
│  - /api/roast-github      - /api/hr-chat               │
│  - /api/rewrite-bullet    - /api/quick-roast           │
│  - Security & Rate Limits - Prompt Grounding Pipeline   │
└───────────────────────────┬────────────────────────────┘
                            │ Structured System Instructions
                            ▼
┌────────────────────────────────────────────────────────┐
│         AI Engine (Google Gemini 2.5/3.7 Flash)        │
│  - Strictly Grounded System Prompt (No-Hallucination)   │
│  - JSON Schema Enforcement (Type.OBJECT, Type.ARRAY)   │
│  - Low Temperature Sampling (0.25)                     │
└────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### 1. Hierarki Komponen (`src/components/`)
- **`App.tsx`**: Pengendali state global, tab navigasi aktif (`cv_roaster`, `digital_footprint`, `github_roaster`, `consultant`), dan manajemen modal.
- **`Header.tsx`**: Navigasi atas dengan indikator status sistem, mode pemilih ketegasan, dan *quick branding*.
- **`CVInputSection.tsx`**: Form input multimodal (mendukung file upload PDF/PNG/JPG dengan drag-and-drop dan text input), selektor target level karir, industri, serta input opsional *Job Description*.
- **`ReviewDashboard.tsx`**: Dashboard hasil audit dengan format Bento Grid:
  - Header Skor Keseluruhan & Badge Grade (S/A/B/C/D/F).
  - 5-Dimension Radar/Progress Score Breakdown.
  - Fatal Red Flags dengan kutipan verbatim fakta CV.
  - Buzzword Audit & Kata Pengganti Berbobot.
  - STAR / Google X-Y-Z Bullet Point Transformer.
  - ATS Keyword Matcher & Gap Analysis.
  - Step-by-Step Action Plan & Full Rewrite Snippet.
- **`DigitalFootprintSection.tsx`**: Form cross-check jejak digital dan visualisasi *Digital Hygiene Score*.
- **`GitHubRoasterSection.tsx`**: Modul roasting teknis programmer dengan diagnosa *Tutorial Hell*, audit commit, dan blueprint proyek BANGKAH.
- **`InteractiveHRConsultant.tsx`**: Widget chat live dengan persona Recruiter Director.
- **`BulletRewriterModal.tsx`**: Modal interaktif untuk merombak kalimat CV individual secara cepat.

### 2. Styling System
- Menggunakan **Tailwind CSS v4** dengan tema *Dark Mode Tech-Forward*:
  - Latar belakang: `zinc-950`
  - Kartu kontainer: `zinc-900/80` dengan *glassmorphism backdrop blur*
  - Aksen status: `red-500` (Savage Roasting), `amber-500` (Warning), `emerald-500` (Good/Passed), `cyan-500` (Tech/GitHub).

---

## ⚙️ Backend Architecture (`server.ts`)

### 1. Vite Development Integration vs. Production CJS
- **Dalam Mode Development (`process.env.NODE_ENV !== 'production'`)**:
  Server Express memanfaatkan middleware `createViteServer({ server: { middlewareMode: true } })` untuk mendukung *Instant TypeScript Compilation* dan live preview.
- **Dalam Mode Production (`NODE_ENV=production`)**:
  File `server.ts` dibundel oleh `esbuild` menjadi file tunggal `dist/server.cjs` menggunakan opsi `--format=cjs --packages=external`. Aset frontend yang telah dibuild ke dalam `dist/` dilayani secara statis oleh Express.

### 2. Zero-Hallucination & Accuracy Strategy
Untuk mengatasi masalah ketidakakuratan atau tuduhan fiktif saat roasting, sistem menerapkan teknik *Prompt Grounding* berstandar tinggi:

1. **Strict Evidence-Based Quotations:**
   AI diwajibkan menyertakan *verbatim quote* dari teks CV setiap kali mendeteksi kelemahan atau buzzword.
2. **Deterministic Sampling:**
   Pengaturan `temperature: 0.25` untuk menekan halusinasi dan menjaga konsistensi skoring matematis antar pengujian.
3. **Structured Schema Validation:**
   Menggunakan `responseSchema` dari SDK `@google/genai` (`Type.OBJECT`, `Type.INTEGER`, `Type.ARRAY`) sehingga output dijamin valid JSON tanpa parsing error.
4. **Seniority Normalization:**
   Pemberian instruksi eksplisit tentang batasan ekspektasi untuk level *Fresh Graduate* vs *Staff/Executive*.

---

## Security & Data Privacy

1. **Server-Side API Key Encapsulation:**
   Kunci API `GEMINI_API_KEY` dikelola eksklusif pada runtime backend container. Klien browser tidak pernah menerima atau mengekspos token rahasia.
2. **Ephemeral Document Processing:**
   File CV (PDF/Gambar) yang diunggah dikonversi menjadi buffer base64 dalam memori, diproses ke API Gemini secara *stateless*, dan langsung dibuang dari memori tanpa disimpan di disk penyimpanan publik.

---

## Alur Data (Data Flow Lifecycle)

```
[User Uploads CV] 
       │
       ▼
[Client Base64 Encoding & Validation]
       │
       ▼
[POST /api/review-cv Request]
       │
       ▼
[Express Server formats Multimodal Parts + Grounded System Prompt]
       │
       ▼
[Google GenAI Gemini 2.5/3.7 Flash API Call with JSON Schema]
       │
       ▼
[Structured Audit Response (Scores, Quotes, Rewrites)]
       │
       ▼
[Client renders Interactive Bento Dashboard & Enables PDF Export]
```
