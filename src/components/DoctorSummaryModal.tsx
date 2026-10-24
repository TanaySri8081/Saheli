"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCycle } from "@/context/CycleContext";

interface DoctorSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DoctorSummaryModal({ isOpen, onClose }: DoctorSummaryModalProps) {
  const { language } = useLanguage();
  const { profile, periodLogs, symptomLogs, rollingAvgLength, prediction } = useCycle();

  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Compute average pain level from recent logs
  const painScores = symptomLogs.map((l) => l.pain_level);
  const avgPain = painScores.length > 0
    ? (painScores.reduce((a, b) => a + b, 0) / painScores.length).toFixed(1)
    : "N/A";
  const maxPain = painScores.length > 0 ? Math.max(...painScores) : 0;

  // Aggregate symptoms
  const symptomCounts: Record<string, number> = {};
  symptomLogs.forEach((l) => {
    l.symptoms.forEach((s) => {
      symptomCounts[s] = (symptomCounts[s] || 0) + 1;
    });
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white text-zinc-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 print:shadow-none print:max-w-none print:w-full print:p-8 font-sans">
        {/* Top Actions */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#482e47] text-white flex items-center justify-center font-serif text-sm">
              स
            </span>
            <span className="font-serif text-lg font-semibold text-[#482e47]">
              {language === "hi" ? "डॉक्टर परामर्श सारांश" : "Clinical Consultation Summary"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#482e47] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#60445f] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>{language === "hi" ? "प्रिंट / PDF" : "Print / PDF"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Document Header */}
        <div className="space-y-1 border-b border-zinc-200 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#482e47]">
                Saheli — Gynecological Patient Summary
              </h2>
              <p className="text-xs text-zinc-500">
                Self-Reported Menstrual & Symptom Record (India DPDP Act Compliant)
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              {new Date().toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 text-xs bg-zinc-50 p-3 rounded-xl border border-zinc-200">
            <div>
              <span className="text-zinc-500 block">Patient Display ID</span>
              <span className="font-semibold text-zinc-800">{profile.display_name}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Cycle Rhythm</span>
              <span className="font-semibold text-zinc-800 capitalize">{profile.cycle_rhythm_type}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Rolling Avg Cycle</span>
              <span className="font-semibold text-zinc-800">{rollingAvgLength} Days (±{prediction.uncertaintyDays}d)</span>
            </div>
          </div>
        </div>

        {/* Section 1: Cycle History */}
        <div className="space-y-2">
          <h3 className="font-serif text-sm font-bold text-zinc-800 uppercase tracking-wide">
            1. Recorded Period Starts & Cycle Intervals
          </h3>
          <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
            <div className="grid grid-cols-3 bg-zinc-100 font-semibold p-2 text-zinc-600">
              <span>Start Date</span>
              <span>Flow Intensity</span>
              <span>Notes</span>
            </div>
            {periodLogs.length > 0 ? (
              periodLogs.slice(0, 5).map((log, idx) => (
                <div key={idx} className="grid grid-cols-3 p-2 border-t border-zinc-200 text-zinc-700">
                  <span className="font-medium">{log.start_date}</span>
                  <span className="capitalize">{log.flow_intensity || "Medium"}</span>
                  <span className="truncate">{log.notes || "—"}</span>
                </div>
              ))
            ) : (
              <p className="p-3 text-zinc-400 italic">No cycle history logged yet.</p>
            )}
          </div>
        </div>

        {/* Section 2: Pain & Symptom Profile */}
        <div className="space-y-2">
          <h3 className="font-serif text-sm font-bold text-zinc-800 uppercase tracking-wide">
            2. Pain Score Profile & Reported Symptoms
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
              <span className="text-zinc-500 block">Average Reported Pain:</span>
              <span className="font-serif text-xl font-bold text-zinc-800">{avgPain} / 10</span>
              <span className="text-[11px] text-zinc-400 block">Peak Recorded: {maxPain}/10</span>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
              <span className="text-zinc-500 block">Dysmenorrhea Severity:</span>
              <span className={`font-semibold ${maxPain >= 7 ? "text-red-700" : maxPain >= 4 ? "text-amber-700" : "text-green-700"}`}>
                {maxPain >= 7 ? "Severe (Clinical Triage Advised)" : maxPain >= 4 ? "Moderate" : "Mild"}
              </span>
              <span className="text-[11px] text-zinc-400 block">
                {maxPain >= 7 ? "Screen for Endometriosis/Adenomyosis" : "Within manageable range"}
              </span>
            </div>
          </div>

          {/* Top Frequent Symptoms */}
          <div>
            <span className="text-xs text-zinc-500 block mb-1">Frequently Logged Bodily Symptoms:</span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(symptomCounts).length > 0 ? (
                Object.entries(symptomCounts).map(([sym, count], idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-800 text-xs border border-zinc-200">
                    {sym} ({count}x)
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-400 italic">No symptoms logged.</span>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Clinical Flags */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <span className="font-bold block mb-1">Clinical Note for Attending Physician:</span>
          This document summarizes patient-reported retrospective data recorded in the Saheli application. FOGSI/ACOG guidelines recommend pelvic ultrasound and hormone panel evaluation if severe cyclical pelvic pain (≥7/10) or chronic oligomenorrhea (cycle &gt;35 days) is reported.
        </div>

        {/* Print Footer */}
        <div className="pt-3 border-t border-zinc-200 flex justify-between items-center text-[11px] text-zinc-400">
          <span>Saheli • Free & Private Companion</span>
          <span>Confidential Medical Information</span>
        </div>
      </div>
    </div>
  );
}
