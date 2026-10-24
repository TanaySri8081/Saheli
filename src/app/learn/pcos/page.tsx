"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCycle } from "@/context/CycleContext";

export default function PcosPage() {
  const { language, speakText, isSpeaking, stopSpeaking } = useLanguage();
  const { logPeriod, logSymptom } = useCycle();

  const [checkedSigns, setCheckedSigns] = useState<string[]>([]);
  const [copiedToast, setCopiedToast] = useState(false);
  const [logToast, setLogToast] = useState(false);

  // Quick Inline Symptom / Cycle Logger State
  const [logDate, setLogDate] = useState("2026-10-24");
  const [selectedPcosSymptoms, setSelectedPcosSymptoms] = useState<string[]>([]);
  const [cycleDelayDays, setCycleDelayDays] = useState<number>(38);
  const [isLoggingCycle, setIsLoggingCycle] = useState(false);

  useEffect(() => {
    setLogDate(new Date().toISOString().split("T")[0]);
  }, []);

  const toggleSign = (sign: string) => {
    if (checkedSigns.includes(sign)) {
      setCheckedSigns(checkedSigns.filter((s) => s !== sign));
    } else {
      setCheckedSigns([...checkedSigns, sign]);
    }
  };

  const togglePcosSymptom = (sym: string) => {
    if (selectedPcosSymptoms.includes(sym)) {
      setSelectedPcosSymptoms(selectedPcosSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedPcosSymptoms([...selectedPcosSymptoms, sym]);
    }
  };

  const handleSaveToCycleLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingCycle) {
      logPeriod({
        start_date: logDate,
        flow_intensity: "medium",
        is_predicted: false,
        notes: `Logged via PCOS Awareness: cycle delay ${cycleDelayDays} days.`,
      });
    }
    if (selectedPcosSymptoms.length > 0) {
      logSymptom({
        log_date: logDate,
        pain_level: 2,
        symptoms: selectedPcosSymptoms,
        reflection: "PCOS pathway diary record.",
      });
    }
    setLogToast(true);
    setTimeout(() => setLogToast(false), 3500);
  };

  const doctorQuestions = [
    language === "hi"
      ? "क्या मेरे लक्षणों के आधार पर अंतरराष्ट्रीय रोटरडैम मानदंड (Rotterdam criteria) पूरे होते हैं?"
      : "Based on my clinical history, do my signs fulfill the international Rotterdam diagnostic criteria?",
    language === "hi"
      ? "क्या मुझे थायराइड (TSH) और प्रोलैक्टिन (Prolactin) की जांच करानी चाहिए ताकि अन्य कारण खारिज हो सकें?"
      : "Should we check TSH and Prolactin to rule out thyroid disorders or hyperprolactinemia?",
    language === "hi"
      ? "क्या मुझे फास्टिंग इंसुलिन (Fasting Insulin) और LH:FSH अनुपात की जांच करानी चाहिए?"
      : "Should we check fasting insulin, HbA1c, and an LH:FSH ratio to assess metabolic status?",
    language === "hi"
      ? "गर्भनिरोधक गोलियों के अलावा इंसुलिन संवेदनशीलता बढ़ाने वाले पोषण में क्या बदलाव प्रभावी हैं?"
      : "Beyond birth control, what evidence-based metabolic and dietary sequencing steps do you recommend?",
  ];

  const handleCopyQuestions = () => {
    const textToCopy = doctorQuestions.join("\n\n");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const narration =
      language === "hi"
        ? "पीसीओएस जागरूकता मार्गदर्शिका। पीसीओएस कोई बीमारी नहीं बल्कि एक अंतःस्रावी और मेटाबॉलिक स्थिति है। अंतरराष्ट्रीय रोटरडैम मानदंड के अनुसार 3 में से कम से कम 2 लक्षण होने पर ही इसे पीसीओएस माना जाता है। महत्वपूर्ण बात यह है कि थायराइड और प्रोलैक्टिन जैसी अन्य स्थितियां भी बिल्कुल ऐसे ही लक्षण पैदा कर सकती हैं, इसलिए डॉक्टर से जांच आवश्यक है। सहेली कभी कोई कृत्रिम स्कोर उत्पन्न नहीं करती।"
        : "PCOS Awareness Pathway. PCOS is an endocrine and metabolic condition, not a personal flaw. Under international Rotterdam consensus, at least two of three criteria are required: irregular cycles, clinical signs of elevated androgens, and polycystic ovarian appearance on ultrasound. Notice that other conditions such as hypothyroidism and hyperprolactinemia can cause identical symptoms. Saheli never calculates an artificial probability score.";

    speakText(narration);
  };

  const misconceptions = [
    {
      mythEn: "Myth: PCOS means you can never get pregnant naturally.",
      mythHi: "भ्रम: पीसीओएस होने पर कभी गर्भधारण नहीं हो सकता।",
      factEn: "Fact: PCOS causes delayed or irregular ovulation, not permanent sterility. Balanced meal sequencing, inositol support, and medical cycle regularisation result in very high conception rates (ACOG & Monash guidelines).",
      factHi: "तथ्य: पीसीओएस में डिंब (egg) बनने में देरी होती है, बांझपन नहीं। संतुलित खानपान और चिकित्सा परामर्श से अधिकांश महिलाएं स्वाभाविक रूप से स्वस्थ गर्भधारण करती हैं।",
    },
    {
      mythEn: "Myth: Ultrasound cysts are mandatory to have PCOS.",
      mythHi: "भ्रम: अल्ट्रासाउंड में सिस्ट दिखना अनिवार्य है।",
      factEn: "Fact: The 'cysts' are actually harmless immature follicles, not tumors. Many women with PCOS have normal-looking ovaries, while healthy women can have multi-follicular ovaries on ultrasound.",
      factHi: "तथ्य: ये सिस्ट नहीं, बल्कि छोटे अपरिपक्व फॉलिकल्स होते हैं। कई महिलाओं के अंडाशय बिल्कुल सामान्य दिखते हैं फिर भी उन्हें पीसीओएस हो सकता है।",
    },
    {
      mythEn: "Myth: Birth control pills are the only medical solution.",
      mythHi: "भ्रम: केवल गर्भनिरोधक गोलियां ही इसका एकमात्र इलाज हैं।",
      factEn: "Fact: While oral contraceptives regulate bleeding withdrawal, lifestyle interventions—such as high-fiber meal sequencing, resistance strength movement, and stress optimization—form the foundation of care.",
      factHi: "तथ्य: गोलियां सिर्फ रक्तस्राव को नियमित करती हैं। खानपान में फाइबर बढ़ाना, नींद पूरी करना और मांसपेशी व्यायाम इसके वास्तविक आधार हैं।",
    },
  ];

  const similarConditions = [
    {
      nameEn: "Hypothyroidism (Underactive Thyroid)",
      nameHi: "हाइपोथायरायडिज्म (थायराइड ग्रंथि की सुस्ती)",
      descEn: "Elevated TSH directly delays ovulation, causes weight retention, hair thinning, and menstrual irregularities identical to PCOS.",
      descHi: "थायराइड की कमी से अंडोत्सर्ग रुक जाता है, वजन बढ़ता है और बाल झड़ते हैं, जो बिल्कुल पीसीओएस जैसे लगते हैं।",
      testEn: "Check: Serum TSH, Free T3 & T4",
      testHi: "जांच: सीरम टीएसएच (TSH) व फ्री T3/T4",
    },
    {
      nameEn: "Hyperprolactinemia",
      nameHi: "हाइपरप्रोलैक्टिनीमिया (प्रोलैक्टिन हार्मोन का बढ़ना)",
      descEn: "Elevated pituitary prolactin suppresses GnRH pulsatility, stopping periods and causing acne or breast tenderness.",
      descHi: "पिट्यूटरी ग्रंथि से प्रोलैक्टिन बढ़ने पर माहवारी बंद हो जाती है और चेहरे पर मुंहासे हो सकते हैं।",
      testEn: "Check: Fasting Serum Prolactin",
      testHi: "जांच: फास्टिंग सीरम प्रोलैक्टिन",
    },
    {
      nameEn: "Hypothalamic Amenorrhea (HA)",
      nameHi: "हाइपोथैलेमिक एमेनोरिया (तनाव या अल्पाहार से माहवारी रुकना)",
      descEn: "Chronic caloric restriction, extreme exercise, or psychological stress shuts down ovarian signal pathways.",
      descHi: "अत्यधिक मानसिक तनाव, डाइटिंग या बहुत भारी कसरत से मस्तिष्क माहवारी के सिग्नल रोक देता है।",
      testEn: "Check: LH, FSH, and Estradiol levels",
      testHi: "जांच: एलएच, एफएसएच और एस्ट्रैडिऑल",
    },
  ];

  return (
    <main className="flex-1 w-full px-4 py-5 flex flex-col gap-5 max-w-md mx-auto pb-24">
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
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary">
            {language === "hi" ? "जागरूकता पाथवे" : "Awareness Pathway"}
          </span>
          <button
            onClick={handleReadAloud}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              isSpeaking
                ? "bg-primary text-white animate-pulse"
                : "bg-surface-container text-primary hover:bg-surface-container-high border border-outline-variant/30"
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

        <h1 className="font-serif text-2xl font-medium text-primary leading-tight">
          {language === "hi"
            ? "पीसीओएस जागरूकता पाथवे: लक्षण, भ्रम और सही देखभाल"
            : "PCOS Awareness Pathway: Evidence, Misconceptions & Care"}
        </h1>

        <div className="flex items-center gap-2 text-[11px] text-outline font-medium">
          <span>Aligned with Monash & ACOG International Standards</span>
          <span>•</span>
          <span>5 min read</span>
        </div>
      </section>

      {/* 2. CRITICAL CLINICAL GUARDRAIL: NO ALGORITHMIC PROBABILITY SCORE */}
      <section className="p-3.5 rounded-2xl bg-surface-container-highest border border-primary/20 space-y-1.5 text-xs text-on-surface-variant leading-relaxed">
        <div className="flex items-center gap-1.5 text-primary font-bold text-xs uppercase">
          <span className="material-symbols-outlined text-base">verified_user</span>
          <span>{language === "hi" ? "सहेली क्लिनिकल सिद्धांत:" : "Clinical Safeguard Principle:"}</span>
        </div>
        <p className="text-[11px]">
          {language === "hi"
            ? "सहेली कभी भी आपके लक्षणों से 'पीसीओएस संभावना स्कोर (PCOS Probability Score)' नहीं बनाती। पीसीओएस का निदान केवल योग्य स्त्री रोग विशेषज्ञ द्वारा हार्मोनल रक्त जांच (Fasting Insulin, LH:FSH) और पेल्विक अल्ट्रासाउंड के बाद ही संभव है।"
            : "Saheli will NEVER generate a 'PCOS probability score' from your symptoms. PCOS diagnosis requires comprehensive clinical evaluation by an OB-GYN, including differential bloodwork and ultrasound. Algorithmic scoring creates unnecessary anxiety."}
        </p>
      </section>

      {/* 3. Rotterdam Diagnostic Criteria Breakdown */}
      <section className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">biotech</span>
          <h2 className="font-serif text-base font-semibold text-primary">
            {language === "hi" ? "रोटरडैम अंतर्राष्ट्रीय मानदंड (Rotterdam Criteria)" : "Rotterdam Consensus Criteria"}
          </h2>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          {language === "hi"
            ? "अक्सर केवल अल्ट्रासाउंड देखकर पीसीओएस घोषित कर दिया जाता है, जो गलत है। अंतरराष्ट्रीय नियम के अनुसार इन 3 में से कम से कम 2 लक्षण होने अनिवार्य हैं:"
            : "Ultrasound appearance alone does NOT equal PCOS. International guidelines mandate at least 2 of these 3 features:"}
        </p>

        <div className="space-y-1.5 text-xs">
          <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex gap-2 items-start">
            <span className="font-bold text-primary text-xs">1.</span>
            <div>
              <span className="font-semibold text-primary block">
                {language === "hi" ? "अनियमित अंडोत्सर्ग (Oligo/Anovulation)" : "Irregular or Absent Ovulation"}
              </span>
              <p className="text-[11px] text-on-surface-variant">
                {language === "hi" ? "चक्र का 35 दिनों से अधिक देर से आना या साल में 8 से कम माहवारी।" : "Cycles > 35 days apart, or fewer than 8 periods in a year."}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex gap-2 items-start">
            <span className="font-bold text-primary text-xs">2.</span>
            <div>
              <span className="font-semibold text-primary block">
                {language === "hi" ? "एंड्रोजन की अधिकता (Hyperandrogenism)" : "Clinical / Biochemical Androgens"}
              </span>
              <p className="text-[11px] text-on-surface-variant">
                {language === "hi" ? "ठुड्डी पर बाल (Hirsutism), जिद्दी मुंहासे, या रक्त में टेस्टोस्टेरोन।" : "Terminal chin/facial hair, cystic jawline acne, or high blood testosterone."}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex gap-2 items-start">
            <span className="font-bold text-primary text-xs">3.</span>
            <div>
              <span className="font-semibold text-primary block">
                {language === "hi" ? "अल्ट्रासाउंड पर पॉलीसिस्टिक अंडाशय" : "Polycystic Ovarian Morphology"}
              </span>
              <p className="text-[11px] text-on-surface-variant">
                {language === "hi" ? "अंडाशय में 20 से अधिक छोटे अपरिपक्व फॉलिकल्स (मोतियों की माला स्वरूप)।" : "20+ small peripheral immature follicles on transvaginal imaging."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Common Misconceptions vs Clinical Facts */}
      <section className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-3">
        <h3 className="font-serif text-base font-bold text-primary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px] text-secondary">help_outline</span>
          <span>{language === "hi" ? "सामान्य भ्रम बनाम क्लिनिकल सच्चाई" : "Common Misconceptions vs Facts"}</span>
        </h3>

        <div className="space-y-2.5">
          {misconceptions.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-1 text-xs">
              <span className="font-semibold text-error block">
                {language === "hi" ? item.mythHi : item.mythEn}
              </span>
              <p className="text-on-surface-variant leading-relaxed text-[11px]">
                {language === "hi" ? item.factHi : item.factEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Conditions that Cause Similar Symptoms (Differential Diagnosis) */}
      <section className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-2.5">
        <div className="flex items-center gap-1.5 text-primary font-bold text-xs uppercase">
          <span className="material-symbols-outlined text-base">rule</span>
          <span>{language === "hi" ? "अन्य स्थितियां जो पीसीओएस जैसे लक्षण देती हैं" : "Conditions with Similar Symptoms"}</span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {language === "hi"
            ? "पीसीओएस का निदान करने से पहले डॉक्टर को इन स्थितियों को रक्त जांच द्वारा खारिज करना अनिवार्य होता है:"
            : "Before concluding PCOS, clinicians must rule out overlapping endocrine conditions:"}
        </p>

        <div className="space-y-2 text-xs">
          {similarConditions.map((cond, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-1">
              <span className="font-semibold text-primary block">
                {language === "hi" ? cond.nameHi : cond.nameEn}
              </span>
              <p className="text-[11px] text-on-surface-variant">
                {language === "hi" ? cond.descHi : cond.descEn}
              </p>
              <span className="text-[10px] font-bold text-secondary block">
                {language === "hi" ? cond.testHi : cond.testEn}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Direct In-Page Symptom & Cycle Logger (Screenshot Requirement) */}
      <section className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary">edit_calendar</span>
            <span>{language === "hi" ? "अनियमित चक्र या लक्षण दर्ज करें" : "Record Irregular Cycle / Symptoms"}</span>
          </h3>
          <span className="text-[9px] text-outline">Optional Tracker</span>
        </div>

        <form onSubmit={handleSaveToCycleLog} className="space-y-3 text-xs">
          <div>
            <label className="text-[10px] uppercase font-bold text-outline block mb-1">
              {language === "hi" ? "तारीख (Date):" : "Record Date:"}
            </label>
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface focus:outline-none"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-surface-container space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-primary text-xs">
              <input
                type="checkbox"
                checked={isLoggingCycle}
                onChange={(e) => setIsLoggingCycle(e.target.checked)}
                className="rounded text-primary"
              />
              <span>{language === "hi" ? "माहवारी में असामान्य देरी (Late Period Start)" : "Delayed Cycle / Period Start"}</span>
            </label>
            {isLoggingCycle && (
              <div className="flex items-center gap-2 pl-5">
                <span className="text-[11px] text-outline">{language === "hi" ? "चक्र की लंबाई:" : "Estimated Cycle Length:"}</span>
                <input
                  type="number"
                  min="21"
                  max="120"
                  value={cycleDelayDays}
                  onChange={(e) => setCycleDelayDays(Number(e.target.value))}
                  className="w-16 p-1 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-center font-bold text-xs"
                />
                <span className="text-[11px] text-outline">Days</span>
              </div>
            )}
          </div>

          {/* Quick Symptoms Multi-Select */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-outline block">
              {language === "hi" ? "लक्षण चुनें:" : "Select Specific Bodily Signs:"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "chin_hair", label: "Chin Hair (ठुड्डी पर बाल)" },
                { id: "cystic_acne", label: "Cystic Acne (जिद्दी मुंहासे)" },
                { id: "sugar_craving", label: "Sugar Fatigue (मीठे की तलब)" },
                { id: "hair_thinning", label: "Hair Thinning (बाल झड़ना)" },
              ].map((s) => {
                const isSelected = selectedPcosSymptoms.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => togglePcosSymptom(s.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                      isSelected
                        ? "bg-secondary-container/40 border-secondary text-primary font-bold"
                        : "bg-surface-container text-outline border-outline-variant/20"
                    }`}
                  >
                    <span>{isSelected ? "✓ " : "+ "}</span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-xs transition-colors shadow-sm"
          >
            {language === "hi" ? "सहेली डायरी में सहेजें (Save to Cycle Log)" : "Save to Saheli Cycle Log"}
          </button>

          {logToast && (
            <div className="p-2 rounded-lg bg-secondary text-white text-[11px] text-center font-medium animate-fadeIn">
              {language === "hi" ? "✓ लक्षण सहेली डायरी में सफलतापूर्वक सहेज लिए गए!" : "✓ Saved directly into your cycle diary!"}
            </div>
          )}
        </form>
      </section>

      {/* 7. Clinician Consultation Questions */}
      <section className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-primary">
            {language === "hi" ? "डॉक्टर से क्या पूछें?" : "Questions for Your Clinician"}
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
              <span className="text-secondary font-bold">Q{idx + 1}.</span>
              <p className="text-on-surface-variant leading-relaxed text-[11px]">{q}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
