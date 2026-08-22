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
  initialTargetRole = "Fullstack Developer / Software Engineer",
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

  const handleFillSample = (type: "junior" | "senior") => {
  if (type === "junior") {
    setUsername("Bangkah");

    setTargetRole("maintenance / devops / backend engineer");

    setClaimedTechStack(
      "React, Next.js, TypeScript, Node.js, Docker, Kubernetes, GraphQL"
    );

    setManualRepoInfo(
      `Repos:
        - portfolio(personal portfolio menggunakan React dan Tailwind CSS)
        - todo-app (CRUD application sederhana)
        - weather-app (menggunakan public weather API)
        - ecommerce-demo (frontend project dengan React)
        - backend-api (REST API sederhana dengan Node.js)

        GitHub activity:
        - Beberapa project masih berupa eksperimen dan learning projects
        - Sebagian repository memiliki dokumentasi yang belum lengkap
        - Belum memiliki pengalaman profesional yang signifikan sebagai Senior Frontend Developer`
    );
  } else {
    setUsername("Bangkah");

    setTargetRole("DevOps / Backend Engineer");

    setClaimedTechStack(
      "Linux, Git, GitHub Actions, Docker, Go, Node.js, PostgreSQL, Redis, React, Next.js, gRPC, Supabase, Cloud Native"
    );

    setManualRepoInfo(
      `Open source & personal projects:
        - NetInfo — CLI utility untuk menampilkan informasi sistem dan jaringan Linux
        - Sentinel AI — project yang berkaitan dengan AI dan software engineering
        - Bangkah Launcher — personal software project
        - Atha — software/project development repository
        - Berbagai eksperimen backend, DevOps, CI/CD, Linux, dan cloud-native

        GitHub activity:
        - Aktif menggunakan Git dan GitHub dalam software development workflow
        - Memiliki pengalaman membuat dan mengelola Pull Request
        - Menggunakan GitHub Actions untuk CI/CD dan automation
        - Aktif mengembangkan dan mendokumentasikan proyek open source
        - Memiliki pembelajaran/credential terkait eBPF dan Cilium dari Isovalent
        - Fokus pengembangan: backend, DevOps, Linux, cloud-native, infrastructure, dan platform engineering`
    );
  }

  setErrorMessage(null);
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
        targetRole: targetRole.trim() || "Software Engineer",
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
      `[GITHUB SAVAGE ROAST - @${result.username} - Skor Dev: ${result.devScore}/100 - Tier: ${result.devTier}]\nVerdict: ${result.verdictTag}\n\n"${result.brutalRoast}"`
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
            Developer Code &amp; Portfolio Roaster AI
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase">
            GitHub Roasted • <span className="text-red-500">Programmer Edition</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Lead Tech Architect veteran &amp; Technical Recruiter akan menguliti repositori GitHub Anda: mendeteksi <em>tutorial hell</em>, commit message memalukan, <em>green square farming</em>, serta memeriksa apakah tech stack di CV Anda benar-benar ada di kode nyata.
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
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-xs flex items-center gap-3 shadow-xl">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Result View (Bento Grid) */}
      {result ? (
        <div className="space-y-6">
          {/* Top Hero Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Bento 1: Dev Score & Tier */}
            <div className="col-span-12 md:col-span-3 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-2xl backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-radial-gradient opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
              <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-2">
                Developer Score
              </span>
              <div className="text-6xl sm:text-7xl font-black text-red-500 tracking-tight glow-red">
                {result.devScore}
                <span className="text-2xl text-zinc-600 font-bold">/100</span>
              </div>
              <div className="mt-4 px-3.5 py-1 text-xs font-black rounded-full bg-red-950/80 text-red-400 border border-red-800/80 uppercase tracking-wider shadow-sm">
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
              <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-3">
                Repository Hygiene
              </span>

              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between text-zinc-300 mb-1.5">
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
                  <div className="flex justify-between text-zinc-300 mb-1.5">
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

                <div className="pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 space-y-1.5">
                  <div>Public Repos: <strong className="text-zinc-200 font-mono">{result.metricsAudit.repoCount}</strong></div>
                  <div>Total Stars: <strong className="text-zinc-200 font-mono">{result.metricsAudit.starsTotal}</strong></div>
                  <div>
                    Languages:{" "}
                    <span className="text-red-400 font-mono">{result.metricsAudit.topLanguages.slice(0, 3).join(", ") || "None"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-300 flex items-center gap-2 pb-2 border-b border-zinc-800/80">
              <span className="bg-red-500 w-1.5 h-4 rounded-full"></span>
              Profil GitHub &amp; Identitas Developer
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-zinc-300" /> Username GitHub atau URL Profil
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: Bangkah atau github.com/Bangkah"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-red-500 font-mono shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Target Posisi / Impian Karir
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Contoh: Senior Fullstack Engineer / Backend Go Lead"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-red-500 shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Tech Stack yang Anda Klaim di CV (Opsional - untuk Uji Validasi Kebohongan)
              </label>
              <input
                type="text"
                value={claimedTechStack}
                onChange={(e) => setClaimedTechStack(e.target.value)}
                placeholder="Contoh: React, Kubernetes, Go, Microservices, Redis, Kafka, AWS, Docker"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-red-500 font-mono shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Daftar Repositori / Catatan Manual (Jika repo bersifat private atau ingin diuji khusus)
              </label>
              <textarea
                value={manualRepoInfo}
                onChange={(e) => setManualRepoInfo(e.target.value)}
                placeholder="Tuliskan nama-nama repo utama, deskripsi, teknologi yang dipakai, atau kebiasaan coding Anda..."
                className="w-full h-24 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-red-500 font-mono resize-none shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-red-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>TECH LEAD SEDANG MENGULITI REPO GITHUB &amp; COMMIT HISTORY...</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  <span>ROAST PROFIL GITHUB &amp; AUDIT KODE SEKARANG</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
