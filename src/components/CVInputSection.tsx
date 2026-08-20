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
      {/* Bento Top Header Intro Banner */}
      <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Flame className="w-48 h-48 text-red-500" />
        </div>

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-red-400 text-xs font-bold uppercase tracking-widest mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            Industry Score & Reality Check
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
            Roast My CV <span className="text-red-500">Zero Mercy</span>
          </h2>
          <p className="mt-2 text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Evaluasi CV berstandar rekruter FAANG & Fortune 500. Dapatkan skor industri objektif, simulasi parser ATS, detoks buzzwords instan, dan formula Google X-Y-Z otomatis.
          </p>
        </div>

        {/* Quick Sample Presets in Bento Tile */}
        <div className="w-full md:w-auto bg-zinc-950/90 border border-zinc-800/90 p-4 rounded-xl flex flex-col gap-2 shadow-inner">
          <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick Test Samples
          </span>
          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_CVS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample.id)}
                className="px-3 py-2 text-[11px] font-bold rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 transition-all text-left truncate cursor-pointer hover:border-red-500/40 shadow-sm"
                title={sample.description}
              >
                {sample.title.split(" - ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Bento Form Grid */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-800/80 flex items-center gap-3 text-red-300 text-xs font-medium shadow-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bento Card Left (7 cols): Document Upload / Paste Area */}
          <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5 border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="bg-red-500 w-1.5 h-5 rounded-full"></span>
                <h3 className="text-xs font-extrabold text-zinc-300 uppercase tracking-widest">
                  CV Document Source
                </h3>
              </div>

              {/* Mode Toggle Tabs */}
              <div className="flex p-1 bg-zinc-950 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveInputTab("upload")}
                  className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    activeInputTab === "upload"
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInputTab("text")}
                  className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    activeInputTab === "text"
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md"
                      : "text-zinc-400 hover:text-zinc-200"
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
                  <div className="p-6 rounded-xl border border-zinc-700/80 bg-zinc-950/80 flex flex-col items-center text-center shadow-lg">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-red-500 mb-3 shadow-inner">
                      <FileCheck className="w-7 h-7 text-red-400" />
                    </div>
                    <p className="text-sm font-bold text-zinc-100 mb-1 max-w-sm truncate">
                      {fileData.fileName}
                    </p>
                    <p className="text-xs text-zinc-400 mb-4 font-mono">
                      {fileData.sizeKb} KB • Siap untuk Analisis Multimodal HR
                    </p>
                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition cursor-pointer"
                      >
                        Ganti File
                      </button>
                      <button
                        type="button"
                        onClick={() => setFileData(null)}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-800/80 transition flex items-center gap-1.5 cursor-pointer"
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
                    className="border-2 border-dashed border-zinc-800 hover:border-red-500/60 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 bg-zinc-950/40 hover:bg-zinc-950/70 flex flex-col items-center justify-center min-h-[260px] group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900/90 border border-zinc-800 group-hover:border-red-500/50 flex items-center justify-center text-red-500 mb-3.5 transition-all shadow-inner group-hover:scale-105">
                      <UploadCloud className="w-7 h-7 text-red-500 group-hover:text-red-400" />
                    </div>
                    <p className="text-sm font-bold text-zinc-200 mb-1 group-hover:text-white">
                      Tarik &amp; Letakkan Dokumen CV (PDF / Gambar / TXT)
                    </p>
                    <p className="text-xs text-zinc-400 max-w-xs mb-3.5">
                      Tata letak visual, formatting tabel &amp; kolom diuji otomatis oleh AI.
                    </p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-zinc-900 text-zinc-400 border border-zinc-800 uppercase tracking-wider">
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
                  className="w-full h-64 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-xs sm:text-sm focus:outline-none focus:border-red-500 resize-y font-mono leading-relaxed shadow-inner"
                  id="cv-text-input"
                />
                <div className="flex items-center justify-between mt-2.5 text-[11px] text-zinc-400 font-mono">
                  <span>
                    {cvText.trim().split(/\s+/).filter(Boolean).length} KATA • {cvText.length} KARAKTER
                  </span>
                  {cvText && (
                    <button
                      type="button"
                      onClick={() => setCvText("")}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1 font-sans font-bold cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Bersihkan
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bento Card Right (5 cols): Target Role & Configuration */}
          <div className="lg:col-span-5 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-2xl backdrop-blur-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-4">
                <span className="bg-red-500 w-1.5 h-5 rounded-full"></span>
                <h3 className="text-xs font-extrabold text-zinc-300 uppercase tracking-widest">
                  Target Role &amp; Parameters
                </h3>
              </div>

              {/* Target Role */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-red-400" /> Posisi / Job Target
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Contoh: Senior Software Engineer"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs sm:text-sm focus:outline-none focus:border-red-500 font-medium shadow-inner"
                  id="target-role-input"
                />
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {COMMON_ROLES.slice(0, 4).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setTargetRole(r)}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-zinc-950 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 border border-zinc-800 transition font-medium cursor-pointer"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level & Language */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-zinc-500" /> Senioritas
                  </label>
                  <select
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value as TargetLevel)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-red-500 cursor-pointer"
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-zinc-500" /> Bahasa Review
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as "id" | "en")}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="id">Bahasa Indonesia (Pedas)</option>
                    <option value="en">English (Brutal)</option>
                  </select>
                </div>
              </div>

              {/* Optional Job Description Matcher */}
              <div className="pt-2 border-t border-zinc-800/60">
                <button
                  type="button"
                  onClick={() => setShowJdInput(!showJdInput)}
                  className="text-[11px] font-bold text-zinc-300 hover:text-red-400 flex items-center justify-between w-full py-1 cursor-pointer transition"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Target Job Description / Persyaratan Lowongan (Opsional)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                    {showJdInput ? "Tutup" : "+ Tambah JD"}
                  </span>
                </button>

                {showJdInput && (
                  <div className="mt-2.5 animate-fadeIn">
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Tempelkan kualifikasi / requirements dari iklan lowongan kerja di sini untuk audit kecocokan ATS 100% presisi..."
                      className="w-full h-24 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-600 text-xs focus:outline-none focus:border-red-500 font-mono resize-y shadow-inner"
                    />
                    <p className="text-[10px] text-zinc-400 mt-1">
                      AI akan mencocokkan kata kunci ATS & gap kompetensi secara presisi terhadap lowongan ini.
                    </p>
                  </div>
                )}
              </div>

              {/* Strictness Persona Grid */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-red-500" /> Persona Evaluasi HR
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStrictnessMode("savage_brutal")}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      strictnessMode === "savage_brutal"
                        ? "bg-red-950/70 border-red-500 text-white shadow-md shadow-red-950/40"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-red-400">🔥 Savage Roast</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-900 text-red-200 font-bold uppercase">Brutal</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Kritik pedas &amp; reality check.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStrictnessMode("stern_hr")}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      strictnessMode === "stern_hr"
                        ? "bg-red-950/70 border-red-500 text-white shadow-md shadow-red-950/40"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-zinc-200">👔 Stern Exec</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 font-bold uppercase">FAANG</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Formal &amp; data-driven criteria.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStrictnessMode("ats_robot")}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      strictnessMode === "ats_robot"
                        ? "bg-red-950/70 border-red-500 text-white shadow-md shadow-red-950/40"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-zinc-200">🤖 ATS Robot</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 font-bold uppercase">Parser</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Audit keyword &amp; formatting.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStrictnessMode("constructive_pro")}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      strictnessMode === "constructive_pro"
                        ? "bg-red-950/70 border-red-500 text-white shadow-md shadow-red-950/40"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-zinc-200">💼 Pro Coach</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300 font-bold uppercase">Solutif</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Tegas dengan solusi instan.</span>
                  </button>
                </div>
              </div>

              {/* Accuracy Guarantee Badge */}
              <div className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800 flex items-center gap-2.5 text-zinc-400 text-[11px]">
                <FileCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong className="text-zinc-200">Zero-Hallucination Grounding:</strong> Setiap kritik &amp; audit mengutip kalimat asli dari CV Anda secara objektif.
                </span>
              </div>
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-red-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
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


