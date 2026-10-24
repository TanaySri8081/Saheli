"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCycle } from "@/context/CycleContext";
import { formatDate, parseDate, diffInDays, getPhaseForCycleDay } from "@/lib/cycleMath";
import { FlowIntensity } from "@/types";
import { DoctorSummaryModal } from "@/components/DoctorSummaryModal";

export default function MyCyclePage() {
  const { language, t } = useLanguage();
  const {
    profile,
    periodLogs,
    logPeriod,
    removePeriodLog,
    currentCycleDay,
    rollingAvgLength,
    prediction,
    getSymptomForDate,
  } = useCycle();

  // Active viewing month (Deterministic for SSR hydration)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 24));
  const [selectedDateStr, setSelectedDateStr] = useState<string>("2026-10-24");
  const [todayStr, setTodayStr] = useState<string>("2026-10-24");
  const [isLoggingModalOpen, setIsLoggingModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [modalFlow, setModalFlow] = useState<FlowIntensity>("medium");

  React.useEffect(() => {
    setCurrentDate(new Date());
    setSelectedDateStr(formatDate(new Date()));
    setTodayStr(formatDate(new Date()));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Days calculations for monthly grid
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNamesEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthNamesHi = [
    "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
    "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
  ];
  const currentMonthName = language === "hi" ? monthNamesHi[month] : monthNamesEn[month];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Determine styling for each day in current month
  const getDayStatus = (dayNum: number) => {
    const dateObj = new Date(year, month, dayNum);
    const dateStr = formatDate(dateObj);
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selectedDateStr;

    // Check if recorded period start
    const isPeriodLog = periodLogs.some((l) => l.start_date === dateStr);

    // Check if within predicted window
    const predStart = parseDate(prediction.nextPeriodStartDate);
    const predEnd = parseDate(prediction.nextPeriodEndDate);
    const isPredictedPeriod = dateObj >= predStart && dateObj <= predEnd;

    // Check if within fertile/ovulation window
    const fertStart = parseDate(prediction.fertileWindowStart);
    const fertEnd = parseDate(prediction.fertileWindowEnd);
    const isFertile = dateObj >= fertStart && dateObj <= fertEnd;
    const isOvulation = dateStr === prediction.estimatedOvulationDate;

    // Check if symptoms logged
    const symptomEntry = getSymptomForDate(dateStr);
    const hasSymptoms = symptomEntry !== null;

    return {
      dateStr,
      isToday,
      isSelected,
      isPeriodLog,
      isPredictedPeriod,
      isFertile,
      isOvulation,
      hasSymptoms,
      symptomEntry,
    };
  };

  const selectedLog = getSymptomForDate(selectedDateStr);
  const isSelectedPeriod = periodLogs.some((l) => l.start_date === selectedDateStr);

  const handleQuickLogPeriod = () => {
    logPeriod({
      start_date: selectedDateStr,
      flow_intensity: modalFlow,
      is_predicted: false,
      notes: "Logged from interactive calendar.",
    });
    setIsLoggingModalOpen(false);
  };

  const handlePrintSummary = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <main className="flex-1 w-full px-4 py-5 flex flex-col gap-5 max-w-md mx-auto">
      {/* 1. Month Navigation Header */}
      <section className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
            {language === "hi" ? "माहवारी चक्र व कैलेंडर" : "Cycle & Menstrual Calendar"}
          </span>
          <h1 className="font-serif text-2xl font-medium text-primary">
            {currentMonthName} {year}
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full bg-surface-container hover:bg-surface-container-high text-primary transition-colors"
            aria-label="Previous Month"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-container text-primary hover:bg-surface-container-high transition-colors"
          >
            {language === "hi" ? "आज" : "Today"}
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full bg-surface-container hover:bg-surface-container-high text-primary transition-colors"
            aria-label="Next Month"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </section>

      {/* 2. Interactive Calendar Matrix */}
      <section className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, idx) => (
            <span
              key={d}
              className={`text-[11px] font-semibold py-1 ${
                idx === 0 || idx === 6 ? "text-outline" : "text-on-surface-variant"
              }`}
            >
              {language === "hi"
                ? ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"][idx]
                : d}
            </span>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty cells before 1st of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-11" />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const status = getDayStatus(dayNum);

            let bgClass = "bg-surface-container-low hover:bg-surface-container";
            let textClass = "text-on-surface";
            let borderClass = "border border-transparent";

            if (status.isPeriodLog) {
              bgClass = "bg-[#ffdad4]";
              textClass = "text-[#724038] font-bold";
              borderClass = "border border-[#724038]/40";
            } else if (status.isPredictedPeriod) {
              bgClass = "bg-[#ffdad4]/40";
              textClass = "text-[#724038] font-semibold";
              borderClass = "border border-dashed border-[#724038]";
            } else if (status.isFertile) {
              bgClass = status.isOvulation ? "bg-secondary-container" : "bg-secondary-container/50";
              textClass = "text-[#00210e] font-semibold";
              borderClass = status.isOvulation ? "border-2 border-secondary" : "border border-secondary/30";
            }

            if (status.isSelected) {
              borderClass = "ring-2 ring-primary ring-offset-1";
            }

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => setSelectedDateStr(status.dateStr)}
                className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition-all ${bgClass} ${textClass} ${borderClass}`}
              >
                <span className="text-xs">{dayNum}</span>

                {/* Dot markers */}
                <div className="flex gap-0.5 items-center justify-center mt-0.5">
                  {status.isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                  {status.hasSymptoms && !status.isToday && (
                    <span className="w-1 h-1 rounded-full bg-secondary" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-outline-variant/20 flex flex-wrap gap-3 justify-center text-[10px] text-on-surface-variant font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ffdad4] border border-[#724038]" />
            <span>{language === "hi" ? "माहवारी (Period)" : "Logged Period"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border border-dashed border-[#724038] bg-[#ffdad4]/40" />
            <span>{language === "hi" ? "अनुमानित माहवारी" : "Predicted Period"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-secondary-container border border-secondary" />
            <span>{language === "hi" ? "अंडोत्सर्ग विंडो" : "Ovulation Window"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>{language === "hi" ? "आज" : "Today"}</span>
          </span>
        </div>
      </section>

      {/* 3. Selected Date Detail Sheet */}
      <section className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">event</span>
            <h3 className="font-serif text-base font-medium text-primary">
              {language === "hi" ? `चयनित तिथि: ${selectedDateStr}` : `Selected: ${selectedDateStr}`}
            </h3>
          </div>

          {isSelectedPeriod ? (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ffdad4] text-[#724038]">
              {language === "hi" ? "माहवारी दर्ज" : "Period Active"}
            </span>
          ) : (
            <button
              onClick={() => setIsLoggingModalOpen(true)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary-container transition-colors shadow-sm"
            >
              {language === "hi" ? "+ माहवारी दर्ज करें" : "+ Log Period"}
            </button>
          )}
        </div>

        {/* Selected Day Details */}
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-2 text-xs">
          {selectedLog ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-outline">{language === "hi" ? "दर्द स्तर:" : "Pain Level:"}</span>
                <span className="font-semibold text-primary">{selectedLog.pain_level} / 10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-outline">{language === "hi" ? "मूड:" : "Mood:"}</span>
                <span className="font-semibold text-secondary capitalize">{selectedLog.mood || "None"}</span>
              </div>
              {selectedLog.symptoms.length > 0 && (
                <div>
                  <span className="text-outline block mb-1">{language === "hi" ? "शारीरिक लक्षण:" : "Logged Symptoms:"}</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedLog.symptoms.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-medium text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-outline text-center py-2">
              {language === "hi"
                ? "इस तिथि के लिए कोई विशेष लक्षण दर्ज नहीं हैं।"
                : "No symptom log recorded for this specific date."}
            </p>
          )}
        </div>

        {/* Quick Link to Symptom Logger */}
        <Link
          href="/symptoms"
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs font-semibold text-primary hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">edit_note</span>
          <span>{language === "hi" ? "विस्तृत लक्षण डायरी खोलें" : "Open Detailed Symptom Logger"}</span>
        </Link>
      </section>

      {/* 4. Cycle Regularity & Length Statistics */}
      <section className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-4">
        <div>
          <h3 className="font-serif text-lg font-medium text-primary">
            {language === "hi" ? "चक्र नियमितता विश्लेषण" : "Cycle Regularity & Historical Rhythm"}
          </h3>
          <p className="text-xs text-outline">
            {language === "hi"
              ? "पारदर्शी 3-मासिक रोलिंग औसत (कोई ब्लैक-बॉक्स AI नहीं)"
              : "Transparent rolling statistics based on logged dates"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 text-center">
            <span className="block font-serif text-2xl font-bold text-primary">
              {rollingAvgLength} {language === "hi" ? "दिन" : "Days"}
            </span>
            <span className="text-[11px] text-outline font-sans">
              {language === "hi" ? "रोलिंग औसत चक्र" : "Rolling Avg Length"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 text-center">
            <span className="block font-serif text-2xl font-bold text-secondary">
              ±{prediction.uncertaintyDays} {language === "hi" ? "दिन" : "Days"}
            </span>
            <span className="text-[11px] text-outline font-sans">
              {language === "hi" ? "सामान्य भिन्नता सीमा" : "Variance Range"}
            </span>
          </div>
        </div>

        {/* Clinical Note from Gynecologist */}
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface-variant leading-relaxed">
          <span className="font-semibold text-primary block mb-1">
            {language === "hi" ? "चिकित्सीय मार्गदर्शन (FOGSI / ACOG):" : "Clinical Guidance (FOGSI / ACOG):"}
          </span>
          {language === "hi"
            ? "21 से 35 दिनों के बीच का चक्र चिकित्सकीय रूप से सामान्य माना जाता है। मौसम, तनाव, यात्रा या आहार में बदलाव के कारण 2 से 4 दिनों का आगे-पीछे होना स्वाभाविक है।"
            : "Cycles between 21 to 35 days are clinically normal. Natural variations of 2–4 days occur regularly due to sleep, stress, travel, or nutritional changes."}
        </div>

        {/* Recent Cycles List */}
        <div>
          <h4 className="font-serif text-sm font-semibold text-primary mb-2">
            {language === "hi" ? "हाल के दर्ज चक्र" : "Recent Recorded Cycles"}
          </h4>
          <div className="space-y-1.5">
            {periodLogs.slice(0, 3).map((log, index) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-surface-container flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-semibold text-primary">{log.start_date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-outline">
                    {language === "hi" ? "माहवारी शुरू" : "Menses start"}
                  </span>
                  <button
                    onClick={() => removePeriodLog(log.id)}
                    className="text-error hover:underline text-[11px]"
                    title="Delete log"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Doctor Consultation Export Bar */}
        <div className="pt-2">
          <button
            onClick={() => setIsDoctorModalOpen(true)}
            className="w-full h-12 rounded-xl bg-primary text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-warm-sm"
          >
            <span className="material-symbols-outlined text-[18px]">medical_services</span>
            <span>
              {language === "hi"
                ? "डॉक्टर परामर्श रिपोर्ट तैयार करें / प्रिंट करें"
                : "Generate Doctor Summary / PDF"}
            </span>
          </button>
        </div>
      </section>

      {/* Quick Modal for Logging Period */}
      {isLoggingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface p-5 rounded-2xl max-w-sm w-full space-y-4 shadow-warm-lg animate-fadeIn">
            <h3 className="font-serif text-lg font-medium text-primary">
              {language === "hi" ? "माहवारी तिथि दर्ज करें" : "Record Period Start Date"}
            </h3>
            <p className="text-xs text-on-surface-variant">
              {language === "hi" ? `तिथि: ${selectedDateStr}` : `Date: ${selectedDateStr}`}
            </p>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                {language === "hi" ? "रक्तस्राव का स्तर (Flow Intensity)" : "Flow Intensity"}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["spotting", "light", "medium", "heavy"] as FlowIntensity[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setModalFlow(f)}
                    className={`py-2 text-xs font-semibold rounded-lg border capitalize transition-all ${
                      modalFlow === f
                        ? "bg-primary text-white border-primary"
                        : "bg-surface-container text-on-surface-variant border-outline-variant/30"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsLoggingModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant/40 text-xs font-semibold text-outline"
              >
                {language === "hi" ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleQuickLogPeriod}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold"
              >
                {language === "hi" ? "सहेजें" : "Save Log"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Doctor Consultation Summary Modal */}
      <DoctorSummaryModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
      />
    </main>
  );
}
