import React from "react";
import { Search, Github, FileText, RefreshCw, Sparkles } from "lucide-react";
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
  return (
    <header className="w-full bg-zinc-950/90 border-b border-zinc-800/80 sticky top-0 z-40 backdrop-blur-xl transition-all">
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
            <div className="absolute -inset-0.5 bg-red-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-sans flex items-center gap-1.5">
                ROAST MY CV <span className="text-red-500 font-extrabold">&amp; DEV</span>
              </h1>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-red-950/90 text-red-400 border border-red-800/60 rounded-md">
                AI HR v3.0
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">
              Savage HR Roaster • Jejak Digital Checker • GitHub Roaster
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900/90 border border-zinc-800/80 rounded-xl shadow-inner max-w-full overflow-x-auto">
          <button
            onClick={() => onSelectMode("cv_roaster")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentMode === "cv_roaster"
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-950/50"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
            }`}
            id="tab-mode-cv"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CV Roaster</span>
          </button>

          <button
            onClick={() => onSelectMode("digital_footprint")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentMode === "digital_footprint"
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-950/50"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
            }`}
            id="tab-mode-digital-footprint"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Jejak Digital</span>
          </button>

          <button
            onClick={() => onSelectMode("github_roaster")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentMode === "github_roaster"
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-950/50"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
            }`}
            id="tab-mode-github"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Roasted</span>
          </button>
        </div>

        {/* Right Status */}
        <div className="hidden lg:flex items-center gap-2.5">
          {hasResult && currentMode === "cv_roaster" && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3 h-3 text-red-400" />
              <span>Ganti CV</span>
            </button>
          )}

          <div className="bg-zinc-900/80 border border-zinc-700/60 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-red-500" /> FAANG HR ACTIVE
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

