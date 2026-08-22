# Spesifikasi API Backend (API Reference)

Dokumentasi lengkap untuk seluruh endpoint REST API yang disediakan oleh server Express pada aplikasi **HR Savage CV Reviewer & Roaster AI**.

Base URL: `http://localhost:3000` (atau URL hosting produksi).

---

## Daftar Endpoint

1. [POST /api/review-cv](#1-post-apireview-cv)
2. [POST /api/digital-footprint](#2-post-apidigital-footprint)
3. [POST /api/roast-github](#3-post-apiroast-github)
4. [POST /api/hr-chat](#4-post-apihr-chat)
5. [POST /api/rewrite-bullet](#5-post-apirewrite-bullet)
6. [POST /api/quick-roast](#6-post-apiquick-roast)
7. [GET /api/health](#7-get-apihealth)

---

## 1. POST `/api/review-cv`

Melakukan analisis menyeluruh, skoring 5 kategori, deteksi red flags, simulasi ATS, dan audit kalimat untuk teks atau dokumen CV kandidat.

### Request Headers
```http
Content-Type: application/json
```

### Request Body Schema
```typescript
interface ReviewCVRequest {
  cvText?: string;             // Teks mentah CV (opsional jika mengirim file)
  fileData?: {                 // Dokumen CV (PDF/Gambar)
    mimeType: string;          // e.g. "application/pdf", "image/png"
    data: string;              // Base64 encoded file string
  };
  targetRole?: string;         // e.g. "Senior Backend Engineer"
  targetLevel?: "freshgrad" | "junior" | "mid" | "senior" | "lead_executive";
  industry?: string;           // e.g. "Fintech / Banking"
  jobDescription?: string;     // Opsional: Teks kualifikasi loker untuk match ATS
  strictnessMode?: "savage_brutal" | "constructive_hr" | "ultra_roast";
  language?: "id" | "en";      // Default: "id"
}
```

### Contoh Request Body
```json
{
  "cvText": "John Doe - Software Engineer. Bertanggung jawab mengelola website dan database. Menguasai React, Node.js, dan MySQL. Bekerja keras dan mampu bekerja dalam tim.",
  "targetRole": "Senior Fullstack Engineer",
  "targetLevel": "senior",
  "industry": "Tech / Startup",
  "jobDescription": "Looking for Senior Fullstack Engineer with 5+ years experience in Node.js, distributed microservices, AWS, and system scalability.",
  "strictnessMode": "savage_brutal",
  "language": "id"
}
```

### Response Schema (200 OK)
```json
{
  "overallScore": 48,
  "grade": "D",
  "verdictTag": "Auto-Reject dalam 4 Detik",
  "summaryRoast": "CV ini lebih mirip resep belanjaan daripada portofolio Senior Engineer. Nol metrik kuantitatif, penuh kata kerja pasif, dan tidak ada bukti nyata skalabilitas.",
  "scoreBreakdown": {
    "impactAndMetrics": {
      "score": 6,
      "max": 20,
      "feedback": "Tidak ada satu pun angka atau persentase dampak bisnis yang dicantumkan.",
      "status": "critical"
    },
    "atsCompatibility": {
      "score": 12,
      "max": 20,
      "feedback": "Struktur teks terbaca, namun keyword esensial terlewat.",
      "status": "warning"
    },
    "actionVerbsAndClarity": {
      "score": 8,
      "max": 20,
      "feedback": "Menggunakan 'Bertanggung jawab atas' alih-alih action verbs kuat seperti Merancang atau Mengoptimalkan.",
      "status": "critical"
    },
    "skillsAndKeywords": {
      "score": 11,
      "max": 20,
      "feedback": "Hanya menyebut library dasar tanpa tech stack arsitektur kelas senior.",
      "status": "warning"
    },
    "careerStoryAndRelevance": {
      "score": 11,
      "max": 20,
      "feedback": "Narasi senioritas belum terlihat jelas dari deskripsi tugas.",
      "status": "warning"
    }
  },
  "fatalRedFlags": [
    {
      "issue": "Nol Metrik Kuantitatif",
      "quoteOrEvidence": "mengelola website dan database",
      "whyFatal": "Recruiter tidak tahu berapa skala pengguna atau efisiensi yang Anda hasilkan.",
      "howToFix": "Gunakan format: Meningkatkan response time API sebesar 35% dengan menerapkan Redis caching."
    }
  ],
  "buzzwordAudit": [
    {
      "buzzword": "mampu bekerja dalam tim",
      "alternatives": ["Memimpin kolaborasi lintas divisi untuk merilis 4 fitur utama"]
    }
  ],
  "bulletPointRewrites": [
    {
      "original": "Bertanggung jawab mengelola website dan database",
      "critique": "Sangat pasif dan tidak menjelaskan dampak nyata.",
      "improvedXYZ": "Mengembangkan arsitektur backend website berbasis Node.js yang melayani 50.000+ daily active users dengan uptime 99.9%.",
      "actionVerbUsed": "Mengembangkan",
      "metricImpact": "50.000+ DAU, 99.9% uptime"
    }
  ],
  "atsSimulation": {
    "parseScore": 55,
    "matchedKeywords": ["React", "Node.js", "MySQL"],
    "missingCriticalKeywords": ["AWS", "Microservices", "System Architecture", "Docker", "CI/CD"],
    "formattingRisks": ["Kurang rincian proyek arsitektural"]
  },
  "sectionBySectionCritique": [
    {
      "sectionName": "Ringkasan Profil",
      "scoreOutOf10": 4,
      "comment": "Terlalu umum dan penuh kata sifat tanpa bukti pencapaian."
    }
  ],
  "stepByStepActionPlan": [
    "Ubah semua poin deskripsi kerja menjadi formula X-Y-Z",
    "Tambahkan kata kunci AWS dan Microservices sesuai lowongan sasaran"
  ],
  "sampleFullCvRewriteSnippet": "### PENGALAMAN KERJA\n**Senior Fullstack Engineer** | Tech Corp\n- Merancang ulang pipeline database MySQL..."
}
```

---

## 2. POST `/api/digital-footprint`

Memeriksa jejak digital kandidat dengan membandingkan riwayat CV terhadap klaim LinkedIn, GitHub, Website Portofolio, atau Twitter/X.

### Request Body Schema
```typescript
interface DigitalFootprintRequest {
  cvTextSummary: string;       // Ringkasan atau teks CV
  linkedInUrlOrBio?: string;   // URL atau teks bio LinkedIn
  githubUsernameOrData?: string; // Username atau data GitHub
  portfolioUrlOrData?: string; // URL atau ringkasan portofolio
  twitterOrSocial?: string;    // Profil sosial media tambahan
  language?: "id" | "en";
}
```

### Response Schema (200 OK)
```json
{
  "digitalHygieneScore": 72,
  "riskLevel": "medium",
  "executiveSummary": "Ditemukan beberapa diskrepansi antara tech stack di CV dengan commit history di GitHub.",
  "inconsistenciesFound": [
    {
      "platform": "GitHub vs CV",
      "severity": "high",
      "cvClaim": "5 tahun pengalaman Go/Golang dan Kubernetes",
      "onlineEvidence": "Seluruh repositori GitHub hanya berisi JavaScript dan HTML dasar",
      "recruiterImpression": "Dicurigai memalsukan pengalaman backend untuk lolos saringan CV",
      "recommendation": "Sertakan repositori proyek Golang publik dengan unit test dan deployment script nyata"
    }
  ],
  "platformAudits": [
    {
      "platformName": "GitHub",
      "hygieneScore": 60,
      "status": "warning",
      "strengths": ["Memiliki aktivitas komit rutin"],
      "vulnerabilities": ["Banyak repositori hasil fork tanpa kontribusi nyata"]
    }
  ],
  "onlineReputationRisks": [
    "Tidak ada tautan portofolio yang dapat diakses langsung"
  ],
  "actionPlanToSanitize": [
    "Arsipkan repositori tutorial pemula yang belum selesai",
    "Lengkapi bio LinkedIn dengan kata kunci yang konsisten dengan CV"
  ]
}
```

---

## 3. POST `/api/roast-github`

Melakukan technical audit dan roasting terhadap profil GitHub programmer secara objektif dan mendalam.

### Request Body Schema
```typescript
interface GitHubRoastRequest {
  username: string;            // Username GitHub target
  claimedTechStack?: string;   // Klaim keahlian kandidat
  targetRole?: string;         // Target posisi (e.g., "Senior Go Engineer")
  language?: "id" | "en";
}
```

### Response Schema (200 OK)
```json
{
  "devScore": 65,
  "devTier": "Mid-Tier Tutorial Survivor",
  "punchlineRoast": "Profil ini adalah museum digital untuk tutorial YouTube yang ditinggalkan di tengah jalan.",
  "tutorialHellDiagnosis": {
    "isTrapped": true,
    "evidenceRepos": ["todo-app-react", "weather-app-v1", "netflix-clone"],
    "critique": "3 dari 5 repo publik adalah tutorial pemula tanpa testing atau custom business logic."
  },
  "commitHistoryAudit": {
    "consistencyScore": 70,
    "qualityVerdict": "Banyak komit dengan pesan 'fix bug' dan 'update'.",
    "greenSquaresRealityCheck": "Aktivitas hijau didominasi perubahan README daripada arsitektur kode."
  },
  "codeHygieneAndArchitecture": {
    "score": 60,
    "strengths": ["Struktur folder rapi pada proyek React"],
    "antiPatterns": ["Tidak ada Dockerfile, unit test 0%, dan environment variables di-hardcode"]
  },
  "techStackMatchAudit": {
    "claimed": "Go, Docker, Kubernetes",
    "realityFound": "JavaScript 85%, HTML/CSS 15%",
    "gapAnalysis": "Belum ada repositori Go yang menunjukkan kemampuan concurrency atau microservices."
  },
  "worldClassProjectBlueprint": {
    "suggestedProjectTitle": "High-Throughput Distributed Task Queue in Go",
    "techStack": ["Golang", "Redis", "gRPC", "Docker"],
    "architectureHighlights": ["Raft consensus algorithm", "Benchmarking 100k req/s", "Prometheus metrics"],
    "whyItImpressesBANGKAH": "Membuktikan kemampuan mengelola concurrency dan sistem terdistribusi nyata."
  }
}
```

---

## 4. POST `/api/hr-chat`

Sesi tanya jawab interaktif dengan persona AI HR Consultant / Recruiter Director.

### Request Body Schema
```typescript
interface HRChatRequest {
  history: Array<{
    role: "user" | "model";
    content: string;
  }>;
  message: string;             // Pertanyaan pengguna terbaru
  cvContext?: string;          // Ringkasan hasil roasting CV sebelumnya (opsional)
  targetRole?: string;
  language?: "id" | "en";
}
```

### Response Schema (200 OK)
```json
{
  "response": "Dari kacamata Recruiter, negosiasi gaji di tahap awal harus berfokus pada value creation. Jika CV Anda belum memiliki metrik efisiensi biaya, berikan bukti portofolio studi kasus sebelum meminta kenaikan 40%..."
}
```

---

## 5. POST `/api/rewrite-bullet`

Mentransformasikan satu baris kalimat deskripsi kerja menjadi formula Google X-Y-Z yang tajam.

### Request Body Schema
```typescript
interface RewriteBulletRequest {
  originalBullet: string;      // Contoh: "Membuat fitur login dan register"
  targetRole?: string;         // Contoh: "Backend Engineer"
  context?: string;            // Contoh: "Menggunakan JWT dan bcrypt untuk 10k user"
  language?: "id" | "en";
}
```

### Response Schema (200 OK)
```json
{
  "original": "Membuat fitur login dan register",
  "variations": [
    {
      "framework": "Google X-Y-Z Formula",
      "rewrittenText": "Merancang dan mengimplementasikan modul otentikasi JWT terenkripsi yang mengamankan 10.000+ akun pengguna dengan zero security breach.",
      "actionVerb": "Merancang & Mengimplementasikan",
      "impactMetric": "10.000+ akun, zero security breach",
      "explanation": "Menonjolkan aspek keamanan dan skala pengguna."
    },
    {
      "framework": "STAR (Impact First)",
      "rewrittenText": "Meningkatkan kecepatan otentikasi user hingga 40% melalui arsitektur login berbasis Redis session caching.",
      "actionVerb": "Meningkatkan",
      "impactMetric": "40% faster latency",
      "explanation": "Fokus pada performa sistem."
    }
  ]
}
```

---

## 6. POST `/api/quick-roast`

Menghasilkan 1-2 kalimat roasting kilat untuk preview cepat sebelum audit lengkap dijalankan.

### Request Body Schema
```typescript
interface QuickRoastRequest {
  snippet: string;             // Cuplikan teks CV atau bio
  role?: string;
  language?: "id" | "en";
}
```

### Response Schema (200 OK)
```json
{
  "punchline": "CV Anda membuktikan bahwa Anda sangat ahli dalam meng-copy paste deskripsi pekerjaan tanpa pernah mengukur apa hasilnya."
}
```

---

## 7. GET `/api/health`

Health check endpoint untuk memverifikasi kesiapan server backend.

### Response (200 OK)
```json
{
  "status": "ok",
  "service": "HR Savage CV Reviewer & Roaster AI",
  "timestamp": "2026-08-22T07:30:00.000Z"
}
```
