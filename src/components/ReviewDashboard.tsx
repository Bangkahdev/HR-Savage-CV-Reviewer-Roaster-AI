import React, { useState } from "react";
import {
  Flame,
  AlertTriangle,
  FileCheck2,
  Cpu,
  Ban,
  ListOrdered,
  Sparkles,
  Download,
  Copy,
  Check,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Wand2,
  BarChart3,
  Search,
  Code2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { CVReviewResult } from "../types";
import { exportReviewToPdf, getScoreTheme } from "../utils/helpers";

interface ReviewDashboardProps {
  result: CVReviewResult;
  targetRole: string;
  onOpenChat: () => void;
  onOpenRewriter: (initialText?: string) => void;
  onNavigateToDigitalFootprint?: () => void;
  onNavigateToGithubRoast?: () => void;
}

export const ReviewDashboard: React.FC<ReviewDashboardProps> = ({
  result,
  targetRole,
  onOpenChat,
  onOpenRewriter,
  onNavigateToDigitalFootprint,
  onNavigateToGithubRoast,
}) => {
  const [activeTab, setActiveTab] = useState<
    | "scores"
    | "redflags"
    | "rewrites"
    | "ats"
    | "buzzwords"
    | "sections"
    | "actionplan"
    | "polished"
  >("scores");

  const [copiedRoast, setCopiedRoast] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);

  const theme = getScoreTheme(result.overallScore);

  const handleCopyRoast = () => {
    navigator.clipboard.writeText(
      `[ROAST MY CV - Score: ${result.overallScore}/100 - Grade: ${result.grade}]\nVerdict: ${result.verdictTag}\n\n"${result.summaryRoast}"`
    );
    setCopiedRoast(true);
    setTimeout(() => setCopiedRoast(false), 2000);
  };

  const handleCopyMarkdown = () => {
    if (result.sampleFullCvRewriteSnippet) {
      navigator.clipboard.writeText(result.sampleFullCvRewriteSnippet);
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2000);
    }
  };

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
  };

  const interviewProbability = Math.max(
    0.4,
    Math.min(94, Math.round((result.overallScore / 100) * 85 + (result.overallScore > 75 ? 10 : 0)))
  );

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Hero Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {/* Cell 1: Industry Score */}
        <div className="col-span-12 md:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-center items-center text-center soft-shadow-lg page-fade relative overflow-hidden group">
          <div className="absolute inset-0 bg-coral-50/50 opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none"></div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 z-10 relative">
            Industry Score
          </span>
          <div className="text-5xl sm:text-6xl font-black text-coral-600 tracking-tight z-10 relative">
            {result.overallScore}
            <span className="text-xl text-slate-400 font-bold">/100</span>
          </div>
          <div className="mt-5 px-4 py-1.5 text-xs font-black rounded-full border uppercase tracking-wider z-10 relative shadow-sm ${
            result.overallScore < 50
              ? "bg-coral-50 text-coral-700 border-coral-200/60"
              : result.overallScore < 75
                ? "bg-amber-50 text-amber-700 border-amber-200/60"
                : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
          }`}
          >
            GRADE {result.grade} • {theme.label}
          </div>
        </div>

        {/* Cell 2: The HR Roast */}
        <div className="col-span-12 md:col-span-6 bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 relative overflow-hidden soft-shadow-lg page-fade flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Flame className="w-32 h-32 text-coral-200" />
          </div>

          <div className="z-10 relative">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200/80">
              <h2 className="text-xs sm:text-sm font-black flex items-center gap-2 text-slate-900 uppercase tracking-widest">
                <span className="bg-coral-500 w-1.5 h-4 rounded-full"></span>
                THE HR SAVAGE ROAST
              </h2>
              <span className="text-[11px] font-mono text-coral-600 font-bold">
                ROLE: <strong className="text-coral-700">{targetRole}</strong>
              </span>
            </div>

            <p className="text-base sm:text-lg font-normal italic leading-relaxed text-slate-600 mb-5">
              "{result.summaryRoast}"
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 z-10 relative">
            <span className="font-bold text-coral-700 flex items-center gap-1.5 bg-coral-50 px-2.5 py-0.5 rounded-full border border-coral-200/60">
              <Flame className="w-3.5 h-3.5 text-coral-500" /> {result.verdictTag}
            </span>
            <span className="text-slate-400 text-[11px] font-mono">Strictness: BANGKAH Level</span>
          </div>
        </div>

        {/* Cell 3: ATS Compliance */}
        <div className="col-span-12 md:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-7 soft-shadow-lg page-fade flex flex-col justify-between">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center justify-between">
            <span>ATS Compliance</span>
            <Cpu className="w-4 h-4 text-coral-400" />
          </h2>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-500 font-medium">Parsing Ability</span>
                <span
                  className={`font-mono text-xs font-bold ${
                    result.atsSimulation.parseScore >= 70
                      ? "text-emerald-600"
                      : result.atsSimulation.parseScore >= 50
                        ? "text-amber-600"
                        : "text-coral-600"
                  }`}
                >
                  {result.atsSimulation.parseScore >= 70 ? "PASSED" : result.atsSimulation.parseScore >= 50 ? "AT RISK" : "FAILED"}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden border border-slate-300/40">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    result.atsSimulation.parseScore >= 70 ? "bg-emerald-500" : result.atsSimulation.parseScore >= 50 ? "bg-amber-500" : "bg-coral-500"
                  }`}
                  style={{ width: `${result.atsSimulation.parseScore}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-500 font-medium">Keyword Density</span>
                <span className="text-amber-600 font-mono text-xs font-bold">
                  {result.scoreBreakdown.skillsAndKeywords.score} / {result.scoreBreakdown.skillsAndKeywords.max}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden border border-slate-300/40">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-700" style={{ width: `${(result.scoreBreakdown.skillsAndKeywords.score / result.scoreBreakdown.skillsAndKeywords.max) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-500 font-medium">Format &amp; Structure</span>
                <span
                  className={`font-mono text-xs font-bold ${
                    result.scoreBreakdown.atsCompatibility.score >= 15 ? "text-emerald-600" : "text-coral-600"
                  }`}
                >
                  {result.scoreBreakdown.atsCompatibility.score >= 15 ? "CLEAN" : "CRITICAL"}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden border border-slate-300/40">
                <div className={`h-full rounded-full transition-all duration-700 ${result.scoreBreakdown.atsCompatibility.score >= 15 ? "bg-emerald-500" : "bg-coral-500"}`} style={{ width: `${(result.scoreBreakdown.atsCompatibility.score / result.scoreBreakdown.atsCompatibility.max) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Missing: <strong className="text-coral-600">{result.atsSimulation.missingCriticalKeywords.length}</strong></span>
            <span>Match: <strong className="text-emerald-600">{result.atsSimulation.matchedKeywords.length}</strong></span>
          </div>
        </div>

        {/* Cell 4: Impact Analysis */}
        <div className="col-span-12 md:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-7 soft-shadow-lg page-fade flex flex-col justify-between">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Impact Analysis
          </h2>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900 italic">
              "{result.verdictTag}"
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Dampak kuantitatif &amp; aksi nyata:{" "}
              <strong className="text-slate-800">{result.scoreBreakdown.impactAndMetrics.score} / {result.scoreBreakdown.impactAndMetrics.max}</strong>
            </p>
          </div>
          <div className="p-4 rounded-3xl bg-coral-50 border border-coral-200/60 flex items-center justify-between shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">Interview Chance:</span>
            <span className={`text-sm font-black font-mono ${interviewProbability >= 70 ? "text-emerald-600" : interviewProbability >= 40 ? "text-amber-600" : "text-coral-600"}`}>
              {interviewProbability}%
            </span>
          </div>
        </div>

        {/* Cell 5: Immediate Fixes */}
        <div className="col-span-12 md:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-7 soft-shadow-lg page-fade flex flex-col justify-between">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Immediate Fixes ({result.fatalRedFlags.length})
          </h2>
          <ul className="text-xs space-y-3">
            {result.fatalRedFlags.slice(0, 4).map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-slate-600">
                <span className="text-coral-500 font-mono font-bold flex-shrink-0 mt-0.5">[!]</span>
                <span className="line-clamp-1">{flag.title}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="text-coral-600 font-bold">Critical Severity</span>
            <button onClick={() => setActiveTab("redflags")} className="text-coral-600 hover:text-coral-700 font-bold transition-colors cursor-pointer">
              Lihat Solusi →
            </button>
          </div>
        </div>

        {/* Cell 6: Industry Benchmark */}
        <div className="col-span-12 md:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-7 soft-shadow-lg page-fade flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Industry Benchmark
            </h2>
            <BarChart3 className="w-4 h-4 text-coral-400" />
          </div>

          <div className="flex items-end gap-1.5 h-20 px-1">
            <div className="w-full flex flex-col items-center gap-1">
              <div className="bg-slate-200 w-full h-[78px] rounded-t"></div>
            </div>
            <div className="w-full flex flex-col items-center gap-1">
              <div className="bg-slate-200 w-full h-[88px] rounded-t"></div>
            </div>
            <div className="w-full flex flex-col items-center gap-1">
              <div className="bg-slate-200 w-full h-[68px] rounded-t"></div>
            </div>
            <div className="w-full flex flex-col items-center gap-1">
              <div className="bg-coral-500 w-full rounded-t border-t-2 border-coral-400 transition-all duration-700 shadow-sm shadow-coral-200/40" style={{ height: `${Math.max(14, (result.overallScore / 100) * 80)}px` }}></div>
            </div>
            <div className="w-full flex flex-col items-center gap-1">
              <div className="bg-slate-200 w-full h-[62px] rounded-t"></div>
            </div>
            <div className="w-full flex flex-col items-center gap-1">
              <div className="bg-slate-200 w-full h-[55px] rounded-t"></div>
            </div>
          </div>

          <div className="flex justify-between mt-3 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Fintech</span><span>Big Tech</span><span>Startup</span><span className="text-coral-600 font-black">ANDA</span><span>Agency</span><span>Edtech</span>
          </div>
        </div>

        {/* Cell 7: Action Command Bar */}
        <div className="col-span-12 bg-gradient-to-br from-coral-50 to-coral-100 border border-coral-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-slate-900 soft-shadow-lg page-fade">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-white/60 flex items-center justify-center font-black shadow-sm">
              <Sparkles className="w-5.5 h-5.5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight">
                Siap Rombak CV Menjadi Standar Top-Tier?
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Gunakan wizard rewriter otomatis, optimalkan kata kunci ATS, dan konsultasi langsung dengan HR AI.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToDigitalFootprint && (
              <button onClick={onNavigateToDigitalFootprint} className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm border border-slate-200 cursor-pointer soft-btn">
                <Search className="w-3.5 h-3.5 text-coral-400" /> Audit Jejak Digital
              </button>
            )}
            {onNavigateToGithubRoast && (
              <button onClick={onNavigateToGithubRoast} className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm border border-slate-200 cursor-pointer soft-btn">
                <Code2 className="w-3.5 h-3.5 text-coral-400" />Roast GitHub
              </button>
            )}
            <button onClick={() => onOpenRewriter()} className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm border border-slate-200 cursor-pointer soft-btn">
              <Wand2 className="w-3.5 h-3.5 text-amber-400" /> Rewrite Bullet Point
            </button>
            <button onClick={onOpenChat} className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm border border-slate-200 cursor-pointer soft-btn" id="open-hr-chat-btn">
              <MessageSquare className="w-3.5 h-3.5 text-coral-400" /> Tanya HR AI
            </button>
            <button onClick={() => exportReviewToPdf(result, targetRole)} className="px-4 py-2.5 rounded-2xl bg-coral-600 hover:bg-coral-700 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-coral-200/40 soft-btn" id="export-pdf-btn">
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
            <button onClick={handleCopyRoast} className="px-4 py-2.5 rounded-2xl bg-coral-600 hover:bg-coral-700 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-coral-200/40 soft-btn">
              {copiedRoast ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Tabs Section */}
      <div className="space-y-4 pt-4">
        <div className="flex overflow-x-auto pb-2 scrollbar-none gap-2 border-b border-slate-200/80">
          <button onClick={() => setActiveTab("scores")} className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${activeTab === "scores" ? "bg-white border-coral-200 text-coral-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200"}`}>
            <TrendingUp className="w-3.5 h-3.5" /> 5 Sub-Skor Audit
          </button>
          <button onClick={() => setActiveTab("redflags")} className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${activeTab === "redflags" ? "bg-white border-coral-200 text-coral-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200"}`}>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Fatal Red Flags ({result.fatalRedFlags.length})
          </button>
          <button onClick={() => setActiveTab("rewrites")} className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${activeTab === "rewrites" ? "bg-white border-coral-200 text-coral-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200"}`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Before vs After (STAR)
          </button>
          <button onClick={() => setActiveTab("ats")} className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${activeTab === "ats" ? "bg-white border-coral-200 text-coral-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200"}`}>
            <Cpu className="w-3.5 h-3.5" /> ATS &amp; Keywords
          </button>
          <button onClick={() => setActiveTab("buzzwords")} className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${activeTab === "buzzwords" ? "bg-white border-coral-200 text-coral-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200"}`}>
            <Ban className="w-3.5 h-3.5 text-rose-400" /> Detoks Buzzword ({result.buzzwordAudit.length})
          </button>
          <button onClick={() => setActiveTab("sections")} className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${activeTab === "sections" ? "bg-white border-coral-200 text-coral-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200"}`}>
            <Layers className="w-3.5 h-3.5" /> Kritik Per Bagian
          </button>
          <button onClick={() => setActiveTab("actionplan")} className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${activeTab === "actionplan" ? "bg-white border-coral-200 text-coral-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200"}`}>
            <ListOrdered className="w-3.5 h-3.5 text-emerald-400" /> Action Plan
          </button>
          {result.sampleFullCvRewriteSnippet && (
            <button onClick={() => setActiveTab("polished")} className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${activeTab === "polished" ? "bg-white border-coral-200 text-coral-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-slate-200"}`}>
              <Award className="w-3.5 h-3.5 text-teal-400" /> Draf CV Dipoles
            </button>
          )}
        </div>

        {/* Tab 1: Sub-scores */}
        {activeTab === "scores" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries({
              "Dampak & Metrik Kuantitatif": result.scoreBreakdown.impactAndMetrics,
              "Kompatibilitas Format ATS": result.scoreBreakdown.atsCompatibility,
              "Kata Kerja Aksi & Kejelasan": result.scoreBreakdown.actionVerbsAndClarity,
              "Densitas Skill & Keyword Industri": result.scoreBreakdown.skillsAndKeywords,
              "Alur Karir & Relevansi Pengalaman": result.scoreBreakdown.careerStoryAndRelevance,
            }).map(([title, item]) => {
              const percentage = (item.score / item.max) * 100;
              const isGood = percentage >= 75;
              const isWarning = percentage >= 50 && percentage < 75;
              return (
                <div key={title} className="bg-white border border-slate-200/80 rounded-3xl p-7 soft-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">{title}</h4>
                      <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${isGood ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : isWarning ? "bg-amber-50 text-amber-700 border border-amber-200/60" : "bg-coral-50 text-coral-700 border border-coral-200/60"}`}>
                        {item.score} / {item.max}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                      <div className={`h-full rounded-full transition-all duration-500 ${isGood ? "bg-emerald-500" : isWarning ? "bg-amber-500" : "bg-coral-500"}`} style={{ width: `${percentage}%` }} />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.feedback}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Fatal Red Flags */}
        {activeTab === "redflags" && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-coral-50 border border-coral-200 text-coral-800 text-xs">
              <strong className="font-bold">Peringatan Rekruter:</strong> Kesalahan fatal ini adalah alasan utama CV Anda langsung dibuang dalam 6 detik pertama sebelum dibaca manusia.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.fatalRedFlags.map((flag, idx) => (
                <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-7 soft-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black uppercase tracking-wider text-coral-600 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Red Flag #{idx + 1}
                      </span>
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${flag.severity === "high" ? "bg-coral-600 text-white" : flag.severity === "medium" ? "bg-amber-600 text-white" : "bg-blue-600 text-white"}`}>
                        {flag.severity}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">{flag.title}</h4>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">{flag.explanation}</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-emerald-600">
                    <span className="font-bold block text-emerald-700 mb-0.5">Solusi Standar Emas:</span>
                    {flag.fix}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Rewrites */}
        {activeTab === "rewrites" && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>
                💡 <strong className="text-slate-800">Formula Google X-Y-Z:</strong> "Berhasil mencapai [X], yang diukur dengan [Y], dengan melakukan [Z]".
              </span>
              <button onClick={() => onOpenRewriter()} className="px-3 py-1 text-xs font-bold rounded-lg bg-coral-600 hover:bg-coral-700 text-white transition flex items-center gap-1 soft-btn">
                <Wand2 className="w-3.5 h-3.5" /> Rewriter Kustom
              </button>
            </div>
            <div className="space-y-4">
              {result.bulletPointRewrites.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-7 space-y-5 soft-shadow">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-coral-600 flex items-center gap-1">
                        <Ban className="w-3 h-3" /> Kalimat Asli Anda (Pasif / Lemah)
                      </span>
                      <button onClick={() => onOpenRewriter(item.original)} className="text-[11px] text-amber-600 hover:underline flex items-center gap-1 font-bold">
                        <Wand2 className="w-3 h-3" /> Variasikan Lagi
                      </button>
                    </div>
                    <div className="p-4 rounded-3xl bg-coral-50/50 border border-coral-200/60 text-xs sm:text-sm text-slate-600 font-mono">
                      "{item.original}"
                    </div>
                    <p className="text-xs text-coral-600 mt-2"><strong className="text-coral-800">Alasan Gagal:</strong> {item.whyWeak}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Versi Rekomendasi HR (Formula STAR & Google X-Y-Z)
                      </span>
                      <button onClick={() => handleCopyBullet(item.improvedSTAR, idx)} className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-600 text-[11px] font-semibold transition flex items-center gap-1 soft-btn">
                        {copiedBulletIdx === idx ? (<> <Check className="w-3 h-3 text-emerald-400" /> Tersalin! </>) : (<> <Copy className="w-3 h-3" /> Salin Kalimat </>)}
                      </button>
                    </div>
                    <div className="p-4 rounded-3xl bg-emerald-50/50 border border-emerald-200/60 text-xs sm:text-sm text-emerald-600 font-medium leading-relaxed">
                      "{item.improvedSTAR}"
                    </div>
                    <p className="text-xs text-slate-500 mt-2"><strong className="text-slate-700">Mengapa ampuh:</strong> {item.impactExplained}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: ATS & Keywords */}
        {activeTab === "ats" && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 flex flex-col sm:flex-row items-center justify-between gap-6 soft-shadow">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Simulasi Parser ATS (Workday / Greenhouse / Lever)</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  Estimasi Lolos Seleksi ATS:{<span className={result.atsSimulation.parseScore >= 75 ? "text-emerald-600" : result.atsSimulation.parseScore >= 50 ? "text-amber-600" : "text-coral-600"}>{result.atsSimulation.parseScore}%</span>}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md">
                  Berdasarkan kesesuaian kata kunci untuk posisi <strong className="text-slate-800">{targetRole}</strong> dan keterbacaan struktur format.
                </p>
              </div>
              <div className="w-24 h-24 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center p-2">
                <Cpu className="w-6 h-6 text-coral-500 mb-1" />
                <span className="text-xs font-bold text-slate-700">{result.atsSimulation.parseScore >= 70 ? "ATS Friendly" : "Berisiko"}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-7 soft-shadow">
                <h4 className="text-xs font-bold uppercase tracking-wider text-coral-600 mb-3 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Keyword Kunci yang Hilang</h4>
                {result.atsSimulation.missingCriticalKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">{result.atsSimulation.missingCriticalKeywords.map((kw, i) => (<span key={i} className="px-2.5 py-1 rounded-xl bg-coral-50 border border-coral-200/60 text-coral-700 text-xs font-semibold">+ {kw}</span>))}</div>
                ) : (<p className="text-xs text-slate-400">Keyword utama sudah cukup lengkap.</p>)}
              </div>
              <div className="bg-white border border-slate-200/80 rounded-3xl p-7 soft-shadow">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-1.5"><FileCheck2 className="w-3.5 h-3.5" /> Keyword yang Terdeteksi</h4>
                <div className="flex flex-wrap gap-2">{result.atsSimulation.matchedKeywords.map((kw, i) => (<span key={i} className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-medium">✓ {kw}</span>))}</div>
              </div>
            </div>
            {result.atsSimulation.formattingRisks.length > 0 && (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-7 soft-shadow">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Risiko Layout &amp; Format</h4>
                <ul className="space-y-2 text-xs text-slate-500">{result.atsSimulation.formattingRisks.map((risk, i) => (<li key={i} className="flex items-start gap-2"><span className="text-amber-500">•</span><span>{risk}</span></li>))}</ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Buzzwords */}
        {activeTab === "buzzwords" && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              Kata-kata klise seperti <em>"hardworking"</em>, <em>"fast learner"</em>, atau <em>"bertanggung jawab atas"</em> membuat CV Anda terdengar seperti jutaan kandidat medioker lainnya. Ganti dengan kata kerja aksi berdaya tinggi.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.buzzwordAudit.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-7 soft-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-xl bg-coral-50 text-coral-700 border border-coral-200/60 text-xs font-bold line-through">"{item.word}"</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                      <span className="px-2.5 py-0.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold">{item.replacement}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed"><strong className="text-slate-700">Mengapa jelek:</strong> {item.whyItSucks}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Sections */}
        {activeTab === "sections" && (
          <div className="space-y-4">
            {Object.entries({
              "Header & Professional Summary": result.sectionBySectionCritique.headerAndSummary,
              "Pengalaman Kerja": result.sectionBySectionCritique.workExperience,
              "Keahlian & Tools": result.sectionBySectionCritique.skillsAndTools,
              "Pendidikan & Sertifikasi": result.sectionBySectionCritique.educationAndCertifications,
              "Layout, Tipografi & Panjang Halaman": result.sectionBySectionCritique.layoutAndLength,
            }).map(([secTitle, data]) => (
              <div key={secTitle} className="bg-white border border-slate-200/80 rounded-3xl p-7 soft-shadow space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{secTitle}</h4>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-amber-600 border border-slate-200">Rating: {data.rating}</span>
                </div>
                <p className="text-xs text-coral-600 bg-coral-50 p-4 rounded-3xl border border-coral-200/60 leading-relaxed"><strong className="text-coral-700">Roasting:</strong> {data.roast}</p>
                <p className="text-xs text-emerald-600 bg-emerald-50 p-4 rounded-3xl border border-emerald-200/60 leading-relaxed"><strong className="text-emerald-700">Saran Perbaikan:</strong> {data.recommendation}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 7: Action Plan */}
        {activeTab === "actionplan" && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              Ikuti rencana aksi berurutan ini untuk mengubah CV Anda dari "Tong Sampah HR" menjadi "Shortlist Ready".
            </div>
            <div className="space-y-3">
              {result.stepByStepActionPlan.map((plan) => (
                <div key={plan.step} className="bg-white border border-slate-200/80 rounded-3xl p-7 soft-shadow flex items-start gap-4">
                  <div className="w-9 h-9 rounded-2xl bg-coral-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">{plan.step}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-slate-900">{plan.action}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${plan.priority.includes("Darurat") ? "bg-coral-600 text-white" : plan.priority.includes("Penting") ? "bg-amber-600 text-white" : "bg-blue-600 text-white"}`}>{plan.priority}</span>
                    </div>
                    <div className="mt-3 p-3 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-500"><strong className="text-emerald-600 block mb-0.5">Contoh Penerapan Nyata:</strong>{plan.example}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 8: Polished */}
        {activeTab === "polished" && result.sampleFullCvRewriteSnippet && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 soft-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Award className="w-4 h-4 text-teal-400" /> Contoh Draf CV yang Telah Dipoles Standar BANGKAH</h4>
              <button onClick={handleCopyMarkdown} className="px-3.5 py-1.5 rounded-xl bg-coral-600 hover:bg-coral-700 text-white text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 soft-btn">{copiedMarkdown ? (<> <Check className="w-3.5 h-3.5" /> Tersalin! </>) : (<> <Copy className="w-3.5 h-3.5" /> Salin Draf Lengkap </>)}</button>
            </div>
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto"><ReactMarkdown>{result.sampleFullCvRewriteSnippet}</ReactMarkdown></div>
          </div>
        )}
      </div>
    </div>
  );
};

