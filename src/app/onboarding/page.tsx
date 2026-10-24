"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCycle } from "@/context/CycleContext";
import { CycleRhythm, DietPreference, LanguagePreference } from "@/types";
import { formatDate } from "@/lib/cycleMath";

export default function OnboardingPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { profile, updateProfile, logPeriod } = useCycle();

  const [step, setStep] = useState<number>(1);
  const [displayName, setDisplayName] = useState<string>(profile.display_name || "");
  const [selectedLang, setSelectedLang] = useState<LanguagePreference>(profile.language_preference || "en");
  const [cycleRhythm, setCycleRhythm] = useState<CycleRhythm>(profile.cycle_rhythm_type || "standard");
  const [lastPeriodDate, setLastPeriodDate] = useState<string>(profile.last_period_date || "2026-10-24");
  const [periodDuration, setPeriodDuration] = useState<number>(profile.avg_period_duration || 5);
  const [diet, setDiet] = useState<DietPreference>(profile.diet_preference || "veg");
  const [focusAreas, setFocusAreas] = useState<string[]>(profile.focus_areas || ["cycle_awareness", "nutrition"]);

  const handleLanguageChange = (lang: LanguagePreference) => {
    setSelectedLang(lang);
    if (lang === "hi") {
      setLanguage("hi");
    } else {
      setLanguage("en");
    }
  };

  const toggleFocusArea = (area: string) => {
    if (focusAreas.includes(area)) {
      setFocusAreas(focusAreas.filter((a) => a !== area));
    } else {
      setFocusAreas([...focusAreas, area]);
    }
  };

  const handleComplete = (isSkipped: boolean = false) => {
    if (!isSkipped) {
      updateProfile({
        display_name: displayName.trim() || (language === "hi" ? "सहेली" : "Saheli"),
        language_preference: selectedLang,
        cycle_rhythm_type: cycleRhythm,
        diet_preference: diet,
        focus_areas: focusAreas,
        avg_period_duration: periodDuration,
        last_period_date: lastPeriodDate,
        onboarding_complete: true,
      });

      // Log the initial period start date
      logPeriod({
        start_date: lastPeriodDate,
        flow_intensity: "medium",
        cycle_length_days: 28,
        is_predicted: false,
        notes: "Initial period date recorded during onboarding.",
      });
    } else {
      updateProfile({ onboarding_complete: true });
    }

    router.push("/");
  };

  return (
    <div className="min-h-full py-6 px-4 flex flex-col justify-between max-w-md mx-auto">
      {/* Top Header & Progress */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-white font-serif flex items-center justify-center text-sm font-medium">
              स
            </span>
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">
              {language === "hi" ? `चरण ${step} / 3` : `Step ${step} of 3`}
            </span>
          </div>

          <button
            onClick={() => handleComplete(true)}
            className="text-xs font-semibold text-outline hover:text-primary transition-colors py-1 px-2.5 rounded-lg hover:bg-surface-container"
          >
            {language === "hi" ? "छोड़ें (Skip)" : "Skip Setup"}
          </button>
        </div>

        {/* Step Progress Line */}
        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-primary h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* STEP 1: Language & Identity */}
        {step === 1 && (
          <section className="space-y-5 animate-fadeIn">
            <div>
              <span className="text-xs font-semibold text-secondary px-2.5 py-0.5 rounded-full bg-secondary-container">
                {language === "hi" ? "सहेली में स्वागत है" : "Welcome to Saheli"}
              </span>
              <h1 className="font-serif text-3xl font-medium text-primary mt-2 leading-tight">
                {language === "hi"
                  ? "अपनी पसंद की भाषा चुनें"
                  : "Choose your preferred language"}
              </h1>
              <p className="font-sans text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                {language === "hi"
                  ? "सहेली आपकी स्वास्थ्य साथी है। आप जब चाहें इसे बाद में बदल सकते हैं।"
                  : "Saheli adapts to your voice and comfort. You can switch languages anytime."}
              </p>
            </div>

            {/* Language Selection Cards */}
            <div className="space-y-2.5">
              {[
                {
                  id: "hi" as LanguagePreference,
                  title: "हिंदी (Hindi)",
                  desc: "सम्पूर्ण हिंदी अनुभव व आवाज मार्गदर्शन",
                  badge: "अनुशंसित",
                },
                {
                  id: "en" as LanguagePreference,
                  title: "English",
                  desc: "Complete English experience with audio narration",
                  badge: "Universal",
                },
                {
                  id: "hinglish" as LanguagePreference,
                  title: "Hinglish (मिक्स)",
                  desc: "Everyday conversational blend of English & Hindi",
                  badge: "Easy",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleLanguageChange(item.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedLang === item.id
                      ? "border-primary bg-surface-container-low ring-1 ring-primary shadow-warm-sm"
                      : "border-outline-variant/40 bg-surface-container-lowest hover:border-outline"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base font-semibold text-primary">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-container text-outline">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <span
                    className={`material-symbols-outlined text-xl ${
                      selectedLang === item.id ? "text-primary" : "text-outline/40"
                    }`}
                  >
                    {selectedLang === item.id ? "radio_button_checked" : "radio_button_unchecked"}
                  </span>
                </div>
              ))}
            </div>

            {/* Optional Name Input */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                {language === "hi" ? "आपका नाम या उपनाम (वैकल्पिक)" : "What should Saheli call you? (Optional)"}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={language === "hi" ? "उदा. प्रिया या सहेली" : "e.g. Priya or Friend"}
                className="w-full h-12 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <span className="text-[11px] text-outline mt-1 block">
                {language === "hi"
                  ? "यह नाम सिर्फ आपके फोन पर सुरक्षित रहता है।"
                  : "Stored locally on this device only."}
              </span>
            </div>
          </section>
        )}

        {/* STEP 2: Cycle Rhythm & Last Period */}
        {step === 2 && (
          <section className="space-y-5 animate-fadeIn">
            <div>
              <span className="text-xs font-semibold text-tertiary px-2.5 py-0.5 rounded-full bg-tertiary-fixed">
                {language === "hi" ? "चक्र और माहवारी" : "Cycle & Rhythm"}
              </span>
              <h1 className="font-serif text-3xl font-medium text-primary mt-2 leading-tight">
                {language === "hi"
                  ? "आपका चक्र आमतौर पर कैसा रहता है?"
                  : "How does your cycle typically flow?"}
              </h1>
              <p className="font-sans text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                {language === "hi"
                  ? "हम किसी एक निश्चित नियम को आप पर नहीं थोपते। अनियमित चक्र भी पूरी तरह सामान्य हैं।"
                  : "Every body has its own rhythm. We provide transparent estimates, never rigid judgments."}
              </p>
            </div>

            {/* Rhythm Options */}
            <div className="space-y-2">
              {[
                {
                  id: "standard" as CycleRhythm,
                  title: language === "hi" ? "नियमित (~26-32 दिन)" : "Regular (~26–32 days)",
                  desc: language === "hi" ? "पूर्वानुमान सीमा ±2 दिन" : "Prediction range ±2 days",
                },
                {
                  id: "irregular" as CycleRhythm,
                  title: language === "hi" ? "अनियमित / आगे-पीछे (35–50+ दिन)" : "Irregular / Fluctuating (35–50+ days)",
                  desc: language === "hi" ? "विस्तृत अनिश्चितता सीमा ±4 दिन" : "Expanded uncertainty range ±4 days",
                },
                {
                  id: "pcos" as CycleRhythm,
                  title: language === "hi" ? "पीसीओएस / पीसीओडी (PCOS/PCOD)" : "PCOS / PCOD Diagnosed",
                  desc: language === "hi" ? "लक्षण व आहार केंद्रित दृष्टिकोण" : "Symptom & insulin-focused care",
                },
                {
                  id: "education_only" as CycleRhythm,
                  title: language === "hi" ? "केवल सीखने हेतु (तिथियां नहीं ट्रैक करनी)" : "Just Learning / Education Only",
                  desc: language === "hi" ? "ज्ञान, पोषण और स्वास्थ्य परामर्श" : "Educational library & care guide",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setCycleRhythm(item.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    cycleRhythm === item.id
                      ? "border-primary bg-surface-container-low ring-1 ring-primary shadow-warm-sm"
                      : "border-outline-variant/40 bg-surface-container-lowest hover:border-outline"
                  }`}
                >
                  <div>
                    <span className="font-serif text-sm font-semibold text-primary block">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-outline">{item.desc}</span>
                  </div>
                  <span
                    className={`material-symbols-outlined text-lg ${
                      cycleRhythm === item.id ? "text-primary" : "text-outline/40"
                    }`}
                  >
                    {cycleRhythm === item.id ? "radio_button_checked" : "radio_button_unchecked"}
                  </span>
                </div>
              ))}
            </div>

            {/* Last Period Date Picker */}
            {cycleRhythm !== "education_only" && (
              <div className="pt-2 space-y-2">
                <label className="block text-xs font-semibold text-on-surface-variant">
                  {language === "hi"
                    ? "पिछली माहवारी की शुरुआत कब हुई थी?"
                    : "When did your last period start?"}
                </label>
                <input
                  type="date"
                  value={lastPeriodDate}
                  onChange={(e) => setLastPeriodDate(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />

                {/* Quick Date Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setLastPeriodDate(formatDate(new Date()))}
                    className="flex-1 py-1.5 px-2 text-[11px] font-semibold rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors text-center"
                  >
                    {language === "hi" ? "आज शुरू हुई" : "Started Today"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() - 14);
                      setLastPeriodDate(formatDate(d));
                    }}
                    className="flex-1 py-1.5 px-2 text-[11px] font-semibold rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors text-center"
                  >
                    {language === "hi" ? "~2 सप्ताह पहले" : "~2 Weeks Ago"}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* STEP 3: Diet & Privacy Sanctuary */}
        {step === 3 && (
          <section className="space-y-5 animate-fadeIn">
            <div>
              <span className="text-xs font-semibold text-secondary px-2.5 py-0.5 rounded-full bg-secondary-container">
                {language === "hi" ? "आहार व गोपनीयता" : "Nutrition & Privacy"}
              </span>
              <h1 className="font-serif text-3xl font-medium text-primary mt-2 leading-tight">
                {language === "hi"
                  ? "पोषण प्राथमिकता और गोपनीयता संकल्प"
                  : "Dietary preferences & Privacy Sanctuary"}
              </h1>
              <p className="font-sans text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                {language === "hi"
                  ? "आपके चक्र के अनुसार घर का पौष्टिक आहार सुझाया जाएगा।"
                  : "We tailor traditional Indian meals to your hormonal phases."}
              </p>
            </div>

            {/* Diet Chips */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-2">
                {language === "hi" ? "खान-पान की आदत" : "Dietary Style"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "veg" as DietPreference, labelEn: "Vegetarian", labelHi: "शाकाहारी" },
                  { id: "eggetarian" as DietPreference, labelEn: "Eggetarian", labelHi: "अंडे सहित" },
                  { id: "nonveg" as DietPreference, labelEn: "Non-Veg", labelHi: "मांसाहारी" },
                  { id: "vegan" as DietPreference, labelEn: "Vegan / Dairy-Free", labelHi: "डेयरी मुक्त" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDiet(item.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      diet === item.id
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/40 hover:bg-surface-container"
                    }`}
                  >
                    {language === "hi" ? item.labelHi : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Goals */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-2">
                {language === "hi" ? "प्राथमिक ध्यान (Select multiple)" : "Primary Care Goals"}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "cycle_awareness", labelEn: "Cycle Awareness", labelHi: "माहवारी समझ" },
                  { id: "nutrition", labelEn: "Hormonal Meals", labelHi: "हार्मोनल आहार" },
                  { id: "pcos_guidance", labelEn: "PCOS Guidance", labelHi: "PCOS मार्गदर्शन" },
                  { id: "natural_relief", labelEn: "Cramp Relief", labelHi: "दर्द व ऐंठन राहत" },
                ].map((f) => {
                  const isChecked = focusAreas.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggleFocusArea(f.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        isChecked
                          ? "bg-secondary-container text-[#2c4e36] border-secondary font-semibold"
                          : "bg-surface-container-lowest text-outline border-outline-variant/30"
                      }`}
                    >
                      {isChecked ? "✓ " : "+ "}
                      {language === "hi" ? f.labelHi : f.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Privacy Sanctuary High-Trust Card */}
            <div className="p-5 rounded-2xl bg-primary text-white space-y-3 shadow-warm-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary-fixed text-2xl">
                  verified_user
                </span>
                <span className="font-serif text-base font-medium">
                  {language === "hi" ? "सहेली गोपनीयता प्रतिज्ञा" : "Saheli Privacy Sanctuary"}
                </span>
              </div>
              <ul className="text-xs space-y-2 opacity-90 leading-relaxed font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-secondary-container font-bold">✓</span>
                  <span>
                    {language === "hi"
                      ? "डेटा केवल आपके फोन पर रहता है (भारत DPDP अधिनियम 2023 अनुपालन)।"
                      : "Zero-cloud guest mode: All logs remain on this physical device."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary-container font-bold">✓</span>
                  <span>
                    {language === "hi"
                      ? "कोई विज्ञापन नहीं, कोई डेटा बिक्री नहीं।"
                      : "No advertising trackers, no profile reselling ever."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary-container font-bold">✓</span>
                  <span>
                    {language === "hi"
                      ? "कैलकुलेटर मोड: आपात स्थिति में फोन हिलाने पर स्क्रीन तुरंत कैलकुलेटर बन जाती है।"
                      : "Emergency Camouflage: Shake device anytime to hide this app instantly."}
                  </span>
                </li>
              </ul>
            </div>
          </section>
        )}
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="pt-6 pb-2 space-y-2">
        {step < 3 ? (
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="h-12 px-5 rounded-xl border border-outline-variant/40 bg-surface-container text-primary font-semibold text-sm hover:bg-surface-container-high transition-colors"
              >
                {language === "hi" ? "पीछे" : "Back"}
              </button>
            )}
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex-1 h-12 rounded-xl bg-primary text-white font-medium text-sm flex items-center justify-center gap-2 shadow-warm-sm active:scale-[0.99] transition-transform"
            >
              <span>{language === "hi" ? "आगे बढ़ें" : "Continue"}</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="h-12 px-5 rounded-xl border border-outline-variant/40 bg-surface-container text-primary font-semibold text-sm hover:bg-surface-container-high transition-colors"
            >
              {language === "hi" ? "पीछे" : "Back"}
            </button>
            <button
              type="button"
              onClick={() => handleComplete(false)}
              className="flex-1 h-12 rounded-xl bg-primary text-white font-medium text-sm flex items-center justify-center gap-2 shadow-warm-md active:scale-[0.99] transition-transform"
            >
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>{language === "hi" ? "सहेजें और डैशबोर्ड शुरू करें" : "Save & Open Dashboard"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
