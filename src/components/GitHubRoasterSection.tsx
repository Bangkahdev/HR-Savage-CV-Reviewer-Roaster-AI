import React, { useState } from "react";
import {
  Flame,
  Code2,
  GitBranch,
  Terminal,
  AlertTriangle,
  Sparkles,
  RotateCcw,
  Check,
  Copy,
  Award,
  History,
  Briefcase,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Calendar,
  GitCommit,
  GitPullRequest,
  GitMerge,
  Star,
  MessageSquare,
  Bookmark,
  Users,
  Target,
  ArrowRight,
} from "lucide-react";
import { GitHubRoastRequest, GitHubRoastResult } from "../types";
import { safeFetchJson } from "../utils/api";

interface GitHubRoasterSectionProps {
  initialUsername?: string;
  initialTargetRole?: string;
  initialClaimedTechStack?: string;
}

export const GitHubRoasterSection: React.FC<GitHubRoasterSectionProps> = ({
  initialUsername = "",
  initialTargetRole = "",
  initialClaimedTechStack = "",
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [claimedTechStack, setClaimedTechStack] = useState(initialClaimedTechStack);
  const [manualRepoInfo, setManualRepoInfo] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GitHubRoastResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedRoast, setCopiedRoast] = useState(false);

  const isTargetedModeActive = Boolean(targetRole.trim() || claimedTechStack.trim() || manualRepoInfo.trim());

  const handleFillSample = (type: "junior" | "senior") => {
    if (type === "junior") {
      setUsername("alex-dev-starter");
      setTargetRole("Senior Frontend Developer");
      setClaimedTechStack("React, Next.js, Microservices, Kubernetes, TypeScript, GraphQL");
      setManualRepoInfo("Repos:\n- todo-app-react (dibuat 2 tahun lalu, 2 commits: 'first commit', 'fix')\n- netflix-clone (copy-paste dari youtube tutorial)\n- weather-app-js (pake openweathermap gratisan)\n- portfolio-v1, portfolio-v2, portfolio-v3 (semuanya template html css bootstrap)\n- fork repo create-react-app (tidak pernah ada commit tambahan)");
    } else {
      setUsername("torvalds");
      setTargetRole("");
      setClaimedTechStack("");
      setManualRepoInfo("");
    }
    setErrorMessage(null);
  };

  const handleResetForm = () => {
    setUsername("");
    setTargetRole("");
    setClaimedTechStack("");
    setManualRepoInfo("");
    setErrorMessage(null);
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() && !manualRepoInfo.trim()) {
      setErrorMessage("Silakan masukkan username GitHub atau daftar repositori Anda.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: GitHubRoastRequest = {
        username: username.trim(),
        targetRole: targetRole.trim(),
        claimedTechStack: claimedTechStack.trim(),
        manualRepoInfo: manualRepoInfo.trim(),
        language: "id",
      };

      const res = await safeFetchJson<GitHubRoastResult>("/api/roast-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || "Gagal me-roast profil GitHub.");
      }

      setResult(res.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Terjadi kesalahan saat mengevaluasi GitHub.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyRoast = () => {
    if (!result) return;
    navigator.clipboard.writeText(
      `[GITHUB DEEP SCAN & ROAST - @${result.username} - Skor Dev: ${result.devScore}/100 - Tier: ${result.devTier}]\nVerdict: ${result.verdictTag}\nHR Decision: ${result.hrVerdict?.hiringDecision || "N/A"}\n\n"${result.brutalRoast}"`
    );
    setCopiedRoast(true);
    setTimeout(() => setCopiedRoast(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Soft Hero Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 soft-shadow-lg page-fade relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Terminal className="w-48 h-48 text-coral-200" />
        </div>

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-50 border border-coral-200 text-coral-700 text-xs font-black uppercase tracking-widest mb-4">
            <Terminal className="w-3.5 h-3.5" />
            GitHub Deep Scanner & AI Roaster
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
            GitHub Roasted <span className="text-coral-600">• Full Profile & Career Audit</span>
          </h1>
          <p className="mt-3 text-slate-600 text-sm leading-relaxed">
            Pemindaian menyeluruh akun GitHub Anda: <strong className="text-slate-800">HR Decision & Negosiasi Gaji</strong>, <strong className="text-slate-800">History & Streak Commit</strong>, <strong className="text-slate-800">Achievements & Badges</strong>, serta <strong className="text-slate-800">Roadmap Saran Aksi Karir Masa Depan</strong>.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 flex-shrink-0">
          <button type="button" onClick={() => handleFillSample("junior")} className="px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-coral-600 font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm soft-btn">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Contoh Tutorial Hell
          </button>
          <button type="button" onClick={() => handleFillSample("senior")} className="px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-emerald-600 font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm soft-btn">
            <Zap className="w-3.5 h-3.5 text-emerald-400" /> Contoh Senior Chad
          </button>
          {(username || manualRepoInfo || claimedTechStack) && (
            <button type="button" onClick={handleResetForm} className="px-3.5 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-500 font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer soft-btn">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-coral-50 border border-coral-200 text-coral-800 text-xs flex items-center gap-3 soft-shadow">
          <AlertTriangle className="w-4 h-4 text-coral-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {result ? (
        <div className="space-y-6">
          {/* Mode Notice */}
          <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl backdrop-blur-xl ${result.auditMode === "targeted_role" ? "bg-amber-50 border-amber-200/60 text-amber-800" : "bg-blue-50 border-blue-200/60 text-blue-800"}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${result.auditMode === "targeted_role" ? "bg-amber-100 border border-amber-200 text-amber-600" : "bg-blue-100 border border-blue-200 text-blue-600"}`}>
                {result.auditMode === "targeted_role" ? <Target className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest block opacity-75">{result.auditMode === "targeted_role" ? "Targeted Role & CV Cross-Check Mode" : "Holistic Comprehensive Profile Audit Mode"}</span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">{result.auditMode === "targeted_role" ? `Fokus Evaluasi: Target Posisi "${result.targetRoleEvaluated}" & Validasi Klaim CV` : `Audit Menyeluruh: Role Terdeteksi dari Kode: "${result.detectedDeveloperRole || "Software Engineer"}"`}</p>
              </div>
            </div>
            <button onClick={() => setResult(null)} className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 transition flex items-center gap-1.5 cursor-pointer self-end sm:self-auto soft-btn"><RotateCcw className="w-3.5 h-3.5" /> Ganti Parameter</button>
          </div>

          {/* Top Hero Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Dev Score */}
            <div className="col-span-12 md:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-center items-center text-center soft-shadow-lg page-fade relative overflow-hidden group">
              <div className="absolute inset-0 bg-coral-50/50 opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none"></div>
              {result.avatarUrl && (
                <img src={result.avatarUrl} alt={result.username} className="w-16 h-16 rounded-full border-2 border-coral-500/60 mb-3 shadow-sm object-cover z-10 relative" referrerPolicy="no-referrer" />
              )}
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 z-10 relative">Developer Score</span>
              <div className="text-4xl sm:text-5xl font-black text-coral-600 tracking-tight z-10 relative">{result.devScore}<span className="text-xl text-slate-400 font-bold">/100</span></div>
              <div className="mt-3 px-3.5 py-1 text-[11px] font-black rounded-full bg-coral-50 text-coral-700 border border-coral-200/60 uppercase tracking-wider shadow-sm z-10 relative">{result.devTier}</div>
            </div>

            {/* Roast */}
            <div className="col-span-12 md:col-span-6 bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 relative overflow-hidden soft-shadow-lg page-fade flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none"><Flame className="w-32 h-32 text-coral-200" /></div>
              <div className="z-10 relative">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200/80">
                  <h2 className="text-xs sm:text-sm font-black flex items-center gap-2 text-slate-900 uppercase tracking-widest"><span className="bg-coral-500 w-1.5 h-4 rounded-full"></span> VONIS TECH LEAD &amp; LEAD ARCHITECT</h2>
                  <span className="text-[11px] font-mono text-coral-600 font-bold">@{result.username}</span>
                </div>
                <p className="text-base sm:text-lg font-normal italic leading-relaxed text-slate-600 mb-5">"{result.brutalRoast}"</p>
              </div>
              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 z-10 relative">
                <span className="text-coral-600 font-bold flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> {result.verdictTag}</span>
                <button onClick={handleCopyRoast} className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200 soft-btn">{copiedRoast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}{copiedRoast ? "Tersalin!" : "Salin Roast"}</button>
              </div>
            </div>

            {/* Metrics */}
            <div className="col-span-12 md:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-7 soft-shadow-lg page-fade flex flex-col justify-between">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Live Stats &amp; Hygiene</span>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-500 mb-1.5"><span>Commit Consistency:</span><span className="font-mono font-bold text-coral-600">{result.metricsAudit.commitConsistencyScore}%</span></div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden border border-slate-300/40"><div className="bg-coral-500 h-full rounded-full transition-all duration-700" style={{ width: `${result.metricsAudit.commitConsistencyScore}%` }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-500 mb-1.5"><span>README Quality:</span><span className="font-mono font-bold text-amber-600">{result.metricsAudit.readmeQualityScore}%</span></div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden border border-slate-300/40"><div className="bg-amber-500 h-full rounded-full transition-all duration-700" style={{ width: `${result.metricsAudit.readmeQualityScore}%` }} /></div>
                </div>
                <div className="pt-2.5 border-t border-slate-200/80 text-[11px] text-slate-400 grid grid-cols-2 gap-1.5">
                  <div>Repos: <strong className="text-slate-800 font-mono">{result.metricsAudit.repoCount}</strong></div>
                  <div>Stars: <strong className="text-slate-800 font-mono">{result.metricsAudit.starsTotal}</strong></div>
                  <div>Followers: <strong className="text-slate-800 font-mono">{result.metricsAudit.followersCount ?? 0}</strong></div>
                  <div>Forks: <strong className="text-slate-800 font-mono">{result.metricsAudit.forksTotal ?? 0}</strong></div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate">Top Stack: {result.metricsAudit.topLanguages?.slice(0, 3).join(", ") || "General"}</div>
              </div>
            </div>
          </div>

          {/* HR Verdict */}
          {result.hrVerdict && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 soft-shadow-lg page-fade space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><Briefcase className="w-4 h-4 text-coral-400" /> Audit HR &amp; Dampak Negosiasi Gaji (Hiring Decision)</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">Keputusan:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${result.hrVerdict.hiringDecision === "STRONG_HIRE" ? "bg-emerald-100 text-emerald-800 border border-emerald-200/60" : result.hrVerdict.hiringDecision === "CONSIDER" ? "bg-blue-100 text-blue-800 border border-blue-200/60" : result.hrVerdict.hiringDecision === "INTERN_MATERIAL" ? "bg-amber-100 text-amber-800 border border-amber-200/60" : "bg-coral-100 text-coral-800 border border-coral-200/60"}`}>{result.hrVerdict.hiringDecision}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
                <div className="md:col-span-5 p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 flex flex-col justify-between soft-shadow">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-1">Dampak Penawaran Gaji (Offer Leverage)</span>
                    <p className="text-xs text-slate-500 leading-relaxed italic">"{result.hrVerdict.salaryNegotiationImpact}"</p>
                  </div>
                  <div className="pt-3 border-t border-slate-200/80">
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5"><span>Peluang Lolos Technical Interview:</span><span className="font-mono font-bold text-coral-600">{result.hrVerdict.interviewSurvivability}%</span></div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden border border-slate-300/40"><div className="bg-gradient-to-r from-coral-500 to-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${result.hrVerdict.interviewSurvivability}%` }} /></div>
                  </div>
                </div>
                <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-3xl bg-coral-50/20 border border-coral-200/40 space-y-2">
                    <h4 className="text-xs font-black text-coral-600 uppercase tracking-wider flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-coral-500" /> HR Red Flags Terdeteksi</h4>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">{result.hrVerdict.hrRedFlags?.map((flag, idx) => (<li key={idx} className="leading-relaxed">{flag}</li>))}</ul>
                  </div>
                  <div className="p-4 rounded-3xl bg-emerald-50/20 border border-emerald-200/40 space-y-2">
                    <h4 className="text-xs font-black text-emerald-600 uppercase tracking-wider flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> HR Green Flags (Kelebihan)</h4>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">{result.hrVerdict.hrGreenFlags?.map((flag, idx) => (<li key={idx} className="leading-relaxed">{flag}</li>))}</ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Spectrum */}
          {result.activityBreakdown && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 soft-shadow-lg page-fade space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /> Audit Seluruh Spektrum Aktivitas Developer (PR, Merge, Issues, Stars &amp; Diskusi)</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">Community Engagement:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${["A+", "A"].includes(result.activityBreakdown.communityEngagementGrade) ? "bg-emerald-100 text-emerald-800 border border-emerald-200/60" : ["B", "C"].includes(result.activityBreakdown.communityEngagementGrade) ? "bg-amber-100 text-amber-800 border border-amber-200/60" : "bg-coral-100 text-coral-800 border border-coral-200/60"}`}>Grade {result.activityBreakdown.communityEngagementGrade}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-1 soft-shadow">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><GitPullRequest className="w-3.5 h-3.5 text-purple-400" /> Pull Requests</span>
                  <div className="text-lg font-black text-purple-300 font-mono">{result.activityBreakdown.pullRequestsCount} <span className="text-xs text-slate-500 font-normal">Events</span></div>
                  <div className="text-[10px] text-slate-400">Merged: <strong className="text-emerald-400 font-mono">{result.activityBreakdown.mergedPRsCount} PR</strong></div>
                </div>
                <div className="p-4 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-1 soft-shadow">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><GitMerge className="w-3.5 h-3.5 text-emerald-400" /> Merged PRs</span>
                  <div className="text-lg font-black text-emerald-400 font-mono">{result.activityBreakdown.mergedPRsCount} <span className="text-xs text-slate-500 font-normal">Merged</span></div>
                  <div className="text-[10px] text-slate-400">Tingkat Sukses: <strong className="text-slate-800 font-mono">{result.activityBreakdown.pullRequestsCount > 0 ? `${Math.round((result.activityBreakdown.mergedPRsCount / result.activityBreakdown.pullRequestsCount) * 100)}%` : "0%"}</strong></div>
                </div>
                <div className="p-4 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-1 soft-shadow">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Issues &amp; Tiket</span>
                  <div className="text-lg font-black text-amber-300 font-mono">{result.activityBreakdown.openIssuesCount} <span className="text-xs text-slate-500 font-normal">Events</span></div>
                  <div className="text-[10px] text-slate-400">Keterlibatan Diskusi Bug/Fitur</div>
                </div>
                <div className="p-4 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-1 soft-shadow">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400" /> Starred Repos</span>
                  <div className="text-lg font-black text-yellow-300 font-mono">{result.activityBreakdown.starredReposCount} <span className="text-xs text-slate-500 font-normal">Repo</span></div>
                  <div className="text-[10px] text-slate-400">Kurasi &amp; Minat Tech Stack</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-slate-50/90 border border-slate-200/80 space-y-2 soft-shadow">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5"><Bookmark className="w-3.5 h-3.5 text-cyan-400" /> Evaluasi Forking &amp; Kolaborasi Eksternal</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{result.activityBreakdown.forksGivenOrReceived}</p>
                </div>
                <div className="p-4 rounded-3xl bg-slate-50/90 border border-slate-200/80 space-y-2 soft-shadow">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-indigo-400" /> Code Reviews &amp; Keterlibatan Diskusi Komunitas</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{result.activityBreakdown.codeReviewAndDiscussions}</p>
                </div>
              </div>
              <div className="p-4.5 rounded-3xl bg-orange-50/20 border border-orange-200/40 text-xs text-slate-600 space-y-1 soft-shadow">
                <strong className="text-orange-600 uppercase text-[10px] font-black flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" /> Vonis Roasting Spektrum Aktivitas HR:</strong>
                <p className="italic leading-relaxed">"{result.activityBreakdown.activitySummaryRoast}"</p>
              </div>
            </div>
          )}

          {/* History */}
          {result.historyAudit && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 soft-shadow-lg page-fade space-y-4">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-slate-200/80"><History className="w-4 h-4 text-amber-400" /> Audit History Aktivitas, Streak &amp; Kontribusi</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-1 soft-shadow">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> Usia Akun</span>
                  <div className="text-sm font-bold text-slate-900">{result.historyAudit.accountAge}</div>
                </div>
                <div className="p-4 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-1 soft-shadow">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><TrendingUp className="w-3 h-3 text-amber-400" /> Peak Activity</span>
                  <div className="text-xs text-slate-600 leading-snug">{result.historyAudit.peakActivityPeriod}</div>
                </div>
                <div className="p-4 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-1 soft-shadow">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><GitCommit className="w-3 h-3 text-coral-400" /> Dormancy / Hiatus</span>
                  <div className="text-xs text-slate-600 leading-snug">{result.historyAudit.dormancyWarning}</div>
                </div>
                <div className="p-4 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-1 soft-shadow">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><GitPullRequest className="w-3 h-3 text-emerald-400" /> PR &amp; Open Source</span>
                  <div className="text-xs text-slate-600 leading-snug">{result.historyAudit.prAndIssuesRoast}</div>
                </div>
              </div>
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 italic soft-shadow"><strong className="text-coral-600 not-italic block uppercase text-[10px] font-black mb-1">Komentar Commit Streak &amp; Green Squares:</strong>"{result.historyAudit.commitStreakRoast}"</div>
            </div>
          )}

          {/* Achievements */}
          {result.achievementsAudit && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 soft-shadow-lg page-fade space-y-4">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-slate-200/80"><Award className="w-4 h-4 text-amber-400" /> Audit Achievements &amp; Developer Badges</h3>
              {Array.isArray(result.achievementsAudit) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {result.achievementsAudit.map((ach, idx) => (
                    <div key={idx} className={`p-4 rounded-3xl border flex flex-col justify-between space-y-2 ${ach.status === "UNLOCKED" ? "bg-emerald-50/20 border-emerald-200/50 text-emerald-800" : ach.status === "FAILED" ? "bg-coral-50/20 border-coral-200/50 text-coral-800" : "bg-slate-50/60 border-slate-200 text-slate-500"}`}>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{ach.badge || "🏆"}</span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${ach.status === "UNLOCKED" ? "bg-emerald-100 text-emerald-400" : ach.status === "FAILED" ? "bg-coral-100 text-coral-400" : "bg-slate-200 text-slate-400"}`}>{ach.status}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mb-1">{ach.title}</h4>
                        <p className="text-[11px] text-slate-500 mb-2">{ach.description}</p>
                      </div>
                      <p className="text-[11px] italic pt-2 border-t border-slate-200/60 text-slate-500">"{ach.roastComment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 soft-shadow">
                  <div className="text-amber-600 font-bold">Reputasi: {result.achievementsAudit.reputationTier || "General"}</div>
                  <p>{result.achievementsAudit.starsVsForksRatioRoast || result.achievementsAudit.communityInfluence}</p>
                </div>
              )}
            </div>
          )}

          {/* Diagnostic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 soft-shadow-lg page-fade flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/80">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Tutorial Hell</h3>
                  <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${result.roastCategories.tutorialHellDiagnosis.status === "severe" ? "bg-coral-600 text-white" : result.roastCategories.tutorialHellDiagnosis.status === "warning" ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"}`}>{result.roastCategories.tutorialHellDiagnosis.status}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{result.roastCategories.tutorialHellDiagnosis.explanation}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 soft-shadow-lg page-fade flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/80">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Code Smells</h3>
                  <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${result.roastCategories.codeSmellAndQuality.status === "severe" ? "bg-coral-600 text-white" : result.roastCategories.codeSmellAndQuality.status === "warning" ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"}`}>{result.roastCategories.codeSmellAndQuality.status}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{result.roastCategories.codeSmellAndQuality.explanation}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 soft-shadow-lg page-fade flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/80">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Commit Habits</h3>
                  <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${result.roastCategories.commitHabitsAndMessages.status === "severe" ? "bg-coral-600 text-white" : result.roastCategories.commitHabitsAndMessages.status === "warning" ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"}`}>{result.roastCategories.commitHabitsAndMessages.status}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{result.roastCategories.commitHabitsAndMessages.explanation}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 soft-shadow-lg page-fade flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/80">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Kesesuaian Stack</h3>
                  <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${result.roastCategories.techStackVsCvAlignment.status === "fake" ? "bg-coral-600 text-white" : result.roastCategories.techStackVsCvAlignment.status === "questionable" ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"}`}>{result.roastCategories.techStackVsCvAlignment.status}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{result.roastCategories.techStackVsCvAlignment.explanation}</p>
              </div>
            </div>
          </div>

          {/* Repo Teardowns */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 soft-shadow-lg page-fade space-y-4">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-slate-200/80"><Code2 className="w-4 h-4 text-coral-500" /> Bedah Repositori Publik ({result.repoTeardowns.length} Repositories)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.repoTeardowns.map((repo, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between soft-shadow">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-mono text-sm font-bold text-coral-600 flex items-center gap-1.5"><GitBranch className="w-3.5 h-3.5" /> {repo.repoName}</div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600">{repo.verdict}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">{repo.techStack.map((tech, tIdx) => (<span key={tIdx} className="px-2 py-0.5 rounded-xl bg-slate-200 text-slate-500 text-[10px] font-mono border border-slate-300">{tech}</span>))}</div>
                    <p className="text-xs text-slate-600 italic mb-2">"{repo.roast}"</p>
                  </div>
                  <div className="p-3.5 rounded-3xl bg-slate-200 border border-slate-300 text-xs text-emerald-600 shadow-inner"><strong className="text-emerald-700 block text-[10px] uppercase font-bold mb-0.5">Solusi Perbaikan:</strong>{repo.howToFix}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Blueprint */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 soft-shadow-lg page-fade space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /> Blueprint Upgrade Portofolio Standar Silicon Valley / Unicorn</h3>
              <span className="text-xs text-coral-600 font-mono font-bold">Anti Tutorial Hell</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.portfolioUpgradeBlueprint.map((proj, idx) => (
                <div key={idx} className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3 soft-shadow">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-coral-600 block mb-1">Proyek Rekomendasi #{idx + 1}</span>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">{proj.projectName}</h4>
                    <div className="p-3 rounded-3xl bg-slate-200 border border-slate-300 text-xs text-slate-600 font-mono mb-2 shadow-inner"><strong className="text-slate-500 block text-[10px] uppercase mb-0.5">Arsitektur:</strong>{proj.architectureSuggested}</div>
                  </div>
                  <p className="text-xs text-slate-500 pt-2.5 border-t border-slate-200/80"><strong className="text-amber-600">Kenapa disukai HR:</strong> {proj.whyRecruitersLoveIt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Roadmap */}
          {result.futureCareerRoadmap && result.futureCareerRoadmap.length > 0 && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 soft-shadow-lg page-fade space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4 text-emerald-400" /> Saran &amp; Roadmap Karir Masa Depan (Future Action Plan)</h3>
                <span className="text-xs text-emerald-600 font-mono font-bold">Langkah Konkret</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.futureCareerRoadmap.map((phase, idx) => (
                  <div key={idx} className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-4 soft-shadow">
                    <div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-200 text-emerald-600 border border-slate-300 text-[10px] font-bold uppercase tracking-wider block w-fit mb-2">{phase.timeframe}</span>
                      <h4 className="text-sm font-bold text-slate-900 mb-3">{phase.milestoneTitle}</h4>
                      <ul className="space-y-2 text-xs text-slate-600">{phase.actionItems?.map((action, aIdx) => (<li key={aIdx} className="flex items-start gap-2"><ArrowRight className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" /><span>{action}</span></li>))}</ul>
                    </div>
                    <div className="p-3 rounded-3xl bg-emerald-50/30 border border-emerald-200/50 text-[11px] text-emerald-600"><strong className="block text-emerald-700 uppercase font-bold text-[10px] mb-0.5">Expected Impact:</strong>{phase.expectedImpact}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center pt-4">
            <button onClick={() => setResult(null)} className="px-6 py-3 rounded-3xl bg-slate-50/90 hover:bg-slate-100 border border-slate-200/80 text-slate-600 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 mx-auto cursor-pointer shadow-lg soft-btn"><RotateCcw className="w-4 h-4" /> Roast Akun GitHub Lain</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 soft-shadow-lg page-fade space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><span className="bg-coral-500 w-1.5 h-4 rounded-full"></span> Parameter Audit Profil GitHub</h2>
              <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 border transition-all ${isTargetedModeActive ? "bg-amber-50 border-amber-200/60 text-amber-700" : "bg-blue-50 border-blue-200/60 text-blue-700"}`}>
                {isTargetedModeActive ? (<><Target className="w-3.5 h-3.5 text-amber-500" /><span>Mode: Targeted Role &amp; CV Cross-Check</span></>) : (<><Sparkles className="w-3.5 h-3.5 text-blue-500" /><span>Mode: Audit Holistik Menyeluruh (Username Saja)</span></>)}
              </div>
            </div>
            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${isTargetedModeActive ? "bg-amber-50 border-amber-200/40 text-slate-700" : "bg-blue-50 border-blue-200/40 text-slate-700"}`}>
              {isTargetedModeActive ? (<span><strong className="text-amber-600 font-bold">🎯 Fokus Khusus:</strong> Karena Anda mengisi Target Posisi, Klaim CV, atau Daftar Repo, AI akan secara tajam memvalidasi kecocokan posisi, menguji kebenaran klaim tech stack CV Anda vs data commit GitHub, dan membedah repo yang Anda sebutkan.</span>) : (<span><strong className="text-blue-600 font-bold">🔍 Audit Menyeluruh:</strong> Anda hanya memasukkan username. AI akan melakukan pemindaian komprehensif pada seluruh profil, mendeteksi arsitektur/spesialisasi Anda secara mandiri, dan menilai kematangan portofolio Anda secara objektif.</span>)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between"><span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5 text-coral-400" /> Username GitHub (Wajib)</span><span className="text-[10px] text-coral-600 font-mono">*Harus ada</span></label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Contoh: torvalds atau github.com/username" className="w-full px-4 py-2.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-coral-400 focus-ring-soft font-mono shadow-inner" />
                <p className="mt-1 text-[10px] text-slate-500">Cukup isi ini saja jika ingin audit menyeluruh &amp; deteksi peran otomatis.</p>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between"><span>Target Posisi / Karir Impian</span><span className="text-[10px] text-slate-500 font-mono">Opsional</span></label>
                <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Kosongkan untuk deteksi otomatis, atau isi misal: Backend Go Lead" className="w-full px-4 py-2.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus-ring-soft shadow-inner" />
                <p className="mt-1 text-[10px] text-slate-500">Isi jika ingin audit ditargetkan ke posisi tertentu.</p>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between"><span>Klaim Tech Stack pada CV</span><span className="text-[10px] text-slate-500 font-mono">Opsional</span></label>
              <input type="text" value={claimedTechStack} onChange={(e) => setClaimedTechStack(e.target.value)} placeholder="Contoh: React, Node.js, TypeScript, Go, PostgreSQL" className="w-full px-4 py-2.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus-ring-soft shadow-inner" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Informasi Tambahan Repositori (Opsional)</label>
              <textarea value={manualRepoInfo} onChange={(e) => setManualRepoInfo(e.target.value)} placeholder="Daftarkan nama repo dan deskripsi singkat yang ingin Anda bedah secara mendalam..." className="w-full h-24 p-3.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-coral-400 focus-ring-soft font-mono resize-none shadow-inner" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-5 rounded-3xl bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-coral-200/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 hover:scale-[1.01] soft-btn">{isLoading ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>HR SEDANG ME-ROAST GITHUB ANDA...</span></>) : (<><Flame className="w-4 h-4 animate-pulse" /><span>JALANKAN GITHUB ROASTER SEKARANG</span></>)}</button>
          </div>
        </form>
      )}
    </div>
  );
};


