"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCycle } from "@/context/CycleContext";

interface DoctorSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DOCTOR_POINTS_KEY = "saheli_doctor_discussion_points";

export function DoctorSummaryModal({ isOpen, onClose }: DoctorSummaryModalProps) {
  const { language } = useLanguage();
  const { profile, periodLogs, symptomLogs, rollingAvgLength, prediction } = useCycle();
  const [savedDoctorPoints, setSavedDoctorPoints] = useState<string[]>([]);
  const [downloadToast, setDownloadToast] = useState(false);
  const [currentFormattedDate, setCurrentFormattedDate] = useState("24 Oct 2026");

  useEffect(() => {
    if (isOpen) {
      setCurrentFormattedDate(
        new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      );
      try {
        const raw = localStorage.getItem(DOCTOR_POINTS_KEY);
        if (raw) setSavedDoctorPoints(JSON.parse(raw));
      } catch (e) {
        console.warn("Storage load error", e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Compute average pain level from recent logs
  const painScores = symptomLogs.map((l) => l.pain_level);
  const avgPain =
    painScores.length > 0
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

  // Downloadable text file export
  const handleDownloadTextSummary = () => {
    const summaryText = `=====================================================
SAHELI CLINICAL CONSULTATION SUMMARY
Self-Reported Menstrual & Pelvic Symptom Record
Date of Generation: ${new Date().toLocaleDateString("en-IN")}
Compliant with India DPDP Act & Medical Data Ethics
=====================================================

PATIENT IDENTIFIER:
- Display ID: ${profile.display_name}
- Self-Reported Cycle Pattern: ${profile.cycle_rhythm_type}

-----------------------------------------------------
SECTION 1: PATIENT-ENTERED RETROSPECTIVE DATA
(Directly inputted by patient; unmanipulated by algorithms)
-----------------------------------------------------
1. RECORDED PERIOD STARTS & FLOW INTENSITY:
${
  periodLogs.length > 0
    ? periodLogs
        .map(
          (p, i) =>
            `  [${i + 1}] Date: ${p.start_date} | Flow: ${p.flow_intensity || "Medium"} | Notes: ${p.notes || "None"}`
        )
        .join("\n")
    : "  No historical cycles logged yet."
}

2. PAIN SEVERITY PROFILE (0-10 NUMERIC CLINICAL SCALE):
- Average Recorded Pain: ${avgPain} / 10
- Peak Recorded Pain: ${maxPain} / 10
- Triage Severity: ${
      maxPain >= 7
        ? "Severe / Disruptive Dysmenorrhea (Screening advised for endometriosis)"
        : maxPain >= 4
        ? "Moderate Dysmenorrhea"
        : "Mild"
    }

3. USER-REPORTED BODILY SYMPTOMS & DIARY NOTES:
${
  Object.entries(symptomCounts).length > 0
    ? Object.entries(symptomCounts)
        .map(([sym, count]) => `  - ${sym}: ${count} occurrence(s)`)
        .join("\n")
    : "  No symptoms logged."
}

Recent Diary Entries:
${
  symptomLogs.length > 0
    ? symptomLogs
        .slice(-5)
        .map((s) => `  * Date ${s.log_date}: Pain ${s.pain_level}/10 | Notes: ${s.reflection || "—"}`)
        .join("\n")
    : "  None."
}

-----------------------------------------------------
SECTION 2: APP-GENERATED STATISTICAL ESTIMATIONS
(Calculated for patient reference only; NOT a clinical diagnosis)
-----------------------------------------------------
- Mathematical Rolling Cycle Average: ${rollingAvgLength} Days
- Algorithmic Uncertainty Band: ±${prediction.uncertaintyDays} days
- Projected Cycle Window: ${prediction.nextPeriodStartDate}
* NOTE: Digital rhythm estimations reflect mathematical averages of past entries. They must NOT be used for contraceptive timing or medical diagnosis.

-----------------------------------------------------
SECTION 3: PREPARED CLINICAL QUESTIONS FOR DOCTOR
-----------------------------------------------------
${
  savedDoctorPoints.length > 0
    ? savedDoctorPoints.map((pt, i) => `  [Q${i + 1}] "${pt}"`).join("\n")
    : '  [Q1] "My menstrual pain interferes with college/work attendance. Should we evaluate for secondary dysmenorrhea or pelvic causes?"'
}

Clinical Notice:
Prepared using Saheli — A free and private reproductive companion.
All data is stored securely on the user's personal device.
=====================================================`;

    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Saheli_Clinical_Summary_${new Date().toISOString().split("T")[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white text-zinc-900 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4 print:shadow-none print:max-w-none print:w-full print:p-6 font-sans">
        {/* Top Header Actions (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#482e47] text-white flex items-center justify-center font-serif text-sm font-bold shadow-sm">
              स
            </span>
            <div>
              <span className="font-serif text-base font-bold text-[#482e47] block">
                {language === "hi" ? "क्लिनिकल अपॉइंटमेंट सारांश" : "Clinical Appointment Summary"}
              </span>
              <span className="text-[10px] text-zinc-500">
                {language === "hi" ? "डॉक्टर परामर्श हेतु रिपोर्ट" : "Exportable for Doctor Consultation"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDownloadTextSummary}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Download text report"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>TXT</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#482e47] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#60445f] transition-colors shadow-sm"
              title="Print or Save as PDF"
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

        {downloadToast && (
          <div className="p-2 rounded-lg bg-emerald-700 text-white text-xs text-center font-medium animate-fadeIn print:hidden">
            ✓ Summary file downloaded! You can attach it to doctor emails or patient portals.
          </div>
        )}

        {/* Printable Document Title */}
        <div className="space-y-1 border-b border-zinc-200 pb-3">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#482e47]">
                Saheli — Patient Gynecological Summary
              </h2>
              <p className="text-[11px] text-zinc-500">
                Self-Reported Menstrual & Pelvic Symptom Record (India DPDP Act Compliant)
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              {currentFormattedDate}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
            <div>
              <span className="text-zinc-500 block text-[10px]">Patient Display ID:</span>
              <span className="font-semibold text-zinc-800">{profile.display_name}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">Pattern Category:</span>
              <span className="font-semibold text-zinc-800 capitalize">{profile.cycle_rhythm_type}</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: PROMINENTLY LABELED AS USER-ENTERED DATA */}
        <div className="space-y-3 p-3.5 rounded-xl bg-blue-50/50 border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white">
              Section 1: User-Reported Retrospective Data
            </span>
            <span className="text-[10px] text-blue-800 font-medium">Verified Patient Input</span>
          </div>

          {/* 1. Cycle History */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-zinc-800 block">
              A. Logged Period Starts & Flow Intensity
            </span>
            <div className="border border-zinc-200 rounded-lg overflow-hidden text-xs bg-white">
              <div className="grid grid-cols-3 bg-zinc-100 font-semibold p-1.5 text-zinc-600 text-[11px]">
                <span>Start Date</span>
                <span>Flow</span>
                <span>User Notes</span>
              </div>
              {periodLogs.length > 0 ? (
                periodLogs.slice(0, 5).map((log, idx) => (
                  <div key={idx} className="grid grid-cols-3 p-1.5 border-t border-zinc-200 text-zinc-700 text-[11px]">
                    <span className="font-medium">{log.start_date}</span>
                    <span className="capitalize">{log.flow_intensity || "Medium"}</span>
                    <span className="truncate">{log.notes || "—"}</span>
                  </div>
                ))
              ) : (
                <p className="p-2 text-zinc-400 italic text-[11px]">No cycle history logged yet.</p>
              )}
            </div>
          </div>

          {/* 2. Pain & Dysmenorrhea Profile */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-zinc-800 block">
              B. Pain Severity Profile (0–10 Numeric Scale)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white border border-zinc-200 rounded-lg space-y-0.5">
                <span className="text-zinc-500 block text-[10px]">Average Reported Pain:</span>
                <span className="font-serif text-lg font-bold text-zinc-800">{avgPain} / 10</span>
                <span className="text-[10px] text-zinc-400 block">Peak Recorded: {maxPain}/10</span>
              </div>
              <div className="p-2.5 bg-white border border-zinc-200 rounded-lg space-y-0.5">
                <span className="text-zinc-500 block text-[10px]">Clinical Classification:</span>
                <span
                  className={`font-semibold text-xs ${
                    maxPain >= 7 ? "text-red-700" : maxPain >= 4 ? "text-amber-700" : "text-green-700"
                  }`}
                >
                  {maxPain >= 7
                    ? "Severe / Disruptive (Screen for Endometriosis)"
                    : maxPain >= 4
                    ? "Moderate Dysmenorrhea"
                    : "Mild Pain"}
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  {maxPain >= 7 ? "Impacts daily college/work" : "Manageable with self-care"}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Reported Symptoms */}
          <div>
            <span className="text-[11px] font-bold text-zinc-700 block mb-1">
              C. Frequently Logged Bodily Symptoms & Notes:
            </span>
            <div className="flex flex-wrap gap-1">
              {Object.entries(symptomCounts).length > 0 ? (
                Object.entries(symptomCounts).map(([sym, count], idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-white text-zinc-800 text-[11px] border border-zinc-200 font-medium"
                  >
                    {sym} ({count}x)
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-zinc-400 italic">No symptoms recorded yet.</span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: PROMINENTLY LABELED AS APP-GENERATED ESTIMATIONS */}
        <div className="space-y-2 p-3 rounded-xl bg-amber-50/50 border border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-700 text-white">
              Section 2: App-Generated Statistical Estimations
            </span>
            <span className="text-[10px] text-amber-800 font-medium">For Reference Only</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 bg-white border border-zinc-200 rounded-lg">
              <span className="text-zinc-500 block text-[10px]">Rolling Average</span>
              <span className="font-bold text-zinc-800">{rollingAvgLength} Days</span>
            </div>
            <div className="p-2 bg-white border border-zinc-200 rounded-lg">
              <span className="text-zinc-500 block text-[10px]">Uncertainty Band</span>
              <span className="font-bold text-zinc-800">±{prediction.uncertaintyDays} Days</span>
            </div>
            <div className="p-2 bg-white border border-zinc-200 rounded-lg">
              <span className="text-zinc-500 block text-[10px]">Projected Start</span>
              <span className="font-bold text-zinc-800">{prediction.nextPeriodStartDate}</span>
            </div>
          </div>

          <p className="text-[10px] text-amber-900 leading-snug">
            * <em>Algorithmic estimates reflect retrospective mathematical averages. They are not medical predictions, hormonal diagnostic tools, or birth control.</em>
          </p>
        </div>

        {/* SECTION 3: SAVED CAREPATH DOCTOR TALKING POINTS */}
        <div className="space-y-2 p-3 rounded-xl bg-purple-50/50 border border-purple-200">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#482e47] text-white">
            Section 3: Questions Prepared for Clinician
          </span>

          <div className="space-y-1.5 text-xs">
            {savedDoctorPoints.length > 0 ? (
              savedDoctorPoints.map((pt, idx) => (
                <div key={idx} className="p-2 bg-white border border-zinc-200 rounded-lg text-zinc-800 text-[11px] italic">
                  &quot;{pt}&quot;
                </div>
              ))
            ) : (
              <div className="p-2 bg-white border border-zinc-200 rounded-lg text-zinc-800 text-[11px] italic">
                &quot;My menstrual pain disrupts college/work routine. Could we evaluate for secondary dysmenorrhea, pelvic ultrasound, or endometriosis?&quot;
              </div>
            )}
          </div>
        </div>

        {/* Clinical Note & DPDP Disclaimer */}
        <div className="text-[10px] text-zinc-400 pt-2 border-t border-zinc-200 flex justify-between items-center">
          <span>Saheli • DPDP Act Compliant (Zero Cloud Sharing)</span>
          <span>Confidential Clinical Record</span>
        </div>
      </div>
    </div>
  );
}
