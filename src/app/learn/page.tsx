"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface Article {
  id: string;
  slug: string;
  category: "pcos" | "endo" | "basics" | "nutrition" | "myths";
  titleEn: string;
  titleHi: string;
  summaryEn: string;
  summaryHi: string;
  readTime: string;
  reviewedBy: string;
  link?: string;
}

const ARTICLES: Article[] = [
  {
    id: "pcos-guide",
    slug: "pcos",
    category: "pcos",
    titleEn: "Understanding PCOS: Rotterdam Criteria & Everyday Nutrition",
    titleHi: "पीसीओएस (PCOS) को समझें: लक्षण, निदान और आहार",
    summaryEn: "A comprehensive guide breaking down irregular cycles, androgen signs, and insulin management.",
    summaryHi: "अनियमित माहवारी, एंड्रोजन लक्षण और इंसुलिन संतुलन पर एक संपूर्ण वैज्ञानिक मार्गदर्शिका।",
    readTime: "6 min",
    reviewedBy: "Dr. Ananya Sen, MD (OB-GYN)",
    link: "/learn/pcos",
  },
  {
    id: "endo-guide",
    slug: "endometriosis",
    category: "endo",
    titleEn: "Understanding Endometriosis: Validating Severe Pelvic Pain",
    titleHi: "एंडोमेट्रियोसिस और श्रोणि दर्द: दर्द वास्तविक है, वहम नहीं",
    summaryEn: "Why debilitating period pain is not 'in your head'. Exploring diagnostic pathways and laparoscopy.",
    summaryHi: "असहनीय दर्द केवल सामान्य ऐंठन नहीं है। जानिए क्यों आवश्यक है सही समय पर स्त्री रोग विशेषज्ञ की जांच।",
    readTime: "7 min",
    reviewedBy: "Dr. Radhika Sharma, MD",
    link: "/learn/endometriosis",
  },
  {
    id: "cycle-regularity",
    slug: "cycle-regularity",
    category: "basics",
    titleEn: "What is a 'Normal' Menstrual Cycle? Demystifying Month-to-Month Variance",
    titleHi: "माहवारी चक्र में सामान्य क्या है? 21 से 35 दिनों की प्राकृतिक भिन्नता",
    summaryEn: "Why cycles fluctuate between 21 to 35 days naturally and how stress impacts ovulatory timing.",
    summaryHi: "तनाव, नींद और जीवनशैली के कारण माहवारी की तिथियों में कुछ दिनों का अंतर पूरी तरह स्वाभाविक है।",
    readTime: "4 min",
    reviewedBy: "FOGSI Reproductive Health Guideline",
  },
  {
    id: "iron-nutrition",
    slug: "iron-nutrition",
    category: "nutrition",
    titleEn: "Everyday Indian Kitchen Nutrition: Replenishing Ferritin & Bioavailable Iron",
    titleHi: "रसोई के देसी सुपरफूड्स: हीमोग्लोबिन और आयरन बढ़ाने के घरेलू उपाय",
    summaryEn: "Gur-chana, palak dal with lemon, and roasted pumpkin seeds for natural fatigue recovery.",
    summaryHi: "गुड़-चना, पालक और नींबू का मेल जो शरीर में थकान को दूर कर हीमोग्लोबिन के स्तर को सुधारता है।",
    readTime: "5 min",
    reviewedBy: "Clinical Nutrition Society of India",
  },
];

interface MythFact {
  mythEn: string;
  mythHi: string;
  factEn: string;
  factHi: string;
}

const MYTHS: MythFact[] = [
  {
    mythEn: "Menstrual blood is dirty or toxic waste leaving the body.",
    mythHi: "माहवारी का खून गंदा या शरीर का विषैला कचरा होता है।",
    factEn: "Menstrual fluid is clean, sterile tissue composed of blood, mucosal secretions, and cells shed from the uterine lining.",
    factHi: "मासिक धर्म का रक्त पूरी तरह साफ और प्राकृतिक ऊतक (tissue) होता है जो गर्भाशय की परत से निकलता है।",
  },
  {
    mythEn: "Severe, debilitating pelvic pain is normal for every woman.",
    mythHi: "असहनीय, तेज पेल्विक दर्द हर महिला के लिए सामान्य बात है।",
    factEn: "Mild cramping is common, but pain that prevents standing, walking, or going to school/work warrants medical screening for Endometriosis.",
    factHi: "हल्की मरोड़ सामान्य है, लेकिन अगर दर्द से उठना या चलना भी दूभर हो जाए, तो एंडोमेट्रियोसिस की जांच अनिवार्य है।",
  },
  {
    mythEn: "You should not exercise or wash your hair during your period.",
    mythHi: "पीरियड्स के दौरान सिर नहीं धोना चाहिए और व्यायाम नहीं करना चाहिए।",
    factEn: "Warm showers ease pelvic muscular tension, and gentle movement releases natural endorphins that relieve cramping.",
    factHi: "गुनगुने पानी से नहाना गर्भाशय की मांसपेशियों को आराम देता है और हल्का टहलना दर्द को कम करता है।",
  },
];

export default function LearnPage() {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedMyth, setExpandedMyth] = useState<number | null>(null);

  const categories = [
    { id: "all", labelEn: "All Topics", labelHi: "सभी विषय" },
    { id: "pcos", labelEn: "PCOS & Hormones", labelHi: "PCOS" },
    { id: "endo", labelEn: "Pelvic Pain & Endo", labelHi: "एंडोमेट्रियोसिस" },
    { id: "basics", labelEn: "Cycle Basics", labelHi: "चक्र समझ" },
    { id: "nutrition", labelEn: "Nutrition", labelHi: "पोषण" },
    { id: "myths", labelEn: "Myths vs. Facts", labelHi: "मिथक व सत्य" },
  ];

  const filteredArticles = ARTICLES.filter((art) => {
    const matchesCategory = activeCategory === "all" || art.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      art.titleEn.toLowerCase().includes(query) ||
      art.titleHi.toLowerCase().includes(query) ||
      art.summaryEn.toLowerCase().includes(query) ||
      art.summaryHi.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="flex-1 w-full py-5 flex flex-col gap-6">
      {/* 1. Header & Medical Advisory Badge */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
            {language === "hi" ? "चिकित्सीय स्वास्थ्य पुस्तकालय" : "Medical Health Library"}
          </span>
        </div>
        <h1 className="font-serif text-2xl font-medium text-primary">
          {language === "hi" ? "विश्वसनीय ज्ञान और शोध" : "Evidence-Based Guidance"}
        </h1>
        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
          {language === "hi"
            ? "FOGSI और ACOG क्लिनिकल गाइडलाइन्स पर आधारित प्रमाणित स्वास्थ्य लेख। बिना किसी झिझक के सीखें।"
            : "Clinically reviewed articles free from superstition and shame. Verified by gynecologists."}
        </p>
      </section>

      {/* 2. Search Bar */}
      <section className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-outline text-lg">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            language === "hi"
              ? "PCOS, एंडोमेट्रियोसिस, दर्द या आहार खोजें..."
              : "Search PCOS, cramps, cycle signs..."
          }
          className="w-full h-12 pl-10 pr-4 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      </section>

      {/* 3. Category Horizontal Carousel */}
      <section className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => {
          const isSelected = activeCategory === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-surface-container text-outline border-outline-variant/30 hover:text-on-surface"
              }`}
            >
              {language === "hi" ? c.labelHi : c.labelEn}
            </button>
          );
        })}
      </section>

      {/* 4. Featured Deep-Dive Guides (PCOS & Endometriosis) */}
      <section className="space-y-3">
        <h3 className="font-serif text-lg font-medium text-primary">
          {language === "hi" ? "प्रमुख मार्गदर्शिकाएँ (Deep Dives)" : "Featured Clinical Guides"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* PCOS Banner */}
        <Link
          href="/learn/pcos"
          className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between hover:border-primary transition-all shadow-warm-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary">
              {language === "hi" ? "रॉटरडैम मानदंड" : "Rotterdam Criteria"}
            </span>
            <span className="text-[11px] font-semibold text-outline">6 min read</span>
          </div>

          <h4 className="font-serif text-lg font-semibold text-primary leading-tight group-hover:text-primary-container transition-colors">
            {language === "hi" ? "पीसीओएस (PCOS) संपूर्ण गाइड" : "Understanding PCOS: Complete Guide"}
          </h4>
          <p className="text-xs text-on-surface-variant mt-1.5 line-clamp-2">
            {language === "hi"
              ? "अनियमित तिथियां, फेशियल हेयर, मुंहासे और इंसुलिन रेजिस्टेंस को समझें। डॉक्टर से क्या प्रश्न पूछें।"
              : "Demystifying androgen signs, metabolic insulin resistance, and practical Indian glycemic food pairing."}
          </p>

          <div className="flex items-center gap-1 text-xs font-semibold text-primary mt-3 pt-2 border-t border-outline-variant/20">
            <span>{language === "hi" ? "पूरी गाइड पढ़ें" : "Read Full Guide"}</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
        </Link>

        {/* Endometriosis Banner */}
        <Link
          href="/learn/endometriosis"
          className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between hover:border-tertiary transition-all shadow-warm-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-tertiary">
              {language === "hi" ? "श्रोणि दर्द पुष्टि" : "Pelvic Pain Validation"}
            </span>
            <span className="text-[11px] font-semibold text-outline">7 min read</span>
          </div>

          <h4 className="font-serif text-lg font-semibold text-tertiary leading-tight group-hover:text-tertiary-container transition-colors">
            {language === "hi" ? "एंडोमेट्रियोसिस और गहरा दर्द" : "Understanding Endometriosis & Pelvic Care"}
          </h4>
          <p className="text-xs text-on-surface-variant mt-1.5 line-clamp-2">
            {language === "hi"
              ? "असहनीय दर्द केवल ऐंठन नहीं है। 4-चरणीय डायग्नोस्टिक रोडमैप और क्लिनिकल रेड फ्लैग्स।"
              : "Validating that severe pelvic pain is real and medical. 4-step diagnostic roadmap from ultrasound to laparoscopy."}
          </p>

          <div className="flex items-center gap-1 text-xs font-semibold text-tertiary mt-3 pt-2 border-t border-outline-variant/20">
            <span>{language === "hi" ? "पूरी गाइड पढ़ें" : "Read Full Guide"}</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
        </Link>
        </div>
      </section>

      {/* 5. Interactive Myth vs. Fact Cards */}
      <section className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-2xl">verified</span>
          <div>
            <h3 className="font-serif text-lg font-medium text-primary">
              {language === "hi" ? "मिथक बनाम वैज्ञानिक सत्य" : "Menstrual Myths vs. Medical Facts"}
            </h3>
            <span className="text-[11px] text-outline">
              {language === "hi" ? "स्त्री रोग विशेषज्ञों द्वारा प्रमाणित" : "Debunked by OB-GYN Clinical Specialists"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MYTHS.map((item, idx) => {
            const isExpanded = expandedMyth === idx;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-outline-variant/30 bg-surface-container space-y-2 cursor-pointer transition-all"
                onClick={() => setExpandedMyth(isExpanded ? null : idx)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#ffdad4] text-[#ba1a1a]">
                      {language === "hi" ? "मिथक" : "MYTH"}
                    </span>
                    <span className="text-xs font-semibold text-on-surface leading-snug">
                      {language === "hi" ? item.mythHi : item.mythEn}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-outline text-sm">
                    {isExpanded ? "expand_less" : "expand_more"}
                  </span>
                </div>

                {isExpanded && (
                  <div className="pt-2 border-t border-outline-variant/20 flex items-start gap-2 text-xs leading-relaxed text-[#2c4e36] bg-secondary-container/40 p-2.5 rounded-lg">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-secondary-container text-secondary flex-shrink-0">
                      {language === "hi" ? "तथ्य" : "FACT"}
                    </span>
                    <p>{language === "hi" ? item.factHi : item.factEn}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Curated Articles Feed */}
      <section className="space-y-3">
        <h3 className="font-serif text-lg font-medium text-primary">
          {language === "hi" ? "स्वास्थ्य लेख" : "Clinical Articles"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => {
            const CardWrapper = article.link ? Link : "div";
            return (
              <CardWrapper
                key={article.id}
                href={article.link || "#"}
                className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col gap-1.5 hover:border-primary transition-colors block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-outline">
                    {article.category.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-outline">{article.readTime}</span>
                </div>
                <h4 className="font-serif text-sm font-semibold text-primary leading-snug">
                  {language === "hi" ? article.titleHi : article.titleEn}
                </h4>
                <p className="text-xs text-on-surface-variant line-clamp-2">
                  {language === "hi" ? article.summaryHi : article.summaryEn}
                </p>
                <span className="text-[10px] text-outline font-medium pt-1">
                  Reviewed by: {article.reviewedBy}
                </span>
              </CardWrapper>
            );
          })}
        </div>
      </section>
    </main>
  );
}
