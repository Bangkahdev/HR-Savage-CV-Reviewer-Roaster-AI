import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Briefcase,
  MessageSquare,
  Code2,
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
    setCandidateName("Muhammad Dhiyaul Atha");
    setTargetRole("Open Source Enthusiast  & DevOps Engineer");
    setCvText(
      "Open Source Enthusiast dengan fokus pada DevOps, backend engineering, Linux, dan cloud-native technologies. sedikit berpengalaman membangun dan mengembangkan aplikasi berbasis React, Next.js, Node.js, Go, PostgreSQL, Supabase, serta tooling Linux."
    );
    setLinkedinUrlOrBio("linkedin.com/in/muhammad-dhyaul-atha - Headline: 'Open Source Enthusiast | DevOps & Backend | Linux | Cloud Native'");
    setTwitterUrlOrBio("@mdhiyaulatha - Berbagi proses belajar software engineering, Linux, open source, DevOps, backend, dan cloud-native technologies.");
    setGithubUrlOrBio("github.com/bangkahdev - projects: NetInfo, Atha, HR-Savage-CV-Reviewer-Roaster-AI");
    setPortfolioOrBlog("https://mdhiyaulatha.me - Portfolio pribadi software engineering dan dokumentasi pembelajaran backend, DevOps, Linux, dan open source.");
    setAdditionalNotes("Memiliki pengalaman belajar dan mengembangkan sistem menggunakan Linux, Git/GitHub, GitHub Actions, Docker, Node.js, Go, PostgreSQL, Redis, Supabase, React, Next.js.");
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
      {/* Soft Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 soft-shadow-lg page-fade relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Fingerprint className="w-48 h-48 text-coral-200" />
        </div>

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-50 border border-coral-200 text-coral-700 text-xs font-black uppercase tracking-widest mb-4">
            <Search className="w-3.5 h-3.5" />
            Background Check & Reality Audit AI
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
            Audit Jejak Digital &amp; Cross-Check CV
          </h1>
          <p className="mt-3 text-slate-600 text-sm leading-relaxed">
            Sebelum rekruter mencari nama Anda di Google, LinkedIn, dan Twitter/X, sistem AI HR ini akan menguji apakah klaim pengalaman kerja di CV Anda cocok dengan jejak digital Anda di dunia nyata.
          </p>
        </div>

        <button type="button" onClick={handleFillSample} className="px-5 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-coral-600 font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm soft-btn">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Isi Contoh Simulasi Kontradiksi
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-coral-50 border border-coral-200 text-coral-800 text-xs flex items-center gap-3 soft-shadow">
          <AlertTriangle className="w-4 h-4 text-coral-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {result ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Authenticity Score */}
            <div className="col-span-12 md:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-center items-center text-center soft-shadow-lg page-fade relative overflow-hidden group">
              <div className="absolute inset-0 bg-coral-50/50 opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none"></div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 z-10 relative">Authenticity Score</span>
              <div className="text-5xl sm:text-6xl font-black text-coral-600 tracking-tight z-10 relative">{result.authenticityScore}<span className="text-xl text-slate-400 font-bold">/100</span></div>
              <div className={result.riskLevel === "critical" || result.riskLevel === "high" ? "mt-5 px-4 py-1.5 text-xs font-black rounded-full border uppercase tracking-wider z-10 relative shadow-sm bg-coral-50 text-coral-700 border-coral-200/60" : result.riskLevel === "medium" ? "mt-5 px-4 py-1.5 text-xs font-black rounded-full border uppercase tracking-wider z-10 relative shadow-sm bg-amber-50 text-amber-700 border-amber-200/60" : "mt-5 px-4 py-1.5 text-xs font-black rounded-full border uppercase tracking-wider z-10 relative shadow-sm bg-emerald-50 text-emerald-700 border-emerald-200/60"}>
                RISK LEVEL: {result.riskLevel}
              </div>
            </div>

            {/* Roast */}
            <div className="col-span-12 md:col-span-6 bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 relative overflow-hidden soft-shadow-lg page-fade flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none"><ShieldAlert className="w-32 h-32 text-coral-200" /></div>
              <div className="z-10 relative">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200/80">
                  <h2 className="text-xs sm:text-sm font-black flex items-center gap-2 text-slate-900 uppercase tracking-widest"><span className="bg-coral-500 w-1.5 h-4 rounded-full"></span> VONIS INVESTIGASI JEJAK DIGITAL</h2>
                  <span className="text-[11px] font-mono text-coral-600 font-bold">{result.verdict}</span>
                </div>
                <p className="text-base sm:text-lg font-normal italic leading-relaxed text-slate-600 mb-5">"{result.summaryRoast}"</p>
              </div>
              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 z-10 relative">
                <span className="text-slate-400 font-mono">Target: <strong className="text-slate-800">{targetRole}</strong></span>
                <button onClick={handleCopyRoast} className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200 soft-btn">
                  {copiedRoast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}{copiedRoast ? "Tersalin!" : "Salin Vonis"}
                </button>
              </div>
            </div>

            {/* Digital Persona */}
            <div className="col-span-12 md:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-7 soft-shadow-lg page-fade flex flex-col justify-between">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Digital Persona Rating</span>
              <div className="my-2">
                <div className="text-base font-black text-slate-900 uppercase tracking-tight">{result.digitalPersonaAudit.professionalismRating}</div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed"><strong className="text-coral-600">Tone Audit:</strong> {result.digitalPersonaAudit.toneRoast}</p>
              </div>
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 shadow-inner">
                <span className="text-amber-600 font-bold block text-[10px] uppercase">Online Activity Risk:</span>{result.digitalPersonaAudit.onlineActivityRisk}
              </div>
            </div>
          </div>

          {/* Inconsistencies */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 soft-shadow-lg page-fade space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-coral-500" /> Daftar Inkonsistensi &amp; Kontradiksi CV vs Jejak Digital ({result.inconsistencies.length})</h3>
              <span className="text-xs text-coral-600 font-mono font-bold">HR Red Flags</span>
            </div>
            {result.inconsistencies.length === 0 ? (
              <p className="text-xs text-emerald-600 bg-emerald-50/40 p-4 rounded-3xl border border-emerald-200/80">✓ Tidak ditemukan kontradiksi fatal antara klaim CV dengan data media sosial yang diberikan.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.inconsistencies.map((item, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3 soft-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Temuan #{idx + 1}</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${item.severity === "critical" ? "bg-coral-600 text-white" : item.severity === "warning" ? "bg-amber-600 text-white" : "bg-blue-600 text-white"}`}>{item.severity}</span>
                      </div>
                      <div className="space-y-2.5 text-xs">
                        <div className="p-2.5 rounded-3xl bg-coral-50/40 border border-coral-200/60 text-coral-600"><strong className="block text-coral-700 font-mono text-[10px] uppercase mb-0.5">Klaim pada CV:</strong>"{item.claimInCv}"</div>
                        <div className="p-2.5 rounded-3xl bg-white border border-slate-200 text-slate-600"><strong className="block text-slate-400 font-mono text-[10px] uppercase mb-0.5">Fakta di Medsos / Portofolio:</strong>"{item.foundInDigitalFootprint}"</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 pt-2.5 border-t border-slate-200/80"><strong className="text-slate-800">Analisis HR:</strong> {item.analysis}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified Highlights & Advice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 soft-shadow-lg page-fade space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5 pb-2 border-b border-slate-200/80"><ShieldCheck className="w-4 h-4" /> Bukti yang Terverifikasi &amp; Menguntungkan</h3>
              <div className="space-y-3">{result.verifiedHighlights.map((v, i) => (
                <div key={i} className="p-3.5 rounded-3xl bg-slate-50 border border-slate-200 text-xs space-y-1 shadow-inner">
                  <div className="font-bold text-slate-900 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {v.skillOrExperience}</div>
                  <p className="text-slate-500 leading-relaxed">{v.evidence}</p>
                  <p className="text-emerald-600 text-[11px] font-mono">💡 {v.credibilityNote}</p>
                </div>
              ))}</div>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 soft-shadow-lg page-fade space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-200/80"><Sparkles className="w-4 h-4 text-amber-400" /> Solusi Pembersihan Jejak Digital</h3>
              <div className="space-y-3">{result.backgroundCheckAdvice.map((adv, i) => (
                <div key={i} className="p-3.5 rounded-3xl bg-slate-50 border border-slate-200 text-xs space-y-1 shadow-inner">
                  <div className="font-bold text-slate-900 flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-coral-600 text-white text-[10px] flex items-center justify-center font-bold">{i + 1}</span>{adv.action}</div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">{adv.whyItMatters}</p>
                </div>
              ))}</div>
            </div>
          </div>

          <div className="text-center pt-4">
            <button onClick={() => setResult(null)} className="px-6 py-3 rounded-3xl bg-slate-50/90 hover:bg-slate-100 border border-slate-200/80 text-slate-600 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 mx-auto cursor-pointer shadow-lg soft-btn"><RotateCcw className="w-4 h-4" /> Audit Kandidat Lain</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 soft-shadow-lg page-fade space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 pb-2 border-b border-slate-200/80"><span className="bg-coral-500 w-1.5 h-4 rounded-full"></span> Langkah 1: Identitas &amp; Klaim CV</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nama Kandidat / Panggilan</label>
                <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="Contoh: Muhammad Dhiyaul Atha" className="w-full px-4 py-2.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-coral-400 focus-ring-soft shadow-inner" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Target Posisi yang Dilamar</label>
                <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Contoh: Senior Fullstack Developer / Tech Lead" className="w-full px-4 py-2.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-coral-400 focus-ring-soft shadow-inner" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Cuclikan Klaim / Pengalaman Pada CV</label>
              <textarea value={cvText} onChange={(e) => setCvText(e.target.value)} placeholder="Tempelkan ringkasan pengalaman, gelar, jabatan terakhir, atau skill utama yang diklaim di CV..." className="w-full h-24 p-3.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-coral-400 focus-ring-soft font-mono resize-none shadow-inner" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 soft-shadow-lg page-fade space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 pb-2 border-b border-slate-200/80"><span className="bg-coral-500 w-1.5 h-4 rounded-full"></span> Langkah 2: Data Jejak Digital &amp; Profil Online</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-blue-400" /> LinkedIn URL atau Headline &amp; Riwayat Bio</label>
                <input type="text" value={linkedinUrlOrBio} onChange={(e) => setLinkedinUrlOrBio(e.target.value)} placeholder="linkedin.com/in/username atau 'Ex-Intern di Agency ABC'" className="w-full px-4 py-2.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-coral-400 focus-ring-soft shadow-inner" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-sky-400" /> X (Twitter) Akun atau Kebiasaan Postingan</label>
                <input type="text" value={twitterUrlOrBio} onChange={(e) => setTwitterUrlOrBio(e.target.value)} placeholder="@username atau 'Sering tweet sambat soal framework baru'" className="w-full px-4 py-2.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-coral-400 focus-ring-soft shadow-inner" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5 text-slate-300" /> GitHub URL / Profil Tech</label>
                <input type="text" value={githubUrlOrBio} onChange={(e) => setGithubUrlOrBio(e.target.value)} placeholder="github.com/username atau 'Hanya ada repo clone tutorial'" className="w-full px-4 py-2.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-coral-400 focus-ring-soft shadow-inner" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-emerald-400" /> Website Portfolio / Medium / Blog</label>
                <input type="text" value={portfolioOrBlog} onChange={(e) => setPortfolioOrBlog(e.target.value)} placeholder="https://portfolio-anda.com atau link artikel medium" className="w-full px-4 py-2.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-coral-400 focus-ring-soft shadow-inner" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Catatan Tambahan / Rekam Jejak Publik Lainnya (Opsional)</label>
              <input type="text" value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} placeholder="Misal: Aktif di komunitas discord, pernah bikin thread viral, dsb." className="w-full px-4 py-2.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-coral-400 focus-ring-soft shadow-inner" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-5 rounded-3xl bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-coral-200/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 hover:scale-[1.01] soft-btn">{isLoading ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>HR SEDANG MENELUSURI &amp; MENGUJI JEJAK DIGITAL...</span></>) : (<><Search className="w-4 h-4" /><span>JALANKAN AUDIT JEJAK DIGITAL &amp; DETEKTOR KLAIM SEKARANG</span></>)}</button>
          </div>
        </form>
      )}
    </div>
  );
};

