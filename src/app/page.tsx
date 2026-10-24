"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useLanguage } from "@/context/LanguageContext";
import { useCycle } from "@/context/CycleContext";
import { getPainLevelInfo } from "@/lib/painScale";
import { Mood, FlowIntensity } from "@/types";
import { formatDate } from "@/lib/cycleMath";

export default function Home() {
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

  const [todayStr, setTodayStr] = useState<string>("2026-10-24");
  const [greeting, setGreeting] = useState<string>(language === "hi" ? "नमस्ते" : "Good morning");
  const existingLog = getSymptomForDate(todayStr);

  React.useEffect(() => {
    const now = new Date();
    setTodayStr(formatDate(now));
    const hr = now.getHours();
    const gEn = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
    const gHi = hr < 12 ? "शुभ प्रभात" : hr < 17 ? "शुभ दोपहर" : "शुभ संध्या";
    setGreeting(language === "hi" ? gHi : gEn);
  }, [language]);

  // Daily check-in state
  const [selectedPain, setSelectedPain] = useState<number>(existingLog?.pain_level ?? 2);
  const [selectedMood, setSelectedMood] = useState<Mood>(existingLog?.mood || "calm");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(existingLog?.symptoms || []);
  const [selectedFlow, setSelectedFlow] = useState<FlowIntensity>(
    (existingLog?.flow_level as FlowIntensity) || "light"
  );
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const painDetail = getPainLevelInfo(selectedPain);
  const userName = profile.display_name || (language === "hi" ? "सहेली" : "Saheli");

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
      symptoms: selectedSymptoms,
      mood: selectedMood,
      flow_level: selectedFlow,
      water_ml: existingLog?.water_ml || 1250,
      reflection: existingLog?.reflection || null,
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

    setSaveToast(
      language === "hi"
        ? "✓ आज का स्वास्थ्य रिकॉर्ड डिवाइस पर सुरक्षित सहेजा गया!"
        : "✓ Today's check-in saved safely to your device!"
    );

    setTimeout(() => {
      setSaveToast(null);
    }, 3500);
  };

  const handleDailyAudioSummary = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const summaryText =
      language === "hi"
        ? `${greeting}, ${userName}। आज आपके चक्र का ${currentCycleDay}वां दिन है और आप ${currentPhaseInfo.phaseNameHi} में हैं। ${currentPhaseInfo.summaryHi} आज के आहार में ${currentPhaseInfo.nutritionTipHi}`
        : `${greeting}, ${userName}. Today is Day ${currentCycleDay} of your cycle in the ${currentPhaseInfo.phaseNameEn}. ${currentPhaseInfo.summaryEn} Nutrition spotlight: ${currentPhaseInfo.nutritionTipEn}`;

    speakText(summaryText);
  };

  return (
    <main className="flex-1 w-full px-4 py-5 flex flex-col gap-5 max-w-md mx-auto">
      {/* 1. Header Greeting & Audio Summary */}
      <section className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-primary">
            {greeting}, {userName}
          </h1>
          <p className="font-sans text-xs text-on-surface-variant">
            {language === "hi"
              ? "आज अपने लिए थोड़ा कोमल और शांत समय निकालें।"
              : "Take a gentle, mindful moment for yourself today."}
          </p>
        </div>

        <button
          onClick={handleDailyAudioSummary}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            isSpeaking
              ? "bg-primary text-white animate-pulse"
              : "bg-surface-container text-primary hover:bg-surface-container-high border border-outline-variant/30"
          }`}
          title="Listen to today's summary"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isSpeaking ? "volume_up" : "volume_up"}
          </span>
          <span>{isSpeaking ? (language === "hi" ? "सुन रहे हैं" : "Speaking") : (language === "hi" ? "सुनें" : "Listen")}</span>
        </button>
      </section>

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
              {language === "hi"
                ? currentPhaseInfo.phaseNameHi
                : currentPhaseInfo.phaseNameEn}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-outline">
            {language === "hi" ? `औसत: ${rollingAvgLength} दिन` : `Avg: ${rollingAvgLength} Days`}
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
              <span className="font-serif text-2xl font-semibold leading-none text-primary">
                {currentCycleDay}
              </span>
              <span className="text-[10px] text-outline font-sans">
                {language === "hi" ? "चक्र दिन" : "Day"}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="font-serif text-xl font-medium text-primary leading-tight">
              {prediction.isLate
                ? language === "hi"
                  ? `${prediction.daysLate} दिन की संभावित देरी`
                  : `${prediction.daysLate} Days Delayed`
                : language === "hi"
                ? `अगली माहवारी ~${prediction.daysUntilNextPeriod} दिन में`
                : `Next Period in ~${prediction.daysUntilNextPeriod} Days`}
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-snug">
              {language === "hi"
                ? `अनुमानित तिथि: ${prediction.nextPeriodStartDate} (±${prediction.uncertaintyDays} दिन)`
                : `Est: ${prediction.nextPeriodStartDate} (Interval: ±${prediction.uncertaintyDays}d)`}
            </p>
            <p className="text-[10px] text-outline mt-0.5">
              {language === "hi"
                ? "*पूर्वानुमान केवल संदर्भ के लिए हैं, गर्भनिरोधक नहीं।"
                : "*Estimates for awareness, not contraception."}
            </p>
          </div>
        </div>

        {/* Linear 4-Phase Timeline */}
        <div className="mt-4 pt-4 border-t border-outline-variant/30">
          <div className="flex justify-between text-[10px] font-semibold text-outline mb-1.5">
            <span className={currentPhaseInfo.phase === "menstrual" ? "text-tertiary font-bold" : ""}>
              {language === "hi" ? "माहवारी (1-5)" : "Menses (1-5)"}
            </span>
            <span className={currentPhaseInfo.phase === "follicular" ? "text-primary font-bold" : ""}>
              {language === "hi" ? "कणिका (6-11)" : "Follicular (6-11)"}
            </span>
            <span className={currentPhaseInfo.phase === "ovulatory" ? "text-secondary font-bold" : ""}>
              {language === "hi" ? "अंडोत्सर्ग (12-15)" : "Ovulation (12-15)"}
            </span>
            <span className={currentPhaseInfo.phase === "luteal" ? "text-primary-container font-bold" : ""}>
              {language === "hi" ? "ल्यूटियल (16-28)" : "Luteal (16-28)"}
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
            {language === "hi" ? "कैलेंडर विवरण देखें" : "View Full Calendar"}
          </Link>
          <Link
            href="/symptoms"
            className="flex-1 py-2 px-3 rounded-xl bg-primary text-white text-center text-xs font-semibold hover:bg-primary-container transition-colors shadow-sm"
          >
            {language === "hi" ? "आज का लक्षण दर्ज करें" : "Log Today's Flow"}
          </Link>
        </div>
      </section>

      {/* 3. Daily Check-In Module */}
      <section className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-medium text-primary">
              {language === "hi" ? "आज का चेक-इन (Daily Check-in)" : "Today's Daily Check-In"}
            </h3>
            <p className="text-xs text-outline">
              {language === "hi" ? "मूड, शारीरिक संवेदना और दर्द स्तर" : "Mood, sensations, and stepped pain score"}
            </p>
          </div>
          <span className="text-xs font-semibold text-primary bg-surface-container px-2.5 py-1 rounded-full">
            {todayStr}
          </span>
        </div>

        {/* Mood Selector Chips */}
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-2">
            {language === "hi" ? "आज का मूड कैसा है?" : "How is your mood today?"}
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "calm" as Mood, labelEn: "🌿 Calm", labelHi: "🌿 शांत" },
              { id: "energized" as Mood, labelEn: "✨ Energized", labelHi: "✨ ऊर्जावान" },
              { id: "sensitive" as Mood, labelEn: "🌸 Sensitive", labelHi: "🌸 संवेदनशील" },
              { id: "tired" as Mood, labelEn: "🌙 Tired", labelHi: "🌙 थकान" },
              { id: "anxious" as Mood, labelEn: "☁️ Anxious", labelHi: "☁️ चिंतित" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMood(m.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedMood === m.id
                    ? "bg-primary text-white border-primary shadow-sm font-semibold scale-105"
                    : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:border-outline"
                }`}
              >
                {language === "hi" ? m.labelHi : m.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Stepped Pain Scale 0-10 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">
              {language === "hi" ? "दर्द की तीव्रता (0–10)" : "Pain Intensity (0–10)"}
            </label>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase"
              style={{
                backgroundColor: painDetail.containerColor,
                color: painDetail.textColor,
              }}
            >
              {painDetail.category} ({selectedPain}/10)
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

          {/* Pain Feedback Snippet */}
          <div
            className="p-3 rounded-xl border text-xs leading-relaxed"
            style={{
              backgroundColor: painDetail.containerColor,
              borderColor: painDetail.accentColor + "40",
              color: painDetail.textColor,
            }}
          >
            <div className="flex items-center justify-between font-semibold mb-1">
              <span>{language === "hi" ? painDetail.labelHi : painDetail.labelEn}</span>
              {painDetail.isRedFlag && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-error">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  <span>{language === "hi" ? "क्लीनिकल चेतावनी" : "Red Flag"}</span>
                </span>
              )}
            </div>
            <p className="opacity-90">{language === "hi" ? painDetail.clinicalDescriptionHi : painDetail.clinicalDescriptionEn}</p>
          </div>
        </div>

        {/* Physical Symptom Chips */}
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-2">
            {language === "hi" ? "शारीरिक लक्षण (Select all that apply)" : "Physical Symptoms"}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "cramps", labelEn: "Pelvic Cramps", labelHi: "पेट में मरोड़" },
              { id: "headache", labelEn: "Headache", labelHi: "सिरदर्द" },
              { id: "bloating", labelEn: "Bloating", labelHi: "पेट फूलना" },
              { id: "tender_breasts", labelEn: "Tender Breasts", labelHi: "स्तन में संवेदनशीलता" },
              { id: "backache", labelEn: "Lower Back Ache", labelHi: "कमर दर्द" },
              { id: "clear_skin", labelEn: "Clear Skin", labelHi: "साफ त्वचा" },
              { id: "fatigue", labelEn: "Fatigue", labelHi: "सुस्ती/थकान" },
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
                  {language === "hi" ? s.labelHi : s.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Check-in Button */}
        <button
          type="button"
          onClick={handleSaveCheckIn}
          className="w-full h-12 rounded-xl bg-primary text-white font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-transform shadow-warm-sm"
        >
          <span className="material-symbols-outlined text-lg">check</span>
          <span>{language === "hi" ? "आज का चेक-इन सहेजें" : "Save Today's Check-in"}</span>
        </button>

        {/* Toast confirmation */}
        {saveToast && (
          <div className="p-3 rounded-xl bg-secondary-container text-[#00210e] text-xs font-semibold text-center border border-secondary animate-fadeIn">
            {saveToast}
          </div>
        )}
      </section>

      {/* 4. Ask Saheli AI Prompt Bar */}
      <section className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-tertiary text-xl">
            auto_awesome
          </span>
          <h3 className="font-serif text-base font-medium text-primary">
            {language === "hi" ? "सहेली AI से कुछ भी पूछें" : "Ask Saheli AI Companion"}
          </h3>
        </div>

        <Link
          href="/chat"
          className="flex items-center justify-between w-full h-12 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs text-outline hover:border-primary transition-colors group"
        >
          <span>
            {language === "hi"
              ? "दर्द, पोषण या चक्र के बारे में बेझिझक पूछें..."
              : "Ask about cramps, diet, or cycle changes..."}
          </span>
          <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </Link>

        {/* Quick prompt chips */}
        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { en: "Why cramps happen?", hi: "दर्द क्यों होता है?" },
            { en: "Iron snacks for fatigue", hi: "थकान में क्या खाएं?" },
            { en: "Normal cycle range", hi: "सामान्य चक्र अवधि" },
          ].map((prompt, idx) => (
            <Link
              key={idx}
              href="/chat"
              className="px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-[11px] text-on-surface-variant hover:text-primary whitespace-nowrap transition-colors"
            >
              {language === "hi" ? prompt.hi : prompt.en}
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
                {language === "hi" ? "हार्मोनल पोषण स्पॉटलाइट" : "Hormonal Nutrition Spotlight"}
              </h3>
              <span className="text-[11px] text-outline">
                {language === "hi" ? "वर्तमान चक्र चरण के अनुकूल" : "Aligned with your current phase"}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary-container text-[#2c4e36]">
            {language === "hi" ? "आयरन व ऊर्जा" : "High Iron"}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex gap-3.5 items-center">
          <div className="w-12 h-12 rounded-xl bg-secondary-container text-secondary flex items-center justify-center text-2xl flex-shrink-0">
            🍲
          </div>
          <div className="flex-1">
            <h4 className="font-serif text-sm font-semibold text-primary">
              {language === "hi" ? "पालक-मूंग दाल खिचड़ी व शुद्ध घी" : "Sprouted Moong & Palak Dal with Ghee"}
            </h4>
            <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
              {language === "hi"
                ? currentPhaseInfo.nutritionTipHi
                : currentPhaseInfo.nutritionTipEn}
            </p>
          </div>
        </div>

        <Link
          href="/care"
          className="flex items-center justify-between text-xs font-semibold text-secondary hover:underline pt-1"
        >
          <span>{language === "hi" ? "सभी घरेलू व्यंजन व मटका जल ट्रैकर देखें" : "View All Healing Recipes & Hydration Tracker"}</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </section>

      {/* 6. Health Awareness & Educational Deep Dives */}
      <section className="space-y-2.5">
        <h3 className="font-serif text-lg font-medium text-primary">
          {language === "hi" ? "चिकित्सीय स्वास्थ्य मार्गदर्शिकाएँ" : "Clinically Vetted Guides"}
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
                {language === "hi" ? "PCOS गाइड" : "PCOS Guide"}
              </span>
              <span className="text-[10px] text-outline">
                {language === "hi" ? "लक्षण व मिथक" : "Criteria & Facts"}
              </span>
            </div>
          </Link>

          <Link
            href="/learn/endometriosis"
            className="p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/30 flex flex-col justify-between h-28"
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-tertiary text-xl">
                clinical_notes
              </span>
              <span className="text-[10px] font-semibold text-outline">ACOG</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-tertiary block leading-tight">
                {language === "hi" ? "एंडोमेट्रियोसिस" : "Endometriosis"}
              </span>
              <span className="text-[10px] text-outline">
                {language === "hi" ? "श्रोणि दर्द पुष्टि" : "Pelvic Care"}
              </span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
