import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

// Middleware for large payload (e.g. base64 PDFs or images)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY belum dikonfigurasi di Environment Variables Vercel atau file .env.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

/**
 * Fast & robust execution helper with rapid fallback across reliable models
 */
async function generateWithRetry(ai: GoogleGenAI, options: any) {
  const candidateModels = ["gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-pro-preview", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      return await ai.models.generateContent({
        model,
        ...options,
      });
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || JSON.stringify(err);
      console.warn(`[Gemini API] Model ${model} encountered issue: ${errMsg}. Trying next candidate model...`);

      if (errMsg.includes("API key not valid") || errMsg.includes("API_KEY_INVALID") || errMsg.includes("GEMINI_API_KEY")) {
        throw new Error("GEMINI_API_KEY tidak valid atau belum dikonfigurasi di Environment Variables Vercel. Silakan periksa Vercel Project Settings > Environment Variables.");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw lastError;
}

function formatErrorMessage(error: any): string {
  const msg = error?.message || error?.toString() || "Unknown error";
  if (msg.includes("API_KEY_INVALID") || msg.includes("API key not valid") || msg.includes("GEMINI_API_KEY")) {
    return "GEMINI_API_KEY tidak valid atau belum dikonfigurasi di Environment Variables Vercel. Silakan atur GEMINI_API_KEY di dashboard Vercel.";
  }
  if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("429") || msg.includes("Quota exceeded")) {
    return "Limit kuota API Gemini telah tercapai untuk saat ini. Silakan coba lagi dalam beberapa saat.";
  }
  return msg;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// =========================================================================
// 1. FULL CV REVIEW & ROASTING ENDPOINT (/api/review-cv)
// =========================================================================
app.post("/api/review-cv", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const {
      cvText = "",
      fileData,
      targetRole = "Software Engineer",
      targetLevel = "mid",
      industry = "Technology",
      jobDescription = "",
      strictnessMode = "savage_brutal",
      language = "id",
    } = req.body;

    if (!cvText && !fileData?.data) {
      return res.status(400).json({
        success: false,
        error: "Harap masukkan teks CV atau unggah dokumen CV/Resume Anda.",
      });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
Kamu adalah "Savage BANGKAH Tech Recruiter, Head of Talent Acquisition & Principal Career Architect" dengan pengalaman 15+ tahun mengeliminasi 99% pelamar kerja di Google, Meta, Amazon, dan top unicorn.
Tugasmu adalah menganalisis CV kandidat ini secara sangat mendalam, detail, objektif, tajam, dan mengeluarkan hasil evaluasi lengkap dalam format JSON.

PENTING:
- Target Role: "${targetRole}"
- Target Level: "${targetLevel}"
- Industri: "${industry}"
- Strictness Mode: "${strictnessMode}" (savage_brutal = sangat pedas, sarkas, lucu, menohok, blak-blakan; stern_hr = tegas, profesional; constructive_pro = berwawasan positif; ats_robot = analitis ATS murni).
- Bahasa Respon: ${language === "en" ? "Bahasa Inggris" : "Bahasa Indonesia yang fasih, tajam, dengan istilah dunia industri tech/karir modern"}.

KEMBALIKAN HANYA JSON VALID DENGAN STRUKTUR BERIKUT:
{
  "overallScore": <angka bulat 0-100>,
  "grade": "<S / A / B / C / D / F>",
  "verdictTag": "<Tag vonis singkat misal: REJECTED IN 6 SECONDS / BUZZWORD OVERDOSE / POTENTIAL HIKIKOMORI / INTERVIEW WORTHY>",
  "summaryRoast": "<Paragraf pembuka roasting pedas atau ringkasan evaluasi tajam 2-3 kalimat>",
  "scoreBreakdown": {
    "impactAndMetrics": {
      "score": <angka 0-20>,
      "max": 20,
      "feedback": "<Kritik penggunaan angka, metrik finansial, formula X-Y-Z>",
      "status": "<critical / warning / good>"
    },
    "atsCompatibility": {
      "score": <angka 0-20>,
      "max": 20,
      "feedback": "<Kritik parsing ATS, layout kolom, font, tabel>",
      "status": "<critical / warning / good>"
    },
    "actionVerbsAndClarity": {
      "score": <angka 0-20>,
      "max": 20,
      "feedback": "<Kritik kata kerja aktif vs pasif>",
      "status": "<critical / warning / good>"
    },
    "skillsAndKeywords": {
      "score": <angka 0-20>,
      "max": 20,
      "feedback": "<Kritik relevansi tech stack / kata kunci>",
      "status": "<critical / warning / good>"
    },
    "careerStoryAndRelevance": {
      "score": <angka 0-20>,
      "max": 20,
      "feedback": "<Kritik alur karir dan relevansi dengan target role>",
      "status": "<critical / warning / good>"
    }
  },
  "fatalRedFlags": [
    {
      "title": "<Nama Red Flag>",
      "explanation": "<Penjelasan mengapa ini membunuh peluang CV>",
      "severity": "<high / medium / low>",
      "fix": "<Solusi konkret revisi>"
    }
  ],
  "buzzwordAudit": [
    {
      "word": "<Kata klise/buzzword di CV, misal: 'Hardworking', 'Passionate', 'Fast learner'>",
      "whyItSucks": "<Alasan mengapa recruiter muak membaca kata ini>",
      "replacement": "<Bukti konkret yang harus ditampilkan sebagai gantinya>"
    }
  ],
  "bulletPointRewrites": [
    {
      "original": "<Kutipan kalimat asli di CV yang lemah>",
      "whyWeak": "<Mengapa kalimat ini gagal menunjukkan dampak>",
      "improvedSTAR": "<Versi perbaikan berstandar BANGKAH Google X-Y-Z>",
      "impactExplained": "<Dampak bisnis yang terpancar setelah direvisi>"
    }
  ],
  "atsSimulation": {
    "parseScore": <angka 0-100>,
    "matchedKeywords": ["<keyword yang ditemukan 1>", "<keyword 2>"],
    "missingCriticalKeywords": ["<keyword krusial yang hilang 1>", "<keyword 2>"],
    "formattingRisks": ["<resiko format 1>", "<resiko 2>"]
  },
  "sectionBySectionCritique": {
    "headerAndSummary": {
      "roast": "<Kritik bagian profil/summary>",
      "recommendation": "<Saran perbaikan>",
      "rating": "<Sangat Buruk / Perlu Dirombak / Cukup / Bagus>"
    },
    "workExperience": {
      "roast": "<Kritik bagian pengalaman kerja>",
      "recommendation": "<Saran perbaikan>",
      "rating": "<Sangat Buruk / Perlu Dirombak / Cukup / Bagus>"
    },
    "skillsAndTools": {
      "roast": "<Kritik daftar skills>",
      "recommendation": "<Saran perbaikan>",
      "rating": "<Sangat Buruk / Perlu Dirombak / Cukup / Bagus>"
    },
    "educationAndCertifications": {
      "roast": "<Kritik edukasi & sertifikasi>",
      "recommendation": "<Saran perbaikan>",
      "rating": "<Sangat Buruk / Perlu Dirombak / Cukup / Bagus>"
    },
    "layoutAndLength": {
      "roast": "<Kritik panjang halaman & kerapihan visual>",
      "recommendation": "<Saran perbaikan>",
      "rating": "<Sangat Buruk / Perlu Dirombak / Cukup / Bagus>"
    }
  },
  "stepByStepActionPlan": [
    {
      "step": 1,
      "priority": "<Darurat (Segera) / Penting / Penyempurnaan>",
      "action": "<Langkah spesifik 1>",
      "example": "<Contoh penerapannya>"
    },
    {
      "step": 2,
      "priority": "<Darurat (Segera) / Penting / Penyempurnaan>",
      "action": "<Langkah spesifik 2>",
      "example": "<Contoh penerapannya>"
    },
    {
      "step": 3,
      "priority": "<Darurat (Segera) / Penting / Penyempurnaan>",
      "action": "<Langkah spesifik 3>",
      "example": "<Contoh penerapannya>"
    }
  ],
  "sampleFullCvRewriteSnippet": "<Contoh cuplikan teks pengalaman kerja yang sudah disempurnakan>"
}
`;

    const parts: any[] = [];

    if (fileData?.data && fileData?.mimeType) {
      parts.push({
        inlineData: {
          data: fileData.data,
          mimeType: fileData.mimeType,
        },
      });
    }

    let promptContext = `=== DETAIL PENILAIAN ===\nTarget Posisi: ${targetRole}\nLevel Karir: ${targetLevel}\nIndustri: ${industry}\n`;
    if (jobDescription) {
      promptContext += `\nDeskripsi Lowongan (Job Desc):\n${jobDescription}\n`;
    }

    if (cvText) {
      promptContext += `\n=== ISI TEKS CV KANDIDAT ===\n${cvText}\n`;
    }

    parts.push({
      text: `${promptContext}\n\nLakukan analisis sekarang dan berikan output HANYA format JSON yang diminta.`,
    });

    const response = await generateWithRetry(ai, {
      contents: parts,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const rawResponseText = response.text || "{}";
    const cleanedJson = cleanJsonString(rawResponseText);
    const parsedData = JSON.parse(cleanedJson);

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("CV Review Error:", error);
    res.status(500).json({
      success: false,
      error: formatErrorMessage(error),
    });
  }
});

// =========================================================================
// 2. DIGITAL FOOTPRINT AUDIT ENDPOINT (/api/audit-digital-footprint)
// =========================================================================
app.post("/api/audit-digital-footprint", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const {
      candidateName = "Kandidat",
      name = "",
      targetRole = "Professional",
      cvText = "",
      linkedinUrlOrBio = "",
      twitterUrlOrBio = "",
      githubUrlOrBio = "",
      portfolioOrBlog = "",
      additionalNotes = "",
      language = "id",
    } = req.body;

    const resolvedName = candidateName || name || "Kandidat";

    const ai = getGeminiClient();

    const systemInstruction = `
Kamu adalah "Lead Background Investigator & Digital Intelligence Specialist" untuk Executive Recruiter dan FAANG.
Tugasmu adalah melakukan cross-check antara klaim di CV dengan jejak digital (LinkedIn, X/Twitter, GitHub, Portfolio) untuk mendeteksi kontradiksi, kepalsuan, atau red flag online.

Format respon HARUS berupa JSON murni dengan skema:
{
  "authenticityScore": <angka 0-100, 100 = Sangat Otentik/Kredibel, 0 = Penuh Kebohongan/Red Flag>,
  "riskLevel": "<low / medium / high / critical>",
  "verdict": "<Tag vonis tajam, misal: MASSIVE DISCREPANCY DETECTED / CLEAN & VERIFIED / RED FLAG MAGNET>",
  "summaryRoast": "<Roasting pedas 2-3 kalimat mengenai reputasi dan kontradiksi jejak digital kandidat>",
  "digitalPersonaAudit": {
    "professionalismRating": "<Komentar rating profesionalitas profil online>",
    "toneRoast": "<Kritik gaya komunikasi / tweet / postingan kandidat di medsos>",
    "onlineActivityRisk": "<Risiko reputasi jika perusahaan merekrut kandidat ini>"
  },
  "inconsistencies": [
    {
      "claimInCv": "<Klaim di CV, misal: 'Senior Tech Lead 5 tahun'>",
      "foundInDigitalFootprint": "<Fakta di jejak digital, misal: 'Di LinkedIn terdaftar masih Freshgrad / Bio Twitter mengeluh baru belajar coding'>",
      "severity": "<critical / warning / minor>",
      "analysis": "<Mengapa kontradiksi ini fatal di mata HR>"
    }
  ],
  "verifiedHighlights": [
    {
      "skillOrExperience": "<Skill atau pencapaian yang terverifikasi nyata>",
      "evidence": "<Bukti di medsos / repo / portofolio>",
      "credibilityNote": "<Catatan kredibilitas>"
    }
  ],
  "backgroundCheckAdvice": [
    {
      "action": "<Langkah pembersihan atau sinkronisasi profil online>",
      "whyItMatters": "<Alasan pentingnya bagi karir>"
    }
  ]
}
`;

    const userPrompt = `
AUDIT JEJAK DIGITAL UNTUK:
Nama Kandidat: ${resolvedName}
Target Posisi: ${targetRole}
Teks/Klaim CV: ${cvText || "Tidak dicantumkan"}

Data Jejak Digital:
- LinkedIn / Bio: ${linkedinUrlOrBio || "Tidak dicantumkan"}
- Twitter/X / Tweet: ${twitterUrlOrBio || "Tidak dicantumkan"}
- GitHub / Repos: ${githubUrlOrBio || "Tidak dicantumkan"}
- Portfolio / Blog: ${portfolioOrBlog || "Tidak dicantumkan"}
- Catatan Tambahan: ${additionalNotes || "Tidak ada catatan tambahan"}

Bahasa: ${language === "en" ? "English" : "Bahasa Indonesia"}
Keluarkan HANYA JSON valid.
`;

    const response = await generateWithRetry(ai, {
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const cleanedText = cleanJsonString(response.text || "{}");
    const parsed = JSON.parse(cleanedText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Digital Footprint Error:", error);
    res.status(500).json({ success: false, error: formatErrorMessage(error) });
  }
});

// =========================================
// 3. GITHUB ROASTER & FULL PROFILE SCANNER (/api/roast-github)
// =========================================
app.post("/api/roast-github", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    let {
      username = "developer",
      targetRole = "Software Engineer",
      claimedTechStack = "",
      manualRepoInfo = "",
      language = "id",
    } = req.body;

    // Clean username if passed as a full URL or with @
    username = username
      .replace(/^https?:\/\/(www\.)?github\.com\//, "")
      .replace(/^@/, "")
      .replace(/\/.*$/, "")
      .trim();

    if (!username && !manualRepoInfo) {
      return res.status(400).json({ success: false, error: "Silakan masukkan username GitHub atau daftar repositori." });
    }

    // Attempt to fetch live public GitHub data
    let fetchedGithubData: any = null;

    if (username) {
      try {
        const headers: Record<string, string> = {
          "User-Agent": "HR-Savage-CV-Reviewer-AI",
          "Accept": "application/vnd.github.v3+json",
        };

        const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers });
        
        if (userRes.status === 404) {
          return res.status(404).json({
            success: false,
            error: `Akun GitHub dengan username "@${username}" tidak ditemukan di GitHub. Mohon periksa kembali ejaan username Anda.`,
          });
        }

        if (userRes.ok) {
          const userData = await userRes.json();
          
          // Fetch up to 100 repos sorted by recently pushed
          const reposRes = await fetch(
            `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=100`,
            { headers }
          );
          const reposData = reposRes.ok ? await reposRes.json() : [];

          // Fetch recent public events to extract real commit messages & activity
          const eventsRes = await fetch(
            `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100`,
            { headers }
          );
          const eventsData = eventsRes.ok ? await eventsRes.json() : [];

          // Extract real recent commit messages & event types
          const realCommitMessages: string[] = [];
          let pushEventsCount = 0;
          let prEventsCount = 0;
          let issuesEventsCount = 0;
          let createEventsCount = 0;
          let watchEventsCount = 0;

          if (Array.isArray(eventsData)) {
            for (const ev of eventsData) {
              if (ev.type === "PushEvent") {
                pushEventsCount++;
                if (ev.payload?.commits) {
                  for (const c of ev.payload.commits) {
                    if (c.message && typeof c.message === "string") {
                      const msg = c.message.trim();
                      if (msg && !realCommitMessages.includes(msg)) {
                        realCommitMessages.push(msg);
                      }
                    }
                  }
                }
              } else if (ev.type === "PullRequestEvent") {
                prEventsCount++;
              } else if (ev.type === "IssuesEvent") {
                issuesEventsCount++;
              } else if (ev.type === "CreateEvent") {
                createEventsCount++;
              } else if (ev.type === "WatchEvent") {
                watchEventsCount++;
              }
            }
          }

          // Evaluate Commit Hygiene Statistics
          let structuredCommitCount = 0;
          let lazyCommitCount = 0;
          const semanticPrefixRegex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?:\s?.+/i;
          const lazyMessageRegex = /^(update|fix|fixed|commit|wip|test|asdf|initial commit|first commit|changes|done|temp|my commit|patch|\.)$/i;

          for (const msg of realCommitMessages) {
            if (semanticPrefixRegex.test(msg)) {
              structuredCommitCount++;
            }
            if (lazyMessageRegex.test(msg)) {
              lazyCommitCount++;
            }
          }

          // Compute comprehensive factual statistics
          let totalStars = 0;
          let totalForks = 0;
          let originalStars = 0;
          let forkedStars = 0;
          let originalRepoCount = 0;
          let forkedRepoCount = 0;
          let reposWithDescriptionCount = 0;
          let reposWithHomepageCount = 0;
          let reposWithLicenseCount = 0;
          const liveDemoList: string[] = [];
          const licenseList: string[] = [];
          const languageCounts: Record<string, number> = {};

          const mappedRepos = Array.isArray(reposData)
            ? reposData.map((r: any) => {
                const isFork = Boolean(r.fork);
                const stars = r.stargazers_count || 0;
                const forks = r.forks_count || 0;
                totalStars += stars;
                totalForks += forks;

                if (isFork) {
                  forkedRepoCount++;
                  forkedStars += stars;
                } else {
                  originalRepoCount++;
                  originalStars += stars;
                  if (r.description && r.description.trim().length > 3) {
                    reposWithDescriptionCount++;
                  }
                  if (r.homepage && r.homepage.trim().length > 5) {
                    reposWithHomepageCount++;
                    liveDemoList.push(`${r.name}: ${r.homepage.trim()}`);
                  }
                  if (r.license?.spdx_id && r.license.spdx_id !== "NOASSERTION") {
                    reposWithLicenseCount++;
                    licenseList.push(`${r.name} (${r.license.spdx_id})`);
                  }
                }

                if (r.language) {
                  languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
                }

                return {
                  name: r.name,
                  description: r.description || "Tanpa deskripsi repo",
                  language: r.language || "Unknown",
                  is_fork: isFork,
                  stargazers_count: stars,
                  forks_count: forks,
                  open_issues_count: r.open_issues_count || 0,
                  homepage: r.homepage || null,
                  license: r.license?.spdx_id || null,
                  size_kb: r.size || 0,
                  updated_at: r.updated_at,
                  pushed_at: r.pushed_at,
                  topics: Array.isArray(r.topics) ? r.topics : [],
                };
              })
            : [];

          const topLanguagesSorted = Object.entries(languageCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([lang, count]) => `${lang} (${count} repo)`);

          // Calculate account age
          const createdDate = new Date(userData.created_at);
          const now = new Date();
          const diffMs = now.getTime() - createdDate.getTime();
          const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
          const diffMonths = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
          const accountAgeFormatted = diffYears > 0 ? `${diffYears} tahun ${diffMonths} bulan` : `${diffMonths} bulan`;

          // Check most recent push
          let latestPushDateFormatted = "Belum terdeteksi aktivitas push";
          if (mappedRepos.length > 0) {
            const sortedByPush = [...mappedRepos].sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
            if (sortedByPush[0]?.pushed_at) {
              const lastPushDate = new Date(sortedByPush[0].pushed_at);
              const daysAgo = Math.floor((now.getTime() - lastPushDate.getTime()) / (1000 * 60 * 60 * 24));
              latestPushDateFormatted = daysAgo === 0 ? "Hari ini" : daysAgo < 30 ? `${daysAgo} hari yang lalu` : `${Math.floor(daysAgo / 30)} bulan yang lalu`;
            }
          }

          fetchedGithubData = {
            login: userData.login,
            name: userData.name || userData.login,
            bio: userData.bio || "Tidak ada bio yang ditulis",
            company: userData.company || "Tidak dicantumkan",
            location: userData.location || "Tidak dicantumkan",
            blogOrWebsite: userData.blog || "Tidak ada link website portofolio",
            public_repos: userData.public_repos ?? mappedRepos.length,
            followers: userData.followers || 0,
            following: userData.following || 0,
            created_at: userData.created_at,
            accountAgeFormatted,
            latestPushDateFormatted,
            avatar_url: userData.avatar_url || `https://github.com/${username}.png`,
            totalStars,
            totalForks,
            originalStars,
            forkedStars,
            originalRepoCount,
            forkedRepoCount,
            reposWithDescriptionCount,
            reposWithHomepageCount,
            reposWithLicenseCount,
            liveDemoList: liveDemoList.slice(0, 5),
            licenseList: licenseList.slice(0, 5),
            topLanguages: topLanguagesSorted.length > 0 ? topLanguagesSorted : ["Belum ada bahasa terdeteksi"],
            repos: mappedRepos,
            recentCommitMessages: realCommitMessages.slice(0, 20),
            commitHygieneStats: {
              totalCommitsSampled: realCommitMessages.length,
              structuredConventionalCommits: structuredCommitCount,
              lazySingleWordCommits: lazyCommitCount,
              pushEventsCount,
              prEventsCount,
              issuesEventsCount,
            },
          };
        }
      } catch (fetchErr) {
        console.warn("GitHub live fetch error:", fetchErr);
      }
    }

    const cleanedTargetRole = targetRole?.trim() || "";
    const isTargetRoleCustom = Boolean(
      cleanedTargetRole &&
      !["software engineer", "fullstack developer / software engineer", "general developer"].includes(cleanedTargetRole.toLowerCase())
    );
    const hasClaimedStack = Boolean(claimedTechStack && claimedTechStack.trim());
    const hasManualRepo = Boolean(manualRepoInfo && manualRepoInfo.trim());
    const isTargetedMode = isTargetRoleCustom || hasClaimedStack || hasManualRepo;

    const evaluatedTargetRole = isTargetedMode 
      ? (cleanedTargetRole || "Spesialisasi Sesuai Klaim CV") 
      : "Audit Umum Seluruh Profil & Kemampuan Developer";

    const ai = getGeminiClient();

    const systemInstruction = `
Kamu adalah "FAANG Principal Software Architect & Head of Executive Technical Hiring".
Karaktermu: Sangat analitis, akurat 100% berbasis data faktual, berwawasan mendalam mengenai arsitektur kode dan standar rekrutmen industri tech global, dengan selera humor pedas (savage & witty) namun memberikan kritik yang sangat berbobot, terukur, dan solutif.

STATUS MODE AUDIT: ${
  isTargetedMode
    ? `[MODE TARGETED ROLE & CV CROSS-CHECK AUDIT]`
    : `[MODE AUDIT MENYELURUH & PROFIL HOLISTIK]`
}

===================================================================
PANDUAN UTAMA AKURASI & KALIBRASI LEVEL DEVELOPER (STRICT ACCURACY RUBRIC):
===================================================================
1. KALIBRASI NILAI (devScore) & TIER (devTier) SECARA REALISTIS:
   - 90 - 100 ("Production Hardened Chad / Open-Source Legend"): Memiliki ratusan/ribuan bintang asli, membuat framework/library orisinal berdampak tinggi, arsitektur kelas dunia (misal: Linus Torvalds, creator open-source terkenal). JANGAN PERNAH merendahkan developer kaliber ini sebagai "tutorial hell".
   - 75 - 89 ("Senior / Lead Architect Material"): Portofolio proyek orisinal production-grade lengkap dengan live demo website/app, testing, CI/CD, dokumentasi rapi, lisensi open-source, dan kebiasaan commit semantic yang konsisten.
   - 60 - 74 ("Solid Mid-Level Engineer"): Memiliki beberapa repositori orisinal yang selesai dan berfungsi, tech stack modern yang koheren, dokumentasi lumayan, commit aktif.
   - 40 - 59 ("Junior CRUD Specialist / Builder"): Repositori masih seputar project dasar, minim unit test, belum banyak live demo, pesan commit masih sering acak ("update", "fix").
   - 20 - 39 ("Tutorial Hell Survivor / Fork Collector"): Profil didominasi fork repo orang lain tanpa kontribusi kode nyata, tugas kuliah satu file tanpa README, atau repositori template kosong.
   - 0 - 19 ("Ghost Developer / Inactive Profile"): Akun memiliki 0-1 repositori, tidak ada riwayat commit, atau sudah bertahun-tahun ditinggalkan.

2. BEDAKAN BINTANG & REPO ASLI VS FORK:
   - Evaluasi jumlah bintang dari repositori buatan sendiri ("originalStars") bukan dari fork ("forkedStars").
   - Jika akun didominasi fork, kritik fakta bahwa portofolionya hanya mengoleksi karya orang lain.

3. EVALUASI HIGIENIS COMMIT & DOKUMENTASI NYATA:
   - Gunakan data "commitHygieneStats" dan sampel commit asli. Jika ada commit seperti "fix bug", "test", atau "update", sebutkan sebagai bukti kurangnya standar profesional. Jika menggunakan conventional commit ("feat:", "fix:"), beri apresiasi.
   - Periksa ketersediaan live demo ("reposWithHomepageCount") dan README ("reposWithDescriptionCount").

4. ATURAN ANTI-HALUSINASI MUTLAK:
   - Di dalam "repoTeardowns", kamu HANYA BOLEH MEMBAHAS NAMA REPOSITORI YANG BENAR-BENAR TERCANTUM dalam data scan GitHub di bawah!
   - JANGAN PERNAH mengarang nama repo seperti "todo-app", "netflix-clone", dsb jika tidak ada di daftar!
   - Jika repositori sedikit (misal hanya 1 atau 2), bahas hanya repo tersebut secara mendalam.

KEMBALIKAN HANYA JSON VALID SESUAI SKEMA BERIKUT:
{
  "username": "${username}",
  "auditMode": "${isTargetedMode ? 'targeted_role' : 'general_profile'}",
  "detectedDeveloperRole": "<Peran/Spesialisasi yang kamu deteksi secara akurat dari komposisi kode>",
  "targetRoleEvaluated": "${evaluatedTargetRole}",
  "realNameOrBio": "<Nama asli atau bio nyata dari GitHub>",
  "avatarUrl": "${fetchedGithubData?.avatar_url || `https://github.com/${username}.png`}",
  "devScore": <angka 0-100 terkalibrasi secara objektif>,
  "devTier": "<Production Hardened Chad / Senior Architect / Solid Mid-Level / Junior CRUD Specialist / Tutorial Hell Survivor / Ghost Developer>",
  "verdictTag": "<Tag vonis tajam misal: ARCHITECTURAL GIGACHAD / FORK COLLECTOR / PRODUCTION BUILDER / CODE SLEEPWALKER / SOLID FULLSTACK CRAFTSMAN>",
  "brutalRoast": "<Paragraf analisis & roasting tajam yang 100% didasarkan pada data faktual akun, kualitas repo, commit hygiene, dan kebiasaan koding nyata akun ini>",
  "metricsAudit": {
    "repoCount": <angka total repo publik>,
    "starsTotal": <angka total bintang asli>,
    "forksTotal": <angka total forks>,
    "followersCount": <angka followers>,
    "followingCount": <angka following>,
    "topLanguages": ["<bahasa utama 1>", "<bahasa utama 2>"],
    "commitConsistencyScore": <angka 0-100 berdasarkan frekuensi & kematangan commit>,
    "readmeQualityScore": <angka 0-100 berdasarkan kelengkapan deskripsi & demo>
  },
  "hrVerdict": {
    "hiringDecision": "<STRONG_HIRE / CONSIDER / INTERN_MATERIAL / AUTO_REJECT>",
    "salaryNegotiationImpact": "<Analisis realistis apakah bukti nyata di GitHub ini menaikkan leverage penawaran gaji di pasar saat ini atau justru menjadi beban negosiasi>",
    "hrRedFlags": [
      "<Red flag 1 spesifik berbasis fakta nyata repositori/profil>",
      "<Red flag 2>"
    ],
    "hrGreenFlags": [
      "<Green flag 1 kelebihan nyata dari repo/kemampuan teknis>",
      "<Green flag 2>"
    ],
    "interviewSurvivability": <angka 0-100 peluang lolos technical & architectural interview>
  },
  "historyAudit": {
    "accountAge": "${fetchedGithubData?.accountAgeFormatted || 'Baru dibuat'}",
    "commitStreakRoast": "<Analisis tajam tentang konsistensi commit, frekuensi push, dan kebersihan pesan commit>",
    "peakActivityPeriod": "<Analisis aktivitas terkini (${fetchedGithubData?.latestPushDateFormatted || 'Aktivitas terkini'})>",
    "dormancyWarning": "<Status apakah profil ini aktif berkarya atau sudah mati suri>",
    "prAndIssuesRoast": "<Evaluasi keterlibatan di open-source PR & Issue discussion berdasarkan data event>"
  },
  "achievementsAudit": [
    {
      "title": "Pull Shark & Open Source",
      "status": "<UNLOCKED / FAILED / MISSING>",
      "badge": "🦈",
      "description": "Keterlibatan nyata dalam Pull Requests dan kolaborasi eksternal.",
      "roastComment": "<Komentar audit status PR>"
    },
    {
      "title": "Production Deployment & Live Demo",
      "status": "<UNLOCKED / FAILED / MISSING>",
      "badge": "🚀",
      "description": "Menyediakan link live demo/deployment aktif yang bisa diuji publik.",
      "roastComment": "<Komentar ketersediaan live demo>"
    },
    {
      "title": "Starstruck Community Reputation",
      "status": "<UNLOCKED / FAILED / MISSING>",
      "badge": "⭐",
      "description": "Mendapatkan apresiasi bintang organik dari komunitas developer luar.",
      "roastComment": "<Komentar reputasi stars orisinal>"
    },
    {
      "title": "Engineering Hygiene & Docs",
      "status": "<UNLOCKED / FAILED / MISSING>",
      "badge": "📖",
      "description": "Dokumentasi README, struktur lisensi open-source, dan commit convention.",
      "roastComment": "<Komentar kualitas dokumentasi>"
    }
  ],
  "roastCategories": {
    "tutorialHellDiagnosis": {
      "status": "<safe / warning / severe>",
      "explanation": "<Penilaian objektif apakah repo merupakan karya orisinal atau salinan tutorial>"
    },
    "codeSmellAndQuality": {
      "status": "<safe / warning / severe>",
      "explanation": "<Evaluasi arsitektur, ketiadaan tes/CI-CD, dan organisasi repository>"
    },
    "commitHabitsAndMessages": {
      "status": "<safe / warning / severe>",
      "explanation": "<Kritik pesan commit nyata seperti yang tertera di log push>"
    },
    "techStackVsCvAlignment": {
      "status": "<aligned / questionable / fake>",
      "explanation": "<${
        isTargetedMode
          ? `Kesesuaian antara klaim stack CV (${claimedTechStack}) dengan repositori nyata`
          : `Kedalaman dan kejelasan penguasaan teknologi dominan yang terlihat di GitHub`
      }>"
    }
  },
  "repoTeardowns": [
    {
      "repoName": "<HANYA NAMA REPO ASLI YANG ADA DI DAFTAR SCAN>",
      "techStack": ["<Bahasa & teknologi repo ini>"],
      "roast": "<Kritik teknis mendalam mengenai arsitektur, tujuan, dan kualitas repo ini>",
      "verdict": "<CRINGE / BUTUH KERJA KERAS / LUMAYAN / IMPRESIF / FORK_ONLY>",
      "howToFix": "<Saran spesifik standar industri tech untuk meningkatkan repo ini menjadi standar FAANG/Unicorn>"
    }
  ],
  "portfolioUpgradeBlueprint": [
    {
      "projectName": "<Ide project nyata flagship yang relevan dengan ${isTargetedMode ? evaluatedTargetRole : 'spesialisasi terdeteksi'}>",
      "architectureSuggested": "<Arsitektur production, database, caching, dan deployment stack>",
      "whyRecruitersLoveIt": "<Alasan mengapa proyek ini akan memikat Principal Architect & HR>"
    }
  ],
  "futureCareerRoadmap": [
    {
      "timeframe": "Minggu 1-2 (Hygiene & Sanitasi Repo)",
      "milestoneTitle": "Pembersihan Repositori & Dokumentasi Profesional",
      "actionItems": [
        "<Tindakan konkret 1>",
        "<Tindakan konkret 2>",
        "<Tindakan konkret 3>"
      ],
      "expectedImpact": "<Dampak langsung pada lolos screening awal recruiter>"
    },
    {
      "timeframe": "Bulan 1 (Production Grade Flagship Project)",
      "milestoneTitle": "Membangun Proyek Unggulan Terdistribusi / Fullstack",
      "actionItems": [
        "<Tindakan konkret 1>",
        "<Tindakan konkret 2>"
      ],
      "expectedImpact": "<Meningkatkan probabilitas lolos technical screen>"
    },
    {
      "timeframe": "Bulan 2-3 (Otoritas Komunitas & Open Source)",
      "milestoneTitle": "Otoritas Teknis & Rekrutmen Inbound",
      "actionItems": [
        "<Tindakan konkret 1>",
        "<Tindakan konkret 2>"
      ],
      "expectedImpact": "<Daya tawar gaji maksimal dan tawaran kerja langsung dari hiring manager>"
    }
  ]
}
`;

    let userPrompt = `
Username GitHub: @${username}
Mode Audit: ${isTargetedMode ? "TARGETED ROLE & CV CROSS-CHECK" : "AUDIT HOLISTIK MENYELURUH (HANYA USERNAME)"}
Target Role: ${evaluatedTargetRole}
Klaim Tech Stack di CV: ${claimedTechStack || "Tidak diinput (Deteksi mandiri dari data akun)"}
`;

    if (fetchedGithubData) {
      userPrompt += `
=======================================================
DATA FAKTUAL LIVE DARI GITHUB API (STRICT SOURCE OF TRUTH):
=======================================================
Username: ${fetchedGithubData.login}
Nama Asli / Display Name: ${fetchedGithubData.name}
Bio: ${fetchedGithubData.bio}
Perusahaan: ${fetchedGithubData.company}
Lokasi: ${fetchedGithubData.location}
Website/Blog Portofolio: ${fetchedGithubData.blogOrWebsite}
Tanggal Akun Dibuat: ${fetchedGithubData.created_at} (Usia: ${fetchedGithubData.accountAgeFormatted})
Aktivitas Push Terakhir: ${fetchedGithubData.latestPushDateFormatted}

METRIK REPOSITORI & KONTRIBUSI:
- Total Repositori Publik: ${fetchedGithubData.public_repos}
- Repositori Asli (Original/Non-Fork): ${fetchedGithubData.originalRepoCount} repo
- Repositori Fork: ${fetchedGithubData.forkedRepoCount} repo
- Total Bintang Pada Repo Asli: ${fetchedGithubData.originalStars} stars
- Total Bintang Pada Repo Fork: ${fetchedGithubData.forkedStars} stars
- Followers: ${fetchedGithubData.followers} | Following: ${fetchedGithubData.following}
- Repo dengan Deskripsi Lengkap: ${fetchedGithubData.reposWithDescriptionCount} dari ${fetchedGithubData.originalRepoCount} repo asli
- Repo dengan Live Demo URL: ${fetchedGithubData.reposWithHomepageCount} repo ${fetchedGithubData.liveDemoList.length > 0 ? `[${fetchedGithubData.liveDemoList.join(", ")}]` : ""}
- Repo dengan Lisensi Open Source: ${fetchedGithubData.reposWithLicenseCount} repo ${fetchedGithubData.licenseList.length > 0 ? `[${fetchedGithubData.licenseList.join(", ")}]` : ""}
- Komposisi Bahasa Terbanyak: ${fetchedGithubData.topLanguages.join(", ")}

METRIK HIGIENIS COMMIT & AKTIVITAS:
- Total Sampel Commit Terdeteksi: ${fetchedGithubData.commitHygieneStats.totalCommitsSampled}
- Commit Berstandar Semantic/Conventional (feat:, fix:, etc): ${fetchedGithubData.commitHygieneStats.structuredConventionalCommits}
- Commit Malas Satu Kata ("update", "fix", "wip", etc): ${fetchedGithubData.commitHygieneStats.lazySingleWordCommits}
- Aktivitas Pull Request Baru: ${fetchedGithubData.commitHygieneStats.prEventsCount} PR
- Aktivitas Issues: ${fetchedGithubData.commitHygieneStats.issuesEventsCount} issues

DAFTAR REPOSITORI ASLI LENGKAP (HANYA GUNAKAN NAMA-NAMA BERIKUT DI repoTeardowns):
${
  fetchedGithubData.repos.length > 0
    ? JSON.stringify(
        fetchedGithubData.repos.slice(0, 20).map((r: any) => ({
          name: r.name,
          language: r.language,
          is_fork: r.is_fork,
          stars: r.stargazers_count,
          forks: r.forks_count,
          description: r.description,
          homepage: r.homepage,
          license: r.license,
          pushed_at: r.pushed_at,
        })),
        null,
        2
      )
    : "TIDAK ADA REPOSITORI PUBLIK SAMA SEKALI (Repo count = 0)"
}

SAMPEL KUTIPAN PESAN COMMIT ASLI TERAKHIR:
${
  fetchedGithubData.recentCommitMessages.length > 0
    ? fetchedGithubData.recentCommitMessages.map((msg: string, i: number) => `${i + 1}. "${msg}"`).join("\n")
    : "Tidak ada event commit publik terbaru yang terdeteksi."
}
`;
    } else {
      userPrompt += `\n(Catatan: Data GitHub live API tidak dapat diakses atau rate-limited. Gunakan info manual user di bawah)`;
    }

    if (manualRepoInfo) {
      userPrompt += `\n=== INFORMASI TAMBAHAN DARI USER ===\n${manualRepoInfo}\n`;
    }

    userPrompt += `\nBahasa Respon: ${language === "en" ? "English" : "Bahasa Indonesia"}\nKeluarkan HANYA JSON valid sesuai skema dan patuhi aturan akurasi dan anti-halusinasi dengan ketat!`;

    const response = await generateWithRetry(ai, {
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const cleanedText = cleanJsonString(response.text || "{}");
    const parsed = JSON.parse(cleanedText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("GitHub Roast Error:", error);
    res.status(500).json({ success: false, error: formatErrorMessage(error) });
  }
});


// =========================================================================
// 4. INTERACTIVE HR CHATBOT (/api/chat-hr)
// =========================================================================
app.post("/api/chat-hr", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { messages = [], cvContext, targetRole = "Software Engineer" } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `
Kamu adalah "Savage Head of Talent Acquisition & Executive Career Coach". 
Gaya bicaramu: tajam, to-the-point, berwawasan insider HR tingkat tinggi, lucu, sarkas bila kandidat memberikan jawaban lemah, namun sangat solutif dalam membantu kandidat memperbaiki CV dan lolos wawancara kerja.

Target Posisi: ${targetRole}
Konteks Evaluasi CV: ${cvContext ? JSON.stringify(cvContext) : "Belum ada CV yang di-upload"}
`;

    const contents = messages.map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text || msg.content || "" }],
    }));

    if (contents.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: "Halo HR, tolong bantu saya evaluasi karir." }],
      });
    }

    const response = await generateWithRetry(ai, {
      contents,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({
      success: true,
      data: {
        reply: response.text || "Maaf, rekruter sedang sibuk mengeliminasi CV lain. Coba tanyakan lagi.",
      },
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, error: formatErrorMessage(error) });
  }
});

// =========================================================================
// 5. BULLET POINT REWRITER (/api/rewrite-bullet)
// =========================================================================
app.post("/api/rewrite-bullet", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { bulletText, role = "Software Engineer", metricHint = "" } = req.body;
    if (!bulletText) {
      return res.status(400).json({ success: false, error: "Kalimat tidak boleh kosong." });
    }

    const ai = getGeminiClient();

    const prompt = `
Ubah kalimat pengalaman kerja CV ini menjadi 3 variasi standar emas FAANG/Top Global Company menggunakan formula STAR dan Google X-Y-Z (Accomplished [X] as measured by [Y], by doing [Z]).

Kalimat Asli: "${bulletText}"
Target Role: ${role}
${metricHint ? `Petunjuk Angka/Metrik Tambahan: ${metricHint}` : ""}

KEMBALIKAN HANYA JSON DENGAN STRUKTUR BERIKUT:
{
  "analysis": "Penjelasan mengapa kalimat asli lemah / pasif",
  "variations": [
    {
      "type": "High Impact / Revenue / Scale",
      "text": "...",
      "whyItWorks": "..."
    },
    {
      "type": "Efficiency / Optimization / Speed",
      "text": "...",
      "whyItWorks": "..."
    },
    {
      "type": "Leadership / Collaboration / Problem Solving",
      "text": "...",
      "whyItWorks": "..."
    }
  ]
}
`;

    const response = await generateWithRetry(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const cleanedText = cleanJsonString(response.text || "{}");
    const parsed = JSON.parse(cleanedText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Rewrite error:", error);
    res.status(500).json({ success: false, error: formatErrorMessage(error) });
  }
});

export default app;
