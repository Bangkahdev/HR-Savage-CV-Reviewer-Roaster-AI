import React from "react";
import { Search, Code2, FileText, RefreshCw, Sparkles } from "lucide-react";
import { AppMode } from "../types";

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onReset: () => void;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onReset,
  hasResult,
}) => {
  const modeConfigs: Record<AppMode, { icon: React.ElementType; label: string }> = {
    cv_roaster: { icon: FileText, label: "CV Roaster" },
    digital_footprint: { icon: Search, label: "Jejak Digital" },
    github_roaster: { icon: Code2, label: "GitHub Roaster" },
  };

  return (
    <header className="w-full bg-white/90 border-b border-slate-200/80 sticky top-0 z-40 backdrop-blur-xl transition-all soft-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onReset}
          id="header-brand-logo"
        >
          <div className="relative">
            <img
              src="/src/assets/logo.svg"
              alt="HR Savage Logo"
              className="w-10 h-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute -inset-0.5 bg-coral-100/60 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase font-sans flex items-center gap-1.5">
                ROAST MY CV <span className="text-coral-600 font-extrabold">&amp; DEV</span>
              </h1>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-coral-50 text-coral-700 border border-coral-200/60 rounded-md">
                AI HR v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Savage HR Roaster • Jejak Digital Checker • GitHub Roaster
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 border border-slate-200/80 rounded-xl shadow-sm max-w-full overflow-x-auto">
          {Object.entries(modeConfigs).map(([mode, config]) => {
            const active = currentMode === mode;
            const Icon = config.icon;
            return (
              <button
                key={mode}
                onClick={() => onSelectMode(mode as AppMode)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  active
                    ? "bg-white border-coral-200 text-coral-700 shadow-sm"
                    : "text-slate-400 hover:text-coral-600 hover:bg-coral-50/50"
                }`}
                id={`tab-mode-${mode.replace("_", "-")}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Status */}
        <div className="hidden lg:flex items-center gap-2.5">
          {hasResult && currentMode === "cv_roaster" && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 hover:text-slate-900 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3 h-3 text-coral-500" />
              <span>Ganti CV</span>
            </button>
          )}

          <div className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-coral-500" /> HR ACTIVE
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

