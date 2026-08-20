import React, { useState } from "react";
import { Header } from "./components/Header";
import { CVInputSection } from "./components/CVInputSection";
import { LoadingRoastAnimation } from "./components/LoadingRoastAnimation";
import { ReviewDashboard } from "./components/ReviewDashboard";
import { InteractiveHRConsultant } from "./components/InteractiveHRConsultant";
import { BulletRewriterModal } from "./components/BulletRewriterModal";
import { DigitalFootprintSection } from "./components/DigitalFootprintSection";
import { GitHubRoasterSection } from "./components/GitHubRoasterSection";
import { AppMode, CVReviewRequest, CVReviewResult } from "./types";
import { triggerConfetti } from "./utils/helpers";
import { safeFetchJson } from "./utils/api";
import { AlertCircle, Flame, RotateCcw } from "lucide-react";

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>("cv_roaster");
  const [reviewResult, setReviewResult] = useState<CVReviewResult | null>(null);
  const [lastSubmittedCvText, setLastSubmittedCvText] = useState("");
  const [lastRequest, setLastRequest] = useState<CVReviewRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [targetRole, setTargetRole] = useState("Software Engineer");

  // Modals state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRewriterOpen, setIsRewriterOpen] = useState(false);
  const [rewriterInitialText, setRewriterInitialText] = useState("");

  const handleReviewCV = async (request: CVReviewRequest) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTargetRole(request.targetRole);
    setLastSubmittedCvText(request.cvText || "");
    setLastRequest(request);

    try {
      const res = await safeFetchJson<CVReviewResult>("/api/review-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || "Gagal melakukan evaluasi CV.");
      }

      setReviewResult(res.data);

      if (res.data.overallScore >= 80) {
        triggerConfetti();
      }

      // Smooth scroll to top of review
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Evaluation error:", err);
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses CV.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastRequest) {
      handleReviewCV(lastRequest);
    }
  };

  const handleReset = () => {
    setReviewResult(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenRewriterWithText = (text?: string) => {
    setRewriterInitialText(text || "");
    setIsRewriterOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-red-500 selection:text-white relative overflow-x-hidden">
      {/* Top Ambient Glow Background */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-red-600/5 blur-[120px] pointer-events-none -z-10 rounded-full"></div>

      {/* Navbar with 3 Mode Switchers */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          setErrorMessage(null);
        }}
        onReset={handleReset}
        hasResult={Boolean(reviewResult)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {errorMessage && (
          <div className="max-w-4xl mx-auto mt-6 px-4">
            <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-red-300 text-xs sm:text-sm shadow-2xl backdrop-blur-md">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
                <div>
                  <strong className="block font-bold text-red-200 uppercase tracking-wide text-xs mb-1">
                    Evaluasi Terkendala (Trafik Server AI):
                  </strong>
                  <span className="text-zinc-300 leading-relaxed text-xs">{errorMessage}</span>
                </div>
              </div>

              {lastRequest && (
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 self-start sm:self-auto flex-shrink-0 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Coba Lagi Sekarang</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 1. Mode: CV Roaster */}
        {currentMode === "cv_roaster" && (
          <>
            {isLoading ? (
              <LoadingRoastAnimation />
            ) : reviewResult ? (
              <ReviewDashboard
                result={reviewResult}
                targetRole={targetRole}
                onOpenChat={() => setIsChatOpen(true)}
                onOpenRewriter={handleOpenRewriterWithText}
                onNavigateToDigitalFootprint={() => setCurrentMode("digital_footprint")}
                onNavigateToGithubRoast={() => setCurrentMode("github_roaster")}
              />
            ) : (
              <CVInputSection onSubmit={handleReviewCV} isLoading={isLoading} />
            )}
          </>
        )}

        {/* 2. Mode: Audit Jejak Digital */}
        {currentMode === "digital_footprint" && (
          <DigitalFootprintSection
            initialCvText={lastSubmittedCvText}
            initialTargetRole={targetRole}
            onRoastAnother={() => {}}
          />
        )}

        {/* 3. Mode: GitHub Roaster (Programmer Edition) */}
        {currentMode === "github_roaster" && (
          <GitHubRoasterSection
            initialTargetRole={targetRole}
            initialClaimedTechStack="React, Node.js, TypeScript, Next.js, Docker, Kubernetes"
          />
        )}
      </main>

      {/* Floating Follow-up Chat & Rewriter Modals for CV */}
      <InteractiveHRConsultant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        cvContext={reviewResult}
        targetRole={targetRole}
      />

      <BulletRewriterModal
        isOpen={isRewriterOpen}
        onClose={() => setIsRewriterOpen(false)}
        initialText={rewriterInitialText}
        defaultRole={targetRole}
      />

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-zinc-400">
              HR Savage CV Reviewer &amp; Developer Roaster
            </span>
          </div>
          <p className="text-zinc-500 text-[11px]">CV Roast • Jejak Digital Checker • GitHub Roaster • Powered by Gemini 3.7 Flash</p>
        </div>
      </footer>
    </div>
  );
}
