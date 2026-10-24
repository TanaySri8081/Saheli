"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useLanguage } from "@/context/LanguageContext";
import { useCycle } from "@/context/CycleContext";
import { getPainLevelInfo } from "@/lib/painScale";
import { formatDate, parseDate } from "@/lib/cycleMath";
import { Mood, FlowIntensity } from "@/types";

export default function SymptomsPage() {
  const { language } = useLanguage();
  const { logSymptom, getSymptomForDate } = useCycle();

  const [activeDateStr, setActiveDateStr] = useState<string>("2026-10-24");
  const [painLevel, setPainLevel] = useState<number>(2);
  const [mood, setMood] = useState<Mood>("calm");
  const [flow, setFlow] = useState<FlowIntensity>("none");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [waterMl, setWaterMl] = useState<number>(1000);
  const [reflection, setReflection] = useState<string>("");
  const [isDictating, setIsDictating] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Initialize client date on mount
  useEffect(() => {
    setActiveDateStr(formatDate(new Date()));
  }, []);

  // Load existing log if available for activeDateStr
  useEffect(() => {
    const existing = getSymptomForDate(activeDateStr);
    if (existing) {
      setPainLevel(existing.pain_level);
      setMood(existing.mood || "calm");
      setFlow((existing.flow_level as FlowIntensity) || "none");
      setSymptoms(existing.symptoms || []);
      setWaterMl(existing.water_ml || 1000);
      setReflection(existing.reflection || "");
    } else {
      setPainLevel(2);
      setMood("calm");
      setFlow("none");
      setSymptoms([]);
      setWaterMl(1000);
      setReflection("");
    }
  }, [activeDateStr, getSymptomForDate]);

  const painDetail = getPainLevelInfo(painLevel);

  const handlePrevDay = () => {
    const d = parseDate(activeDateStr);
    d.setDate(d.getDate() - 1);
    setActiveDateStr(formatDate(d));
  };

  const handleNextDay = () => {
    const d = parseDate(activeDateStr);
    d.setDate(d.getDate() + 1);
    setActiveDateStr(formatDate(d));
  };

  const toggleSymptom = (sym: string) => {
    if (symptoms.includes(sym)) {
      setSymptoms(symptoms.filter((s) => s !== sym));
    } else {
      setSymptoms([...symptoms, sym]);
    }
  };

  const handleAddWater = () => {
    setWaterMl((prev) => Math.min(4000, prev + 250));
  };

  // Web Speech Recognition for voice dictation
  const handleToggleDictation = () => {
    if (typeof window === "undefined") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(language === "hi" ? "आपके ब्राउज़र में आवाज पहचान समर्थित नहीं है।" : "Speech recognition is not supported in this browser.");
      return;
    }

    if (isDictating) {
      setIsDictating(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsDictating(true);
      recognition.onend = () => setIsDictating(false);
      recognition.onerror = () => setIsDictating(false);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setReflection((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch {
      setIsDictating(false);
    }
  };

  const handleSave = () => {
    logSymptom({
      log_date: activeDateStr,
      pain_level: painLevel,
      symptoms,
      mood,
      flow_level: flow,
      water_ml: waterMl,
      reflection,
    });

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#482e47", "#c5eccc", "#ffdad4"],
      });
    } catch {
      // Confetti fallback
    }

    setSaveToast(
      language === "hi"
        ? `✓ ${activeDateStr} का डेटा सुरक्षित रूप से सहेजा गया!`
        : `✓ Entry for ${activeDateStr} saved safely to device!`
    );

    setTimeout(() => {
      setSaveToast(null);
    }, 3500);
  };

  return (
    <main className="flex-1 w-full px-4 py-5 flex flex-col gap-5 max-w-md mx-auto">
      {/* 1. Header & Date Navigator */}
      <section className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
            {language === "hi" ? "लक्षण व दर्द डायरी" : "Symptom & Sensation Journal"}
          </span>
          <h1 className="font-serif text-2xl font-medium text-primary">
            {activeDateStr}
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-full bg-surface-container hover:bg-surface-container-high text-primary transition-colors"
            aria-label="Previous Day"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button
            onClick={() => setActiveDateStr(formatDate(new Date()))}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-container text-primary hover:bg-surface-container-high transition-colors"
          >
            {language === "hi" ? "आज" : "Today"}
          </button>
          <button
            onClick={handleNextDay}
            className="p-2 rounded-full bg-surface-container hover:bg-surface-container-high text-primary transition-colors"
            aria-label="Next Day"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </section>

      {/* 2. Stepped Pain Scale (0-10) */}
      <section className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-medium text-primary">
            {language === "hi" ? "दर्द व ऐंठन की तीव्रता (0–10)" : "Pain Intensity (0–10)"}
          </h3>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
            style={{
              backgroundColor: painDetail.containerColor,
              color: painDetail.textColor,
            }}
          >
            {painDetail.category} ({painLevel}/10)
          </span>
        </div>

        {/* 11 step buttons */}
        <div className="grid grid-cols-11 gap-1">
          {Array.from({ length: 11 }, (_, i) => i).map((lvl) => {
            const isSelected = painLevel === lvl;
            const info = getPainLevelInfo(lvl);
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => setPainLevel(lvl)}
                className={`h-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
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

        {/* Live Clinical Advice Card */}
        <div
          className="p-3.5 rounded-xl border transition-colors space-y-1.5 text-xs"
          style={{
            backgroundColor: painDetail.containerColor,
            borderColor: painDetail.accentColor + "40",
            color: painDetail.textColor,
          }}
        >
          <div className="flex items-center justify-between font-semibold">
            <span>{language === "hi" ? painDetail.labelHi : painDetail.labelEn}</span>
            {painDetail.isRedFlag && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-error">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                <span>{language === "hi" ? "क्लीनिकल अलर्ट" : "Red Flag"}</span>
              </span>
            )}
          </div>
          <p className="opacity-90 leading-relaxed">
            {language === "hi" ? painDetail.clinicalDescriptionHi : painDetail.clinicalDescriptionEn}
          </p>
          <div className="text-[11px] pt-1 border-t border-black/10 flex items-start gap-1 font-medium">
            <span className="material-symbols-outlined text-[14px] mt-0.5">spa</span>
            <span>{language === "hi" ? `घरेलू राहत: ${painDetail.homeRemedyHi}` : `Somatic Relief: ${painDetail.homeRemedyEn}`}</span>
          </div>
        </div>
      </section>

      {/* 3. Menstrual Flow Level */}
      <section className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3">
        <h3 className="font-serif text-base font-medium text-primary">
          {language === "hi" ? "रक्तस्राव का स्तर (Flow Level)" : "Menstrual Flow Level"}
        </h3>
        <div className="grid grid-cols-5 gap-1.5">
          {(["none", "spotting", "light", "medium", "heavy"] as FlowIntensity[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFlow(f)}
              className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                flow === f
                  ? "bg-tertiary-container text-white border-tertiary shadow-sm"
                  : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Categorized Physical Symptoms (Multiselect) */}
      <section className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-4">
        <div>
          <h3 className="font-serif text-lg font-medium text-primary">
            {language === "hi" ? "शारीरिक संवेदनाएँ व लक्षण" : "Physical Symptoms & Sensations"}
          </h3>
          <p className="text-xs text-outline">
            {language === "hi" ? "जो भी लक्षण महसूस हो रहे हैं उन्हें चुनें" : "Tap chips to log your bodily signals"}
          </p>
        </div>

        {/* Group 1: Pelvic & Cramps */}
        <div>
          <span className="text-[11px] font-semibold text-outline uppercase block mb-1.5">
            {language === "hi" ? "पेल्विक व दर्द" : "Pelvic & Sensation"}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "cramps", en: "Pelvic Cramps", hi: "पेट की ऐंठन" },
              { id: "backache", en: "Lower Back Ache", hi: "कमर दर्द" },
              { id: "pelvic_heaviness", en: "Pelvic Heaviness", hi: "श्रोणि में भारीपन" },
              { id: "tender_breasts", en: "Tender Breasts", hi: "स्तन में खिंचाव" },
            ].map((s) => {
              const isChecked = symptoms.includes(s.id);
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
                  {language === "hi" ? s.hi : s.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Group 2: Digestive & Hormonal */}
        <div>
          <span className="text-[11px] font-semibold text-outline uppercase block mb-1.5">
            {language === "hi" ? "पाचन व हार्मोनल" : "Digestive & Hormonal"}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "bloating", en: "Bloating", hi: "पेट फूलना" },
              { id: "headache", en: "Headache", hi: "सिरदर्द" },
              { id: "nausea", en: "Nausea", hi: "जी मिचलाना" },
              { id: "acne", en: "Acne Flare", hi: "मुंहासे" },
              { id: "hot_flashes", en: "Hot Flashes", hi: "गर्मी लगना" },
            ].map((s) => {
              const isChecked = symptoms.includes(s.id);
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
                  {language === "hi" ? s.hi : s.en}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Hydration Water Counter */}
      <section className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-secondary-container text-secondary flex items-center justify-center text-2xl">
            🏺
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold text-primary">
              {language === "hi" ? "मटका जल ट्रैकर" : "Matka Hydration"}
            </h4>
            <span className="text-xs text-on-surface-variant">
              {waterMl} ml / 2500 ml {language === "hi" ? "पिया गया" : "consumed"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddWater}
          className="h-10 px-3.5 rounded-xl bg-secondary text-white font-semibold text-xs flex items-center gap-1 active:scale-95 transition-transform"
        >
          <span>+ 250ml</span>
        </button>
      </section>

      {/* 6. Private Reflection & Bilingual Voice Dictation */}
      <section className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
            <span>{language === "hi" ? "निजी अनुभव व विचार (केवल फोन पर)" : "Private Reflection (Local Only)"}</span>
          </label>

          <button
            type="button"
            onClick={handleToggleDictation}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              isDictating
                ? "bg-error text-white animate-pulse"
                : "bg-surface-container text-primary hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">mic</span>
            <span>{isDictating ? (language === "hi" ? "सुन रहे हैं..." : "Listening...") : (language === "hi" ? "बोलकर लिखें" : "Voice Dictate")}</span>
          </button>
        </div>

        <textarea
          rows={3}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder={
            language === "hi"
              ? "आज शरीर में क्या बदलाव महसूस हुए? बोलकर या लिखकर दर्ज करें..."
              : "What sensations did you notice today? Type or dictate..."
          }
          className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary leading-relaxed"
        />
      </section>

      {/* 7. Save Action Button & Toast */}
      <section className="space-y-2 pb-4">
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-12 rounded-xl bg-primary text-white font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-transform shadow-warm-sm"
        >
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span>{language === "hi" ? "लक्षण प्रविष्टि सहेजें" : "Save Journal Entry"}</span>
        </button>

        {saveToast && (
          <div className="p-3 rounded-xl bg-secondary-container text-[#00210e] text-xs font-semibold text-center border border-secondary animate-fadeIn">
            {saveToast}
          </div>
        )}
      </section>
    </main>
  );
}
