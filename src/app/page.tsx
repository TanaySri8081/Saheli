"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { useLanguage } from "@/context/LanguageContext";
import { useCycle } from "@/context/CycleContext";
import { getPainLevelInfo } from "@/lib/painScale";
import { Mood, FlowIntensity } from "@/types";
import { formatDate } from "@/lib/cycleMath";
import { storage } from "@/lib/storage";

export default function Home() {
  const router = useRouter();
  const { language, t, speakText, isSpeaking, stopSpeaking } = useLanguage();
  const {
    profile,
    currentCycleDay,
    currentPhaseInfo,
    prediction,
    rollingAvgLength,
    logSymptom,
    getSymptomForDate,
  } = useCycle();

  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = storage.getUserProfile();
      if (!stored.onboarding_complete) {
        router.replace("/onboarding");
        return;
      }
      setIsCheckingOnboarding(false);
    }
  }, [router]);

  const [todayStr, setTodayStr] = useState<string>("2026-10-24");
  const [greeting, setGreeting] = useState<string>("");
  const existingLog = getSymptomForDate(todayStr);

  React.useEffect(() => {
    const now = new Date();
    setTodayStr(formatDate(now));
    const hr = now.getHours();
    if (hr < 12) {
      setGreeting(t("greetingMorning"));
    } else if (hr < 17) {
      setGreeting(t("greetingAfternoon"));
    } else {
      setGreeting(t("greetingEvening"));
    }
  }, [language, t]);

  // Daily check-in state
  const [selectedPain, setSelectedPain] = useState<number>(existingLog?.pain_level ?? 2);
  const [selectedMood, setSelectedMood] = useState<Mood>(existingLog?.mood || "calm");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(existingLog?.symptoms || ["cramps"]);
  const [selectedFlow, setSelectedFlow] = useState<FlowIntensity>(
    (existingLog?.flow_level as FlowIntensity) || "light"
  );
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const painDetail = getPainLevelInfo(selectedPain);
  const userName = profile.display_name || t("appName");

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleSaveCheckIn = () => {
    logSymptom({
      log_date: todayStr,
      pain_level: selectedPain,
      mood: selectedMood,
      flow_level: selectedFlow,
      symptoms: selectedSymptoms,
    });

    // Trigger gentle celebratory confetti
    try {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.8 },
        colors: ["#60445f", "#c5eccc", "#ffdad4"],
      });
    } catch {
      // Ignore if confetti fails in some contexts
    }

    setSaveToast(t("savedNotice"));
    setTimeout(() => {
      setSaveToast(null);
    }, 3500);
  };

  const getPhaseName = () => {
    switch (currentPhaseInfo.phase) {
      case "menstrual":
        return t("phaseMenstrual");
      case "follicular":
        return t("phaseFollicular");
      case "ovulatory":
        return t("phaseOvulatory");
      case "luteal":
        return t("phaseLuteal");
      default:
        return t("phaseLuteal");
    }
  };

  const getPainCategory = (score: number) => {
    if (score === 0) return t("painNone");
    if (score <= 3) return t("painMild");
    if (score <= 7) return t("painModerate");
    return t("painSevere");
  };

  const handleDailyAudioSummary = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const summaryText = `${greeting}, ${userName}. ${getPhaseName()}. ${t("mindfulMoment")}`;
    speakText(summaryText);
  };

  if (isCheckingOnboarding) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs text-on-surface-variant font-medium animate-pulse">
            {t("reading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 w-full py-5 flex flex-col gap-6 font-sans">
      {/* 1. Header Greeting & Audio Summary */}
      <section className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-medium text-primary">
            {greeting || t("greetingMorning")}, {userName}
          </h1>
          <p className="font-sans text-xs md:text-sm text-on-surface-variant mt-0.5">
            {t("mindfulMoment")}
          </p>
        </div>

        <button
          onClick={handleDailyAudioSummary}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
            isSpeaking
              ? "bg-primary text-white animate-pulse"
              : "bg-surface-container text-primary hover:bg-surface-container-high border border-outline-variant/30"
          }`}
          title="Listen to today's summary"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isSpeaking ? "volume_up" : "volume_up"}
          </span>
          <span>{isSpeaking ? t("reading") : t("readAloud")}</span>
        </button>
      </section>

      {/* Responsive Two-Column Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Primary Column: Cycle Progress & Daily Check-in */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">

          {/* 2. SVG Circular Cycle Ring & Phase Hero */}
          <section className="p-6 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-warm-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: currentPhaseInfo.colorHex }}
                />
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: currentPhaseInfo.containerColorHex,
                    color: currentPhaseInfo.textColorHex,
                  }}
                >
                  {getPhaseName()}
                </span>
              </div>

              <span className="text-[11px] font-semibold text-outline">
                {t("avgDays")}: {rollingAvgLength} {t("days")}
              </span>
            </div>

            {/* Progress Ring & Countdown */}
            <div className="flex items-center gap-5 py-2">
              <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#eddee8"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={currentPhaseInfo.colorHex}
                    strokeWidth="8"
                    strokeDasharray="251"
                    strokeDashoffset={
                      251 - (251 * Math.min(currentCycleDay, rollingAvgLength)) / rollingAvgLength
                    }
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-serif text-2xl font-bold text-primary leading-none">
                    {currentCycleDay}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-outline">
                    {t("dayWord")}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <h2 className="font-serif text-xl font-medium text-primary leading-tight">
                  {prediction.isLate
                    ? `${prediction.daysLate} ${t("daysDelayed")}`
                    : `${t("nextPeriodIn")}${prediction.daysUntilNextPeriod} ${t("days")}`}
                </h2>
                <p className="text-xs text-on-surface-variant mt-1 leading-snug">
                  {t("estimatedDate")}: {prediction.nextPeriodStartDate} ({t("avgDays")}: ±{prediction.uncertaintyDays}d)
                </p>
                <p className="text-[10px] text-outline mt-0.5">
                  {t("estimatesDisclaimer")}
                </p>
              </div>
            </div>

            {/* Linear 4-Phase Timeline */}
            <div className="mt-4 pt-4 border-t border-outline-variant/30">
              <div className="flex justify-between text-[10px] font-semibold text-outline mb-1.5">
                <span className={currentPhaseInfo.phase === "menstrual" ? "text-tertiary font-bold" : ""}>
                  {t("phaseMenstrual")} (1-5)
                </span>
                <span className={currentPhaseInfo.phase === "follicular" ? "text-primary font-bold" : ""}>
                  {t("phaseFollicular")} (6-11)
                </span>
                <span className={currentPhaseInfo.phase === "ovulatory" ? "text-secondary font-bold" : ""}>
                  {t("phaseOvulatory")} (12-15)
                </span>
                <span className={currentPhaseInfo.phase === "luteal" ? "text-primary-container font-bold" : ""}>
                  {t("phaseLuteal")} (16-28)
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1 h-2 rounded-full overflow-hidden bg-surface-container-high">
                <div className={`h-full rounded-l-full ${currentCycleDay <= 5 ? "bg-tertiary" : "bg-tertiary/40"}`} />
                <div className={`h-full ${currentCycleDay > 5 && currentCycleDay <= 11 ? "bg-primary" : "bg-primary/30"}`} />
                <div className={`h-full ${currentCycleDay > 11 && currentCycleDay <= 15 ? "bg-secondary" : "bg-secondary/40"}`} />
                <div className={`h-full rounded-r-full ${currentCycleDay > 15 ? "bg-primary-container" : "bg-primary-container/30"}`} />
              </div>
            </div>

            {/* Quick CTA Links */}
            <div className="mt-4 flex gap-2">
              <Link
                href="/my-cycle"
                className="flex-1 py-2 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-center text-xs font-semibold text-primary hover:bg-white transition-colors"
              >
                {t("viewCalendar")}
              </Link>
              <Link
                href="/symptoms"
                className="flex-1 py-2 px-3 rounded-xl bg-primary text-white text-center text-xs font-semibold hover:bg-primary-container transition-colors shadow-sm"
              >
                {t("logTodayFlow")}
              </Link>
            </div>
          </section>

          {/* 3. Daily Check-In Module */}
          <section className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium text-primary">
                  {t("dailyCheckInTitle")}
                </h3>
                <p className="text-xs text-outline">
                  {t("dailyCheckInSubtitle")}
                </p>
              </div>
              <span className="text-xs font-semibold text-primary bg-surface-container px-2.5 py-1 rounded-full">
                {todayStr}
              </span>
            </div>

            {/* Mood Selector Chips */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-2">
                {t("howIsMood")}
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "calm" as Mood, label: t("moodCalm"), emoji: "🌿" },
                  { id: "energized" as Mood, label: t("moodEnergized"), emoji: "✨" },
                  { id: "sensitive" as Mood, label: t("moodSensitive"), emoji: "🌸" },
                  { id: "tired" as Mood, label: t("moodTired"), emoji: "🍌" },
                  { id: "anxious" as Mood, label: t("moodAnxious"), emoji: "☁️" },
                ].map((item) => {
                  const isSelected = selectedMood === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedMood(item.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? "bg-primary text-white font-semibold shadow-sm"
                          : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stepped Pain Scale 0-10 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">
                  {t("painScoreTitle")}
                </label>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase"
                  style={{
                    backgroundColor: painDetail.containerColor,
                    color: painDetail.textColor,
                  }}
                >
                  {getPainCategory(selectedPain)} ({selectedPain}/10)
                </span>
              </div>

              <div className="grid grid-cols-11 gap-1 my-2">
                {Array.from({ length: 11 }, (_, i) => i).map((lvl) => {
                  const isSelected = selectedPain === lvl;
                  const info = getPainLevelInfo(lvl);
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedPain(lvl)}
                      className={`h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                        isSelected
                          ? "scale-110 shadow-md ring-2 ring-primary ring-offset-1 text-white"
                          : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                      }`}
                      style={{
                        backgroundColor: isSelected ? info.accentColor : undefined,
                      }}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Physical Symptom Chips */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-2">
                {t("symptomsPrompt")}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "cramps", label: t("symCramps") },
                  { id: "bloating", label: t("symBloating") },
                  { id: "fatigue", label: t("symFatigue") },
                  { id: "headache", label: t("symHeadache") },
                  { id: "backache", label: t("symBackache") },
                  { id: "acne", label: t("symAcne") },
                ].map((s) => {
                  const isChecked = selectedSymptoms.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSymptom(s.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        isChecked
                          ? "bg-secondary-container text-[#2c4e36] border-secondary font-semibold"
                          : "bg-surface-container text-outline border-outline-variant/30 hover:border-outline"
                      }`}
                    >
                      {isChecked ? "✓ " : "+ "}
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Check-in Button */}
            <button
              type="button"
              onClick={handleSaveCheckIn}
              className="w-full h-12 rounded-xl bg-primary text-white font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-transform shadow-warm-sm cursor-pointer hover:bg-primary-container"
            >
              <span className="material-symbols-outlined text-lg">check</span>
              <span>{t("saveCheckInBtn")}</span>
            </button>

            {saveToast && (
              <div className="p-3 rounded-xl bg-secondary-container text-on-secondary-container text-xs flex items-center gap-2 animate-fadeIn font-semibold border border-secondary/30">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{saveToast}</span>
              </div>
            )}
          </section>
        </div>

        {/* Right Secondary Column: Ask Saheli AI & Nutrition */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">

          {/* 4. Ask Saheli AI Companion Quick Card */}
          <section className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">
                auto_awesome
              </span>
              <h3 className="font-serif text-lg font-medium text-primary">
                {t("aiCompanionTitle")}
              </h3>
            </div>

            <Link
              href="/chat"
              className="flex items-center justify-between w-full h-12 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs text-outline hover:border-primary transition-colors group"
            >
              <span className="truncate pr-2">
                {t("askPlaceholder")}
              </span>
              <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            {/* Quick prompt chips */}
            <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { label: t("whyCrampsHappen") },
                { label: t("ironSnacks") },
                { label: t("normalCycle") },
              ].map((prompt, idx) => (
                <Link
                  key={idx}
                  href="/chat"
                  className="px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-[11px] text-on-surface-variant hover:text-primary whitespace-nowrap transition-colors"
                >
                  {prompt.label}
                </Link>
              ))}
            </div>
          </section>

          {/* 5. Phase-Aligned Nutrition Spotlight */}
          <section className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-2xl">
                  restaurant
                </span>
                <div>
                  <h3 className="font-serif text-lg font-medium text-primary">
                    {t("nutritionSpotlight")}
                  </h3>
                  <span className="text-[11px] text-outline">
                    {t("alignedWithPhase")}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary-container text-[#2c4e36]">
                {t("navCare")}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex gap-3.5 items-center">
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-secondary flex items-center justify-center text-2xl flex-shrink-0">
                🍲
              </div>
              <div className="flex-1">
                <h4 className="font-serif text-sm font-semibold text-primary">
                  Sprouted Moong & Palak Dal with Ghee
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                  {currentPhaseInfo.nutritionTipEn}
                </p>
              </div>
            </div>

            <Link
              href="/care"
              className="flex items-center justify-between text-xs font-semibold text-secondary hover:underline pt-1"
            >
              <span>{t("viewAllRecipes")}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </section>

          {/* 6. Health Awareness & Educational Deep Dives */}
          <section className="space-y-2.5">
            <h3 className="font-serif text-lg font-medium text-primary">
              {t("clinicalGuidesTitle")}
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/learn/pcos"
                className="p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/30 flex flex-col justify-between h-28"
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-primary text-xl">
                    health_and_safety
                  </span>
                  <span className="text-[10px] font-semibold text-outline">Rotterdam</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-primary block leading-tight">
                    PCOS Guide
                  </span>
                  <span className="text-[10px] text-outline">Diagnostic & Care</span>
                </div>
              </Link>

              <Link
                href="/learn/endometriosis"
                className="p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/30 flex flex-col justify-between h-28"
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-primary text-xl">
                    clinical_notes
                  </span>
                  <span className="text-[10px] font-semibold text-outline">ACOG</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-primary block leading-tight">
                    Endometriosis
                  </span>
                  <span className="text-[10px] text-outline">Stepped Triage</span>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
