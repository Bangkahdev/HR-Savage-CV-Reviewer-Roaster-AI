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
  const candidateModels = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-3.7-flash", "gemini-2.5-pro"];
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
Kamu adalah "Savage FAANG Tech Recruiter, Head of Talent Acquisition & Principal Career Architect" dengan pengalaman 15+ tahun mengeliminasi 99% pelamar kerja di Google, Meta, Amazon, dan top unicorn.
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
      "improvedSTAR": "<Versi perbaikan berstandar FAANG Google X-Y-Z>",
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

// =========================================================================
// 3. GITHUB ROASTER & CODE PORTFOLIO AUDITOR (/api/roast-github)
// =========================================================================
app.post("/api/roast-github", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const {
      username = "developer",
      targetRole = "Software Engineer",
      claimedTechStack = "",
      manualRepoInfo = "",
      language = "id",
    } = req.body;

    if (!username && !manualRepoInfo) {
      return res.status(400).json({ success: false, error: "Silakan masukkan username GitHub atau daftar repositori." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
Kamu adalah "Savage Staff Infrastructure Engineer & Principal Code Reviewer" yang sudah mengaudit jutaan repo GitHub.
Roast profil GitHub ini secara brutal, lucu, cerdas, dan teliti, lalu keluarkan data JSON dengan skema:

{
  "username": "${username}",
  "devScore": <angka 0-100>,
  "devTier": "<Tutorial Hell Survivor / Green Square Farmer / Junior CRUD Specialist / Solid Mid-Level / Production Hardened Chad>",
  "verdictTag": "<Tag vonis singkat misal: TUTORIAL COPY-PASTER / CERTIFIED BUG ARCHITECT / 10X DEVELOPER>",
  "brutalRoast": "<Paragraf roasting pedas dan menohok mengenai profil kodingnya>",
  "metricsAudit": {
    "repoCount": <perkiraan jumlah repo atau 12>,
    "starsTotal": <perkiraan total stars>,
    "topLanguages": ["<bahasa 1>", "<bahasa 2>", "<bahasa 3>"],
    "commitConsistencyScore": <angka 0-100>,
    "readmeQualityScore": <angka 0-100>
  },
  "roastCategories": {
    "tutorialHellDiagnosis": {
      "status": "<safe / warning / severe>",
      "explanation": "<Penjelasan apakah repo penuh clone netflix/todo-app tutorial youtube>"
    },
    "codeSmellAndQuality": {
      "status": "<safe / warning / severe>",
      "explanation": "<Kritik arsitektur kode, hardcoded secret, tidak ada unit test>"
    },
    "commitHabitsAndMessages": {
      "status": "<safe / warning / severe>",
      "explanation": "<Kritik gaya commit message seperti 'update', 'fix bug', 'asdfgh'>"
    },
    "techStackVsCvAlignment": {
      "status": "<aligned / questionable / fake>",
      "explanation": "<Apakah tech stack yang diklaim di CV terbukti di repo kodingnya>"
    }
  },
  "repoTeardowns": [
    {
      "repoName": "<Nama Repo>",
      "techStack": ["<Tech 1>", "<Tech 2>"],
      "roast": "<Kritik roasting spesifik untuk repo ini>",
      "verdict": "<CRINGE / BUTUH KERJA KERAS / LUMAYAN / IMPRESIF>",
      "howToFix": "<Saran arsitektur untuk membuatnya jadi portofolio level FAANG>"
    }
  ],
  "portfolioUpgradeBlueprint": [
    {
      "projectName": "<Ide project nyata yang harus dibangun>",
      "architectureSuggested": "<Arsitektur dan stack yang direkomendasikan>",
      "whyRecruitersLoveIt": "<Mengapa project ini akan membuat Tech Lead kagum>"
    }
  ]
}
`;

    const userPrompt = `
Username GitHub: ${username}
Target Role: ${targetRole}
Klaim Tech Stack di CV: ${claimedTechStack || "React, Node.js, TypeScript, Docker"}
Daftar Repo & Aktivitas: ${manualRepoInfo || "Repo tutorial dasar dan CRUD"}

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
