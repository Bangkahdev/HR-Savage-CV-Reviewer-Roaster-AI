import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Flame,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Check,
  Copy,
  Fingerprint,
} from "lucide-react";
import { DigitalFootprintRequest, DigitalFootprintResult } from "../types";
import { safeFetchJson } from "../utils/api";

interface DigitalFootprintSectionProps {
  initialCvText?: string;
  initialTargetRole?: string;
  onRoastAnother?: () => void;
}

export const DigitalFootprintSection: React.FC<DigitalFootprintSectionProps> = ({
  initialCvText = "",
  initialTargetRole = "Software Engineer",
  onRoastAnother,
}) => {
  const [candidateName, setCandidateName] = useState("");
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [cvText, setCvText] = useState(initialCvText);
  const [linkedinUrlOrBio, setLinkedinUrlOrBio] = useState("");
  const [twitterUrlOrBio, setTwitterUrlOrBio] = useState("");
  const [githubUrlOrBio, setGithubUrlOrBio] = useState("");
  const [portfolioOrBlog, setPortfolioOrBlog] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DigitalFootprintResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedRoast, setCopiedRoast] = useState(false);

  const handleFillSample = () => {
    setCandidateName("Budi Pratama");
    setTargetRole("Senior Frontend Engineer");
    setCvText(
      "Senior Frontend Engineer dengan 5+ tahun pengalaman memimpin arsitektur React & Next.js di unicorn, berhasil menaikkan performa 300%, ahli Micro-frontends, GraphQL, CI/CD, dan Docker."
    );
    setLinkedinUrlOrBio(
      "linkedin.com/in/budipratama - Headline: 'Aspiring Web Developer | Belajar Javascript | Ex-Intern di Web Agency (6 bulan)'"
    );
    setTwitterUrlOrBio(
      "@budicoding - Sering tweet: 'Aduh pusing banget belajar useState', 'Kapan ya bisa dapet kerja pertama', 'Kenapa Docker susah banget ampun'."
    );
    setGithubUrlOrBio("github.com/budipratama - Repos: todo-app-react, clone-netflix-tutorial, calculator-html");
    setPortfolioOrBlog("budipratama.vercel.app - Portofolio template gratisan, kontak form belum aktif");
    setAdditionalNotes("Pernah aktif di forum komplain soal wawancara kerja yang terlalu susah.");
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!linkedinUrlOrBio && !twitterUrlOrBio && !githubUrlOrBio && !portfolioOrBlog && !additionalNotes) {
      setErrorMessage("Silakan masukkan setidaknya satu profil/jejak digital (LinkedIn, X/Twitter, GitHub, atau Portfolio).");
      return;
    }

    setIsLoading(true);

    try {
      const payload: DigitalFootprintRequest = {
        candidateName: candidateName.trim() || "Kandidat",
        targetRole: targetRole.trim() || "Professional",
        cvText: cvText.trim(),
        linkedinUrlOrBio: linkedinUrlOrBio.trim(),
        twitterUrlOrBio: twitterUrlOrBio.trim(),
        githubUrlOrBio: githubUrlOrBio.trim(),
        portfolioOrBlog: portfolioOrBlog.trim(),
        additionalNotes: additionalNotes.trim(),
        language: "id",
      };

      const res = await safeFetchJson<DigitalFootprintResult>("/api/audit-digital-footprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || "Gagal melakukan audit jejak digital.");
      }

      setResult(res.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses jejak digital.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyRoast = () => {
    if (!result) return;
    navigator.clipboard.writeText(
      `[AUDIT JEJAK DIGITAL HR - Skor Autentisitas: ${result.authenticityScore}/100]\nVonis: ${result.verdict}\n\n"${result.summaryRoast}"`
    );
    setCopiedRoast(true);
    setTimeout(() => setCopiedRoast(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Fingerprint className="w-48 h-48 text-red-500" />
        </div>

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-red-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Search className="w-3.5 h-3.5" />
            Background Check &amp; Reality Audit AI
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase">
            Audit Jejak Digital &amp; Cross-Check CV
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Sebelum rekruter mencari nama Anda di Google, LinkedIn, dan Twitter/X, sistem AI HR ini akan menguji apakah klaim pengalaman kerja di CV Anda cocok dengan jejak digital Anda di dunia nyata.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillSample}
          className="px-4 py-2.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs text-red-400 font-bold uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer shadow-md hover:border-red-500/40"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Isi Contoh Simulasi Kontradiksi
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-xs flex items-center gap-3 shadow-xl">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Audit Results View (Bento Grid) */}
      {result ? (
        <div className="space-y-6">
          {/* Top Hero Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Bento 1: Authenticity Score */}
            <div className="col-span-12 md:col-span-3 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-2xl backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-radial-gradient opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
              <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-2">
                Authenticity Score
              </span>
              <div className="text-6xl sm:text-7xl font-black text-red-500 tracking-tight glow-red">
                {result.authenticityScore}
                <span className="text-2xl text-zinc-600 font-bold">/100</span>
              </div>
              <div
                className={`mt-4 px-3.5 py-1 text-xs font-black rounded-full border uppercase tracking-wider shadow-sm ${
                  result.riskLevel === "critical" || result.riskLevel === "high"
                    ? "bg-red-950/80 text-red-400 border-red-800/80"
                    : result.riskLevel === "medium"
                    ? "bg-amber-950/80 text-amber-400 border-amber-800/80"
                    : "bg-emerald-950/80 text-emerald-400 border-emerald-800/80"
                }`}
              >
                RISK LEVEL: {result.riskLevel}
              </div>
            </div>

            {/* Bento 2: Detective Savage Roast */}
            <div className="col-span-12 md:col-span-6 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <ShieldAlert className="w-32 h-32 text-red-500" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
                  <h2 className="text-xs sm:text-sm font-black flex items-center gap-2 text-zinc-100 uppercase tracking-widest">
                    <span className="bg-red-500 w-1.5 h-4 rounded-full"></span>
                    VONIS INVESTIGASI JEJAK DIGITAL
                  </h2>
                  <span className="text-[11px] font-mono text-red-400 font-bold">
                    {result.verdict}
                  </span>
                </div>

                <p className="text-base sm:text-lg font-normal italic leading-relaxed text-zinc-200 mb-4">
                  "{result.summaryRoast}"
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-mono">Target: <strong className="text-zinc-200">{targetRole}</strong></span>
                <button
                  onClick={handleCopyRoast}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-zinc-800"
                >
                  {copiedRoast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  {copiedRoast ? "Tersalin!" : "Salin Vonis"}
                </button>
              </div>
            </div>

            {/* Bento 3: Digital Persona Audit */}
            <div className="col-span-12 md:col-span-3 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
              <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest">
                Digital Persona Rating
              </span>
              <div className="my-2">
                <div className="text-base font-black text-white uppercase tracking-tight">
                  {result.digitalPersonaAudit.professionalismRating}
                </div>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  <strong className="text-red-400">Tone Audit:</strong> {result.digitalPersonaAudit.toneRoast}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 shadow-inner">
                <span className="text-amber-400 font-bold block text-[10px] uppercase">Online Activity Risk:</span>
                {result.digitalPersonaAudit.onlineActivityRisk}
              </div>
            </div>
          </div>

          {/* Inconsistencies Matrix */}
          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-xs sm:text-sm font-black text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Daftar Inkonsistensi &amp; Kontradiksi CV vs Jejak Digital ({result.inconsistencies.length})
              </h3>
              <span className="text-xs text-red-400 font-mono font-bold">HR Red Flags</span>
            </div>

            {result.inconsistencies.length === 0 ? (
              <p className="text-xs text-emerald-400 bg-emerald-950/40 p-4 rounded-xl border border-emerald-900/80">
                ✓ Tidak ditemukan kontradiksi fatal antara klaim CV dengan data media sosial yang diberikan.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.inconsistencies.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 flex flex-col justify-between space-y-3 shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-zinc-400">
                          Temuan #{idx + 1}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            item.severity === "critical"
                              ? "bg-red-600 text-white"
                              : item.severity === "warning"
                              ? "bg-amber-600 text-white"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          {item.severity}
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300">
                          <strong className="block text-red-400 font-mono text-[10px] uppercase mb-0.5">Klaim pada CV:</strong>
                          "{item.claimInCv}"
                        </div>
                        <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300">
                          <strong className="block text-zinc-400 font-mono text-[10px] uppercase mb-0.5">Fakta di Medsos / Portofolio:</strong>
                          "{item.foundInDigitalFootprint}"
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 pt-2.5 border-t border-zinc-800/80">
                      <strong className="text-zinc-200">Analisis HR:</strong> {item.analysis}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified Highlights & Background Check Advice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Verified Highlights */}
            <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 pb-2 border-b border-zinc-800/80">
                <ShieldCheck className="w-4 h-4" /> Bukti yang Terverifikasi &amp; Menguntungkan
              </h3>
              <div className="space-y-3">
                {result.verifiedHighlights.map((v, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1 shadow-inner">
                    <div className="font-bold text-zinc-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {v.skillOrExperience}
                    </div>
                    <p className="text-zinc-400 leading-relaxed">{v.evidence}</p>
                    <p className="text-emerald-400 text-[11px] font-mono">💡 {v.credibilityNote}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice to Pass Background Check */}
            <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-200 flex items-center gap-1.5 pb-2 border-b border-zinc-800/80">
                <Sparkles className="w-4 h-4 text-amber-400" /> Solusi Pembersihan Jejak Digital
              </h3>
              <div className="space-y-3">
                {result.backgroundCheckAdvice.map((adv, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1 shadow-inner">
                    <div className="font-bold text-zinc-100 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      {adv.action}
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">{adv.whyItMatters}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setResult(null)}
              className="px-6 py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 mx-auto cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              Audit Kandidat Lain
            </button>
          </div>
        </div>
      ) : (
        /* Input Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-300 flex items-center gap-2 pb-2 border-b border-zinc-800/80">
              <span className="bg-red-500 w-1.5 h-4 rounded-full"></span>
              Langkah 1: Identitas &amp; Klaim CV
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Nama Kandidat / Panggilan
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Contoh: Budi Pratama"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-red-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Target Posisi yang Dilamar
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Contoh: Senior Fullstack Developer / Tech Lead"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-red-500 shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Cuplikan Klaim / Pengalaman Pada CV
              </label>
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Tempelkan ringkasan pengalaman, gelar, jabatan terakhir, atau skill utama yang diklaim di CV..."
                className="w-full h-24 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-red-500 font-mono resize-none shadow-inner"
              />
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-300 flex items-center gap-2 pb-2 border-b border-zinc-800/80">
              <span className="bg-red-500 w-1.5 h-4 rounded-full"></span>
              Langkah 2: Data Jejak Digital &amp; Profil Online
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" /> LinkedIn URL atau Headline &amp; Riwayat Bio
                </label>
                <input
                  type="text"
                  value={linkedinUrlOrBio}
                  onChange={(e) => setLinkedinUrlOrBio(e.target.value)}
                  placeholder="linkedin.com/in/username atau 'Ex-Intern di Agency ABC'"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-red-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Twitter className="w-3.5 h-3.5 text-sky-400" /> X (Twitter) Akun atau Kebiasaan Postingan
                </label>
                <input
                  type="text"
                  value={twitterUrlOrBio}
                  onChange={(e) => setTwitterUrlOrBio(e.target.value)}
                  placeholder="@username atau 'Sering tweet sambat soal framework baru'"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-red-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-zinc-300" /> GitHub URL / Profil Tech
                </label>
                <input
                  type="text"
                  value={githubUrlOrBio}
                  onChange={(e) => setGithubUrlOrBio(e.target.value)}
                  placeholder="github.com/username atau 'Hanya ada repo clone tutorial'"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-red-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" /> Website Portfolio / Medium / Blog
                </label>
                <input
                  type="text"
                  value={portfolioOrBlog}
                  onChange={(e) => setPortfolioOrBlog(e.target.value)}
                  placeholder="https://portfolio-anda.com atau link artikel medium"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-red-500 shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Catatan Tambahan / Rekam Jejak Publik Lainnya (Opsional)
              </label>
              <input
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Misal: Aktif di komunitas discord, pernah bikin thread viral, dsb."
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-red-500 shadow-inner"
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
                  <span>HR SEDANG MENELUSURI &amp; MENGUJI JEJAK DIGITAL...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>JALANKAN AUDIT JEJAK DIGITAL &amp; DETEKTOR KLAIM SEKARANG</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
