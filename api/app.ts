import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

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
// 1. FULL CV REVIEW & ROASTING ENDPOINT
// =========================================================================
app.post("/api/review-cv", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { cvText, fileData, targetRole = "General Tech / Career", mode = "savage" } = req.body;

    if (!cvText && !fileData) {
      return res.status(400).json({
        success: false,
        error: "Harap masukkan teks CV atau unggah dokumen CV/Resume Anda.",
      });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
Kamu adalah "Savage FAANG Tech Recruiter & Principal Architect" dengan pengalaman 15+ tahun mengeliminasi 99% kandidat di Google, Meta, dan Unicorn.
Tugasmu adalah menganalisis CV kandidat ini dengan sangat tajam, teliti, realistis, dan memberikan output komprehensif dalam format JSON.

PENTING:
- Nada bicara (Tone): ${
      mode === "savage"
        ? "Savage, sarkastik, pedas tapi 100% akurat, lucu, tanpa ampun, membongkar semua buzzword, metrik palsu, dan kelemahan fatal CV."
        : mode === "ats_only"
        ? "Fokus total pada ATS optimization, parsing score, keyword density, formatting checks, dan metrik terukur."
        : "Konstruktif, ramah, profesional ala Senior Career Coach kelas dunia yang ingin kandidat sukses tembus FAANG."
    }
- Jangan halusinasi. Evaluasi HANYA dari informasi yang tertera di dokumen/teks.
- Bahasa: Bahasa Indonesia yang natural, gaul untuk istilah tech, namun tetap berwawasan industri tinggi.

Kembalikan data HANYA dalam format JSON valid yang sesuai dengan skema yang diminta.
`;

    const userPromptText = `
Target Posisi yang Dilamar: "${targetRole}"
Mode Review: "${mode}"

Analisis CV ini dan hasilkan evaluasi mendalam dengan struktur JSON berikut:
{
  "score": <angka 0-100>,
  "atsScore": <angka 0-100>,
  "candidateName": "<nama kandidat yang terdeteksi di CV atau 'Anonymous Candidate'>",
  "candidateLevel": "<Junior / Mid-Level / Senior / Lead / Career Switcher / Mahasiswa Abadi>",
  "detectedRole": "<role yang paling tercermin dari isi CV>",
  "summaryRoast": "<Paragraf ringkasan roasting pembuka yang menohok atau evaluasi tajam maksimal 3 kalimat>",
  "verdict": "<REJECTED / NEED_TOTAL_REVAMP / INTERVIEW_WORTHY / ATS_COMPLIANT_ONLY / FAANG_READY>",
  "executiveSummary": "<2-3 kalimat evaluasi objektif tentang profil kandidat ini di pasar kerja saat ini>",
  "strengths": [
    "<Kekuatan riil 1 yang layak dipuji>",
    "<Kekuatan riil 2>"
  ],
  "fatalFlaws": [
    {
      "title": "<Nama kesalahan fatal, misal: Metrik Palsu Tanpa Dampak Finansial / Format Kolom Dua>",
      "severity": "<HIGH / MEDIUM / LOW>",
      "explanation": "<Penjelasan mengapa recruiter langsung melempar CV ini ke tempat sampah karena hal ini>",
      "solution": "<Cara konkret memperbaikinya>"
    }
  ],
  "atsBreakdown": {
    "formatCheck": {
      "status": "<PASS / WARNING / FAIL>",
      "comment": "<Evaluasi struktur layout, tabel, kolom, grafik yang membingungkan ATS>"
    },
    "keywordMatch": {
      "status": "<PASS / WARNING / FAIL>",
      "score": <angka 0-100>,
      "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
      "foundKeywords": ["<keyword 1>", "<keyword 2>"]
    },
    "quantifiableMetrics": {
      "status": "<PASS / WARNING / FAIL>",
      "comment": "<Apakah ada angka X-Y-Z formula Google atau cuma kata kerja hampa>"
    },
    "actionVerbs": {
      "status": "<PASS / WARNING / FAIL>",
      "comment": "<Kualitas kata kerja aktif (Built, Architected, Optimized vs Assisted, Responsible for)>"
    }
  },
  "lineByLineRoasts": [
    {
      "originalText": "<Kutipan kalimat asli di CV yang lemah/kocak/halu>",
      "roast": "<Komentar pedas recruiter mengapa kalimat ini gagal>",
      "suggestedFix": "<Versi revisi standar FAANG dengan formula STAR & X-Y-Z>"
    }
  ],
  "techStackAudit": {
    "overclaimed": ["<Skill yang dicantumkan tapi tidak ada bukti nyata di deskripsi proyek>"],
    "good": ["<Skill yang didukung pengalaman relevan>"],
    "obsolete": ["<Skill jadul atau tidak relevan dengan target role>"]
  },
  "actionPlan": [
    "<Langkah konkret 1 untuk merevisi CV dalam 24 jam ke depan>",
    "<Langkah konkret 2>",
    "<Langkah konkret 3>",
    "<Langkah konkret 4>"
  ],
  "interviewRedFlags": [
    "<Hal di CV ini yang pasti akan jadi bahan cecaran maut saat sesi technical interview>"
  ]
}
`;

    const parts: any[] = [];

    if (fileData && fileData.data && fileData.mimeType) {
      parts.push({
        inlineData: {
          data: fileData.data,
          mimeType: fileData.mimeType,
        },
      });
    }

    if (cvText) {
      parts.push({
        text: `=== TEKS DOKUMEN / CV KANDIDAT ===\n${cvText}\n\n=== INSTRUKSI ANALISIS ===\n${userPromptText}`,
      });
    } else {
      parts.push({
        text: `=== INSTRUKSI ANALISIS DOKUMEN CV TERLAMPIR ===\n${userPromptText}`,
      });
    }

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
// 2. DIGITAL FOOTPRINT AUDIT ENDPOINT
// =========================================================================
app.post("/api/audit-digital-footprint", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { name, targetRole = "Software Engineer", linkedinUrl = "", twitterHandle = "", githubUsername = "", additionalNotes = "" } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: "Nama kandidat wajib diisi." });
    }

    const ai = getGeminiClient();

    const prompt = `
Kamu adalah "Lead Background Check & Social Intelligence Investigator" untuk top FAANG & Tech VC.
Audit jejak digital & presence profesional untuk kandidat berikut:

Nama: ${name}
Target Posisi: ${targetRole}
LinkedIn URL/Username: ${linkedinUrl || "Tidak dicantumkan"}
Twitter/X: ${twitterHandle || "Tidak dicantumkan"}
GitHub: ${githubUsername || "Tidak dicantumkan"}
Catatan / Postingan yang Pernah Dibuat: ${additionalNotes || "Kandidat aktif di komunitas tech, LinkedIn, dan open source"}

Lakukan evaluasi digital footprint mendalam dan berikan respon JSON:
{
  "riskScore": <angka 0-100, di mana 0 = Sangat Aman/Bersih, 100 = Bahaya Tinggi Red Flag>,
  "riskLevel": "<LOW / MODERATE / HIGH / CRITICAL>",
  "summary": "<2-3 kalimat tajam menyimpulkan citra online kandidat ini di mata HR & Hiring Manager>",
  "linkedinAudit": {
    "headlineCheck": "<Evaluasi headline LinkedIn: Apakah generic ('Aspiring SE', 'Looking for Opportunity') atau authoritative>",
    "aboutSectionRating": "<POOR / AVERAGE / STELLAR>",
    "recommendation": "<Saran konkret meningkatkan daya pikat profil LinkedIn>"
  },
  "socialMediaHygiene": {
    "dramaRisk": "<LOW / MEDIUM / HIGH>",
    "rantDetected": "<Analisis potensi postingan emosional / mengeluh soal kantor lama / drama di medsos>",
    "professionalAlignment": "<Sejauh mana persona publiknya mendukung klaim kompetensi teknisnya>"
  },
  "publicBrandingStrengths": [
    "<Poin positif branding digital 1>",
    "<Poin positif 2>"
  ],
  "redFlagsDetected": [
    {
      "issue": "<Isu red flag, misal: 'Open to Work' banner berbulan-bulan tanpa portofolio aktif / Tidak ada bukti coding di publik>",
      "severity": "<HIGH / MEDIUM / LOW>",
      "impact": "<Bagaimana hal ini menurunkan tawar-menawar gaji kandidat>",
      "fix": "<Langkah pembersihan atau mitigasi>"
    }
  ],
  "actionableImprovements": [
    "<Langkah 1 optimasi jejak digital dalam 48 jam>",
    "<Langkah 2>",
    "<Langkah 3>"
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
    console.error("Digital Footprint Error:", error);
    res.status(500).json({ success: false, error: formatErrorMessage(error) });
  }
});

// =========================================================================
// 3. GITHUB ROASTER & CODE PORTFOLIO AUDITOR
// =========================================================================
app.post("/api/roast-github", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { username, repoList = "", claimedTech = "", targetRole = "Software Engineer" } = req.body;

    if (!username) {
      return res.status(400).json({ success: false, error: "Username GitHub wajib diisi." });
    }

    const ai = getGeminiClient();

    const prompt = `
Kamu adalah "Staff Infrastructure Engineer & Tech Lead" yang sudah me-review ribuan profil GitHub.
Bongkar dan roast profil GitHub milik @${username} untuk posisi "${targetRole}".

Data Tambahan:
- Tech Stack yang diklaim kandidat di CV: "${claimedTech || "React, Node.js, TypeScript, Docker"}"
- Daftar Repositori / Deskripsi yang diberikan: "${repoList || "Mencakup repositori tutorial, skripsi/tugas akhir, CRUD, dan personal website"}"

Kembalikan analisis JSON komprehensif:
{
  "devTier": "<TUTORIAL_HELL_SURVIVOR / GREEN_SQUARE_FARMER / JUNIOR_CRUD_SPECIALIST / SOLID_MID_LEVEL / PRODUCTION_HARDENED_CHAD>",
  "overallRoast": "<Roasting pedas 3 kalimat mengenai reputasi profil kodingnya>",
  "statsSummary": {
    "commitQualityScore": <angka 0-100>,
    "architectureScore": <angka 0-100>,
    "originalityScore": <angka 0-100>,
    "productionReadiness": <angka 0-100>
  },
  "roastPoints": [
    {
      "category": "<Tutorial Hell / Commit History / Documentation / Architecture>",
      "roast": "<Kritik pedas misal: 'Repo clone Netflix ke-8000 tanpa auth asli dan API key terekspos di repo publik'>",
      "verdict": "<CRINGE / ACCEPTABLE / IMPRESSIVE>"
    }
  ],
  "techStackDiscrepancy": {
    "claimed": ["${claimedTech || "Docker, Kubernetes, Microservices"}"],
    "actualEvident": ["<Hanya basic HTML, CSS, JavaScript, dan Todo App>"],
    "verdict": "<Analisis apakah kandidat 'overclaiming' atau jujur>"
  },
  "topRepoRecommendations": [
    {
      "suggestedProject": "<Ide project nyata berstandar industri yang harus dia buat untuk membuktikan kemampuannya>",
      "whyItWins": "<Mengapa project ini akan membuat Tech Lead terpukau>"
    }
  ],
  "commitMessageRoast": "<Roasting gaya penulisan commit message seperti 'fix bug', 'update', 'test 123', 'asdfgh'>",
  "readmeActionChecklist": [
    "<Perbaikan 1 untuk README.md>",
    "<Perbaikan 2>"
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
    console.error("GitHub Roast Error:", error);
    res.status(500).json({ success: false, error: formatErrorMessage(error) });
  }
});

// =========================================================================
// 4. INTERACTIVE RECRUITER CHATBOT & FIX GENERATOR
// =========================================================================
app.post("/api/generate-fix", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { sectionName, currentContent, targetRole, instructions } = req.body;
    const ai = getGeminiClient();

    const prompt = `
Kamu adalah Executive CV Writer untuk Tech Leaders.
Tulis ulang bagian "${sectionName}" dari CV berikut agar berstandar FAANG/Tier-1 Tech Company.

Target Role: ${targetRole || "Software Engineer"}
Konten Saat Ini:
"${currentContent}"

Instruksi Khusus: ${instructions || "Gunakan action verbs kuat, formula Google X-Y-Z, dan metrik bisnis terukur."}

Keluarkan HANYA teks markdown hasil revisi yang langsung siap disalin ke dokumen CV.
`;

    const response = await generateWithRetry(ai, {
      contents: prompt,
    });

    res.json({
      success: true,
      revisedContent: response.text || "",
    });
  } catch (error: any) {
    console.error("Generate fix error:", error);
    res.status(500).json({ success: false, error: formatErrorMessage(error) });
  }
});

app.post("/api/chat-recruiter", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { message, chatHistory = [], cvContext = "" } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `
Kamu adalah "Savage HR & Career Architect". Jawab pertanyaan user mengenai persiapan karir, negosiasi gaji, trik interview, atau revisi CV mereka.
Jawab dengan gaya blak-blakan, penuh wawasan orang dalam (insider HR tricks), taktis, dan solutif.

Konteks CV Kandidat saat ini:
${cvContext ? cvContext.substring(0, 3000) : "Belum ada CV yang diunggah"}
`;

    const contents = [
      ...chatHistory.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await generateWithRetry(ai, {
      contents,
      config: {
        systemInstruction: systemPrompt,
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
Ubah bullet point CV berikut menjadi 3 variasi standar emas FAANG/Top Global Company menggunakan formula STAR dan Google X-Y-Z (Accomplished [X] as measured by [Y], by doing [Z]).

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

export default app;
