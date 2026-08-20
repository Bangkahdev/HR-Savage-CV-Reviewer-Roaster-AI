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
  Github,
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

  // Calculate interview probability estimate based on score
  const interviewProbability = Math.max(
    0.4,
    Math.min(94, Math.round((result.overallScore / 100) * 85 + (result.overallScore > 75 ? 10 : 0)))
  );

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* =========================================
          BENTO GRID DASHBOARD HERO SECTION
         ========================================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {/* Bento Cell 1: Industry Score (3 cols) */}
        <div className="col-span-12 md:col-span-3 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-2xl backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-radial-gradient opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
          <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-2">
            Industry Score
          </span>
          <div className="text-6xl sm:text-7xl font-black text-red-500 tracking-tight glow-red">
            {result.overallScore}
            <span className="text-2xl text-zinc-600 font-bold">/100</span>
          </div>
          <div
            className={`mt-4 px-3.5 py-1 text-xs font-black rounded-full border uppercase tracking-wider shadow-sm ${
              result.overallScore < 50
                ? "bg-red-950/80 text-red-400 border-red-800/80"
                : result.overallScore < 75
                ? "bg-amber-950/80 text-amber-400 border-amber-800/80"
                : "bg-emerald-950/80 text-emerald-400 border-emerald-800/80"
            }`}
          >
            GRADE {result.grade} • {theme.label}
          </div>
        </div>

        {/* Bento Cell 2: The HR Roast (6 cols) */}
        <div className="col-span-12 md:col-span-6 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Flame className="w-32 h-32 text-red-500" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
              <h2 className="text-xs sm:text-sm font-black flex items-center gap-2 text-zinc-100 uppercase tracking-widest">
                <span className="bg-red-500 w-1.5 h-4 rounded-full"></span>
                THE HR SAVAGE ROAST
              </h2>
              <span className="text-[11px] font-mono text-zinc-400">
                ROLE: <strong className="text-red-400">{targetRole}</strong>
              </span>
            </div>

            <p className="text-base sm:text-lg font-normal italic leading-relaxed text-zinc-200 mb-4">
              "{result.summaryRoast}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs text-zinc-400">
            <span className="font-bold text-red-400 flex items-center gap-1.5 bg-red-950/40 px-2.5 py-0.5 rounded-full border border-red-900/40">
              <Flame className="w-3.5 h-3.5 text-red-500" /> {result.verdictTag}
            </span>
            <span className="text-zinc-500 text-[11px] font-mono">Strictness: FAANG Level</span>
          </div>
        </div>

        {/* Bento Cell 3: ATS Compliance (3 cols) */}
        <div className="col-span-12 md:col-span-3 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <h2 className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-4 flex items-center justify-between">
            <span>ATS Compliance</span>
            <Cpu className="w-4 h-4 text-red-400" />
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-zinc-300 font-medium">Parsing Ability</span>
                <span
                  className={`font-mono text-xs font-bold ${
                    result.atsSimulation.parseScore >= 70
                      ? "text-emerald-400"
                      : result.atsSimulation.parseScore >= 50
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {result.atsSimulation.parseScore >= 70
                    ? "PASSED"
                    : result.atsSimulation.parseScore >= 50
                    ? "AT RISK"
                    : "FAILED"}
                </span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    result.atsSimulation.parseScore >= 70
                      ? "bg-emerald-500"
                      : result.atsSimulation.parseScore >= 50
                      ? "bg-amber-500"
                      : "bg-red-600"
                  }`}
                  style={{ width: `${result.atsSimulation.parseScore}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-zinc-300 font-medium">Keyword Density</span>
                <span className="text-amber-400 font-mono text-xs font-bold">
                  {result.scoreBreakdown.skillsAndKeywords.score} / {result.scoreBreakdown.skillsAndKeywords.max}
                </span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${
                      (result.scoreBreakdown.skillsAndKeywords.score /
                        result.scoreBreakdown.skillsAndKeywords.max) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-zinc-300 font-medium">Format &amp; Structure</span>
                <span
                  className={`font-mono text-xs font-bold ${
                    result.scoreBreakdown.atsCompatibility.score >= 15
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {result.scoreBreakdown.atsCompatibility.score >= 15 ? "CLEAN" : "CRITICAL"}
                </span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    result.scoreBreakdown.atsCompatibility.score >= 15
                      ? "bg-emerald-500"
                      : "bg-red-600"
                  }`}
                  style={{
                    width: `${
                      (result.scoreBreakdown.atsCompatibility.score /
                        result.scoreBreakdown.atsCompatibility.max) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Missing: <strong className="text-red-400">{result.atsSimulation.missingCriticalKeywords.length}</strong></span>
            <span>Match: <strong className="text-emerald-400">{result.atsSimulation.matchedKeywords.length}</strong></span>
          </div>
        </div>

        {/* Bento Cell 4: Impact Analysis & Interview Likelihood (4 cols) */}
        <div className="col-span-12 md:col-span-4 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <h2 className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest">
            Impact Analysis
          </h2>
          <div className="my-3">
            <div className="text-2xl font-black text-white italic">
              "{result.verdictTag}"
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Dampak kuantitatif &amp; aksi nyata:{" "}
              <strong className="text-zinc-200">
                {result.scoreBreakdown.impactAndMetrics.score} / {result.scoreBreakdown.impactAndMetrics.max}
              </strong>
            </p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between shadow-inner">
            <span className="text-xs text-zinc-400 uppercase font-bold">Interview Chance:</span>
            <span
              className={`text-sm font-black font-mono ${
                interviewProbability >= 70
                  ? "text-emerald-400"
                  : interviewProbability >= 40
                  ? "text-amber-400"
                  : "text-red-500"
              }`}
            >
              {interviewProbability}%
            </span>
          </div>
        </div>

        {/* Bento Cell 5: Immediate Fixes (4 cols) */}
        <div className="col-span-12 md:col-span-4 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <h2 className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-3">
            Immediate Fixes ({result.fatalRedFlags.length})
          </h2>
          <ul className="text-xs space-y-2.5">
            {result.fatalRedFlags.slice(0, 4).map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2 text-zinc-300">
                <span className="text-red-500 font-mono font-bold flex-shrink-0">[!]</span>
                <span className="line-clamp-1">{flag.title}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between">
            <span className="text-red-400 font-bold">Critical Severity</span>
            <button
              onClick={() => setActiveTab("redflags")}
              className="text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer"
            >
              Lihat Solusi →
            </button>
          </div>
        </div>

        {/* Bento Cell 6: Industry Benchmark Comparison (4 cols) */}
        <div className="col-span-12 md:col-span-4 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest">
              Industry Benchmark
            </h2>
            <BarChart3 className="w-4 h-4 text-red-400" />
          </div>

          <div className="flex items-end gap-1.5 h-20 px-1">
            <div className="w-full flex flex-col items-center gap-1">
              <div className="bg-zinc-800 w-full h-[78px] rounded-t opacity-40"></div>
            </div>
            <div className="w-full flex flex-col items-center gap-1">
              <div className="bg-zinc-800 w-full h-[88px] rounded-t opacity-40"></div>
            </div>
            <div className="w-full flex flex-col items-center gap-1">
              <div className="bg-zinc-800 w-full h-[68px] rounded-t opacity-40"></div>
            </div>
            {/* User Candidate Score */}
            <div className="w-full flex flex-col items-center gap-1">
              <div
                className="bg-red-600 w-full rounded-t border-t-2 border-red-400 transition-all duration-700 shadow-md shadow-red-900/50"
                style={{ height: `${Math.max(14, (result.overallScore / 100) * 80)}px` }}
              ></div>
            </div>
            <div className="w-full flex flex-col items-center gap-1">
              <div className="bg-zinc-800 w-full h-[62px] rounded-t opacity-40"></div>
            </div>
            <div className="w-full flex flex-col items-center gap-1">
              <div className="bg-zinc-800 w-full h-[55px] rounded-t opacity-40"></div>
            </div>
          </div>

          <div className="flex justify-between mt-2.5 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
            <span>Fintech</span>
            <span>Big Tech</span>
            <span>Startup</span>
            <span className="text-red-400 font-black">ANDA</span>
            <span>Agency</span>
            <span>Edtech</span>
          </div>
        </div>

        {/* Bento Cell 7: Full Action Command Bar (12 cols) */}
        <div className="col-span-12 bg-gradient-to-r from-red-600 to-red-700 border border-red-500/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-2xl shadow-red-950/60">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-black/25 flex items-center justify-center font-black shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight">
                Siap Rombak CV Menjadi Standar Top-Tier?
              </h3>
              <p className="text-xs text-red-100 font-medium">
                Gunakan wizard rewriter otomatis, optimalkan kata kunci ATS, dan konsultasi langsung dengan HR AI.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToDigitalFootprint && (
              <button
                onClick={onNavigateToDigitalFootprint}
                className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md border border-zinc-800 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-blue-400" /> Audit Jejak Digital
              </button>
            )}

            {onNavigateToGithubRoast && (
              <button
                onClick={onNavigateToGithubRoast}
                className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md border border-zinc-800 cursor-pointer"
              >
                <Github className="w-3.5 h-3.5 text-red-400" /> Roast GitHub
              </button>
            )}

            <button
              onClick={() => onOpenRewriter()}
              className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md border border-zinc-800 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" /> Rewrite Bullet Point
            </button>

            <button
              onClick={onOpenChat}
              className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md border border-zinc-800 cursor-pointer"
              id="open-hr-chat-btn"
            >
              <MessageSquare className="w-3.5 h-3.5 text-red-400" /> Tanya HR AI
            </button>

            <button
              onClick={() => exportReviewToPdf(result, targetRole)}
              className="px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-900 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              id="export-pdf-btn"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </button>

            <button
              onClick={handleCopyRoast}
              className="px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-900 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {copiedRoast ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          DETAILED BENTO ANALYSIS TABS SECTION
         ========================================= */}
      <div className="space-y-4 pt-4">
        {/* Navigation Bento Tabs */}
        <div className="flex overflow-x-auto pb-2 scrollbar-none gap-2 border-b border-zinc-800/80">
          <button
            onClick={() => setActiveTab("scores")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "scores"
                ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
                : "bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/90 border border-zinc-800/90"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> 5 Sub-Skor Audit
          </button>

          <button
            onClick={() => setActiveTab("redflags")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "redflags"
                ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
                : "bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/90 border border-zinc-800/90"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Fatal Red Flags ({result.fatalRedFlags.length})
          </button>

          <button
            onClick={() => setActiveTab("rewrites")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "rewrites"
                ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
                : "bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/90 border border-zinc-800/90"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Before vs After (STAR)
          </button>

          <button
            onClick={() => setActiveTab("ats")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "ats"
                ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
                : "bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/90 border border-zinc-800/90"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> ATS &amp; Keywords
          </button>

          <button
            onClick={() => setActiveTab("buzzwords")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "buzzwords"
                ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
                : "bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/90 border border-zinc-800/90"
            }`}
          >
            <Ban className="w-3.5 h-3.5 text-rose-400" /> Detoks Buzzword ({result.buzzwordAudit.length})
          </button>

          <button
            onClick={() => setActiveTab("sections")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "sections"
                ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
                : "bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/90 border border-zinc-800/90"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Kritik Per Bagian
          </button>

          <button
            onClick={() => setActiveTab("actionplan")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "actionplan"
                ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
                : "bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/90 border border-zinc-800/90"
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5 text-emerald-400" /> Action Plan
          </button>

          {result.sampleFullCvRewriteSnippet && (
            <button
              onClick={() => setActiveTab("polished")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "polished"
                  ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
                  : "bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/90 border border-zinc-800/90"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-teal-400" /> Draf CV Dipoles
            </button>
          )}
        </div>

        {/* Tab 1: Sub-scores Breakdown */}
        {activeTab === "scores" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries({
              "Dampak & Metrik Kuantitatif (Impact & Numbers)": result.scoreBreakdown.impactAndMetrics,
              "Kompatibilitas Format ATS (ATS Readability)": result.scoreBreakdown.atsCompatibility,
              "Kata Kerja Aksi & Kejelasan (Power Verbs)": result.scoreBreakdown.actionVerbsAndClarity,
              "Densitas Skill & Keyword Industri": result.scoreBreakdown.skillsAndKeywords,
              "Alur Karir & Relevansi Pengalaman": result.scoreBreakdown.careerStoryAndRelevance,
            }).map(([title, item]) => {
              const percentage = (item.score / item.max) * 100;
              const isGood = percentage >= 75;
              const isWarning = percentage >= 50 && percentage < 75;

              return (
                <div
                  key={title}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">{title}</h4>
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          isGood
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                            : isWarning
                            ? "bg-amber-950 text-amber-400 border border-amber-900"
                            : "bg-red-950 text-red-400 border border-red-900"
                        }`}
                      >
                        {item.score} / {item.max}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isGood ? "bg-emerald-500" : isWarning ? "bg-amber-500" : "bg-red-600"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">{item.feedback}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Fatal Red Flags */}
        {activeTab === "redflags" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-900 text-red-300 text-xs">
              <strong className="font-bold">Peringatan Rekruter:</strong> Kesalahan fatal ini adalah alasan utama CV Anda langsung dibuang dalam 6 detik pertama sebelum dibaca manusia.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.fatalRedFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Red Flag #{idx + 1}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                          flag.severity === "high"
                            ? "bg-red-600 text-white"
                            : flag.severity === "medium"
                            ? "bg-amber-600 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {flag.severity}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-100 mb-2">{flag.title}</h4>
                    <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{flag.explanation}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-emerald-300">
                    <span className="font-bold block text-emerald-400 mb-0.5">Solusi Standar Emas:</span>
                    {flag.fix}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Before vs After Rewriter (STAR / Formula X-Y-Z) */}
        {activeTab === "rewrites" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between">
              <span>
                💡 <strong>Formula Google X-Y-Z:</strong> "Berhasil mencapai [X], yang diukur dengan [Y], dengan melakukan [Z]".
              </span>
              <button
                onClick={() => onOpenRewriter()}
                className="px-3 py-1 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white transition flex items-center gap-1"
              >
                <Wand2 className="w-3.5 h-3.5" /> Rewriter Kustom
              </button>
            </div>

            <div className="space-y-4">
              {result.bulletPointRewrites.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-lg"
                >
                  {/* Original Weak Bullet */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                        <Ban className="w-3 h-3" /> Kalimat Asli Anda (Pasif / Lemah)
                      </span>
                      <button
                        onClick={() => onOpenRewriter(item.original)}
                        className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        <Wand2 className="w-3 h-3" /> Variasikan Lagi
                      </button>
                    </div>
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-xs sm:text-sm text-zinc-300 font-mono">
                      "{item.original}"
                    </div>
                    <p className="text-xs text-red-400 mt-1">
                      <strong>Alasan Gagal:</strong> {item.whyWeak}
                    </p>
                  </div>

                  {/* Improved STAR Bullet */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Versi Rekomendasi HR (Formula STAR & Google X-Y-Z)
                      </span>
                      <button
                        onClick={() => handleCopyBullet(item.improvedSTAR, idx)}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-[11px] font-semibold transition flex items-center gap-1"
                      >
                        {copiedBulletIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Tersalin!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Salin Kalimat
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-xs sm:text-sm text-emerald-200 font-medium leading-relaxed">
                      "{item.improvedSTAR}"
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      <strong>Mengapa ampuh:</strong> {item.impactExplained}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: ATS & Keywords */}
        {activeTab === "ats" && (
          <div className="space-y-4">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Simulasi Parser ATS (Workday / Greenhouse / Lever)
                </span>
                <h3 className="text-2xl font-black text-zinc-100 mt-1">
                  Estimasi Lolos Seleksi ATS:{" "}
                  <span
                    className={
                      result.atsSimulation.parseScore >= 75
                        ? "text-emerald-400"
                        : result.atsSimulation.parseScore >= 50
                        ? "text-amber-400"
                        : "text-red-500"
                    }
                  >
                    {result.atsSimulation.parseScore}%
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md">
                  Berdasarkan kesesuaian kata kunci untuk posisi <strong>{targetRole}</strong> dan keterbacaan struktur format.
                </p>
              </div>

              <div className="w-24 h-24 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center text-center p-2">
                <Cpu className="w-6 h-6 text-red-500 mb-1" />
                <span className="text-xs font-bold text-zinc-200">
                  {result.atsSimulation.parseScore >= 70 ? "ATS Friendly" : "Berisiko"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-lg">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Keyword Kunci yang Hilang (Wajib Ditambahkan)
                </h4>
                {result.atsSimulation.missingCriticalKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.atsSimulation.missingCriticalKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-red-950 border border-red-900 text-red-400 text-xs font-semibold"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400">Keyword utama sudah cukup lengkap.</p>
                )}
              </div>

              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-lg">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5" /> Keyword yang Berhasil Terdeteksi
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.atsSimulation.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-900 text-emerald-400 text-xs font-medium"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {result.atsSimulation.formattingRisks.length > 0 && (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-lg">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Risiko Layout & Format yang Merusak ATS
                </h4>
                <ul className="space-y-2 text-xs text-zinc-300">
                  {result.atsSimulation.formattingRisks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Buzzwords Detox */}
        {activeTab === "buzzwords" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
              Kata-kata klise seperti <em>"hardworking"</em>, <em>"fast learner"</em>, atau <em>"bertanggung jawab atas"</em> membuat CV Anda terdengar seperti jutaan kandidat medioker lainnya. Ganti dengan kata kerja aksi berdaya tinggi.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.buzzwordAudit.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-900 text-xs font-bold line-through">
                        "{item.word}"
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900 text-xs font-bold">
                        {item.replacement}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      <strong className="text-zinc-300">Mengapa jelek:</strong> {item.whyItSucks}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Section by Section Critique */}
        {activeTab === "sections" && (
          <div className="space-y-4">
            {Object.entries({
              "Header & Professional Summary": result.sectionBySectionCritique.headerAndSummary,
              "Pengalaman Kerja (Work Experience)": result.sectionBySectionCritique.workExperience,
              "Keahlian & Tools (Skills & Tech Stack)": result.sectionBySectionCritique.skillsAndTools,
              "Pendidikan & Sertifikasi (Education)": result.sectionBySectionCritique.educationAndCertifications,
              "Layout, Tipografi & Panjang Halaman": result.sectionBySectionCritique.layoutAndLength,
            }).map(([secTitle, data]) => (
              <div
                key={secTitle}
                className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-zinc-100">{secTitle}</h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-zinc-950 text-amber-400 border border-zinc-800">
                    Rating: {data.rating}
                  </span>
                </div>

                <p className="text-xs text-red-300 bg-red-950/40 p-3.5 rounded-xl border border-red-900/60 leading-relaxed">
                  <strong className="text-red-400">Roasting:</strong> {data.roast}
                </p>

                <p className="text-xs text-emerald-300 bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-900/60 leading-relaxed">
                  <strong className="text-emerald-400">Saran Perbaikan:</strong> {data.recommendation}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 7: Action Plan */}
        {activeTab === "actionplan" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
              Ikuti rencana aksi berurutan ini untuk mengubah CV Anda dari "Tong Sampah HR" menjadi "Shortlist Ready".
            </div>

            <div className="space-y-3">
              {result.stepByStepActionPlan.map((plan) => (
                <div
                  key={plan.step}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-lg flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                    {plan.step}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-zinc-100">{plan.action}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          plan.priority.includes("Darurat")
                            ? "bg-red-600 text-white"
                            : plan.priority.includes("Penting")
                            ? "bg-amber-600 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {plan.priority}
                      </span>
                    </div>

                    <div className="mt-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                      <strong className="text-emerald-400 block mb-0.5">Contoh Penerapan Nyata:</strong>
                      {plan.example}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 8: Polished Markdown Preview */}
        {activeTab === "polished" && result.sampleFullCvRewriteSnippet && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-400" />
                Contoh Draf CV yang Telah Dipoles Standar FAANG
              </h4>
              <button
                onClick={handleCopyMarkdown}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5"
              >
                {copiedMarkdown ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Salin Draf Lengkap
                  </>
                )}
              </button>
            </div>

            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto">
              <div className="space-y-3 prose prose-invert max-w-none text-xs sm:text-sm">
                <ReactMarkdown>
                  {result.sampleFullCvRewriteSnippet}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
