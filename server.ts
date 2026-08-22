import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for large payload (e.g. base64 PDFs or images)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
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
  // Primary fast models: gemini-3.7-flash, gemini-flash-latest, gemini-3.1-flash-lite
  const candidateModels = ["gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        ...options,
        model,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || JSON.stringify(err);
      console.warn(`[Gemini API] Model ${model} encountered issue: ${errMsg}. Trying next candidate model...`);

      const isTransient =
        err?.status === 503 ||
        err?.status === 429 ||
        err?.code === 503 ||
        err?.code === 429 ||
        errMsg.includes("503") ||
        errMsg.includes("high demand") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("RESOURCE_EXHAUSTED") ||
        errMsg.includes("Overloaded") ||
        errMsg.includes("fetch failed");

      if (!isTransient) {
        // Stop immediately if it's an invalid prompt or schema error
        throw err;
      }

      // Brief delay before switching model
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }

  throw lastError || new Error("Layanan AI sedang sibuk. Silakan coba sesaat lagi.");
}

function formatErrorMessage(error: any): string {
  const msg = error?.message || (typeof error === "string" ? error : JSON.stringify(error));
  if (msg.includes("503") || msg.includes("high demand") || msg.includes("UNAVAILABLE") || msg.includes("Overloaded")) {
    return "Server AI sedang mengalami lonjakan trafik tinggi (503 High Demand). Silakan tunggu beberapa detik lalu tekan tombol 'Coba Lagi'.";
  }
  if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
    return "Batas panggilan AI tercapai (Rate limit). Mohon tunggu sebentar lalu coba lagi.";
  }
  if (msg.includes("GEMINI_API_KEY")) {
    return "Kunci API Gemini belum dikonfigurasi. Silakan periksa pengaturan lingkungan.";
  }
  return msg || "Terjadi kesalahan saat memproses permintaan AI.";
}

// Health check
app.get("/api/health", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({ status: "ok", time: new Date().toISOString() });
});

// =========================================================================
// 1. MAIN CV REVIEW & ROASTER API (PRECISION GROUNDED & CALIBRATED)
// =========================================================================
app.post("/api/review-cv", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const {
      cvText,
      fileData,
      targetRole = "Software Engineer / Professional",
      targetLevel = "mid",
      industry = "Tech / General",
      jobDescription = "",
      strictnessMode = "savage_brutal",
      language = "id",
    } = req.body;

    if (!cvText && !fileData?.data) {
      return res.status(400).json({ success: false, error: "Mohon masukkan teks CV atau unggah file CV (PDF/DOCX/Gambar)." });
    }

    const ai = getGeminiClient();

    let strictnessPromptModifier = "";
    if (strictnessMode === "savage_brutal") {
      strictnessPromptModifier = `
GAYA BICARA & PERSONA (MODE SAVAGE ROASTING HR):
- Kamu adalah Head of Talent Acquisition & Senior HR Director veteran 15+ tahun di BANGKAH/Unicorn global.
- Roasting CV ini secara PEDAS, MENIKIK, BLAK-BLAKAN, TEGAS, dan MENUSUK REALITA, tapi TETAP PROFESIONAL, EDUKATIF, dan 100% AKURAT BERDASARKAN FAKTA CV.
- Tunjukkan betapa cepatnya (dalam 6 detik screening) recruiter top-tier menyortir CV ini.
- Gunakan analogi cerdas, tajam, dan tidak berbelit-belit.
- Target role: ${targetRole}, Level: ${targetLevel}, Industri: ${industry}.
- Gunakan bahasa ${language === "id" ? "Bahasa Indonesia gaul-profesional yang pedas dan mengena (campuran istilah HR/Tech)" : "English (sharp, witty, executive-level roast)"}.
`;
    } else if (strictnessMode === "stern_hr") {
      strictnessPromptModifier = `
GAYA BICARA & PERSONA (MODE STERN EXECUTIVE HR):
- Kamu adalah HR Executive yang sangat ketat, berbasis data, formal, analitis, dan tidak menoleransi ketidakjelasan.
- Nilai setiap baris berdasarkan standar seleksi top-tier perusahaan global.
- Kritik tajam terfokus pada efisiensi kata, relevansi bisnis, dan kejelasan pencapaian.
`;
    } else if (strictnessMode === "ats_robot") {
      strictnessPromptModifier = `
GAYA BICARA & PERSONA (MODE ATS SCANNER & ALGORITHM AUDITOR):
- Kamu adalah bot parser ATS enterprise (Workday / Greenhouse / Taleo) yang dingin dan matematis.
- Analisis kegagalan parsing font, struktur kolom ganda, simbol aneh, dan keyword density ratio.
`;
    } else {
      strictnessPromptModifier = `
GAYA BICARA & PERSONA (MODE CONSTRUCTIVE PRO HR):
- Kamu adalah Career Coach & Senior HR yang mendalam, tegas namun berorientasi perbaikan cepat.
`;
    }

    const systemInstruction = `
Kamu adalah sistem Penilai & Roasting CV Tingkat Lanjut berbasis standar rekrutmen industri tier-1 global.
${strictnessPromptModifier}

=== ATURAN MUTLAK AKURASI & ZERO-HALLUCINATION (PENTING!) ===
1. DILARANG MENGARANG ATAU MEMBUAT ASUMSI PALSU (Strict Evidence-Based):
   - Setiap kali kamu mengkritik kesalahan, menyebut red flag, atau menemukan buzzword di CV, kamu WAJIB MENGUTIP frasa atau kata ASLI (verbatim quote) dari teks/dokumen CV yang dikirimkan.
   - JANGAN PERNAH menuduh CV menggunakan kata klise seperti "hardworking", "team player", "responsible for" JIKA kata tersebut TIDAK ADA di dalam teks CV!
   - JANGAN PERNAH menuduh CV tidak punya kontak / email / nomor telepon jika sudah tertera di dokumen.

2. PENGAKUAN & APRESIASI METRIK NYATA:
   - Periksa dengan teliti apakah kandidat SUDAH mencantumkan metrik kuantitatif (misalnya persentase %, nominal uang/omset, jumlah pengguna/traffic, waktu/kecepatan, atau jumlah tim).
   - JIKA ADA METRIK: Berikan poin yang adil pada kategori 'impactAndMetrics', akui angka tersebut, dan fokuskan kritik pada cara mengembangkannya ke formula Google X-Y-Z (Accomplished [X] as measured by [Y], by doing [Z]) dengan baseline & context yang lebih masif.
   - JIKA BENAR-BENAR NOL METRIK: Barulah kamu berhak memberikan nilai rendah dan membongkarnya.

3. KALIBRASI LEVEL & SENIORITAS:
   - Fresh Graduate (0-1 thn): Nilai berdasarkan relevansi jurusan, projek akhir, portofolio, magang, organisasi, dan pemahaman fundamental. Jangan tuntut pengalaman manajerial 5 tahun.
   - Junior (1-2 thn): Nilai kecepatan eksekusi, ownership kode/task, dan inisiatif.
   - Mid-Level (3-5 thn): Nilai kepemilikan modul, optimasi proses/kinerja, dan kolaborasi lintas fungsi.
   - Senior / Lead / Executive (5-8+ thn): Tuntut arsitektur skala besar, kepemimpinan tim, efisiensi biaya, pertumbuhan revenue, dan strategi bisnis.

4. SIMULASI ATS & JOB DESCRIPTION MATCHING:
   - Bandingkan secara objektif antara teks CV dengan target posisi '${targetRole}'${jobDescription ? ` dan Job Description yang dilampirkan` : ""}.
   - 'matchedKeywords': Daftar keyword/skill/tools yang BENAR-BENAR ADA di CV dan relevan dengan role.
   - 'missingCriticalKeywords': Daftar keyword industri penting untuk ${targetRole} yang BELUM ADA di CV.

5. MATEMATIKA SKOR TERTELITI:
   - Skor keseluruhan (overallScore) adalah penjumlahan langsung dari 5 kategori scoreBreakdown (masing-masing 0-20, total = 0-100).
   - Grade: 90-100 (S), 80-89 (A), 70-79 (B), 55-69 (C), 40-54 (D), 0-39 (F).

6. OUTPUT ELEMEN:
   - summaryRoast: Roasting pembuka yang pedas, menyengat, lucu, tapi 100% tepat sasaran mengacu pada isi CV nyata.
   - fatalRedFlags: 3-5 hal krusial yang benar-benar ada di CV dan bikin auto-reject.
   - buzzwordAudit: Kata-kata pasif/klise yang BENAR-BENAR DITEMUKAN di CV dan alternatif kata pengganti kuat.
   - bulletPointRewrites: Minimal 3-4 baris pengalaman ASLI kandidat diubah ke format STAR / Google X-Y-Z tingkat tinggi.
   - atsSimulation: Parse score %, matched keywords, missing keywords, formatting risks.
   - sectionBySectionCritique: Evaluasi tajam dan spesifik untuk setiap bagian nyata di CV.
   - stepByStepActionPlan: Rencana aksi darurat berurutan.
   - sampleFullCvRewriteSnippet: Cuplikan Markdown CV yang sudah dipoles total.
`;

    const contentParts: any[] = [];

    if (fileData?.data && fileData?.mimeType) {
      contentParts.push({
        inlineData: {
          mimeType: fileData.mimeType,
          data: fileData.data,
        },
      });
    }

    const textPrompt = `
Lakukan audit, penilaian akurat, dan roasting mendalam untuk CV berikut:

${cvText ? `--- TEKS CV ASLI KANDIDAT ---\n${cvText}\n--- AKHIR TEKS CV ASLI ---` : `(Analisis dokumen/gambar CV terlampir secara multimodal OCR penuh)`}

--- PARAMETER PENILAIAN ---
- Target Posisi: ${targetRole}
- Target Senioritas: ${targetLevel}
- Sektor Industri: ${industry}
${jobDescription ? `- Deskripsi / Persyaratan Lowongan Kerja (Job Description): \n${jobDescription}\n` : ""}
- Mode Ketegasan: ${strictnessMode}
- Bahasa Output: ${language === "id" ? "Bahasa Indonesia" : "English"}

INGAT: Setiap kritik dan rewrite HARUS berakar kuat pada data asli CV di atas. Jangan mengarang frasa yang tidak ada. Hasilkan output JSON valid sesuai schema.
`;

    contentParts.push({ text: textPrompt });

    const response = await generateWithRetry(ai, {
      contents: { parts: contentParts },
      config: {
        systemInstruction,
        temperature: 0.25, // Lower temperature for high precision & zero hallucination
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: "Skor keseluruhan 0-100 (jumlah dari 5 breakdown)" },
            grade: { type: Type.STRING, description: "Grade: S, A, B, C, D, atau F" },
            verdictTag: { type: Type.STRING, description: "Label vonis singkat seperti 'Auto-Reject 4 Detik' atau 'Kandidat Medioker'" },
            summaryRoast: { type: Type.STRING, description: "Roasting pembuka yang pedas, tajam, dan memukul realita" },
            scoreBreakdown: {
              type: Type.OBJECT,
              properties: {
                impactAndMetrics: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER, description: "Skor 0-20" },
                    max: { type: Type.INTEGER },
                    feedback: { type: Type.STRING },
                    status: { type: Type.STRING, description: "critical, warning, atau good" },
                  },
                  required: ["score", "max", "feedback", "status"],
                },
                atsCompatibility: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER, description: "Skor 0-20" },
                    max: { type: Type.INTEGER },
                    feedback: { type: Type.STRING },
                    status: { type: Type.STRING },
                  },
                  required: ["score", "max", "feedback", "status"],
                },
                actionVerbsAndClarity: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER, description: "Skor 0-20" },
                    max: { type: Type.INTEGER },
                    feedback: { type: Type.STRING },
                    status: { type: Type.STRING },
                  },
                  required: ["score", "max", "feedback", "status"],
                },
                skillsAndKeywords: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER, description: "Skor 0-20" },
                    max: { type: Type.INTEGER },
                    feedback: { type: Type.STRING },
                    status: { type: Type.STRING },
                  },
                  required: ["score", "max", "feedback", "status"],
                },
                careerStoryAndRelevance: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER, description: "Skor 0-20" },
                    max: { type: Type.INTEGER },
                    feedback: { type: Type.STRING },
                    status: { type: Type.STRING },
                  },
                  required: ["score", "max", "feedback", "status"],
                },
              },
              required: [
                "impactAndMetrics",
                "atsCompatibility",
                "actionVerbsAndClarity",
                "skillsAndKeywords",
                "careerStoryAndRelevance",
              ],
            },
            fatalRedFlags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  severity: { type: Type.STRING, description: "high, medium, low" },
                  fix: { type: Type.STRING },
                },
                required: ["title", "explanation", "severity", "fix"],
              },
            },
            buzzwordAudit: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  whyItSucks: { type: Type.STRING },
                  replacement: { type: Type.STRING },
                },
                required: ["word", "whyItSucks", "replacement"],
              },
            },
            bulletPointRewrites: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  whyWeak: { type: Type.STRING },
                  improvedSTAR: { type: Type.STRING },
                  impactExplained: { type: Type.STRING },
                },
                required: ["original", "whyWeak", "improvedSTAR", "impactExplained"],
              },
            },
            atsSimulation: {
              type: Type.OBJECT,
              properties: {
                parseScore: { type: Type.INTEGER, description: "Estimasi persentase lolos ATS 0-100" },
                matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                missingCriticalKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                formattingRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["parseScore", "matchedKeywords", "missingCriticalKeywords", "formattingRisks"],
            },
            sectionBySectionCritique: {
              type: Type.OBJECT,
              properties: {
                headerAndSummary: {
                  type: Type.OBJECT,
                  properties: {
                    roast: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                    rating: { type: Type.STRING },
                  },
                  required: ["roast", "recommendation", "rating"],
                },
                workExperience: {
                  type: Type.OBJECT,
                  properties: {
                    roast: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                    rating: { type: Type.STRING },
                  },
                  required: ["roast", "recommendation", "rating"],
                },
                skillsAndTools: {
                  type: Type.OBJECT,
                  properties: {
                    roast: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                    rating: { type: Type.STRING },
                  },
                  required: ["roast", "recommendation", "rating"],
                },
                educationAndCertifications: {
                  type: Type.OBJECT,
                  properties: {
                    roast: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                    rating: { type: Type.STRING },
                  },
                  required: ["roast", "recommendation", "rating"],
                },
                layoutAndLength: {
                  type: Type.OBJECT,
                  properties: {
                    roast: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                    rating: { type: Type.STRING },
                  },
                  required: ["roast", "recommendation", "rating"],
                },
              },
              required: [
                "headerAndSummary",
                "workExperience",
                "skillsAndTools",
                "educationAndCertifications",
                "layoutAndLength",
              ],
            },
            stepByStepActionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.INTEGER },
                  priority: { type: Type.STRING, description: "Darurat (Segera), Penting, atau Penyempurnaan" },
                  action: { type: Type.STRING },
                  example: { type: Type.STRING },
                },
                required: ["step", "priority", "action", "example"],
              },
            },
            sampleFullCvRewriteSnippet: {
              type: Type.STRING,
              description: "Markdown cuplikan Professional Summary & Work Experience yang telah dipoles dengan standar tertinggi.",
            },
          },
          required: [
            "overallScore",
            "grade",
            "verdictTag",
            "summaryRoast",
            "scoreBreakdown",
            "fatalRedFlags",
            "buzzwordAudit",
            "bulletPointRewrites",
            "atsSimulation",
            "sectionBySectionCritique",
            "stepByStepActionPlan",
          ],
        },
      },
    });

    const textOutput = response?.text;
    if (!textOutput) {
      throw new Error("Tidak ada respon teks dari model AI.");
    }

    const cleanedText = cleanJsonString(textOutput);
    const parsedJson = JSON.parse(cleanedText);
    res.json({ success: true, data: parsedJson });
  } catch (error: any) {
    console.error("Error evaluating CV:", error);
    res.status(500).json({
      success: false,
      error: formatErrorMessage(error),
    });
  }
});

// =========================================================================
// 2. FITUR JEJAK DIGITAL & BACKGROUND CHECK AUDIT
// =========================================================================
app.post("/api/audit-digital-footprint", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const {
      cvText = "",
      targetRole = "Professional",
      candidateName = "Kandidat",
      linkedinUrlOrBio = "",
      twitterUrlOrBio = "",
      githubUrlOrBio = "",
      portfolioOrBlog = "",
      additionalNotes = "",
      language = "id",
    } = req.body;

    if (!linkedinUrlOrBio && !twitterUrlOrBio && !githubUrlOrBio && !portfolioOrBlog && !additionalNotes) {
      return res.status(400).json({
        success: false,
        error: "Mohon isi setidaknya satu akun media sosial / jejak digital (LinkedIn, X/Twitter, GitHub, Portfolio, atau catatan aktivitas).",
      });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
Kamu adalah Senior Background Investigator & Head of Talent Acquisition veteran BANGKAH.
Tugasmu adalah melakukan AUDIT JEJAK DIGITAL & CROSS-EXAMINATION antara klaim di CV dengan riwayat jejak digital kandidat (LinkedIn, X/Twitter, GitHub, Portfolio/Blog, Public Posts).

Karakter: Savage, cerdas, detektif karir yang tajam, mampu mendeteksi inkonsistensi ("ngibul detector"), me-roast perbedaan antara persona medsos vs klaim CV, sekaligus memberikan solusi konkret sebelum kandidat terkena investigasi HR sesungguhnya.

KATEGORI AUDIT:
1. Authenticity Score (0 - 100): Seberapa konsisten dan valid klaim CV dibanding jejak digital yang ada.
2. Inconsistencies: Deteksi timeline yang bentrok, klaim keahlian palsu/dilebih-lebihkan, ketidaksesuaian role.
3. Verified Highlights: Hal-hal positif yang terbukti valid dan memperkuat profil.
4. Digital Persona Audit: Tone medsos (apakah suka mengeluh/toxic di medsos, membagikan rahasia kantor, atau konsisten berbagi insight profesional).
5. Background Check Advice: Langkah membersihkan jejak digital agar lolos tahap background check ketat.

Gunakan bahasa ${language === "id" ? "Bahasa Indonesia gaul-profesional yang pedas, tajam, dan edukatif" : "English (sharp, witty, investigative HR tone)"}.
`;

    const prompt = `
Lakukan audit jejak digital dan verifikasi keaslian profil berikut:

--- KANDIDAT: ${candidateName} (Target Role: ${targetRole}) ---

--- KLAIM PADA CV ---
${cvText ? cvText.slice(0, 3000) : "(Tidak menyertakan teks CV lengkap, lakukan audit umum terhadap jejak digital yang diisi)"}

--- DATA JEJAK DIGITAL KANDIDAT ---
- LinkedIn Profile / Bio: ${linkedinUrlOrBio || "Tidak disertakan"}
- X (Twitter) Profile / Bio / Kebiasaan Tweet: ${twitterUrlOrBio || "Tidak disertakan"}
- GitHub / Tech Portofolio: ${githubUrlOrBio || "Tidak disertakan"}
- Website Portfolio / Blog / Medium: ${portfolioOrBlog || "Tidak disertakan"}
- Catatan Tambahan / Aktivitas Publik: ${additionalNotes || "Tidak ada"}

Bandingkan secara kritis dan berikan output dalam format JSON yang telah ditentukan.
`;

    const response = await generateWithRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            authenticityScore: { type: Type.INTEGER, description: "Skor autentisitas 0-100" },
            riskLevel: { type: Type.STRING, description: "low, medium, high, atau critical" },
            verdict: { type: Type.STRING, description: "Label vonis singkat seperti 'Klaim Dilebih-lebihkan' atau 'Sangat Kredibel & Solid'" },
            summaryRoast: { type: Type.STRING, description: "Roasting pedas tentang kontradiksi atau kebiasaan jejak digital kandidat" },
            digitalPersonaAudit: {
              type: Type.OBJECT,
              properties: {
                professionalismRating: { type: Type.STRING },
                toneRoast: { type: Type.STRING },
                onlineActivityRisk: { type: Type.STRING },
              },
              required: ["professionalismRating", "toneRoast", "onlineActivityRisk"],
            },
            inconsistencies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  claimInCv: { type: Type.STRING },
                  foundInDigitalFootprint: { type: Type.STRING },
                  severity: { type: Type.STRING, description: "critical, warning, atau minor" },
                  analysis: { type: Type.STRING },
                },
                required: ["claimInCv", "foundInDigitalFootprint", "severity", "analysis"],
              },
            },
            verifiedHighlights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skillOrExperience: { type: Type.STRING },
                  evidence: { type: Type.STRING },
                  credibilityNote: { type: Type.STRING },
                },
                required: ["skillOrExperience", "evidence", "credibilityNote"],
              },
            },
            backgroundCheckAdvice: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  action: { type: Type.STRING },
                  whyItMatters: { type: Type.STRING },
                },
                required: ["action", "whyItMatters"],
              },
            },
          },
          required: [
            "authenticityScore",
            "riskLevel",
            "verdict",
            "summaryRoast",
            "digitalPersonaAudit",
            "inconsistencies",
            "verifiedHighlights",
            "backgroundCheckAdvice",
          ],
        },
      },
    });

    const cleanedText = cleanJsonString(response.text || "{}");
    const parsed = JSON.parse(cleanedText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Footprint audit error:", error);
    res.status(500).json({ success: false, error: formatErrorMessage(error) });
  }
});

// =========================================================================
// 3. FITUR GITHUB ROASTED (PROGRAMMER & DEVELOPER EDITION)
// =========================================================================
app.post("/api/roast-github", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const {
      username,
      targetRole = "Fullstack Developer / Software Engineer",
      claimedTechStack = "",
      manualRepoInfo = "",
      language = "id",
    } = req.body;

    if (!username && !manualRepoInfo) {
      return res.status(400).json({ success: false, error: "Mohon masukkan username GitHub atau informasi repository." });
    }

    let cleanUsername = username ? username.trim().replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "") : "";
    let liveGithubData: any = null;
    let reposData: any[] = [];

    // Attempt to fetch public GitHub data if username provided
    if (cleanUsername) {
      try {
        const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`, {
          headers: { "User-Agent": "AI-Studio-GitHub-Roaster" },
        });
        if (userRes.ok) {
          liveGithubData = await userRes.json();
        }

        const reposRes = await fetch(
          `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?sort=pushed&per_page=15`,
          { headers: { "User-Agent": "AI-Studio-GitHub-Roaster" } }
        );
        if (reposRes.ok) {
          reposData = await reposRes.json();
        }
      } catch (ghErr) {
        console.warn("GitHub API fetch error (will use fallback/manual info):", ghErr);
      }
    }

    const ai = getGeminiClient();

    const systemInstruction = `
Kamu adalah Principal Software Architect, Staff Engineer di BANGKAH/Big Tech, sekaligus Technical Hiring Manager yang legendaris di industri software engineering global.
Tugasmu adalah me-ROAST profil GitHub programmer ini secara BRUTAL, CERDAS, MENYENGAT, tapi 100% AKURAT BERDASARKAN REPOSITORY & DATA NYATA YANG DIKIRIMKAN.

=== ATURAN MUTLAK AKURASI GITHUB ROASTING ===
1. RUJUK REPOSITORY NYATA (Grounding):
   - Kamu WAJIB menyebutkan nama-nama repository ASLI yang ada dalam daftar repositori candidate.
   - JANGAN mengarang nama repo palsu jika data repo sudah tertera.

2. PENILAIAN TEKNIS AKURAT:
   - Jika candidate memiliki repo kompleks (misal: custom compiler, distributed database, active open source with real stars, CI/CD pipelines), AKUI kualitas arsitekturnya dan berikan skor tinggi (80-95), lalu kritik hal-hal arsitektur tingkat lanjut (observability, benchmarking, zero-downtime deployment, concurrency).
   - Jika repositorinya jelas-jelas hanya cloning tutorial YouTube (todo app, weather app, calculator, netflix clone, fork tanpa commit), bongkar dengan tajam di 'tutorialHellDiagnosis'.

3. KESESUAIAN KLAIM TECH STACK:
   - Bandingkan klaim tech stack '${claimedTechStack || "tidak ditentukan"}' dengan bahasa utama yang ada di repositori GitHub aktual.

4. BLUEPRINT PENINGKATAN:
   - Berikan rekomendasi arsitektur nyata yang membedakan junior dari staff engineer untuk posisi ${targetRole}.

Gunakan bahasa ${language === "id" ? "Bahasa Indonesia gaul tech (campuran istilah developer, arsitektur software, dan roasting pedas)" : "English (sharp, witty, tech lead engineer roast)"}.
`;

    const ghSummaryText = liveGithubData
      ? `
- Name: ${liveGithubData.name || cleanUsername}
- Bio: ${liveGithubData.bio || "Kosong (Tidak ada bio)"}
- Public Repos: ${liveGithubData.public_repos}
- Followers / Following: ${liveGithubData.followers} / ${liveGithubData.following}
- Akun Dibuat: ${liveGithubData.created_at}
- Company: ${liveGithubData.company || "Tidak ada"}
- Blog / Website: ${liveGithubData.blog || "Tidak ada"}
- Top Recent Repos (${reposData.length} repos fetched):
${reposData
  .map(
    (r: any) =>
      `  * [${r.name}] (Lang: ${r.language || "Unknown"}, Stars: ${r.stargazers_count}, Forks: ${r.forks_count}, Fork?: ${r.fork}, Description: "${r.description || 'Tanpa deskripsi'}", Updated: ${r.pushed_at})`
  )
  .join("\n")}
`
      : `
- Username: ${cleanUsername || "Manual input"}
- Data Tambahan / Deskripsi Repo: ${manualRepoInfo || "Tidak ada data live yang terhubung"}
`;

    const prompt = `
Lakukan roasting mendalam dan review teknis tingkat tinggi untuk profil GitHub berikut:

--- USER GITHUB: @${cleanUsername || "developer"} ---
--- TARGET ROLE: ${targetRole} ---
--- KLAIM TECH STACK PADA CV: ${claimedTechStack || "Tidak ditentukan"} ---

--- DATA GITHUB ---
${ghSummaryText}

${manualRepoInfo ? `--- CATATAN TAMBAHAN DARI USER ---\n${manualRepoInfo}` : ""}

Hasilkan output terstruktur persis sesuai schema JSON.
`;

    const response = await generateWithRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            username: { type: Type.STRING },
            devScore: { type: Type.INTEGER, description: "Skor developer 0-100" },
            devTier: { type: Type.STRING, description: "Tier seperti 'Tutorial Hell Inmate', 'Fork Hoarder', 'Codebase Graveyard', 'Junior Wannabe', 'Silicon Valley Ready'" },
            verdictTag: { type: Type.STRING, description: "Label vonis singkat seperti 'Tutorial Clone Collector' atau 'Production Grade Architect'" },
            brutalRoast: { type: Type.STRING, description: "Roasting brutal pembuka dari Tech Lead & HR" },
            metricsAudit: {
              type: Type.OBJECT,
              properties: {
                repoCount: { type: Type.INTEGER },
                starsTotal: { type: Type.INTEGER },
                topLanguages: { type: Type.ARRAY, items: { type: Type.STRING } },
                commitConsistencyScore: { type: Type.INTEGER, description: "Skor 0-100" },
                readmeQualityScore: { type: Type.INTEGER, description: "Skor 0-100" },
              },
              required: ["repoCount", "starsTotal", "topLanguages", "commitConsistencyScore", "readmeQualityScore"],
            },
            roastCategories: {
              type: Type.OBJECT,
              properties: {
                tutorialHellDiagnosis: {
                  type: Type.OBJECT,
                  properties: {
                    status: { type: Type.STRING, description: "safe, warning, atau severe" },
                    explanation: { type: Type.STRING },
                  },
                  required: ["status", "explanation"],
                },
                codeSmellAndQuality: {
                  type: Type.OBJECT,
                  properties: {
                    status: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ["status", "explanation"],
                },
                commitHabitsAndMessages: {
                  type: Type.OBJECT,
                  properties: {
                    status: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ["status", "explanation"],
                },
                techStackVsCvAlignment: {
                  type: Type.OBJECT,
                  properties: {
                    status: { type: Type.STRING, description: "aligned, questionable, atau fake" },
                    explanation: { type: Type.STRING },
                  },
                  required: ["status", "explanation"],
                },
              },
              required: [
                "tutorialHellDiagnosis",
                "codeSmellAndQuality",
                "commitHabitsAndMessages",
                "techStackVsCvAlignment",
              ],
            },
            repoTeardowns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  repoName: { type: Type.STRING },
                  techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                  roast: { type: Type.STRING },
                  verdict: { type: Type.STRING },
                  howToFix: { type: Type.STRING },
                },
                required: ["repoName", "techStack", "roast", "verdict", "howToFix"],
              },
            },
            portfolioUpgradeBlueprint: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  projectName: { type: Type.STRING },
                  architectureSuggested: { type: Type.STRING },
                  whyRecruitersLoveIt: { type: Type.STRING },
                },
                required: ["projectName", "architectureSuggested", "whyRecruitersLoveIt"],
              },
            },
          },
          required: [
            "username",
            "devScore",
            "devTier",
            "verdictTag",
            "brutalRoast",
            "metricsAudit",
            "roastCategories",
            "repoTeardowns",
            "portfolioUpgradeBlueprint",
          ],
        },
      },
    });

    const cleanedText = cleanJsonString(response.text || "{}");
    const parsed = JSON.parse(cleanedText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("GitHub roast error:", error);
    res.status(500).json({ success: false, error: formatErrorMessage(error) });
  }
});

// =========================================================================
// 4. INTERACTIVE ASK-HR FOLLOWUP CHAT
// =========================================================================
app.post("/api/chat-hr", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { messages, cvContext, targetRole, strictnessMode = "savage_brutal" } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: "Invalid messages format." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
Kamu adalah Savage HR Director yang baru saja menilai CV pengguna.
Karaktermu: Tegas, blak-blakan, cerdas, berstandar tinggi, mengerti seluk beluk rekrutmen top tech & enterprise, namun siap memberikan tips taktis jika kandidat bertanya dengan serius.
Jika pengguna meminta bantuan memformulasikan kalimat tertentu, berikan formula STAR / Formula Google X-Y-Z yang tajam dan siap pakai.
Target Posisi Kandidat: ${targetRole || "General Professional"}
Konteks CV Singkat: ${cvContext ? JSON.stringify(cvContext).slice(0, 1500) : "CV telah dinilai sebelumnya."}
`;

    const chatHistory = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const response = await generateWithRetry(ai, {
      contents: chatHistory,
      config: {
        systemInstruction,
      },
    });

    res.json({
      success: true,
      reply: response.text || "Tidak ada respon.",
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, error: formatErrorMessage(error) });
  }
});

// =========================================================================
// 5. BULLET POINT REWRITER
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
Ubah bullet point CV berikut menjadi 3 variasi standar emas BANGKAH/Top Global Company menggunakan formula STAR dan Google X-Y-Z (Accomplished [X] as measured by [Y], by doing [Z]).

Bullet Point Asli: "${bulletText}"
Target Role: ${role}
${metricHint ? `Petunjuk Angka/Metrik Tambahan: ${metricHint}` : ""}

Berikan respons dalam JSON:
{
  "analysis": "Mengapa kalimat asli lemah / pasif",
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
    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error("Rewrite error:", error);
    res.status(500).json({ success: false, error: formatErrorMessage(error) });
  }
});

// Boot the server (only when not running as a serverless function)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HR Savage CV Reviewer server running on port ${PORT}`);
  });
}

// Only invoke app.listen if executed directly (e.g. node server.ts / dev), not in Vercel Serverless Function
if (process.env.VERCEL !== "1" && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  startServer();
}

export default app;

