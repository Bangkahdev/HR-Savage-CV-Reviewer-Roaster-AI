import React, { useState } from "react";
import {
  Flame,
  Code2,
  GitBranch,
  Terminal,
  Cpu,
  AlertTriangle,
  Sparkles,
  RotateCcw,
  Check,
  Copy,
  ExternalLink,
  BookOpen,
  Layers,
  Award,
  History,
  Briefcase,
  TrendingUp,
  UserCheck,
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

  const isTargetedModeActive = Boolean(
    targetRole.trim() || claimedTechStack.trim() || manualRepoInfo.trim()
  );

  const handleFillSample = (type: "junior" | "senior") => {
    if (type === "junior") {
      setUsername("alex-dev-starter");
      setTargetRole("Senior Frontend Developer");
      setClaimedTechStack("React, Next.js, Microservices, Kubernetes, TypeScript, GraphQL");
      setManualRepoInfo(
        "Repos:\n- todo-app-react (dibuat 2 tahun lalu, 2 commits: 'first commit', 'fix')\n- netflix-clone (copy-paste dari youtube tutorial)\n- weather-app-js (pake openweathermap gratisan)\n- portfolio-v1, portfolio-v2, portfolio-v3 (semuanya template html css bootstrap)\n- fork repo create-react-app (tidak pernah ada commit tambahan)"
      );
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
      `[GITHUB DEEP SCAN & ROAST - @${result.username} - Skor Dev: ${result.devScore}/100 - Tier: ${result.devTier}]\nVerdict: ${result.verdictTag}\nHR Decision: ${result.hrVerdict?.hiringDecision || 'N/A'}\n\n"${result.brutalRoast}"`
    );
    setCopiedRoast(true);
    setTimeout(() => setCopiedRoast(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Terminal className="w-48 h-48 text-red-500" />
        </div>

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-red-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Terminal className="w-3.5 h-3.5" />
            GitHub Deep Scanner &amp; AI Roaster
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase">
            GitHub Roasted • <span className="text-red-500">Full Profile &amp; Career Audit</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Pemindaian menyeluruh akun GitHub Anda: <strong>HR Decision &amp; Negosiasi Gaji</strong>, <strong>History &amp; Streak Commit</strong>, <strong>Achievements &amp; Badges</strong>, serta <strong>Roadmap Saran Aksi Karir Masa Depan</strong>.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => handleFillSample("junior")}
            className="px-4 py-2.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs text-red-400 font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:border-red-500/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Contoh Tutorial Hell
          </button>
          <button
            type="button"
            onClick={() => handleFillSample("senior")}
            className="px-4 py-2.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs text-emerald-400 font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:border-emerald-500/40"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" /> Contoh Senior Chad
          </button>
          {(username || manualRepoInfo || claimedTechStack) && (
            <button
              type="button"
              onClick={handleResetForm}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-xs flex items-center gap-3 shadow-xl">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Result View (Comprehensive Bento Grid) */}
      {result ? (
        <div className="space-y-6">
          {/* Active Mode Notice Banner */}
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl backdrop-blur-xl ${
              result.auditMode === "targeted_role"
                ? "bg-amber-950/40 border-amber-800/80 text-amber-300"
                : "bg-blue-950/40 border-blue-800/80 text-blue-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${
                  result.auditMode === "targeted_role" ? "bg-amber-950 border border-amber-700 text-amber-400" : "bg-blue-950 border border-blue-700 text-blue-400"
                }`}
              >
                {result.auditMode === "targeted_role" ? <Target className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest block opacity-75">
                  {result.auditMode === "targeted_role"
                    ? "Targeted Role & CV Cross-Check Mode"
                    : "Holistic Comprehensive Profile Audit Mode"}
                </span>
                <p className="text-xs sm:text-sm font-bold text-zinc-100">
                  {result.auditMode === "targeted_role"
                    ? `Fokus Evaluasi: Target Posisi "${result.targetRoleEvaluated}" & Validasi Klaim CV`
                    : `Audit Menyeluruh: Role Terdeteksi dari Kode: "${result.detectedDeveloperRole || 'Software Engineer'}"`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setResult(null)}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 transition flex items-center gap-1.5 cursor-pointer self-end sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Ganti Parameter
            </button>
          </div>

          {/* Top Hero Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Bento 1: Dev Score & Tier */}
            <div className="col-span-12 md:col-span-3 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-2xl backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-radial-gradient opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
              
              {result.avatarUrl && (
                <img
                  src={result.avatarUrl}
                  alt={result.username}
                  className="w-16 h-16 rounded-full border-2 border-red-500/60 mb-3 shadow-lg object-cover"
                  referrerPolicy="no-referrer"
                />
              )}

              <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">
                Developer Score
              </span>
              <div className="text-5xl sm:text-6xl font-black text-red-500 tracking-tight glow-red">
                {result.devScore}
                <span className="text-xl text-zinc-600 font-bold">/100</span>
              </div>
              <div className="mt-3 px-3.5 py-1 text-[11px] font-black rounded-full bg-red-950/80 text-red-400 border border-red-800/80 uppercase tracking-wider shadow-sm">
                {result.devTier}
              </div>
            </div>

            {/* Bento 2: The Savage Tech Lead Roast */}
            <div className="col-span-12 md:col-span-6 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Flame className="w-32 h-32 text-red-500" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
                  <h2 className="text-xs sm:text-sm font-black flex items-center gap-2 text-zinc-100 uppercase tracking-widest">
                    <span className="bg-red-500 w-1.5 h-4 rounded-full"></span>
                    VONIS TECH LEAD &amp; LEAD ARCHITECT
                  </h2>
                  <span className="text-[11px] font-mono text-red-400 font-bold">
                    @{result.username}
                  </span>
                </div>

                <p className="text-base sm:text-lg font-normal italic leading-relaxed text-zinc-200 mb-4">
                  "{result.brutalRoast}"
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> {result.verdictTag}
                </span>
                <button
                  onClick={handleCopyRoast}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-zinc-800"
                >
                  {copiedRoast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  {copiedRoast ? "Tersalin!" : "Salin Roast"}
                </button>
              </div>
            </div>

            {/* Bento 3: Code Metrics & Hygiene */}
            <div className="col-span-12 md:col-span-3 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
              <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-2">
                Live Stats &amp; Hygiene
              </span>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>Commit Consistency:</span>
                    <span className="font-mono font-bold text-red-400">
                      {result.metricsAudit.commitConsistencyScore}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="bg-red-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${result.metricsAudit.commitConsistencyScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>README Quality:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {result.metricsAudit.readmeQualityScore}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${result.metricsAudit.readmeQualityScore}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2.5 border-t border-zinc-800/80 text-[11px] text-zinc-400 grid grid-cols-2 gap-1.5">
                  <div>Repos: <strong className="text-zinc-200 font-mono">{result.metricsAudit.repoCount}</strong></div>
                  <div>Stars: <strong className="text-zinc-200 font-mono">{result.metricsAudit.starsTotal}</strong></div>
                  <div>Followers: <strong className="text-zinc-200 font-mono">{result.metricsAudit.followersCount ?? 0}</strong></div>
                  <div>Forks: <strong className="text-zinc-200 font-mono">{result.metricsAudit.forksTotal ?? 0}</strong></div>
                </div>
                
                <div className="text-[10px] text-zinc-500 font-mono truncate">
                  Top Stack: {result.metricsAudit.topLanguages?.slice(0, 3).join(", ") || "General"}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: HR RECRUITER VERDICT & SALARY NEGOTIATION IMPACT */}
          {result.hrVerdict && (
            <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-2">
                <h3 className="text-xs sm:text-sm font-black text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-red-400" />
                  Audit HR &amp; Dampak Negosiasi Gaji (Hiring Decision)
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-bold">Keputusan:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      result.hrVerdict.hiringDecision === "STRONG_HIRE"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : result.hrVerdict.hiringDecision === "CONSIDER"
                        ? "bg-blue-950 text-blue-300 border border-blue-800"
                        : result.hrVerdict.hiringDecision === "INTERN_MATERIAL"
                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                        : "bg-red-950 text-red-400 border border-red-800"
                    }`}
                  >
                    {result.hrVerdict.hiringDecision}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
                {/* Left: Salary & Interview Survivability */}
                <div className="md:col-span-5 p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                      Dampak Penawaran Gaji (Offer Leverage)
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed italic">
                      "{result.hrVerdict.salaryNegotiationImpact}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80">
                    <div className="flex justify-between text-xs text-zinc-300 mb-1.5">
                      <span>Peluang Lolos Technical Interview:</span>
                      <span className="font-mono font-bold text-red-400">
                        {result.hrVerdict.interviewSurvivability}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="bg-gradient-to-r from-red-600 to-emerald-500 h-full rounded-full transition-all duration-700"
                        style={{ width: `${result.hrVerdict.interviewSurvivability}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Red Flags & Green Flags */}
                <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* HR Red Flags */}
                  <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-2">
                    <h4 className="text-xs font-black text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      HR Red Flags Terdeteksi
                    </h4>
                    <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                      {result.hrVerdict.hrRedFlags?.map((flag, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* HR Green Flags */}
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      HR Green Flags (Kelebihan)
                    </h4>
                    <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                      {result.hrVerdict.hrGreenFlags?.map((flag, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: FULL ACTIVITY SPECTRUM AUDIT (PR, MERGES, STARS, ISSUES, DISCUSSIONS) */}
          {result.activityBreakdown && (
            <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-2">
                <h3 className="text-xs sm:text-sm font-black text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Audit Seluruh Spektrum Aktivitas Developer (PR, Merge, Issues, Stars &amp; Diskusi)
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-bold">Community Engagement:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      ["A+", "A"].includes(result.activityBreakdown.communityEngagementGrade)
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : ["B", "C"].includes(result.activityBreakdown.communityEngagementGrade)
                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                        : "bg-red-950 text-red-400 border border-red-800"
                    }`}
                  >
                    Grade {result.activityBreakdown.communityEngagementGrade}
                  </span>
                </div>
              </div>

              {/* 4 Cards Grid of Activity Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                    <GitPullRequest className="w-3.5 h-3.5 text-purple-400" /> Pull Requests
                  </span>
                  <div className="text-lg font-black text-purple-300 font-mono">
                    {result.activityBreakdown.pullRequestsCount} <span className="text-xs text-zinc-500 font-normal">Events</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Merged: <strong className="text-emerald-400 font-mono">{result.activityBreakdown.mergedPRsCount} PR</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                    <GitMerge className="w-3.5 h-3.5 text-emerald-400" /> Merged PRs
                  </span>
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    {result.activityBreakdown.mergedPRsCount} <span className="text-xs text-zinc-500 font-normal">Merged</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Tingkat Sukses: <strong className="text-zinc-200 font-mono">
                      {result.activityBreakdown.pullRequestsCount > 0 
                        ? `${Math.round((result.activityBreakdown.mergedPRsCount / result.activityBreakdown.pullRequestsCount) * 100)}%` 
                        : "0%"}
                    </strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Issues &amp; Tiket
                  </span>
                  <div className="text-lg font-black text-amber-300 font-mono">
                    {result.activityBreakdown.openIssuesCount} <span className="text-xs text-zinc-500 font-normal">Events</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Keterlibatan Diskusi Bug/Fitur
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" /> Starred Repos
                  </span>
                  <div className="text-lg font-black text-yellow-300 font-mono">
                    {result.activityBreakdown.starredReposCount} <span className="text-xs text-zinc-500 font-normal">Repo</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Kurasi &amp; Minat Tech Stack
                  </div>
                </div>
              </div>

              {/* 2 Wide Analysis Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/90 space-y-2">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                    Evaluasi Forking &amp; Kolaborasi Eksternal
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {result.activityBreakdown.forksGivenOrReceived}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/90 space-y-2">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    Code Reviews &amp; Keterlibatan Diskusi Komunitas
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {result.activityBreakdown.codeReviewAndDiscussions}
                  </p>
                </div>
              </div>

              {/* Roasting Khusus Seluruh Spektrum Aktivitas */}
              <div className="p-4.5 rounded-xl bg-orange-950/20 border border-orange-900/40 text-xs text-zinc-300 space-y-1">
                <strong className="text-orange-400 uppercase text-[10px] font-black flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" /> Vonis Roasting Spektrum Aktivitas HR:
                </strong>
                <p className="italic leading-relaxed">
                  "{result.activityBreakdown.activitySummaryRoast}"
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: HISTORY & STREAK AUDIT */}
          {result.historyAudit && (
            <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4">
              <h3 className="text-xs sm:text-sm font-black text-zinc-100 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-zinc-800/80">
                <History className="w-4 h-4 text-amber-400" />
                Audit History Aktivitas, Streak &amp; Kontribusi
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-zinc-400" /> Usia Akun
                  </span>
                  <div className="text-sm font-bold text-zinc-200">{result.historyAudit.accountAge}</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-amber-400" /> Peak Activity
                  </span>
                  <div className="text-xs text-zinc-300 leading-snug">{result.historyAudit.peakActivityPeriod}</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                    <GitCommit className="w-3 h-3 text-red-400" /> Dormancy / Hiatus
                  </span>
                  <div className="text-xs text-zinc-300 leading-snug">{result.historyAudit.dormancyWarning}</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                    <GitPullRequest className="w-3 h-3 text-emerald-400" /> PR &amp; Open Source
                  </span>
                  <div className="text-xs text-zinc-300 leading-snug">{result.historyAudit.prAndIssuesRoast}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 italic">
                <strong className="text-red-400 not-italic block uppercase text-[10px] font-black mb-1">
                  Komentar Commit Streak &amp; Green Squares:
                </strong>
                "{result.historyAudit.commitStreakRoast}"
              </div>
            </div>
          )}

          {/* SECTION 3: ACHIEVEMENTS & BADGES AUDIT */}
          {result.achievementsAudit && (
            <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4">
              <h3 className="text-xs sm:text-sm font-black text-zinc-100 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-zinc-800/80">
                <Award className="w-4 h-4 text-amber-400" />
                Audit Achievements &amp; Developer Badges
              </h3>

              {Array.isArray(result.achievementsAudit) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {result.achievementsAudit.map((ach, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border flex flex-col justify-between space-y-2 ${
                        ach.status === "UNLOCKED"
                          ? "bg-emerald-950/20 border-emerald-800/50 text-emerald-200"
                          : ach.status === "FAILED"
                          ? "bg-red-950/20 border-red-800/50 text-red-200"
                          : "bg-zinc-950/60 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{ach.badge || "🏆"}</span>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                              ach.status === "UNLOCKED"
                                ? "bg-emerald-900 text-emerald-300"
                                : ach.status === "FAILED"
                                ? "bg-red-900 text-red-300"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {ach.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-100 mb-1">{ach.title}</h4>
                        <p className="text-[11px] text-zinc-400 mb-2">{ach.description}</p>
                      </div>

                      <p className="text-[11px] italic pt-2 border-t border-zinc-800/60 text-zinc-300">
                        "{ach.roastComment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-2">
                  <div className="text-amber-400 font-bold">
                    Reputasi: {result.achievementsAudit.reputationTier || "General"}
                  </div>
                  <p>{result.achievementsAudit.starsVsForksRatioRoast || result.achievementsAudit.communityInfluence}</p>
                </div>
              )}
            </div>
          )}

          {/* 4 Core Diagnostic Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* 1. Tutorial Hell */}
            <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/80">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-200">
                    Tutorial Hell
                  </h3>
                  <span
                    className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      result.roastCategories.tutorialHellDiagnosis.status === "severe"
                        ? "bg-red-600 text-white"
                        : result.roastCategories.tutorialHellDiagnosis.status === "warning"
                        ? "bg-amber-600 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {result.roastCategories.tutorialHellDiagnosis.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {result.roastCategories.tutorialHellDiagnosis.explanation}
                </p>
              </div>
            </div>

            {/* 2. Code Smell & Quality */}
            <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/80">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-200">
                    Code Smells
                  </h3>
                  <span
                    className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      result.roastCategories.codeSmellAndQuality.status === "severe"
                        ? "bg-red-600 text-white"
                        : result.roastCategories.codeSmellAndQuality.status === "warning"
                        ? "bg-amber-600 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {result.roastCategories.codeSmellAndQuality.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {result.roastCategories.codeSmellAndQuality.explanation}
                </p>
              </div>
            </div>

            {/* 3. Commit Habits */}
            <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/80">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-200">
                    Commit Habits
                  </h3>
                  <span
                    className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      result.roastCategories.commitHabitsAndMessages.status === "severe"
                        ? "bg-red-600 text-white"
                        : result.roastCategories.commitHabitsAndMessages.status === "warning"
                        ? "bg-amber-600 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {result.roastCategories.commitHabitsAndMessages.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {result.roastCategories.commitHabitsAndMessages.explanation}
                </p>
              </div>
            </div>

            {/* 4. Tech Stack vs CV Alignment */}
            <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/80">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-200">
                    Kesesuaian Stack
                  </h3>
                  <span
                    className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      result.roastCategories.techStackVsCvAlignment.status === "fake"
                        ? "bg-red-600 text-white"
                        : result.roastCategories.techStackVsCvAlignment.status === "questionable"
                        ? "bg-amber-600 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {result.roastCategories.techStackVsCvAlignment.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {result.roastCategories.techStackVsCvAlignment.explanation}
                </p>
              </div>
            </div>
          </div>

          {/* Repo Teardowns */}
          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4">
            <h3 className="text-xs sm:text-sm font-black text-zinc-100 uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-zinc-800/80">
              <Code2 className="w-4 h-4 text-red-500" />
              Bedah Repositori Publik ({result.repoTeardowns.length} Repositories)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.repoTeardowns.map((repo, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 space-y-3 flex flex-col justify-between shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-mono text-sm font-bold text-red-400 flex items-center gap-1.5">
                        <GitBranch className="w-3.5 h-3.5" />
                        {repo.repoName}
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                        {repo.verdict}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {repo.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 text-[10px] font-mono border border-zinc-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-zinc-300 italic mb-2">
                      "{repo.roast}"
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-emerald-300 shadow-inner">
                    <strong className="text-emerald-400 block text-[10px] uppercase font-bold mb-0.5">Solusi Perbaikan:</strong>
                    {repo.howToFix}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BANGKAH Portfolio Upgrade Blueprint */}
          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <h3 className="text-xs sm:text-sm font-black text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Blueprint Upgrade Portofolio Standar Silicon Valley / Unicorn
              </h3>
              <span className="text-xs text-red-400 font-mono font-bold">Anti Tutorial Hell</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.portfolioUpgradeBlueprint.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 flex flex-col justify-between space-y-3 shadow-md"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-1">
                      Proyek Rekomendasi #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-zinc-100 mb-2">{proj.projectName}</h4>

                    <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 font-mono mb-2 shadow-inner">
                      <strong className="text-zinc-400 block text-[10px] uppercase mb-0.5">Arsitektur:</strong>
                      {proj.architectureSuggested}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 pt-2.5 border-t border-zinc-800/80">
                    <strong className="text-amber-400">Kenapa disukai HR:</strong> {proj.whyRecruitersLoveIt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: FUTURE CAREER ROADMAP & ACTION PLAN */}
          {result.futureCareerRoadmap && result.futureCareerRoadmap.length > 0 && (
            <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <h3 className="text-xs sm:text-sm font-black text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Saran &amp; Roadmap Karir Masa Depan (Future Action Plan)
                </h3>
                <span className="text-xs text-emerald-400 font-mono font-bold">Langkah Konkret</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.futureCareerRoadmap.map((phase, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 flex flex-col justify-between space-y-4 shadow-md"
                  >
                    <div>
                      <span className="px-2.5 py-1 rounded-full bg-zinc-900 text-emerald-400 border border-zinc-800 text-[10px] font-bold uppercase tracking-wider block w-fit mb-2">
                        {phase.timeframe}
                      </span>
                      <h4 className="text-sm font-bold text-zinc-100 mb-3">{phase.milestoneTitle}</h4>

                      <ul className="space-y-2 text-xs text-zinc-300">
                        {phase.actionItems?.map((action, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2">
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/50 text-[11px] text-emerald-300">
                      <strong className="block text-emerald-400 uppercase font-bold text-[10px] mb-0.5">
                        Expected Impact:
                      </strong>
                      {phase.expectedImpact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center pt-4">
            <button
              onClick={() => setResult(null)}
              className="px-6 py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 mx-auto cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              Roast Akun GitHub Lain
            </button>
          </div>
        </div>
      ) : (
        /* Input Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-200 flex items-center gap-2">
                <span className="bg-red-500 w-1.5 h-4 rounded-full"></span>
                Parameter Audit Profil GitHub
              </h2>

              {/* Real-time Dynamic Mode Indicator */}
              <div
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 border transition-all ${
                  isTargetedModeActive
                    ? "bg-amber-950/60 border-amber-800/80 text-amber-300"
                    : "bg-blue-950/60 border-blue-800/80 text-blue-300"
                }`}
              >
                {isTargetedModeActive ? (
                  <>
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mode: Targeted Role &amp; CV Cross-Check</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Mode: Audit Holistik Menyeluruh (Username Saja)</span>
                  </>
                )}
              </div>
            </div>

            {/* Mode Explanation Helper */}
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                isTargetedModeActive
                  ? "bg-amber-950/20 border-amber-800/40 text-zinc-300"
                  : "bg-blue-950/20 border-blue-800/40 text-zinc-300"
              }`}
            >
              {isTargetedModeActive ? (
                <span>
                  <strong className="text-amber-400 font-bold">🎯 Fokus Khusus:</strong> Karena Anda mengisi Target Posisi, Klaim CV, atau Daftar Repo, AI akan secara tajam memvalidasi kecocokan posisi, menguji kebenaran klaim tech stack CV Anda vs data commit GitHub, dan membedah repo yang Anda sebutkan.
                </span>
              ) : (
                <span>
                  <strong className="text-blue-400 font-bold">🔍 Audit Menyeluruh:</strong> Anda hanya memasukkan username. AI akan melakukan pemindaian komprehensif pada seluruh profil, mendeteksi arsitektur/spesialisasi Anda secara mandiri, dan menilai kematangan portofolio Anda secara objektif.
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-red-400" /> Username GitHub (Wajib)
                  </span>
                  <span className="text-[10px] text-red-400 font-mono">*Harus ada</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: torvalds atau github.com/username"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-red-500 font-mono shadow-inner"
                />
                <p className="mt-1 text-[10px] text-zinc-500">
                  Cukup isi ini saja jika ingin audit menyeluruh &amp; deteksi peran otomatis.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center justify-between">
                  <span>Target Posisi / Karir Impian</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Opsional</span>
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Kosongkan untuk deteksi otomatis, atau isi misal: Backend Go Lead"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-500 shadow-inner"
                />
                <p className="mt-1 text-[10px] text-zinc-500">
                  Isi jika ingin AI menguji kelayakan Anda spesifik untuk posisi ini.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center justify-between">
                <span>Tech Stack yang Anda Klaim di CV (Uji Validasi Kebohongan)</span>
                <span className="text-[10px] text-zinc-500 font-mono">Opsional</span>
              </label>
              <input
                type="text"
                value={claimedTechStack}
                onChange={(e) => setClaimedTechStack(e.target.value)}
                placeholder="Contoh: React, Kubernetes, Go, Microservices, Redis, Kafka, AWS, Docker"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-500 font-mono shadow-inner"
              />
              <p className="mt-1 text-[10px] text-zinc-500">
                AI akan membandingkan apakah teknologi di atas benar-benar ada kodenya di GitHub Anda.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center justify-between">
                <span>Daftar Repositori / Catatan Manual (Jika repo private / ingin diuji khusus)</span>
                <span className="text-[10px] text-zinc-500 font-mono">Opsional</span>
              </label>
              <textarea
                value={manualRepoInfo}
                onChange={(e) => setManualRepoInfo(e.target.value)}
                placeholder="Tuliskan nama-nama repo utama, deskripsi, teknologi yang dipakai, atau kebiasaan coding Anda jika ingin dibedah khusus..."
                className="w-full h-24 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-500 font-mono resize-none shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01] ${
                isTargetedModeActive
                  ? "bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white shadow-amber-950/60"
                  : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white shadow-red-950/60"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>
                    {isTargetedModeActive
                      ? "MEMVALIDASI TARGET ROLE, KLAIM CV, & BEDAH REPO..."
                      : "MEMINDAI PROFILE GITHUB, LIVE REPOS, HISTORY COMMIT & AUDIT MENYELURUH..."}
                  </span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  <span>
                    {isTargetedModeActive
                      ? "JALANKAN TARGETED ROLE & CV CROSS-CHECK AUDIT"
                      : "JALANKAN AUDIT MENYELURUH PROFIL GITHUB SEKARANG"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
