"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function PcosPage() {
  const { language, speakText, isSpeaking, stopSpeaking } = useLanguage();
  const [checkedSigns, setCheckedSigns] = useState<string[]>([]);
  const [copiedToast, setCopiedToast] = useState(false);

  const toggleSign = (sign: string) => {
    if (checkedSigns.includes(sign)) {
      setCheckedSigns(checkedSigns.filter((s) => s !== sign));
    } else {
      setCheckedSigns([...checkedSigns, sign]);
    }
  };

  const doctorQuestions = [
    language === "hi"
      ? "क्या मेरे लक्षणों के आधार पर रोटरडैम मानदंड (Rotterdam criteria) पूरे होते हैं?"
      : "Based on my history, do my signs fulfill the Rotterdam diagnostic criteria?",
    language === "hi"
      ? "क्या मुझे फास्टिंग इंसुलिन (Fasting Insulin) और LH:FSH अनुपात की जांच करानी चाहिए?"
      : "Should we check fasting insulin, HbA1c, and an LH:FSH hormone ratio?",
    language === "hi"
      ? "क्या पेल्विक अल्ट्रासाउंड (Pelvic Ultrasound) कराने की आवश्यकता है?"
      : "Would a pelvic ultrasound be beneficial to assess ovarian morphology?",
    language === "hi"
      ? "गर्भनिरोधक गोलियों के अलावा जीवनशैली और पोषण में क्या बदलाव प्रभावी हैं?"
      : "Beyond standard birth control pills, what metabolic and dietary steps are recommended?",
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
        ? "पीसीओएस समझने की मार्गदर्शिका। पीसीओएस कोई बीमारी नहीं, बल्कि एक सामान्य अंतःस्रावी स्थिति है। रोटरडैम मानदंड के अनुसार 3 में से कम से कम 2 लक्षण होने पर ही पीसीओएस माना जाता है: पहला अनियमित माहवारी, दूसरा एंड्रोजन के शारीरिक लक्षण जैसे चेहरे पर बाल या मुंहासे, और तीसरा अल्ट्रासाउंड पर एकाधिक फॉलिकल्स।"
        : "Understanding PCOS Guide. PCOS is a common endocrine condition, not a personal flaw. Under the Rotterdam criteria, at least two out of three pillars are required: irregular ovulatory cycles, clinical or biochemical signs of elevated androgens, and polycystic ovarian appearance on ultrasound.";

    speakText(narration);
  };

  return (
    <main className="flex-1 w-full px-4 py-5 flex flex-col gap-5 max-w-md mx-auto">
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
            {language === "hi" ? "चिकित्सीय गाइड" : "Clinical Deep Dive"}
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
            <span>{isSpeaking ? (language === "hi" ? "सुन रहे हैं" : "Speaking") : (language === "hi" ? "ऑडियो सुनें" : "Listen")}</span>
          </button>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-primary leading-tight">
          {language === "hi"
            ? "पीसीओएस (PCOS) को समझें: लक्षण, निदान और पोषण"
            : "Understanding PCOS: Criteria, Signs & Nutrition"}
        </h1>

        <div className="flex items-center gap-2 text-[11px] text-outline font-medium">
          <span>By Dr. Ananya Sen, MD (OB-GYN)</span>
          <span>•</span>
          <span>6 min read</span>
        </div>
      </section>

      {/* 2. Rotterdam Diagnostic Criteria Breakdown */}
      <section className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">biotech</span>
          <h2 className="font-serif text-lg font-medium text-primary">
            {language === "hi" ? "रोटरडैम मानदंड (Rotterdam Criteria)" : "Rotterdam Diagnostic Criteria"}
          </h2>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          {language === "hi"
            ? "अक्सर केवल अल्ट्रासाउंड देखकर पीसीओएस घोषित कर दिया जाता है, जो गलत है। अंतरराष्ट्रीय चिकित्सकीय नियम के अनुसार इन 3 में से कम से कम 2 लक्षण होने अनिवार्य हैं:"
            : "Ultrasound alone does not equal PCOS. Under international consensus, you must meet at least 2 of these 3 criteria:"}
        </p>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex gap-2.5 items-start">
            <span className="font-bold text-primary text-sm">1</span>
            <div>
              <span className="font-semibold text-primary block">
                {language === "hi" ? "अनियमित या अनुपस्थित अंडोत्सर्ग (Oligomenorrhea)" : "Irregular or Absent Ovulation"}
              </span>
              <p className="text-on-surface-variant mt-0.5">
                {language === "hi"
                  ? "माहवारी चक्र का 35 दिनों से अधिक लंबा होना या साल में 8 से कम चक्र होना।"
                  : "Cycles consistently longer than 35 days, or fewer than 8 periods in a full year."}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex gap-2.5 items-start">
            <span className="font-bold text-primary text-sm">2</span>
            <div>
              <span className="font-semibold text-primary block">
                {language === "hi" ? "एंड्रोजन हार्मोन के शारीरिक या रक्त लक्षण" : "Signs of Elevated Androgens"}
              </span>
              <p className="text-on-surface-variant mt-0.5">
                {language === "hi"
                  ? "चेहरे या ठुड्डी पर बाल (Hirsutism), जिद्दी मुंहासे, या रक्त में टेस्टोस्टेरोन की अधिकता।"
                  : "Excess terminal facial/jawline hair, cystic acne flare-ups, or elevated free testosterone."}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex gap-2.5 items-start">
            <span className="font-bold text-primary text-sm">3</span>
            <div>
              <span className="font-semibold text-primary block">
                {language === "hi" ? "अल्ट्रासाउंड पर पॉलीसिस्टिक अंडाशय" : "Polycystic Ovaries on Ultrasound"}
              </span>
              <p className="text-on-surface-variant mt-0.5">
                {language === "hi"
                  ? "अंडाशय में 20 से अधिक छोटे अपरिपक्व फॉलिकल्स (जिन्हें 'मोतियों की माला' कहा जाता है)।"
                  : "20 or more small immature follicles along ovarian perimeter ('string of pearls')."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Symptom Checklist */}
      <section className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-3">
        <h3 className="font-serif text-lg font-medium text-primary">
          {language === "hi" ? "स्वयं-जांच चेकलिस्ट (Self-Checklist)" : "Interactive Bodily Signs Checklist"}
        </h3>
        <p className="text-xs text-outline">
          {language === "hi"
            ? "जो लक्षण आपमें हैं उन्हें चेक करें। यह डायग्नोसिस नहीं, डॉक्टर से चर्चा हेतु सूची है।"
            : "Check symptoms you experience. For doctor discussion preparation, not self-diagnosis."}
        </p>

        <div className="space-y-2">
          {[
            { id: "cycles", en: "Cycles consistently longer than 35 days", hi: "माहवारी 35 दिन से अधिक देरी से आना" },
            { id: "hair", en: "Chin or facial hair growth (Hirsutism)", hi: "ठुड्डी या चेहरे पर अनचाहे बाल" },
            { id: "acne", en: "Persistent jawline or back cystic acne", hi: "जबड़े और पीठ पर लगातार मुंहासे" },
            { id: "insulin", en: "Intense afternoon sugar cravings or fatigue", hi: "दोपहर में अत्यधिक थकान या मीठे की तलब" },
            { id: "skin", en: "Dark velvety skin patches around neck (Acanthosis)", hi: "गर्दन के आसपास त्वचा का गहरा रंग" },
          ].map((item) => {
            const isChecked = checkedSigns.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleSign(item.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked
                    ? "bg-secondary-container/40 border-secondary"
                    : "bg-surface-container border-outline-variant/20 hover:border-outline"
                }`}
              >
                <span className="text-xs text-on-surface font-medium pr-2">
                  {language === "hi" ? item.hi : item.en}
                </span>
                <span
                  className={`material-symbols-outlined text-lg ${
                    isChecked ? "text-secondary" : "text-outline/40"
                  }`}
                >
                  {isChecked ? "check_box" : "check_box_outline_blank"}
                </span>
              </div>
            );
          })}
        </div>

        {checkedSigns.length >= 2 && (
          <div className="p-3 rounded-xl bg-surface-container-low border border-primary/30 text-xs text-on-surface-variant leading-relaxed animate-fadeIn">
            <span className="font-semibold text-primary block mb-0.5">
              {language === "hi" ? "सहेली परामर्श:" : "Saheli Recommendation:"}
            </span>
            {language === "hi"
              ? `आपने ${checkedSigns.length} लक्षण चुने हैं। नीचे दिए गए डॉक्टर परामर्श प्रश्नों को कॉपी करें और अपने अगले चेकअप में स्त्री रोग विशेषज्ञ से साझा करें।`
              : `You have identified ${checkedSigns.length} bodily markers. Copy the doctor consultation prompts below to discuss with your gynecologist.`}
          </div>
        )}
      </section>

      {/* 4. Indian Kitchen Glycemic Nutrition */}
      <section className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3">
        <h3 className="font-serif text-lg font-medium text-primary">
          {language === "hi" ? "भारतीय रसोई: इंसुलिन संतुलन आहार" : "Indian Kitchen Nutrition for PCOS"}
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {language === "hi"
            ? "रोटी-चावल बंद करने की कोई आवश्यकता नहीं है। केवल खाने का क्रम बदलें और ग्लाइसेमिक लोड को संतुलित करें:"
            : "Extreme carb-free diets spike cortisol. Instead, balance glycemic load using traditional Indian pairing:"}
        </p>

        <ul className="text-xs space-y-2 text-on-surface-variant font-sans">
          <li className="flex items-start gap-2">
            <span className="text-secondary font-bold">1.</span>
            <span>
              <strong>{language === "hi" ? "भोजन का क्रम: " : "Meal Sequencing: "}</strong>
              {language === "hi"
                ? "रोटी या चावल से पहले खीरा-सलाद और दाल खाएं। इससे इंसुलिन में अचानक उछाल नहीं आता।"
                : "Eat fiber (salad/sabzi) and protein (dal/paneer) before roti or rice to blunt glucose spikes."}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary font-bold">2.</span>
            <span>
              <strong>{language === "hi" ? "पुदीना चाय (Spearmint): " : "Spearmint Infusion: "}</strong>
              {language === "hi"
                ? "दिन में 1 कप ताजी पुदीना चाय फ्री टेस्टोस्टेरोन को कम करने में चिकित्सकीय रूप से प्रमाणित है।"
                : "Studies show 1–2 cups of spearmint tea daily significantly reduces circulating androgens."}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary font-bold">3.</span>
            <span>
              <strong>{language === "hi" ? "दालचीनी (Cinnamon): " : "Ceylon Cinnamon: "}</strong>
              {language === "hi"
                ? "दालचीनी का एक छोटा टुकड़ा गुनगुने पानी में उबालकर पीने से इंसुलिन संवेदनशीलता बढ़ती है।"
                : "Steeping a cinnamon stick in warm water improves cellular insulin sensitivity naturally."}
            </span>
          </li>
        </ul>
      </section>

      {/* 5. Gynecologist Consultation Discussion Guide */}
      <section className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-medium text-primary">
            {language === "hi" ? "डॉक्टर से क्या पूछें?" : "Doctor Discussion Questions"}
          </h3>
          <button
            onClick={handleCopyQuestions}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>{copiedToast ? (language === "hi" ? "कॉपी हो गया!" : "Copied!") : (language === "hi" ? "कॉपी करें" : "Copy")}</span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {doctorQuestions.map((q, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 flex gap-2 items-start"
            >
              <span className="text-secondary font-bold">Q{idx + 1}.</span>
              <p className="text-on-surface-variant">{q}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
