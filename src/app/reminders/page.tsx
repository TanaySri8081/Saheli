"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { storage, getDefaultReminderPreferences } from "@/lib/storage";
import { ReminderPreferences, MedicationReminder } from "@/types";

export default function RemindersPage() {
  const { language } = useLanguage();

  // Deterministic state for SSR hydration safety
  const [prefs, setPrefs] = useState<ReminderPreferences>(getDefaultReminderPreferences());
  const [previewTab, setPreviewTab] = useState<"disguised" | "standard">("disguised");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [newMedName, setNewMedName] = useState("");
  const [newMedInstructions, setNewMedInstructions] = useState("");
  const [newMedTime, setNewMedTime] = useState("09:00 AM");
  const [showTimeModal, setShowTimeModal] = useState<"period" | "iron" | null>(null);
  const [timePickerValue, setTimePickerValue] = useState("08:00 AM");

  // Load from local storage on client mount
  useEffect(() => {
    const saved = storage.getReminderPreferences();
    setPrefs(saved);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updatePreference = <K extends keyof ReminderPreferences>(
    key: K,
    val: ReminderPreferences[K]
  ) => {
    const next = { ...prefs, [key]: val };
    setPrefs(next);
    storage.saveReminderPreferences({ [key]: val });
  };

  const handleToggle = (key: keyof ReminderPreferences) => {
    const current = prefs[key] as boolean;
    updatePreference(key, !current as any);
  };

  const playChime = (style: "temple_bell" | "soft_chime" | "vibrate_only") => {
    updatePreference("chimeStyle", style);
    if (typeof window === "undefined") return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (style === "temple_bell") {
        // Resonant bell tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz Solfeggio frequency
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      } else if (style === "soft_chime") {
        // High soft chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } else if (style === "vibrate_only") {
        if ("vibrate" in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
      }
    } catch {
      // Audio autoplay restriction fallback
    }
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    const newMed: MedicationReminder = {
      id: "med_" + Date.now().toString(36),
      name: newMedName.trim(),
      instructions: newMedInstructions.trim() || (language === "hi" ? "दैनिक खुराक" : "Daily dose"),
      time: newMedTime,
      category: "general",
      activeDays: language === "hi" ? "प्रतिदिन" : "Daily",
    };

    const updatedMeds = [...prefs.medications, newMed];
    updatePreference("medications", updatedMeds);
    setNewMedName("");
    setNewMedInstructions("");
    setShowAddMedModal(false);
    showToast(language === "hi" ? "दवाई रिमाइंडर जोड़ा गया!" : "Medication reminder added!");
  };

  const handleDeleteMedication = (id: string) => {
    const updated = prefs.medications.filter((m) => m.id !== id);
    updatePreference("medications", updated);
    showToast(language === "hi" ? "दवाई हटा दी गई" : "Medication removed");
  };

  const handleSaveAll = () => {
    storage.saveReminderPreferences(prefs);
    showToast(
      language === "hi"
        ? "आपकी रिमाइंडर प्राथमिकताएं सुरक्षित कर ली गई हैं! 🌿"
        : "Reminder preferences saved securely on-device! 🌿"
    );
  };

  const testDiscreetNotification = () => {
    const title = prefs.discreetMode
      ? "Daily Pause: Drink warm water"
      : "Saheli: Period in 2 Days";
    const body = prefs.discreetMode
      ? '"Remember to take 3 deep breaths and stay hydrated with a warm infusion today."'
      : "Your estimated cycle start date is approaching. Keep pads ready and rest well.";

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(title, {
          body,
          icon: "/icon.svg",
        });
        showToast(language === "hi" ? "सिस्टम नोटिफिकेशन भेजा गया!" : "Test notification fired!");
        return;
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification(title, { body, icon: "/icon.svg" });
          }
        });
      }
    }

    // In-app visual preview fallback
    showToast(`${title}: ${body}`);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-primary text-on-primary px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Editorial Context */}
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold tracking-wider uppercase">
            {language === "hi" ? "दिनचर्या और सूचनाएं" : "Cycle & Routine Alerts"}
          </span>
          <span className="text-xs text-on-surface-variant">
            {language === "hi" ? "100% ऑन-डिवाइस अलार्म" : "100% On-Device Sandbox"}
          </span>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-medium text-primary tracking-tight mt-1">
          {language === "hi" ? "गोपनीय रिमाइंडर और अलर्ट" : "Gentle Reminders & Alerts"}
        </h1>
        <p className="text-sm text-primary/80 italic">
          {language === "hi"
            ? "आपके स्वास्थ्य के अनुकूल, विवेकपूर्ण और निजी"
            : "Thoughtful notifications tailored to your natural rhythms"}
        </p>
        <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
          {language === "hi"
            ? "अपने स्वाभाविक चक्र के अनुसार कोमल सूचनाएं सेट करें। अपनी गोपनीयता बनाए रखने के लिए छद्म संदेश (Disguised Mode) चुनें, ताकि परिवार के साथ फोन साझा करने पर भी कोई अन्य व्यक्ति माहवारी संबंधी सूचना न पढ़ सके।"
            : "Set thoughtful notifications tailored to your natural rhythms. Choose discreet preview text so your private cycle reminders remain completely confidential on shared family lock screens."}
        </p>
      </div>

      {/* Discretion & Shared Phone Mode Spotlight (Feature Spotlight) */}
      <section className="bg-surface-container-low rounded-2xl p-4 md:p-5 mb-6 shadow-sm border border-outline-variant/30">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-0.5 shadow-xs">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield_lock
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm md:text-base text-on-surface">
                  {language === "hi" ? "प्राइवेट लॉक स्क्रीन मोड" : "Private Lock Screen Mode"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    prefs.discreetMode
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {prefs.discreetMode
                    ? language === "hi"
                      ? "सक्रिय / Active"
                      : "Active"
                    : language === "hi"
                    ? "बंद / Inactive"
                    : "Standard"}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {language === "hi"
                  ? "गोपनीय सूचनाएं (Shared Family Phone Friendly)"
                  : "Disguised notification text for shared family phones"}
              </p>
            </div>
          </div>

          {/* Primary Switch */}
          <button
            aria-pressed={prefs.discreetMode}
            onClick={() => handleToggle("discreetMode")}
            className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 flex items-center shrink-0 ${
              prefs.discreetMode ? "bg-primary" : "bg-surface-container-high"
            }`}
            type="button"
          >
            <span
              className={`w-6 h-6 rounded-full bg-on-primary shadow-sm transform transition-transform duration-200 flex items-center justify-center ${
                prefs.discreetMode ? "translate-x-5" : "translate-x-0"
              }`}
            >
              <span className="material-symbols-outlined text-primary text-[14px]">
                {prefs.discreetMode ? "lock" : "lock_open"}
              </span>
            </span>
          </button>
        </div>

        <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
          {language === "hi"
            ? "यह सुविधा माहवारी या प्रजनन शब्दों को सामान्य स्वास्थ्य व माइंडफुलनेस संदेशों से बदल देती है। स्क्रीन पर कोई भी स्पष्ट सूचना नहीं दिखेगी।"
            : "Substitutes explicit reproductive terms with gentle, neutral wellness check-ins. Family members glancing at your phone will only see positive mindfulness affirmations."}
        </p>

        {/* Interactive Lock Screen Mockup */}
        <div className="bg-surface-container-lowest rounded-xl p-3.5 md:p-4 shadow-xs border border-outline-variant/20">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span className="font-medium">
                {language === "hi" ? "लॉक स्क्रीन पूर्वावलोकन" : "Live Lock Screen Preview"}
              </span>
            </div>
            <div className="inline-flex bg-surface-container-high rounded-full p-0.5">
              <button
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  previewTab === "disguised"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                onClick={() => setPreviewTab("disguised")}
                type="button"
              >
                {language === "hi" ? "छद्म / Disguised" : "Disguised"}
              </button>
              <button
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  previewTab === "standard"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                onClick={() => setPreviewTab("standard")}
                type="button"
              >
                {language === "hi" ? "सामान्य / Standard" : "Standard"}
              </button>
            </div>
          </div>

          <div className="bg-surface-container rounded-xl p-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[16px]">spa</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">Saheli Wellness</span>
                <span className="text-[11px] text-on-surface-variant">Just now</span>
              </div>
              <p className="text-sm font-semibold text-on-surface truncate mt-0.5">
                {previewTab === "disguised"
                  ? language === "hi"
                    ? "दैनिक विराम: गुनगुना पानी पिएं"
                    : "Daily Pause: Drink warm water"
                  : language === "hi"
                  ? "सहेली: 2 दिन में माहवारी की संभावना"
                  : "Saheli: Period in 2 Days"}
              </p>
              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2 mt-0.5">
                {previewTab === "disguised"
                  ? language === "hi"
                    ? '"3 गहरी सांसें लें और आज गुनगुने काढ़े के साथ हाइड्रेटेड रहें।"'
                    : '"Remember to take 3 deep breaths and stay hydrated with a warm infusion today."'
                  : language === "hi"
                  ? "आपका अनुमानित चक्र गुरुवार से शुरू हो सकता है। पैड तैयार रखें और पर्याप्त आराम करें।"
                  : "Your estimated cycle start date is Thursday. Keep pads ready and rest well."}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2.5 pt-1 text-[11px] text-on-surface-variant">
            <span className="italic">
              {language === "hi"
                ? "गोपनीय मोड में माहवारी शब्द पूरी तरह छिपे रहते हैं।"
                : "Lock screen disguises all menstrual and ovulation keywords."}
            </span>
            <button
              onClick={testDiscreetNotification}
              className="text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">send</span>
              {language === "hi" ? "टेस्ट नोटिफिकेशन" : "Test Fire"}
            </button>
          </div>
        </div>
      </section>

      {/* Cycle & Period Alerts */}
      <section className="flex flex-col gap-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
            <h2 className="font-serif text-lg font-medium text-on-surface">
              {language === "hi" ? "चक्र और माहवारी अलर्ट" : "Cycle & Period Alerts"}
            </h2>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            {language === "hi" ? "मासिक धर्म" : "Predictive Alerts"}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant">
          {language === "hi"
            ? "आपके दर्ज किए गए लॉग्स और प्राकृतिक प्रवाह के आधार पर सटीक और कोमल सूचनाएं।"
            : "Predictive cycle notifications based on your logs and natural flow patterns."}
        </p>

        {/* Card 1: Period Approaching */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-outline-variant/20 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">water_drop</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-on-surface">
                  {language === "hi" ? "माहवारी आगमन पूर्व सूचना" : "Period Approaching Alert"}
                </div>
                <p className="text-xs text-on-surface-variant">
                  {language === "hi"
                    ? "माहवारी आने से पहले पूर्व सूचना"
                    : "Advance notice to keep supplies ready"}
                </p>
              </div>
            </div>
            <button
              aria-checked={prefs.periodApproaching}
              onClick={() => handleToggle("periodApproaching")}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors shrink-0 flex items-center ${
                prefs.periodApproaching ? "bg-primary" : "bg-surface-container-high"
              }`}
              type="button"
            >
              <span
                className={`w-6 h-6 rounded-full bg-on-primary shadow-sm transform transition-transform ${
                  prefs.periodApproaching ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {language === "hi"
              ? "साफ पैड, मेंस्ट्रुअल कप या गर्म चाय तैयार रखने के लिए पूर्व चेतावनी।"
              : "Gentle warning to keep clean pads, menstrual cups, or warm tea ready."}
          </p>

          <div className="bg-surface-container rounded-lg p-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
              <span className="text-on-surface font-medium">
                {language === "hi" ? "समय:" : "Alert Timing:"}
              </span>
              <button
                onClick={() => {
                  setTimePickerValue(prefs.periodApproachingTime);
                  setShowTimeModal("period");
                }}
                className="px-2.5 py-1 rounded bg-surface-container-lowest text-primary font-semibold shadow-xs hover:bg-surface-container-high"
                type="button"
              >
                {prefs.periodApproachingTime}
              </button>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-on-surface-variant mr-1">
                {language === "hi" ? "कब:" : "Notify:"}
              </span>
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  onClick={() => updatePreference("periodApproachingDays", d)}
                  className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                    prefs.periodApproachingDays === d
                      ? "bg-primary text-on-primary font-semibold"
                      : "bg-surface-container-high text-on-surface"
                  }`}
                  type="button"
                >
                  {d}d {d === 2 ? "before" : ""}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: PMS & Mood Shift */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-outline-variant/20 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">psychology_alt</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-on-surface">
                  {language === "hi"
                    ? "पीएमएस और मूड संवेदनशीलता"
                    : "PMS & Mood Shift Awareness"}
                </div>
                <p className="text-xs text-on-surface-variant">
                  {language === "hi"
                    ? "मूड बदलाव और पीएमएस संवेदनशीलता"
                    : "Luteal phase hormonal shift understanding"}
                </p>
              </div>
            </div>
            <button
              aria-checked={prefs.pmsMoodAwareness}
              onClick={() => handleToggle("pmsMoodAwareness")}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors shrink-0 flex items-center ${
                prefs.pmsMoodAwareness ? "bg-primary" : "bg-surface-container-high"
              }`}
              type="button"
            >
              <span
                className={`w-6 h-6 rounded-full bg-on-primary shadow-sm transform transition-transform ${
                  prefs.pmsMoodAwareness ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {language === "hi"
              ? "ल्यूटियल फेज में प्रवेश करने पर संकेत मिलता है ताकि चिड़चिड़ापन या भावनात्मक थकान को समझा जा सके और स्वयं के प्रति दयालु रहा जा सके।"
              : "Nudges you when entering the luteal phase so irritability or emotional fatigue feels understood, not overwhelming."}
          </p>
        </div>

        {/* Card 3: Fertile Window */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-outline-variant/20 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">egg_alt</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-on-surface">
                  {language === "hi"
                    ? "गर्भधारण व ओव्यूलेशन अनुमान"
                    : "Fertile Window & Ovulation Rhythm"}
                </div>
                <p className="text-xs text-on-surface-variant">
                  {language === "hi" ? "ओव्यूलेशन रिदम" : "Educational awareness (Disabled by default)"}
                </p>
              </div>
            </div>
            <button
              aria-checked={prefs.fertileWindow}
              onClick={() => handleToggle("fertileWindow")}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors shrink-0 flex items-center ${
                prefs.fertileWindow ? "bg-primary" : "bg-surface-container-high"
              }`}
              type="button"
            >
              <span
                className={`w-6 h-6 rounded-full bg-on-primary shadow-sm transform transition-transform ${
                  prefs.fertileWindow ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {language === "hi"
              ? "प्रजनन योजना या सामान्य जागरूकता के लिए शैक्षिक अनुमान। मानसिक शांति के लिए डिफ़ॉल्ट रूप से बंद रहता है।"
              : "Educational estimates for fertility planning or awareness. Disabled by default for peace of mind."}
          </p>
        </div>

        {/* Card 4: Delayed Period Check-in */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-outline-variant/20 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">favorite</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-on-surface">
                  {language === "hi"
                    ? "तनावमुक्त देरी की जांच (5 दिन बाद)"
                    : "Delayed Period & Stress Check-in"}
                </div>
                <p className="text-xs text-on-surface-variant">
                  {language === "hi"
                    ? "शांतिपूर्ण और बिना घबराहट के परामर्श"
                    : "Gentle non-anxious prompt after 5 days delay"}
                </p>
              </div>
            </div>
            <button
              aria-checked={prefs.delayedPeriodCheckin}
              onClick={() => handleToggle("delayedPeriodCheckin")}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors shrink-0 flex items-center ${
                prefs.delayedPeriodCheckin ? "bg-primary" : "bg-surface-container-high"
              }`}
              type="button"
            >
              <span
                className={`w-6 h-6 rounded-full bg-on-primary shadow-sm transform transition-transform ${
                  prefs.delayedPeriodCheckin ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {language === "hi"
              ? "5 दिन की देरी के बाद यात्रा, तनाव, बीमारी या नींद के पैटर्न को समझने के लिए एक शांत, अपराध-मुक्त अनुस्मारक।"
              : "A calm, guilt-free prompt after 5 days delay to assess recent travel, stress, illness, or sleep changes without triggering anxiety."}
          </p>
        </div>
      </section>

      {/* Daily Routine & Desi Care Nudges */}
      <section className="flex flex-col gap-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">local_cafe</span>
            <h2 className="font-serif text-lg font-medium text-on-surface">
              {language === "hi" ? "घरेलू दिनचर्या और देखभाल" : "Daily Desi Care Nudges"}
            </h2>
          </div>
          <span className="text-xs text-secondary font-semibold">
            {language === "hi" ? "घरेलू पोषण" : "Kitchen Wisdom"}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant">
          {language === "hi"
            ? "सांस्कृतिक रूप से अनुकूल घरेलू नुस्खे, पोषण और विश्राम अनुष्ठान।"
            : "Culturally attuned remedies, kitchen wisdom, and holistic wellness rituals."}
        </p>

        {/* Care Card 1: Warm Infusions */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-outline-variant/20 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">soup_kitchen</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-on-surface">
                  {language === "hi"
                    ? "गर्म काढ़ा व हर्बल अर्क"
                    : "Warm Herbal Infusions (काढ़ा / अर्क)"}
                </div>
                <p className="text-xs text-on-surface-variant">
                  {language === "hi"
                    ? "अजवाइन, जीरा पानी या अदरक की चाय"
                    : "Ajwain, jeera water or ginger-tulsi infusion"}
                </p>
              </div>
            </div>
            <button
              aria-checked={prefs.warmInfusions}
              onClick={() => handleToggle("warmInfusions")}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors shrink-0 flex items-center ${
                prefs.warmInfusions ? "bg-primary" : "bg-surface-container-high"
              }`}
              type="button"
            >
              <span
                className={`w-6 h-6 rounded-full bg-on-primary shadow-sm transform transition-transform ${
                  prefs.warmInfusions ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {language === "hi"
              ? "ऐंठन में राहत और पाचन संतुलन के लिए दिन में दो बार गर्म अर्क का सेवन।"
              : "Friendly prompts for cramp relief and digestive balance during heavy cycle phases."}
          </p>
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[14px] text-secondary">
                check_circle
              </span>
              11:00 AM (Morning Pause)
            </span>
            <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[14px] text-secondary">
                check_circle
              </span>
              04:30 PM (Evening Infusion)
            </span>
          </div>
        </div>

        {/* Care Card 2: Iron & Hemoglobin */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-outline-variant/20 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">nutrition</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-on-surface">
                  {language === "hi"
                    ? "आयरन और हीमोग्लोबिन रिमाइंडर"
                    : "Iron & Hemoglobin Reminders"}
                </div>
                <p className="text-xs text-on-surface-variant">
                  {language === "hi"
                    ? "भुना चना, आंवला, गुड़ और पालक का सेवन"
                    : "Roasted chana, amla, jaggery & leafy greens"}
                </p>
              </div>
            </div>
            <button
              aria-checked={prefs.ironReminders}
              onClick={() => handleToggle("ironReminders")}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors shrink-0 flex items-center ${
                prefs.ironReminders ? "bg-primary" : "bg-surface-container-high"
              }`}
              type="button"
            >
              <span
                className={`w-6 h-6 rounded-full bg-on-primary shadow-sm transform transition-transform ${
                  prefs.ironReminders ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {language === "hi"
              ? "दोपहर के भोजन के बाद डॉक्टर द्वारा सुझाई गई आयरन गोली या प्राकृतिक आयरन युक्त नाश्ते की याद दिलाना।"
              : "Gentle post-lunch check to take prescribed iron/folic acid supplements or natural iron-dense snacks."}
          </p>
          <div className="bg-surface-container rounded-lg p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-on-surface font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary">alarm</span>
              <span>
                {language === "hi" ? "निर्धारित:" : "Scheduled:"} {prefs.ironReminderTime} (Post lunch)
              </span>
            </div>
            <button
              onClick={() => {
                setTimePickerValue(prefs.ironReminderTime);
                setShowTimeModal("iron");
              }}
              className="text-primary font-semibold hover:underline"
              type="button"
            >
              {language === "hi" ? "बदलें" : "Change"}
            </button>
          </div>
        </div>

        {/* Care Card 3: Gentle Movement / Rest */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-outline-variant/20 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">self_improvement</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-on-surface">
                  {language === "hi" ? "विश्राम और कोमल योग" : "Gentle Yoga / Rest Permission"}
                </div>
                <p className="text-xs text-on-surface-variant">
                  {language === "hi"
                    ? "बद्ध कोणासन, शवासन और विश्राम"
                    : "Supta Baddha Konasana & restorative rest"}
                </p>
              </div>
            </div>
            <button
              aria-checked={prefs.gentleMovement}
              onClick={() => handleToggle("gentleMovement")}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors shrink-0 flex items-center ${
                prefs.gentleMovement ? "bg-primary" : "bg-surface-container-high"
              }`}
              type="button"
            >
              <span
                className={`w-6 h-6 rounded-full bg-on-primary shadow-sm transform transition-transform ${
                  prefs.gentleMovement ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {language === "hi"
              ? "यह आश्वस्त करने वाला अनुस्मारक कि ऐंठन के दिनों में सक्रिय विश्राम करना आलस्य नहीं, बल्कि उत्पादक आत्म-देखभाल है।"
              : "Reassuring reminder that active resting during high cramp days is productive self-care, not laziness."}
          </p>
        </div>
      </section>

      {/* Medications & Appointments */}
      <section className="flex flex-col gap-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">medication</span>
            <h2 className="font-serif text-lg font-medium text-on-surface">
              {language === "hi" ? "दवाइयां और परामर्श" : "Medications & Appointments"}
            </h2>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            {language === "hi" ? "दवा अनुसूची" : "Prescriptions"}
          </span>
        </div>

        {/* Prescription List Card */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-outline-variant/20 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-on-surface">
              {language === "hi" ? "सक्रिय दवाइयां" : "Active Prescription Reminders"}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
              {prefs.medications.length} {language === "hi" ? "सक्रिय" : "Active"}
            </span>
          </div>

          {prefs.medications.map((med) => (
            <div
              key={med.id}
              className="bg-surface-container rounded-lg p-3 flex items-start justify-between gap-2"
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    med.category === "pain_relief"
                      ? "bg-tertiary text-on-tertiary"
                      : "bg-primary text-on-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {med.category === "pain_relief" ? "healing" : "pill"}
                  </span>
                </div>
                <div>
                  <div className="text-xs md:text-sm font-semibold text-on-surface">
                    {med.name}
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    {med.instructions} • {med.time}
                  </p>
                </div>
              </div>
              <button
                aria-label="Delete medication"
                onClick={() => handleDeleteMedication(med.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          ))}

          {/* Add New Medication Button */}
          <button
            onClick={() => setShowAddMedModal(true)}
            className="w-full min-h-[44px] rounded-lg bg-surface-container-high text-primary hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold mt-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>
              {language === "hi"
                ? "+ नई दवाई या सप्लीमेंट जोड़ें"
                : "+ Add Medication or Supplement (दवाई जोड़ें)"}
            </span>
          </button>
        </div>

        {/* Gynecologist Follow Up Card */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-outline-variant/20 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">stethoscope</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-on-surface">
                {language === "hi"
                  ? "स्त्री रोग विशेषज्ञ अपॉइंटमेंट"
                  : "Gynecologist Ultrasound Review"}
              </div>
              <p className="text-xs text-secondary font-semibold">
                {language === "hi"
                  ? "शनिवार, 28 अक्टूबर • 11:30 AM"
                  : "Scheduled: Saturday, 28th October at 11:30 AM"}
              </p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Dr. Ananya Sharma • Apollo Women&apos;s Clinic
              </p>
            </div>
          </div>
          <div className="bg-secondary-container/40 rounded-lg p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-on-secondary-container font-medium">
              <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
              <span>
                {language === "hi"
                  ? "सहेली 30-दिवसीय परामर्श रिपोर्ट तैयार करें"
                  : "Prepare Saheli 30-Day Symptom Report"}
              </span>
            </div>
            <Link
              href="/my-cycle"
              className="text-secondary font-bold hover:underline shrink-0"
            >
              {language === "hi" ? "रिपोर्ट देखें" : "View PDF"}
            </Link>
          </div>
        </div>
      </section>

      {/* Quiet Hours & Sound Preferences */}
      <section className="flex flex-col gap-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">
              notifications_paused
            </span>
            <h2 className="font-serif text-lg font-medium text-on-surface">
              {language === "hi" ? "शांति समय और धुनें" : "Quiet Hours & Tones"}
            </h2>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            {language === "hi" ? "आराम का समय" : "Do Not Disturb"}
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-outline-variant/20 flex flex-col gap-4">
          {/* Quiet hours time range */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-on-surface">
                {language === "hi" ? "डू नॉट डिस्टर्ब (DND)" : "Do Not Disturb (शांति समय)"}
              </div>
              <p className="text-xs text-on-surface-variant">
                {language === "hi"
                  ? "नींद के दौरान गैर-आपातकालीन चक्र सूचनाएं म्यूट रखें"
                  : "Mute non-urgent cycle alerts during sleep"}
              </p>
            </div>
            <button
              aria-checked={prefs.dndEnabled}
              onClick={() => handleToggle("dndEnabled")}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors shrink-0 flex items-center ${
                prefs.dndEnabled ? "bg-primary" : "bg-surface-container-high"
              }`}
              type="button"
            >
              <span
                className={`w-6 h-6 rounded-full bg-on-primary shadow-sm transform transition-transform ${
                  prefs.dndEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-container rounded-lg p-2.5 flex flex-col gap-0.5">
              <span className="text-[11px] text-on-surface-variant">
                {language === "hi" ? "प्रारंभ" : "Starts"}
              </span>
              <span className="text-sm font-semibold text-primary">{prefs.dndStartTime}</span>
            </div>
            <div className="bg-surface-container rounded-lg p-2.5 flex flex-col gap-0.5">
              <span className="text-[11px] text-on-surface-variant">
                {language === "hi" ? "समाप्त" : "Ends"}
              </span>
              <span className="text-sm font-semibold text-primary">{prefs.dndEndTime}</span>
            </div>
          </div>

          {/* Tone selector */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-xs font-semibold text-on-surface">
              {language === "hi" ? "नोटिफिकेशन धुन शैली:" : "Notification Chime Style:"}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => playChime("temple_bell")}
                className={`py-2 px-2 rounded-lg text-xs flex flex-col items-center gap-1 transition-all ${
                  prefs.chimeStyle === "temple_bell"
                    ? "bg-primary text-on-primary shadow-xs font-semibold"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                <span>Temple Bell</span>
              </button>
              <button
                onClick={() => playChime("soft_chime")}
                className={`py-2 px-2 rounded-lg text-xs flex flex-col items-center gap-1 transition-all ${
                  prefs.chimeStyle === "soft_chime"
                    ? "bg-primary text-on-primary shadow-xs font-semibold"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">music_note</span>
                <span>Soft Chime</span>
              </button>
              <button
                onClick={() => playChime("vibrate_only")}
                className={`py-2 px-2 rounded-lg text-xs flex flex-col items-center gap-1 transition-all ${
                  prefs.chimeStyle === "vibrate_only"
                    ? "bg-primary text-on-primary shadow-xs font-semibold"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">vibration</span>
                <span>Vibrate Only</span>
              </button>
            </div>
          </div>

          {/* Alert language */}
          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
            <div>
              <span className="text-xs font-semibold text-on-surface">
                {language === "hi" ? "अलर्ट भाषा" : "Alert Language"}
              </span>
              <p className="text-[11px] text-on-surface-variant">
                {language === "hi" ? "भाषा प्राथमिकता" : "Lock screen message language"}
              </p>
            </div>
            <div className="inline-flex bg-surface-container-high rounded-full p-0.5">
              <button
                onClick={() => updatePreference("alertLanguage", "en")}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  prefs.alertLanguage === "en"
                    ? "bg-primary text-on-primary font-semibold shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                type="button"
              >
                English
              </button>
              <button
                onClick={() => updatePreference("alertLanguage", "hi")}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  prefs.alertLanguage === "hi"
                    ? "bg-primary text-on-primary font-semibold shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                type="button"
              >
                हिंदी (Hindi)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Guidance & On-Device Guarantee */}
      <footer className="bg-surface-container-low rounded-xl p-4 md:p-5 flex flex-col gap-3 border border-outline-variant/30">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-on-surface">
              {language === "hi"
                ? "100% ऑन-डिवाइस अलार्म गारंटी"
                : "100% On-Device Alarm Guarantee"}
            </h3>
            <p className="text-xs text-on-surface-variant">
              {language === "hi"
                ? "शून्य डेटा ट्रैकिंग और गोपनीयता सुरक्षा"
                : "Zero cloud brokers • Sovereign local clock"}
            </p>
          </div>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {language === "hi"
            ? "सहेली आपके फोन के आंतरिक ऑपरेटिंग सिस्टम क्लॉक का उपयोग करके सभी सूचनाएं ट्रिगर करती है। कोई भी नोटिफिकेशन या चक्र मील का पत्थर कभी भी बाहरी क्लाउड ट्रैकर्स या मार्केटिंग ब्रोकर्स को नहीं भेजा जाता है।"
            : "Saheli triggers all your routine nudges locally using your phone's built-in operating system clock. No notification payload or cycle milestone is ever sent to external marketing brokers or remote cloud trackers."}
        </p>

        <div className="p-2.5 bg-surface-container rounded-lg flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] text-tertiary">info</span>
          <p className="text-[11px] leading-tight">
            {language === "hi"
              ? "केवल शैक्षिक साथी। दवाइयों व खुराक के लिए हमेशा अपने डॉक्टर के पर्चे का पालन करें।"
              : "Educational companion only. Always follow your prescribing doctor's clinical instructions."}
          </p>
        </div>

        {/* Save Action Button */}
        <button
          onClick={handleSaveAll}
          className="min-h-[48px] w-full rounded-xl bg-primary text-on-primary text-sm font-semibold flex items-center justify-center gap-2 mt-2 shadow-sm active:opacity-90 transition-opacity"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">check</span>
          <span>
            {language === "hi"
              ? "रिमाइंडर प्राथमिकताएं सहेजें (सहेजें)"
              : "Save Notification Preferences (सहेजें)"}
          </span>
        </button>
      </footer>

      {/* Add Medication Modal */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-outline-variant/30 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/20">
              <h3 className="font-serif text-lg font-medium text-primary">
                {language === "hi" ? "नई दवाई या सप्लीमेंट" : "Add Medication or Supplement"}
              </h3>
              <button
                onClick={() => setShowAddMedModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddMedication} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  {language === "hi" ? "दवाई / सप्लीमेंट का नाम" : "Medication / Supplement Name"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Iron & Folic Acid, Vitamin D3"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  {language === "hi" ? "खुराक / निर्देश" : "Dose & Instructions"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 Tablet after dinner with water"
                  value={newMedInstructions}
                  onChange={(e) => setNewMedInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  {language === "hi" ? "अलर्ट समय" : "Alert Time"}
                </label>
                <select
                  value={newMedTime}
                  onChange={(e) => setNewMedTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant text-xs text-on-surface focus:outline-primary"
                >
                  <option value="08:00 AM">08:00 AM (Morning)</option>
                  <option value="09:00 AM">09:00 AM (Breakfast)</option>
                  <option value="01:30 PM">01:30 PM (Post Lunch)</option>
                  <option value="05:00 PM">05:00 PM (Tea time)</option>
                  <option value="08:30 PM">08:30 PM (Dinner)</option>
                  <option value="10:00 PM">10:00 PM (Bedtime)</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMedModal(false)}
                  className="flex-1 py-2.5 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high"
                >
                  {language === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container"
                >
                  {language === "hi" ? "जोड़ें" : "Add Reminder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Time Picker Modal */}
      {showTimeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-xs w-full p-5 shadow-2xl border border-outline-variant/30 animate-in fade-in zoom-in-95">
            <h3 className="font-serif text-base font-medium text-primary mb-2">
              {language === "hi" ? "अलर्ट समय चुनें" : "Select Alert Time"}
            </h3>
            <div className="space-y-1.5 my-3">
              {["07:00 AM", "08:00 AM", "09:00 AM", "01:30 PM", "05:00 PM", "08:00 PM"].map(
                (time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setTimePickerValue(time)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold text-left flex items-center justify-between ${
                      timePickerValue === time
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    <span>{time}</span>
                    {timePickerValue === time && (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    )}
                  </button>
                )
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowTimeModal(null)}
                className="flex-1 py-2 rounded-lg bg-surface-container text-xs font-semibold text-on-surface"
              >
                {language === "hi" ? "रद्द करें" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (showTimeModal === "period") {
                    updatePreference("periodApproachingTime", timePickerValue);
                  } else {
                    updatePreference("ironReminderTime", timePickerValue);
                  }
                  setShowTimeModal(null);
                  showToast(language === "hi" ? "समय अपडेट किया गया!" : "Time updated!");
                }}
                className="flex-1 py-2 rounded-lg bg-primary text-xs font-semibold text-on-primary"
              >
                {language === "hi" ? "लागू करें" : "Apply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
