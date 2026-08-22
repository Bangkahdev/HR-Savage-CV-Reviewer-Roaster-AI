import React, { useState, useEffect } from "react";
import { Flame, Brain, CheckCircle2 } from "lucide-react";

const LOADING_STEPS = [
  "Opening CV document and initializing savage HR lens...",
  "Running 6-second brutal screening simulation...",
  "Detecting generic buzzwords ('hardworking', 'team player', 'responsible for')...",
  "Calculating quantitative impact density & Google X-Y-Z formula...",
  "Simulating ATS Parser (Workday / Greenhouse / Lever / Taleo)...",
  "Compiling reality check, brutal roast & BANGKAH-grade rewrite...",
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
    <div className="w-full max-w-2xl mx-auto py-16 px-4 flex flex-col items-center justify-center text-center">
      <div className="relative mb-6">
        {/* Bento icon box */}
        <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-xl text-red-500">
          <Flame className="w-10 h-10 animate-pulse" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-zinc-950 border border-zinc-700 flex items-center justify-center text-zinc-300">
          <Brain className="w-4 h-4 animate-spin" />
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-700 text-red-500 text-xs font-bold uppercase tracking-widest mb-3">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        Processing Industry Reality Check
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-zinc-100 uppercase tracking-tight mb-2">
        Brutal HR Audit In Progress...
      </h3>
      <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-8">
        Strict criteria calibrated against global top-tier hiring standards.
      </p>

      {/* Progress Steps Box */}
      <div className="w-full bg-zinc-900 rounded-2xl border border-zinc-800 p-6 text-left shadow-2xl">
        <div className="space-y-3.5">
          {LOADING_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={step}
                className={`flex items-center gap-3 text-xs sm:text-sm transition-all duration-300 ${
                  isCurrent
                    ? "text-red-400 font-bold translate-x-1"
                    : isCompleted
                    ? "text-zinc-500"
                    : "text-zinc-700"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-zinc-800 flex-shrink-0" />
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

