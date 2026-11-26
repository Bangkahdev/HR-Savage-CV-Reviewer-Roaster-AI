import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  Flame,
  Sparkles,
  Briefcase,
  Layers,
  Languages,
  AlertCircle,
  FileCheck,
  Zap,
} from "lucide-react";
import { CVReviewRequest, StrictnessMode, TargetLevel } from "../types";
import { SAMPLE_CVS } from "../data/sampleCVs";

interface CVInputSectionProps {
  onSubmit: (request: CVReviewRequest) => void;
  isLoading: boolean;
}

const COMMON_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Product Manager",
  "Data Analyst / Scientist",
  "UI/UX Designer",
  "Digital Marketing Specialist",
  "Finance & Accounting",
];

export const CVInputSection: React.FC<CVInputSectionProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [activeInputTab, setActiveInputTab] = useState<"upload" | "text">("upload");
  const [cvText, setCvText] = useState("");
  const [fileData, setFileData] = useState<{
    mimeType: string;
    data: string;
    fileName: string;
    sizeKb: number;
  } | null>(null);

  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [targetLevel, setTargetLevel] = useState<TargetLevel>("mid");
  const [industry, setIndustry] = useState("Tech / Startup");
  const [jobDescription, setJobDescription] = useState("");
  const [showJdInput, setShowJdInput] = useState(false);
  const [strictnessMode, setStrictnessMode] = useState<StrictnessMode>("savage_brutal");
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    setErrorMessage(null);
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("Ukuran file maksimal 15MB.");
      return;
    }

    const reader = new FileReader();

    if (file.type.includes("text") || file.name.endsWith(".txt")) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCvText(text);
        setActiveInputTab("text");
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64Data = result.split(",")[1];
        setFileData({
          mimeType: file.type || "application/pdf",
          data: base64Data,
          fileName: file.name,
          sizeKb: Math.round(file.size / 1024),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_CVS.find((s) => s.id === sampleId);
    if (found) {
      setCvText(found.cvText);
      setFileData(null);
      setTargetRole(found.role);
      setTargetLevel(found.level);
      setActiveInputTab("text");
      setErrorMessage(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!cvText.trim() && !fileData?.data) {
      setErrorMessage("Silakan masukkan teks CV atau unggah dokumen CV terlebih dahulu.");
      return;
    }

    if (!targetRole.trim()) {
      setErrorMessage("Silakan tentukan target posisi/pekerjaan yang dilamar.");
      return;
    }

    onSubmit({
      cvText: cvText.trim(),
      fileData: fileData
        ? {
            mimeType: fileData.mimeType,
            data: fileData.data,
            fileName: fileData.fileName,
          }
        : undefined,
      targetRole: targetRole.trim(),
      targetLevel,
      industry,
      jobDescription: jobDescription.trim() || undefined,
      strictnessMode,
      language,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Soft Intro Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 soft-shadow-lg relative overflow-hidden page-fade">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Flame className="w-48 h-48 text-coral-200" />
        </div>

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-50 border border-coral-200 text-coral-700 text-xs font-black uppercase tracking-widest mb-4">
            <div className="w-2 h-2 rounded-full bg-coral-500 animate-pulse"></div>
            Industri Score & Reality Check
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
            Roast My CV <span className="text-coral-600">Zero Mercy</span>
          </h2>
          <p className="mt-3 text-slate-600 text-sm leading-relaxed">
            Evaluasi CV berstandar rekruter BANGKAH & Fortune 500. Dapatkan skor industri objektif, simulasi parser ATS, detoks buzzwords instan, dan formula Google X-Y-Z otomatis.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="w-full md:w-auto bg-slate-50 border border-slate-200 p-5 rounded-3xl flex flex-col gap-3 soft-shadow">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-coral-400" /> Quick Test Samples
          </span>
          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_CVS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample.id)}
                className="px-3 py-2 text-[11px] font-bold rounded-2xl bg-white hover:bg-coral-50 text-slate-600 hover:text-coral-700 border border-slate-200 hover:border-coral-200/40 transition-all text-left truncate cursor-pointer shadow-sm"
                title={sample.description}
              >
                {sample.title.split(" - ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Soft Form Grid */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-coral-50 border border-coral-200 flex items-center gap-3 text-coral-800 text-xs font-medium soft-shadow">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-coral-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Card: Document Upload / Paste Area */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between soft-shadow-lg page-fade">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="bg-coral-500 w-1.5 h-5 rounded-full"></span>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  CV Document Source
                </h3>
              </div>

              <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveInputTab("upload")}
                  className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    activeInputTab === "upload"
                      ? "bg-white border-coral-200 text-coral-700 shadow-sm"
                      : "text-slate-400 hover:text-coral-600 hover:bg-coral-50"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInputTab("text")}
                  className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    activeInputTab === "text"
                      ? "bg-white border-coral-200 text-coral-700 shadow-sm"
                      : "text-slate-400 hover:text-coral-600 hover:bg-coral-50"
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {/* Upload Area */}
            {activeInputTab === "upload" && (
              <div className="flex-1 flex flex-col justify-center py-2">
                {fileData ? (
                  <div className="p-7 rounded-3xl border border-slate-200 bg-slate-50 flex flex-col items-center text-center soft-shadow">
                    <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 flex items-center justify-center text-coral-500 mb-4 shadow-sm">
                      <FileCheck className="w-8 h-8 text-coral-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 mb-1 max-w-sm truncate">
                      {fileData.fileName}
                    </p>
                    <p className="text-xs text-slate-400 mb-5 font-mono">
                      {fileData.sizeKb} KB • Siap untuk Analisis Multimodal HR
                    </p>
                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition cursor-pointer soft-btn"
                      >
                        Ganti File
                      </button>
                      <button
                        type="button"
                        onClick={() => setFileData(null)}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-coral-50 hover:bg-coral-100 text-coral-700 border border-coral-200/80 transition flex items-center gap-1.5 cursor-pointer soft-btn"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-coral-400/60 rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 bg-slate-50/50 hover:bg-slate-100 flex flex-col items-center justify-center min-h-[280px] group soft-btn"
                  >
                    <div className="w-16 h-16 rounded-3xl bg-white/80 border border-slate-200 group-hover:border-coral-300/50 flex items-center justify-center text-coral-500 mb-4 transition-all shadow-sm group-hover:scale-105">
                      <UploadCloud className="w-8 h-8 text-coral-500 group-hover:text-coral-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-800 mb-1 group-hover:text-slate-900">
                      Tarik &amp; Letakkan Dokumen CV (PDF / Gambar / TXT)
                    </p>
                    <p className="text-xs text-slate-400 max-w-xs mb-4">
                      Tata letak visual, formatting tabel &amp; kolom diuji otomatis oleh AI.
                    </p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white text-slate-400 border border-slate-200 uppercase tracking-wider">
                      Maksimal 15 MB
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  accept=".pdf,.png,.jpg,.jpeg,.txt,.webp"
                  className="hidden"
                />
              </div>
            )}

            {/* Text Area */}
            {activeInputTab === "text" && (
              <div className="flex-1 flex flex-col">
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Tempelkan seluruh isi teks CV Anda di sini (Ringkasan Profil, Pengalaman Kerja, Skill, Portofolio, Pendidikan)..."
                  className="w-full h-64 p-4 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-coral-400 focus-ring-soft resize-y font-mono leading-relaxed shadow-inner"
                  id="cv-text-input"
                />
                <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400 font-mono">
                  <span>
                    {cvText.trim().split(/\s+/).filter(Boolean).length} KATA • {cvText.length} KARAKTER
                  </span>
                  {cvText && (
                    <button
                      type="button"
                      onClick={() => setCvText("")}
                      className="text-coral-600 hover:text-coral-700 flex items-center gap-1 font-sans font-bold cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Bersihkan
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Card: Target Role & Configuration */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between space-y-5 soft-shadow-lg page-fade">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/80 pb-4">
                <span className="bg-coral-500 w-1.5 h-5 rounded-full"></span>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  Target Role &amp; Parameters
                </h3>
              </div>

              {/* Target Role */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-coral-400" /> Posisi / Job Target
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Contoh: Senior Software Engineer"
                  className="w-full px-4 py-2.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-coral-400 focus-ring-soft font-medium shadow-inner"
                  id="target-role-input"
                />
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {COMMON_ROLES.slice(0, 4).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setTargetRole(r)}
                      className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-50 text-slate-400 hover:text-coral-700 hover:border-slate-300 border border-slate-200 transition font-medium cursor-pointer soft-btn"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level & Language */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" /> Senioritas
                  </label>
                  <select
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value as TargetLevel)}
                    className="w-full px-3 py-2.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-coral-400 focus-ring-soft cursor-pointer"
                  >
                    <option value="freshgrad">Fresh Grad (0-1 thn)</option>
                    <option value="junior">Junior (1-2 thn)</option>
                    <option value="mid">Mid-Level (3-5 thn)</option>
                    <option value="senior">Senior (5-8 thn)</option>
                    <option value="lead">Lead / Staff (8+ thn)</option>
                    <option value="executive">Manager / Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-slate-400" /> Bahasa Review
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as "id" | "en")}
                    className="w-full px-3 py-2.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-coral-400 focus-ring-soft cursor-pointer"
                  >
                    <option value="id">Bahasa Indonesia (Pedas)</option>
                    <option value="en">English (Brutal)</option>
                  </select>
                </div>
              </div>

              {/* Optional Job Description Matcher */}
              <div className="pt-2 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setShowJdInput(!showJdInput)}
                  className="text-[11px] font-bold text-slate-400 hover:text-coral-600 flex items-center justify-between w-full py-1 cursor-pointer transition soft-btn"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-coral-400" />
                    Target Job Description / Persyaratan Lowongan (Opsional)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-500 font-mono">
                    {showJdInput ? "Tutup" : "+ Tambah JD"}
                  </span>
                </button>

                {showJdInput && (
                  <div className="mt-2.5 animate-[fadeIn_0.3s_ease-out]">
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Tempelkan kualifikasi / requirements dari iklan lowongan kerja di sini untuk audit kecocokan ATS 100% presisi..."
                      className="w-full h-24 p-3 rounded-3xl bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 text-xs focus:outline-none focus:border-coral-400 focus-ring-soft font-mono resize-y shadow-inner"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      AI akan mencocokkan kata kunci ATS & gap kompetensi secara presisi terhadap lowongan ini.
                    </p>
                  </div>
                )}
              </div>

              {/* Strictness Persona Grid */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-coral-500" /> Persona Evaluasi HR
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStrictnessMode("savage_brutal")}
                    className={`p-3 rounded-3xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      strictnessMode === "savage_brutal"
                        ? "bg-coral-50 border-coral-200 text-coral-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                    } soft-btn`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-coral-600">🔥 Savage Roast</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-coral-100 text-coral-700 font-bold uppercase">Brutal</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Kritik pedas &amp; reality check.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStrictnessMode("stern_hr")}
                    className={`p-3 rounded-3xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      strictnessMode === "stern_hr"
                        ? "bg-coral-50 border-coral-200 text-coral-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                    } soft-btn`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-slate-700">👔 Stern Exec</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold uppercase">BANGKAH</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Formal &amp; data-driven criteria.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStrictnessMode("ats_robot")}
                    className={`p-3 rounded-3xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      strictnessMode === "ats_robot"
                        ? "bg-coral-50 border-coral-200 text-coral-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                    } soft-btn`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-slate-700">🤖 ATS Robot</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold uppercase">Parser</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Audit keyword &amp; formatting.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStrictnessMode("constructive_pro")}
                    className={`p-3 rounded-3xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      strictnessMode === "constructive_pro"
                        ? "bg-coral-50 border-coral-200 text-coral-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                    } soft-btn`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-slate-700">💼 Pro Coach</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold uppercase">Solutif</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Tegas dengan solusi instan.</span>
                  </button>
                </div>
              </div>

              {/* Accuracy Guarantee Badge */}
              <div className="p-4 rounded-3xl bg-coral-50 border border-coral-200 flex items-center gap-2.5 text-slate-600 text-[11px]">
                <FileCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>
                  <strong className="text-slate-800">Zero-Hallucination Grounding:</strong> Setiap kritik &amp; audit mengutip kalimat asli dari CV Anda secara objektif.
                </span>
              </div>
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 px-8 rounded-3xl bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-coral-200/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] soft-btn"
              id="submit-cv-review-btn"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>HR SEDANG MENGULITI CV ANDA...</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4 animate-pulse" />
                  <span>ROAST &amp; AUDIT CV SEKARANG</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

