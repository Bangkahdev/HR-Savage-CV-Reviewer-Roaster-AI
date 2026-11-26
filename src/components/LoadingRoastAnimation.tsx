import React, { useState, useEffect } from "react";
import { Flame, Brain, CheckCircle2 } from "lucide-react";

const LOADING_STEPS = [
  "Membuka dokumen CV dan menginisialisasi lensa HR Savage...",
  "Menjalani simulasi screening brutal 6 detik...",
  "Mendeteksi kata klise generik ('hardworking', 'team player', 'responsible for')...",
  "Menghitung dampak kuantitatif & formula Google X-Y-Z...",
  "Mensimulasikan parser ATS (Workday / Greenhouse / Lever / Taleo)...",
  "Menyusun realitas check, roasting brutal, & rewrite standar BANGKAH...",
];

export const LoadingRoastAnimation: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto py-16 px=4 flex flex-col items-center justify-center text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 flex items-center justify-center shadow-xl text-coral-500 soft-shadow"><Flame className="w-10 h-10 animate-pulse" /></div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 shadow-sm"><Brain className="w-4 h-4 animate-spin" /></div>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-coral-500 text-xs font-bold uppercase tracking-widest mb-4 soft-shadow">
        <div className="w-2 h-2 rounded-full bg-coral-500 animate-pulse"></div>
        Processing Industry Reality Check
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Brutal HR Audit In Progress...</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-8">Strict criteria calibrated against global top-tier hiring standards.</p>

      <div className="w-full bg-white border border-slate-200 rounded-3xl p=6 text-left soft-shadow-lg page-fade">
        <div className="space-y-3.5">
          {LOADING_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={step} className={`flex items-center gap-3 text-xs sm:text-sm transition-all duration-300 ${isCurrent ? "text-coral-600 font-bold translate-x-1" : isCompleted ? "text-slate-500" : "text-slate-400"}`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 border-2 border-coral-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-200 flex-shrink-0" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

