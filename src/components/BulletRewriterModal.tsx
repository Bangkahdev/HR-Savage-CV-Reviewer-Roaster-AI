import React, { useState, useEffect } from "react";
import { X, Wand2, Sparkles, Copy, Check } from "lucide-react";
import { safeFetchJson } from "../utils/api";

interface BulletRewriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText?: string;
  defaultRole?: string;
}

interface RewriteResult {
  analysis: string;
  variations: Array<{
    type: string;
    text: string;
    whyItWorks: string;
  }>;
}

export const BulletRewriterModal: React.FC<BulletRewriterModalProps> = ({
  isOpen,
  onClose,
  initialText = "",
  defaultRole = "Software Engineer",
}) => {
  const [bulletText, setBulletText] = useState(initialText);
  const [role, setRole] = useState(defaultRole);
  const [metricHint, setMetricHint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialText) {
      setBulletText(initialText);
    }
  }, [initialText]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!bulletText.trim()) {
      setError("Silakan masukkan kalimat pengalaman/tugas yang ingin dipoles.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      const res = await safeFetchJson<RewriteResult>("/api/rewrite-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bulletText: bulletText.trim(),
          role,
          metricHint,
        }),
      });

      if (res.success && res.data && res.data.variations) {
        setResult(res.data);
      } else {
        setError(res.error || "Gagal memformat variasi kalimat. Coba lagi.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden page-fade">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-coral-500 shadow-sm"><Wand2 className="w-5 h-5" /></div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                Bullet Point Rewriter Wizard (STAR & Google X-Y-Z)
              </h3>
              <p className="text-[11px] text-slate-400">Ubah kalimat tugas pasif menjadi pencapaian berdampak tinggi</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 border border-slate-200 transition soft-btn"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-4 rounded-3xl bg-coral-50 border border-coral-200 text-coral-800 text-xs soft-shadow">{error}</div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Kalimat Pengalaman Kerja Asli Anda</label>
            <textarea value={bulletText} onChange={(e) => setBulletText(e.target.value)} placeholder="Contoh: Bertanggung jawab membuat fitur keranjang belanja dan memperbaiki bug di website..." className="w-full h-20 p-4 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-coral-400 focus-ring-soft font-mono resize-none shadow-inner" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Target Role</label>
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-coral-400 focus-ring-soft" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Petunjuk Metrik Tambahan (Opsional)</label>
              <input type="text" value={metricHint} onChange={(e) => setMetricHint(e.target.value)} placeholder="Misal: Naikkan kecepatan 30%, 10rb user" className="w-full px-3 py-2.5 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-coral-400 focus-ring-soft" />
            </div>
          </div>

          <button onClick={handleGenerate} disabled={isLoading} className="w-full py-3.5 rounded-3xl bg-coral-600 hover:bg-coral-700 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-coral-200/30 cursor-pointer disabled:opacity-60 soft-btn">{isLoading ? (<><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Merombak Kalimat dengan Formula BANGKAH...</span></>) : (<><Sparkles className="w-4 h-4" /><span>HASILKAN 3 VARIASI KELAS DUNIA</span></>)}</button>

          {result && (
            <div className="mt-6 space-y-4 pt-4 border-t border-slate-200/80">
              <div className="p-3.5 rounded-3xl bg-coral-50 border border-coral-200/60 text-xs text-coral-700 soft-shadow"><strong className="text-coral-800">Diagnosa HR:</strong> {result.analysis}</div>
              <div className="space-y-3">{result.variations.map((item, idx) => (
                <div key={idx} className="p-4 rounded-3xl bg-slate-50 border border-slate-200 hover:border-coral-200/40 transition soft-shadow space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-coral-600">Variasi #{idx + 1}: {item.type}</span>
                    <button onClick={() => handleCopy(item.text, idx)} className="px-2.5 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 text-[11px] font-semibold transition flex items-center gap-1 soft-btn">{copiedIdx === idx ? (<> <Check className="w-3 h-3 text-emerald-400" /> Tersalin! </>) : (<> <Copy className="w-3 h-3 text-slate-400" /> Salin </>)}</button>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-700 font-medium leading-relaxed font-mono">"{item.text}"</p>
                  <p className="text-[11px] text-slate-500"><strong className="text-slate-700">Dampaknya:</strong> {item.whyItWorks}</p>
                </div>
              ))}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

