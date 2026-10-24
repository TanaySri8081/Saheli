"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function EndometriosisPage() {
  const { language, speakText, isSpeaking, stopSpeaking } = useLanguage();
  const [checkedSymptoms, setCheckedSymptoms] = useState<string[]>([]);
  const [copiedToast, setCopiedToast] = useState(false);

  const toggleSymptom = (sym: string) => {
    if (checkedSymptoms.includes(sym)) {
      setCheckedSymptoms(checkedSymptoms.filter((s) => s !== sym));
    } else {
      setCheckedSymptoms([...checkedSymptoms, sym]);
    }
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const narration =
      language === "hi"
        ? "एंडोमेट्रियोसिस मार्गदर्शिका। आपका दर्द वास्तविक है, वहम नहीं। यदि माहवारी का दर्द आपको स्कूल या काम से रोकता है, उल्टियां लाता है या सामान्य दर्द निवारक से ठीक नहीं होता, तो यह सिर्फ मरोड़ नहीं बल्कि एंडोमेट्रियोसिस हो सकता है। एंडोमेट्रियोसिस में गर्भाशय जैसी परत पेल्विक अंगों पर विकसित होती है।"
        : "Understanding Endometriosis Guide. Your pain is real, not imagined. Severe pain that causes vomiting, resists standard painkillers, or prevents normal daily activity is not just routine cramps. In Endometriosis, tissue similar to the uterine lining implants outside the uterus, creating chronic inflammation.";

    speakText(narration);
  };

  const handleWhatsAppShare = () => {
    const text =
      language === "hi"
        ? encodeURIComponent(
            "माहवारी का असहनीय दर्द 'सामान्य' नहीं है। सहेली पर एंडोमेट्रियोसिस और पेल्विक स्वास्थ्य के बारे में प्रमाणित जानकारी पढ़ें: http://localhost:3000/learn/endometriosis"
          )
        : encodeURIComponent(
            "Severe debilitating menstrual pain is not 'just cramps'. Read this clinically vetted Endometriosis guide on Saheli: http://localhost:3000/learn/endometriosis"
          );

    if (typeof window !== "undefined") {
      window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    }
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
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-tertiary">
            {language === "hi" ? "श्रोणि स्वास्थ्य" : "Pelvic Health"}
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
            <span>{isSpeaking ? (language === "hi" ? "सुन रहे हैं" : "Speaking") : (language === "hi" ? "ऑडियो सुनें" : "Listen")}</span>
          </button>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-tertiary leading-tight">
          {language === "hi"
            ? "एंडोमेट्रियोसिस: दर्द वास्तविक है, वहम नहीं"
            : "Understanding Endometriosis & Pelvic Care"}
        </h1>

        <div className="flex items-center gap-2 text-[11px] text-outline font-medium">
          <span>By Dr. Radhika Sharma, MD</span>
          <span>•</span>
          <span>7 min read</span>
        </div>
      </section>

      {/* 2. Emotional Validation Card */}
      <section className="p-5 rounded-2xl bg-tertiary text-white space-y-2.5 shadow-warm-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary-fixed text-2xl">
            favorite
          </span>
          <h2 className="font-serif text-lg font-medium text-tertiary-fixed">
            {language === "hi" ? "आप अकेली नहीं हैं" : "Your Pain is Real"}
          </h2>
        </div>
        <p className="text-xs leading-relaxed opacity-95 font-sans">
          {language === "hi"
            ? "यदि माहवारी का दर्द आपको बिस्तर से उठने नहीं देता, पैरों में फैलता है या दर्द निवारक दवाओं से ठीक नहीं होता, तो आप 'कमजोर' या 'नाटक' नहीं कर रही हैं। एंडोमेट्रियोसिस एक वास्तविक शारीरिक स्थिति है जिसे सही चिकित्सकीय देखभाल की आवश्यकता है।"
            : "If menstrual pain causes fainting, shoots down your legs, or stops you from attending work, you are not being 'overly sensitive'. Severe pain is a physiological symptom of a chronic condition that deserves compassionate medical care."}
        </p>
      </section>

      {/* 3. Diagnostic Roadmap: 4-Step Pathway */}
      <section className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">map</span>
          <h3 className="font-serif text-lg font-medium text-primary">
            {language === "hi" ? "डायग्नोस्टिक रोडमैप (4 चरण)" : "Clinical Diagnostic Roadmap"}
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex gap-2.5 items-start">
            <span className="font-bold text-primary text-sm">1</span>
            <div>
              <span className="font-semibold text-primary block">
                {language === "hi" ? "विस्तृत दर्द डायरी (Pain Log)" : "Detailed Symptom & Pain Diary"}
              </span>
              <p className="text-on-surface-variant mt-0.5">
                {language === "hi"
                  ? "सहेली के 0-10 दर्द स्केल पर कम से कम 2 से 3 महीनों का रिकॉर्ड रखें ताकि डॉक्टर को पैटर्न स्पष्ट दिखे।"
                  : "Track pain intensity (0-10) across 2-3 cycles to provide objective evidence for your doctor."}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex gap-2.5 items-start">
            <span className="font-bold text-primary text-sm">2</span>
            <div>
              <span className="font-semibold text-primary block">
                {language === "hi" ? "विशेषज्ञ पेल्विक अल्ट्रासाउंड (TVS)" : "Expert Pelvic Ultrasound"}
              </span>
              <p className="text-on-surface-variant mt-0.5">
                {language === "hi"
                  ? "अंडाशय में 'चॉकलेट सिस्ट' (Endometrioma) और पेल्विक अंगों की गतिशीलता की जांच।"
                  : "Screens for ovarian chocolate cysts (endometriomas) and deep pelvic tissue sliding."}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex gap-2.5 items-start">
            <span className="font-bold text-primary text-sm">3</span>
            <div>
              <span className="font-semibold text-primary block">
                {language === "hi" ? "पेल्विक एमआरआई (High-Res MRI)" : "High-Resolution Pelvic MRI"}
              </span>
              <p className="text-on-surface-variant mt-0.5">
                {language === "hi"
                  ? "यदि अल्ट्रासाउंड सामान्य आए लेकिन दर्द गंभीर हो, तो आंतों और मूत्राशय के पास गहरे घावों (DIE) की जांच।"
                  : "Evaluates deep infiltrating endometriosis (DIE) near bowel or bladder when ultrasound is inconclusive."}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex gap-2.5 items-start">
            <span className="font-bold text-primary text-sm">4</span>
            <div>
              <span className="font-semibold text-primary block">
                {language === "hi" ? "लैप्रोस्कोपी (Gold Standard)" : "Diagnostic & Operative Laparoscopy"}
              </span>
              <p className="text-on-surface-variant mt-0.5">
                {language === "hi"
                  ? "सूक्ष्म कैमरे से पेट में देखना और बायोप्सी द्वारा घावों को हटाना (Excision surgery)।"
                  : "Minimally invasive surgical visualization and histological biopsy confirmation."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Symptom Self-Tracker Checklist */}
      <section className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-3">
        <h3 className="font-serif text-lg font-medium text-primary">
          {language === "hi" ? "लक्षण चेकलिस्ट (Self-Checklist)" : "Endometriosis Symptom Checklist"}
        </h3>
        <p className="text-xs text-outline">
          {language === "hi"
            ? "डॉक्टर से मिलने से पहले अपने लक्षण चिन्हित करें:"
            : "Review and check symptoms to discuss with your specialist:"}
        </p>

        <div className="space-y-2">
          {[
            { id: "dysmenorrhea", en: "Severe period cramps that standard painkillers don't relieve", hi: "असहनीय दर्द जो सामान्य पैरासिटामोल से शांत न हो" },
            { id: "back_legs", en: "Pain radiating down the back of thighs or into hips", hi: "कमर और जांघों के पीछे तक फैलने वाला खिंचाव व दर्द" },
            { id: "bowel_pain", en: "Pain during bowel movements or urination during periods", hi: "माहवारी के दिनों में शौच या पेशाब के समय तेज दर्द" },
            { id: "heavy_bleeding", en: "Passing large blood clots (>1 rupee coin size)", hi: "बड़े खून के थक्के (Clots) निकलना" },
            { id: "chronic_fatigue", en: "Overwhelming full-body fatigue even with adequate sleep", hi: "पूरी नींद के बावजूद हर समय गहरी थकान महसूस होना" },
          ].map((item) => {
            const isChecked = checkedSymptoms.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleSymptom(item.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked
                    ? "bg-tertiary-fixed/60 border-tertiary"
                    : "bg-surface-container border-outline-variant/20 hover:border-outline"
                }`}
              >
                <span className="text-xs text-on-surface font-medium pr-2">
                  {language === "hi" ? item.hi : item.en}
                </span>
                <span
                  className={`material-symbols-outlined text-lg ${
                    isChecked ? "text-tertiary" : "text-outline/40"
                  }`}
                >
                  {isChecked ? "check_box" : "check_box_outline_blank"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Emergency Safeguard Red Flags */}
      <section className="p-4 rounded-xl bg-error-container border border-error/30 flex items-start gap-3 text-xs text-[#93000a]">
        <span className="material-symbols-outlined text-error text-2xl mt-0.5">
          emergency
        </span>
        <div className="leading-relaxed">
          <span className="font-bold block mb-0.5">
            {language === "hi" ? "आपातकालीन चेतावनी (Immediate Clinical Care):" : "Emergency Safeguard:"}
          </span>
          {language === "hi"
            ? "यदि अचानक असहनीय एकतरफा पेट दर्द हो, तेज बुखार आए, चक्कर आकर बेहोशी हो या 1 घंटे में 2 पैड लगातार भीग जाएं, तो तुरंत निकटतम अस्पताल की इमरजेंसी में जाएं।"
            : "Sudden sharp one-sided pelvic pain, high fever, fainting, or soaking through two pads in an hour demands immediate emergency room evaluation."}
        </div>
      </section>

      {/* 6. WhatsApp Share Button */}
      <section className="pb-4">
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="w-full h-12 rounded-xl bg-[#25D366] text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
          <span>
            {language === "hi"
              ? "व्हाट्सएप पर परिवार या सहेली से साझा करें"
              : "Share Guide via WhatsApp"}
          </span>
        </button>
      </section>
    </main>
  );
}
