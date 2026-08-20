import { jsPDF } from "jspdf";
import confetti from "canvas-confetti";
import { CVReviewResult } from "../types";

export function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"],
  });
}

export function getScoreTheme(score: number): {
  color: string;
  bgLight: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  label: string;
} {
  if (score >= 90) {
    return {
      color: "text-emerald-600 dark:text-emerald-400",
      bgLight: "bg-emerald-500/10",
      borderColor: "border-emerald-500/40",
      badgeBg: "bg-emerald-500 text-white",
      badgeText: "text-emerald-700 dark:text-emerald-300",
      label: "Tier S: Shortlist Langsung / Standar Elit",
    };
  }
  if (score >= 80) {
    return {
      color: "text-teal-600 dark:text-teal-400",
      bgLight: "bg-teal-500/10",
      borderColor: "border-teal-500/40",
      badgeBg: "bg-teal-600 text-white",
      badgeText: "text-teal-700 dark:text-teal-300",
      label: "Tier A: Sangat Kompetitif",
    };
  }
  if (score >= 65) {
    return {
      color: "text-amber-600 dark:text-amber-400",
      bgLight: "bg-amber-500/10",
      borderColor: "border-amber-500/40",
      badgeBg: "bg-amber-600 text-white",
      badgeText: "text-amber-700 dark:text-amber-300",
      label: "Tier B/C: Rata-rata / Banyak Celah",
    };
  }
  if (score >= 50) {
    return {
      color: "text-orange-600 dark:text-orange-400",
      bgLight: "bg-orange-500/10",
      borderColor: "border-orange-500/40",
      badgeBg: "bg-orange-600 text-white",
      badgeText: "text-orange-700 dark:text-orange-300",
      label: "Tier D: Medioker & Perlu Rombak Besar",
    };
  }
  return {
    color: "text-rose-600 dark:text-rose-400",
    bgLight: "bg-rose-500/10",
    borderColor: "border-rose-500/40",
    badgeBg: "bg-rose-600 text-white",
    badgeText: "text-rose-700 dark:text-rose-300",
    label: "Tier F: Auto-Reject HR dalam 4 Detik",
  };
}

export function exportReviewToPdf(review: CVReviewResult, targetRole: string) {
  const doc = new jsPDF();
  let y = 20;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(220, 38, 38);
  doc.text("LAPORAN AUDIT & ROASTING CV - HR SAVAGE AI", 14, y);
  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`Target Posisi: ${targetRole} | Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 14, y);
  y += 10;

  // Score & Grade
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14, y, 182, 24, 3, 3, "F");
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text(`SKOR KESELURUHAN: ${review.overallScore}/100 (Grade: ${review.grade})`, 20, y + 10);
  doc.setFontSize(11);
  doc.setTextColor(180, 40, 40);
  doc.text(`Vonis HR: ${review.verdictTag}`, 20, y + 18);
  y += 32;

  // Summary Roast
  doc.setFontSize(12);
  doc.setTextColor(180, 30, 30);
  doc.text("THE SAVAGE HR ROAST:", 14, y);
  y += 7;
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  const splitRoast = doc.splitTextToSize(review.summaryRoast, 180);
  doc.text(splitRoast, 14, y);
  y += splitRoast.length * 5 + 8;

  // Fatal Red Flags
  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(12);
  doc.setTextColor(220, 38, 38);
  doc.text("FATAL RED FLAGS (DEALBREAKERS):", 14, y);
  y += 7;

  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  review.fatalRedFlags.forEach((flag, idx) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(`${idx + 1}. [${flag.severity.toUpperCase()}] ${flag.title}`, 14, y);
    y += 5;
    const splitExp = doc.splitTextToSize(`   Masalah: ${flag.explanation}`, 175);
    doc.text(splitExp, 14, y);
    y += splitExp.length * 4.5;
    const splitFix = doc.splitTextToSize(`   Solusi HR: ${flag.fix}`, 175);
    doc.text(splitFix, 14, y);
    y += splitFix.length * 4.5 + 3;
  });

  // Action Plan
  if (y > 230) {
    doc.addPage();
    y = 20;
  }
  y += 5;
  doc.setFontSize(12);
  doc.setTextColor(16, 185, 129);
  doc.text("RENCANA AKSI PERBAIKAN DARURAT:", 14, y);
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  review.stepByStepActionPlan.forEach((plan) => {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }
    doc.text(`Langkah ${plan.step} (${plan.priority}): ${plan.action}`, 14, y);
    y += 5;
    const splitEx = doc.splitTextToSize(`Contoh: ${plan.example}`, 175);
    doc.text(splitEx, 18, y);
    y += splitEx.length * 4.5 + 4;
  });

  doc.save(`Audit_CV_HRSavage_${targetRole.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
}
