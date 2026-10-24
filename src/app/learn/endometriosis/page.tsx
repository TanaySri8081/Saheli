"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCycle } from "@/context/CycleContext";

export default function EndometriosisPage() {
  const { language, speakText, isSpeaking, stopSpeaking } = useLanguage();
  const { logSymptom } = useCycle();

  const [copiedToast, setCopiedToast] = useState(false);
  const [diaryToast, setDiaryToast] = useState(false);

  // In-Page Pain and Symptom Diary State
  const [diaryDate, setDiaryDate] = useState("2026-10-24");
  const [painScore, setPainScore] = useState<number>(7);
  const [painLocations, setPainLocations] = useState<string[]>(["deep_pelvis"]);
  const [painReliefEffect, setPainReliefEffect] = useState<string>("no_relief");
  const [diaryNotes, setDiaryNotes] = useState<string>("");

  useEffect(() => {
    setDiaryDate(new Date().toISOString().split("T")[0]);
  }, []);

  const toggleLocation = (loc: string) => {
    if (painLocations.includes(loc)) {
      setPainLocations(painLocations.filter((l) => l !== loc));
    } else {
      setPainLocations([...painLocations, loc]);
    }
  };

  const handleSavePainDiary = (e: React.FormEvent) => {
    e.preventDefault();
    logSymptom({
      log_date: diaryDate,
      pain_level: painScore,
      symptoms: painLocations,
      reflection: `Endometriosis Diary: Pain ${painScore}/10. Locations: ${painLocations.join(", ")}. Relief: ${painReliefEffect}. Notes: ${diaryNotes}`,
    });
    setDiaryToast(true);
    setTimeout(() => setDiaryToast(false), 3500);
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const narration =
      language === "hi"
        ? "एंडोमेट्रियोसिस जागरूकता पाथवे। आपका दर्द वास्तविक है, वहम नहीं। यदि माहवारी का दर्द आपको कॉलेज या काम से रोकता है, उल्टियां लाता है या सामान्य दवाओं से ठीक नहीं होता, तो इसे नजरअंदाज न करें। यह ध्यान रखना अत्यंत महत्वपूर्ण है कि बीमारी का फैलाव दर्द की तीव्रता तय नहीं करता। सहेली कभी यह दावा नहीं करती कि वह एंडोमेट्रियोसिस की पुष्टि या खारिज कर सकती है; इसका निदान केवल स्त्री रोग विशेषज्ञ द्वारा ही संभव है।"
        : "Endometriosis Awareness Pathway. Your pain is real, not imagined. Disruptive pelvic pain that causes absence from work or college, radiates to your legs, or fails to respond to standard painkillers is not just routine cramps. Crucially, disease extent does not correlate with pain intensity. Saheli never claims to confirm or rule out endometriosis; definitive clinical diagnosis requires specialist gynecological evaluation.";

    speakText(narration);
  };

  const doctorQuestions = [
    language === "hi"
      ? "मेरा दर्द सामान्य से कहीं अधिक है और दैनिक जीवन को रोकता है। क्या हमें पेल्विक एंडोमेट्रियोसिस की जांच करनी चाहिए?"
      : "My pain is disruptive to my work/college routine. Could we evaluate for secondary dysmenorrhea or endometriosis?",
    language === "hi"
      ? "क्या नियमित अल्ट्रासाउंड के बजाय स्पेशलाइज्ड ट्रांसवेजिनल अल्ट्रासाउंड या पेल्विक एमआरआई (Pelvic MRI) अधिक उपयुक्त रहेगा?"
      : "Would a specialized high-resolution pelvic ultrasound or pelvic MRI be more effective than a standard scan?",
    language === "hi"
      ? "केवल दर्द निवारक गोलियों के अलावा क्या हम लॉन्ग-टर्म मल्टीमॉडल पेल्विक केयर पर विचार कर सकते हैं?"
      : "Beyond recurring painkillers, what long-term medical and multidisciplinary pelvic management approaches exist?",
  ];

  const handleCopyQuestions = () => {
    const textToCopy = doctorQuestions.join("\n\n");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  return (
    <main className="flex-1 w-full py-5 flex flex-col gap-6 pb-24 md:pb-12">
      {/* 1. Header Navigation & Audio Narrator */}
      <section className="space-y-2">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>{language === "hi" ? "पुस्तकालय पर वापस" : "Back to Library"}</span>
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-tertiary">
            {language === "hi" ? "श्रोणि स्वास्थ्य पाथवे" : "Pelvic Health Pathway"}
          </span>
          <button
            onClick={handleReadAloud}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              isSpeaking
                ? "bg-tertiary text-white animate-pulse"
                : "bg-surface-container text-tertiary hover:bg-surface-container-high border border-outline-variant/30"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">volume_up</span>
            <span>
              {isSpeaking
                ? language === "hi"
                  ? "सुन रहे हैं"
                  : "Speaking"
                : language === "hi"
                ? "ऑडियो सुनें"
                : "Listen"}
            </span>
          </button>
        </div>

        <h1 className="font-serif text-2xl font-medium text-tertiary leading-tight">
          {language === "hi"
            ? "एंडोमेट्रियोसिस पाथवे: दर्द की वास्तविकता और सही देखभाल"
            : "Endometriosis Pathway: Pain Reality & Clinical Preparation"}
        </h1>

        <div className="flex items-center gap-2 text-[11px] text-outline font-medium">
          <span>WHO & ESHRE Clinical Evidence Standards</span>
          <span>•</span>
          <span>6 min read</span>
        </div>
      </section>

      {/* 2. CRITICAL CLINICAL SAFEGUARD: APP CANNOT CONFIRM OR RULE OUT */}
      <section className="p-3.5 rounded-2xl bg-surface-container-highest border border-tertiary/20 space-y-1.5 text-xs text-on-surface-variant leading-relaxed">
        <div className="flex items-center gap-1.5 text-tertiary font-bold text-xs uppercase">
          <span className="material-symbols-outlined text-base">verified_user</span>
          <span>{language === "hi" ? "सहेली क्लिनिकल सीमा व सुरक्षा नियम:" : "Clinical Scope & Safeguard:"}</span>
        </div>
        <p className="text-[11px]">
          {language === "hi"
            ? "सहेली कभी भी यह दावा नहीं करती कि वह एंडोमेट्रियोसिस की पुष्टि (confirm) या खारिज (rule out) कर सकती है। एंडोमेट्रियोसिस का निश्चित निदान केवल प्रशिक्षित स्त्री रोग विशेषज्ञ द्वारा विशेष अल्ट्रासाउंड, एमआरआई या लेप्रोस्कोपी के माध्यम से ही किया जा सकता है। यह पाथवे आपको डॉक्टर विज़िट के लिए तैयार करता है।"
            : "Saheli will NEVER claim to confirm or rule out endometriosis. Definitive diagnosis requires specialized clinical evaluation (high-resolution imaging or laparoscopy) by an experienced gynecologist. This pathway helps you track objective symptoms to empower your clinical appointment."}
        </p>
      </section>

      {/* 3. Biological Reality: Disruptive Pelvic Pain & Severity Variability */}
      <section className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3">
        <h2 className="font-serif text-base font-semibold text-primary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px] text-tertiary">healing</span>
          <span>{language === "hi" ? "दर्द की गंभीरता और व्यक्तिगत विविधता" : "Pain Reality & Severity Variation"}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-1.5 text-xs">
          <span className="font-bold text-tertiary block">
            {language === "hi" ? "1. दर्द का स्तर बीमारी के आकार पर निर्भर नहीं करता:" : "1. Disease Extent Does NOT Equal Pain Agony:"}
          </span>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            {language === "hi"
              ? "क्लिनिकल अध्ययनों से सिद्ध है कि कुछ महिलाओं में केवल छोटे, सूक्ष्म घाव (Superficial peritoneal lesions) असहनीय दर्द पैदा कर सकते हैं, जबकि गंभीर एंडोमेट्रियोसिस (Stage IV) कभी-कभी कम दर्द के साथ भी मौजूद हो सकता है। इसलिए आपका दर्द जितना भी हो, वह वास्तविक है और सम्मान का हकदार है।"
              : "Clinical studies confirm that pain severity does not correlate with anatomical stage. Superficial peritoneal lesions can cause agonizing pain due to dense nerve endings, whereas extensive disease may cause dull ache. Your reported pain is valid, regardless of scan findings."}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-1.5 text-xs">
          <span className="font-bold text-tertiary block">
            {language === "hi" ? "2. विशिष्ट दर्द के स्थान (Characteristic Pain Sites):" : "2. Specific Radiating Pain Sites:"}
          </span>
          <ul className="text-[11px] text-on-surface-variant space-y-1">
            <li className="flex items-start gap-1.5">
              <span className="text-secondary font-bold">•</span>
              <span><strong>गहरा पेल्विक दर्द:</strong> माहवारी के पहले दिन से शुरू होकर पूरे चक्र में बना रहना।</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-secondary font-bold">•</span>
              <span><strong>पीठ व जांघों में दर्द:</strong> पेल्विक नसों में खिंचाव के कारण कूल्हों और पैरों में दर्द फैलना।</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-secondary font-bold">•</span>
              <span><strong>शौच के समय दर्द (Dyschezia):</strong> माहवारी के दौरान आंतों की हलचल में तेज चुभन होना।</span>
            </li>
          </ul>
        </div>
        </div>
      </section>

      {/* Two-Column Responsive Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Pain & Symptom Diary */}
        <div className="lg:col-span-7">
          <section className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-3">
            <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-tertiary">history_edu</span>
            <span>{language === "hi" ? "पेल्विक दर्द डायरी (Pain Diary)" : "Interactive Pain & Symptom Diary"}</span>
          </h3>
          <span className="text-[9px] text-outline">Stored on Device</span>
        </div>

        <p className="text-xs text-outline leading-snug">
          {language === "hi"
            ? "डॉक्टर को दिखाने के लिए अपने दर्द की तीव्रता और प्रभाव का रिकॉर्ड रखें:"
            : "Record precise pain intensity, location, and painkiller response for your doctor summary:"}
        </p>

        <form onSubmit={handleSavePainDiary} className="space-y-3 text-xs">
          <div>
            <label className="text-[10px] uppercase font-bold text-outline block mb-1">
              {language === "hi" ? "तारीख:" : "Date:"}
            </label>
            <input
              type="date"
              value={diaryDate}
              onChange={(e) => setDiaryDate(e.target.value)}
              className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface focus:outline-none"
            />
          </div>

          {/* Pain Score Slider 0 - 10 */}
          <div className="p-3 rounded-xl bg-surface-container space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-outline">
                {language === "hi" ? "दर्द की तीव्रता (0-10):" : "Pain Severity Score (0-10):"}
              </span>
              <span className="font-serif text-base font-bold text-tertiary">{painScore} / 10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={painScore}
              onChange={(e) => setPainScore(Number(e.target.value))}
              className="w-full accent-tertiary cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-outline">
              <span>0 (No Pain)</span>
              <span>5 (Moderate)</span>
              <span>10 (Unbearable)</span>
            </div>
          </div>

          {/* Pain Locations Multi-Select */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-outline block">
              {language === "hi" ? "दर्द कहां महसूस हो रहा है?" : "Where is the pain localized?"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "deep_pelvis", label: "Deep Pelvis (गहरा पेल्विस)" },
                { id: "lower_back", label: "Lower Back (कमर दर्द)" },
                { id: "radiating_legs", label: "Radiating to Legs (पैरों में दर्द)" },
                { id: "bowel_pain", label: "Bowel Movements (शौच में दर्द)" },
              ].map((loc) => {
                const isSelected = painLocations.includes(loc.id);
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => toggleLocation(loc.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                      isSelected
                        ? "bg-tertiary-fixed text-tertiary font-bold border-tertiary"
                        : "bg-surface-container text-outline border-outline-variant/20"
                    }`}
                  >
                    <span>{isSelected ? "✓ " : "+ "}</span>
                    <span>{loc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Painkiller Effectiveness */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-outline block">
              {language === "hi" ? "दवा या सिकाई से आराम:" : "Painkiller / Heat Response:"}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "no_relief", labelEn: "No Relief", labelHi: "कोई आराम नहीं" },
                { id: "partial", labelEn: "Partial", labelHi: "हल्का आराम" },
                { id: "good", labelEn: "Good Relief", labelHi: "अच्छा आराम" },
              ].map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => setPainReliefEffect(rel.id)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold border text-center transition-all ${
                    painReliefEffect === rel.id
                      ? "bg-primary text-white border-primary"
                      : "bg-surface-container text-outline border-outline-variant/30"
                  }`}
                >
                  {language === "hi" ? rel.labelHi : rel.labelEn}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-outline block mb-1">
              {language === "hi" ? "अतिरिक्त नोट्स (कॉलेज/काम का प्रभाव):" : "Notes (Impact on daily activities):"}
            </label>
            <input
              type="text"
              placeholder="e.g. Missed college lectures, unable to stand..."
              value={diaryNotes}
              onChange={(e) => setDiaryNotes(e.target.value)}
              className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-tertiary hover:bg-[#60445f] text-white font-semibold text-xs transition-colors shadow-sm"
          >
            {language === "hi" ? "दर्द डायरी में सहेजें (Save Pain Record)" : "Save to Symptom Diary"}
          </button>

          {diaryToast && (
            <div className="p-2 rounded-lg bg-tertiary text-white text-[11px] text-center font-medium animate-fadeIn">
              {language === "hi" ? "✓ दर्द का रिकॉर्ड सफलतापूर्वक सहेज लिया गया!" : "✓ Pain entry logged into your clinical history!"}
            </div>
          )}
          </form>
        </section>
        </div>

        {/* Right Column: Preparing for Medical Appointment Guide */}
        <div className="lg:col-span-5">
          <section className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-primary">
            {language === "hi" ? "डॉक्टर परामर्श तैयारी गाइड" : "Preparing for Your Appointment"}
          </h3>
          <button
            onClick={handleCopyQuestions}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>
              {copiedToast
                ? language === "hi"
                  ? "कॉपी हो गया!"
                  : "Copied!"
                : language === "hi"
                ? "कॉपी करें"
                : "Copy"}
            </span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {doctorQuestions.map((q, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/20 flex gap-2 items-start"
            >
              <span className="text-tertiary font-bold">Q{idx + 1}.</span>
              <p className="text-on-surface-variant leading-relaxed text-[11px]">{q}</p>
            </div>
          ))}
        </div>
      </section>
        </div>
      </div>
    </main>
  );
}
