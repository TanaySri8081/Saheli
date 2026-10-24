"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCycle } from "@/context/CycleContext";
import { BiologicalPhase } from "@/types";
import nutritionCollection from "@/data/nutritionCollection.json";

interface NutritionItem {
  id: string;
  nameEn: string;
  nameHi: string;
  diet: string;
  isIronRich: boolean;
  isBloatingFriendly: boolean;
  allergens: string[];
  phase: string;
  prepTime: string;
  cost: string;
  ironMg: number;
  vitaminCPairing: string;
  evidenceNoteEn: string;
  evidenceNoteHi: string;
  ingredientsEn: string[];
  ingredientsHi: string[];
}

const BLOATING_TRIGGER_OPTIONS = [
  { id: "dairy", labelEn: "Excess Milk / Dairy", labelHi: "अधिक दूध या भारी डेयरी" },
  { id: "raw_cruciferous", labelEn: "Raw Cabbage / Cauliflower / Radish", labelHi: "कच्ची गोभी, पत्तागोभी या मूली" },
  { id: "refined_wheat", labelEn: "Refined Flour (Maida) / Bakery", labelHi: "मैदा व बेकरी उत्पाद" },
  { id: "fried", labelEn: "Deep Fried Snacks / Pakoras", labelHi: "अधिक तेल-मसालेदार व तले हुए व्यंजन" },
  { id: "fizzy", labelEn: "Carbonated / Soda Drinks", labelHi: "सोडा व कोल्ड ड्रिंक्स" },
  { id: "stress", labelEn: "Eating in Rush / High Stress", labelHi: "जल्दबाजी या तनाव में भोजन करना" },
];

export default function CarePage() {
  const { language, speakText, isSpeaking, stopSpeaking } = useLanguage();
  const { currentPhaseInfo } = useCycle();

  // Engine State
  const [activePhase, setActivePhase] = useState<string>("all");
  const [dietFilter, setDietFilter] = useState<"all" | "veg" | "vegan" | "budget">("all");
  const [ironRichOnly, setIronRichOnly] = useState<boolean>(false);
  const [bloatingFriendlyOnly, setBloatingFriendlyOnly] = useState<boolean>(false);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);
  const [personalBloatTriggers, setPersonalBloatTriggers] = useState<string[]>([]);
  const [waterMl, setWaterMl] = useState<number>(1500);
  const [activeTab, setActiveTab] = useState<"meals" | "bloatTracker" | "ironGuide">("meals");

  // Load triggers from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("saheli_bloat_triggers");
      if (saved) setPersonalBloatTriggers(JSON.parse(saved));
      const savedAllergens = localStorage.getItem("saheli_user_allergens");
      if (savedAllergens) setExcludedAllergens(JSON.parse(savedAllergens));
    } catch (e) {
      console.warn("Storage load error", e);
    }
  }, []);

  const toggleAllergen = (allergen: string) => {
    const updated = excludedAllergens.includes(allergen)
      ? excludedAllergens.filter((a) => a !== allergen)
      : [...excludedAllergens, allergen];
    setExcludedAllergens(updated);
    try {
      localStorage.setItem("saheli_user_allergens", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage write error", e);
    }
  };

  const toggleBloatTrigger = (triggerId: string) => {
    const updated = personalBloatTriggers.includes(triggerId)
      ? personalBloatTriggers.filter((t) => t !== triggerId)
      : [...personalBloatTriggers, triggerId];
    setPersonalBloatTriggers(updated);
    try {
      localStorage.setItem("saheli_bloat_triggers", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage write error", e);
    }
  };

  // Rule-Based Recommendation Engine
  const filteredRecipes = (nutritionCollection as NutritionItem[]).filter((item) => {
    // 1. Dietary Preference
    if (dietFilter === "veg" && item.diet !== "veg" && item.diet !== "vegan") return false;
    if (dietFilter === "vegan" && item.diet !== "vegan") return false;
    if (dietFilter === "budget" && !item.cost.includes("15") && !item.cost.includes("20") && !item.cost.includes("10") && !item.cost.includes("5")) return false;

    // 2. Iron-Rich Filter
    if (ironRichOnly && !item.isIronRich) return false;

    // 3. Bloating-Friendly Filter
    if (bloatingFriendlyOnly && !item.isBloatingFriendly) return false;

    // 4. Allergen Exclusion Filter
    if (excludedAllergens.some((allergen) => item.allergens.includes(allergen))) {
      return false;
    }

    // 5. Phase alignment (optional)
    if (activePhase !== "all" && item.phase !== "all" && item.phase !== activePhase) {
      return false;
    }

    return true;
  });

  const handleAddWater = (amt: number) => {
    setWaterMl((prev) => Math.max(0, Math.min(3500, prev + amt)));
  };

  const handleReadRecipe = (item: NutritionItem) => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    const text =
      language === "hi"
        ? `${item.nameHi}। ${item.evidenceNoteHi}। सामग्री: ${item.ingredientsHi.join(", ")}।`
        : `${item.nameEn}. ${item.evidenceNoteEn}. Ingredients: ${item.ingredientsEn.join(", ")}.`;
    speakText(text);
  };

  return (
    <main className="flex-1 w-full px-4 py-5 flex flex-col gap-5 max-w-md mx-auto pb-24">
      {/* 1. Header & Evidence Disclaimer */}
      <section className="space-y-2">
        <div className="flex items-center gap-1.5 text-secondary">
          <span className="material-symbols-outlined text-base">verified</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Evidence-Based Nutritional Care
          </span>
        </div>
        <h1 className="font-serif text-2xl font-medium text-primary">
          {language === "hi" ? "रसोई व साक्ष्य-आधारित पोषण" : "Kitchen Sanctuary & Nutrition"}
        </h1>

        {/* Clinical Guardrail Disclaimer Banner */}
        <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface-variant leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-primary">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>{language === "hi" ? "चिकित्सीय स्पष्टीकरण:" : "Clinical Scope & Safety:"}</span>
          </div>
          <p className="text-[11px]">
            {language === "hi"
              ? "सहेली पोषण सुझाव पेट के आराम और सूक्ष्म पोषक तत्वों की भरपाई हेतु हैं। कोई भी आहार पीसीओएस को 'जड़ से खत्म' करने या एंडोमेट्रियोसिस को ठीक करने का दावा नहीं करता। यदि लक्षण गंभीर या लगातार बने रहें, तो डॉक्टर से परामर्श लें।"
              : "Nutritional suggestions support digestive comfort and micronutrient replenishment. We do not claim any diet 'cures' PCOS or treats endometriosis. If symptoms are severe or persistent, seek professional clinical assessment."}
          </p>
        </div>
      </section>

      {/* 2. Interactive Matka Hydration Tracker */}
      <section className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-secondary flex items-center justify-center text-xl shadow-sm">
              🏺
            </div>
            <div>
              <h3 className="font-serif text-sm font-semibold text-primary">
                {language === "hi" ? "मटका जल ट्रैकर" : "Matka Hydration Tracker"}
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                {language === "hi" ? `${waterMl} ml / 2500 ml लक्ष्य` : `${waterMl} ml of 2500 ml target`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleAddWater(-250)}
              className="w-7 h-7 rounded-lg bg-surface-container-highest text-primary font-bold text-xs flex items-center justify-center active:scale-95 transition-transform"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => handleAddWater(250)}
              className="h-7 px-2.5 rounded-lg bg-secondary text-white font-semibold text-xs flex items-center gap-1 active:scale-95 transition-transform shadow-sm"
            >
              <span>+250ml</span>
            </button>
          </div>
        </div>

        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
          <div
            className="bg-secondary h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (waterMl / 2500) * 100)}%` }}
          />
        </div>
      </section>

      {/* 3. Sub-Navigation Tabs */}
      <section className="flex bg-surface-container p-1 rounded-2xl border border-outline-variant/30 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("meals")}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            activeTab === "meals" ? "bg-primary text-white shadow-sm" : "text-outline hover:text-on-surface"
          }`}
        >
          {language === "hi" ? "35 समीक्षा-युक्त व्यंजन" : "35 Reviewed Meals"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ironGuide")}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            activeTab === "ironGuide" ? "bg-primary text-white shadow-sm" : "text-outline hover:text-on-surface"
          }`}
        >
          {language === "hi" ? "आयरन + विट C गाइड" : "Iron + Vit C"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("bloatTracker")}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            activeTab === "bloatTracker" ? "bg-primary text-white shadow-sm" : "text-outline hover:text-on-surface"
          }`}
        >
          {language === "hi" ? "ब्लोटिंग ट्रिगर" : "Bloat Triggers"}
        </button>
      </section>

      {/* TAB 1: MEALS & RULES-BASED RECOMMENDATION ENGINE */}
      {activeTab === "meals" && (
        <section className="space-y-4">
          {/* Rules Filters Card */}
          <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xs font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">tune</span>
                <span>{language === "hi" ? "नियम-आधारित फ़िल्टर" : "Rules-Based Engine"}</span>
              </span>
              <span className="text-[10px] text-outline">
                {filteredRecipes.length} {language === "hi" ? "व्यंजन मिले" : "meals available"}
              </span>
            </div>

            {/* Dietary Preference Chips */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-outline block">
                {language === "hi" ? "आहार प्रकार (Dietary):" : "Dietary Type:"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", labelEn: "All", labelHi: "सभी" },
                  { id: "veg", labelEn: "Vegetarian", labelHi: "शाकाहारी" },
                  { id: "vegan", labelEn: "Plant-Based (Vegan)", labelHi: "वीगन (लैक्टोज मुक्त)" },
                  { id: "budget", labelEn: "Budget (<₹25)", labelHi: "किफायती (<₹25)" },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDietFilter(d.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                      dietFilter === d.id
                        ? "bg-primary text-white border-primary"
                        : "bg-surface-container text-outline border-outline-variant/30"
                    }`}
                  >
                    {language === "hi" ? d.labelHi : d.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Targeted Functional Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setIronRichOnly(!ironRichOnly)}
                className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                  ironRichOnly
                    ? "bg-secondary-container/40 border-secondary text-primary font-bold"
                    : "bg-surface-container border-outline-variant/20 text-on-surface-variant"
                }`}
              >
                <div className="text-[11px]">
                  <span className="block">{language === "hi" ? "आयरन-युक्त" : "Iron-Rich Priority"}</span>
                  <span className="text-[9px] text-outline">{language === "hi" ? "विटामिन C के साथ" : "With Vit C pairing"}</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  {ironRichOnly ? "check_circle" : "radio_button_unchecked"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBloatingFriendlyOnly(!bloatingFriendlyOnly)}
                className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                  bloatingFriendlyOnly
                    ? "bg-secondary-container/40 border-secondary text-primary font-bold"
                    : "bg-surface-container border-outline-variant/20 text-on-surface-variant"
                }`}
              >
                <div className="text-[11px]">
                  <span className="block">{language === "hi" ? "ब्लोटिंग-रहित" : "Bloat-Friendly"}</span>
                  <span className="text-[9px] text-outline">{language === "hi" ? "हल्का व सुपाच्य" : "Gentle digestion"}</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  {bloatingFriendlyOnly ? "check_circle" : "radio_button_unchecked"}
                </span>
              </button>
            </div>

            {/* Allergen Filters */}
            <div className="pt-1 border-t border-outline-variant/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-error">no_food</span>
                  <span>{language === "hi" ? "एलर्जी बहिष्कार (Exclude Allergens):" : "Exclude Allergens:"}</span>
                </span>
                {excludedAllergens.length > 0 && (
                  <button
                    onClick={() => setExcludedAllergens([])}
                    className="text-[9px] text-primary underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "dairy", label: "Dairy (दूध/दही)" },
                  { id: "gluten", label: "Gluten (गेहूं/मैदा)" },
                  { id: "nuts", label: "Nuts (मेवे)" },
                ].map((a) => {
                  const isChecked = excludedAllergens.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleAllergen(a.id)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium border flex items-center gap-1 ${
                        isChecked
                          ? "bg-error-container text-[#93000a] border-error/50"
                          : "bg-surface-container text-outline border-outline-variant/20"
                      }`}
                    >
                      <span>{isChecked ? "✕" : "+"}</span>
                      <span>{a.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[9px] text-outline">
                {language === "hi"
                  ? "⚠️ व्यक्तिगत एलर्जी व सामग्री की पुष्टि स्वयं करें।"
                  : "⚠️ Always verify food labels and ingredients for personal intolerances."}
              </p>
            </div>
          </div>

          {/* Recipes Stream */}
          <div className="space-y-3">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-surface-container-high text-outline uppercase">
                          {item.phase}
                        </span>
                        {item.isIronRich && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-secondary-container text-[#2c4e36]">
                            Fe: {item.ironMg}mg
                          </span>
                        )}
                        {item.isBloatingFriendly && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-surface-container text-primary">
                            🌿 Bloat-Free
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-sm font-bold text-primary">
                        {language === "hi" ? item.nameHi : item.nameEn}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-outline">
                        <span>⏱️ {item.prepTime}</span>
                        <span>•</span>
                        <span>💰 {item.cost}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleReadRecipe(item)}
                      className="p-1.5 rounded-full bg-surface-container text-primary hover:bg-surface-container-high transition-colors"
                      title="Listen"
                    >
                      <span className="material-symbols-outlined text-[17px]">volume_up</span>
                    </button>
                  </div>

                  {/* Scientific Evidence Note */}
                  <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs text-on-surface-variant leading-relaxed">
                    <span className="font-semibold text-primary block mb-0.5 text-[10px] uppercase">
                      {language === "hi" ? "चिकित्सीय तर्क:" : "Clinical Evidence Rationale:"}
                    </span>
                    <p className="text-[11px]">{language === "hi" ? item.evidenceNoteHi : item.evidenceNoteEn}</p>
                    {item.isIronRich && (
                      <div className="mt-1.5 pt-1.5 border-t border-outline-variant/20 text-[10px] text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">bolt</span>
                        <span>
                          <strong>{language === "hi" ? "विटामिन C मेल: " : "Vit C Pairing: "}</strong>
                          {item.vitaminCPairing}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Ingredients Pills */}
                  <div>
                    <span className="text-[9px] uppercase font-bold text-outline block mb-1">
                      {language === "hi" ? "सामग्री:" : "Ingredients:"}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(language === "hi" ? item.ingredientsHi : item.ingredientsEn).map((ing, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] text-on-surface-variant"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-outline text-center py-6">
                {language === "hi"
                  ? "चुने गए फ़िल्टर के अनुसार कोई व्यंजन उपलब्ध नहीं है।"
                  : "No meals match the selected filters. Try clearing excluded allergens."}
              </p>
            )}
          </div>
        </section>
      )}

      {/* TAB 2: IRON + VITAMIN C PAIRING GUIDE */}
      {activeTab === "ironGuide" && (
        <section className="space-y-3 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-2">
            <div className="flex items-center gap-1.5 text-primary font-bold text-xs uppercase">
              <span className="material-symbols-outlined text-base">science</span>
              <span>{language === "hi" ? "आयरन अवशोषण का वैज्ञानिक नियम" : "WHO Science: Iron Bioavailability"}</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {language === "hi"
                ? "पौधों से मिलने वाला नॉन-हीम (Non-Heme) आयरन शरीर में कम अवशोषित होता है। विश्व स्वास्थ्य संगठन (WHO) के अनुसार, जब आप इसके साथ विटामिन सी (नींबू, आंवला, संतरा, टमाटर) मिलाते हैं, तो शरीर में आयरन का अवशोषण 3 गुना तक बढ़ जाता है।"
                : "Plant-based non-heme iron has lower intrinsic absorption compared to animal sources. The World Health Organization (WHO) clinical standard demonstrates that pairing plant iron with ascorbic acid (Vitamin C) transforms non-heme iron into a soluble ferrous state, multiplying absorption up to 300%."}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2.5">
            <h4 className="font-serif text-sm font-bold text-primary">
              {language === "hi" ? "आदर्श भारतीय आयरन + विटामिन C जोड़ियां" : "Gold-Standard Indian Pairings"}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/20">
                <span className="font-semibold text-primary block">पालक खिचड़ी + ताज़ा निचोड़ा नींबू</span>
                <span className="text-[11px] text-outline">खिचड़ी के पालक में प्रचुर आयरन है और नींबू का रस इसे तुरंत अवशोषित कराता है।</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/20">
                <span className="font-semibold text-primary block">भुना चना और गुड़ + कच्चा आंवला या संतरा</span>
                <span className="text-[11px] text-outline">गुड़-चने का आयरन आंवले के प्राकृतिक विटामिन सी से मिलकर हीमोग्लोबिन तेजी से बढ़ाता है।</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/20">
                <span className="font-semibold text-primary block">दाल-रोटी के साथ भोजन के तुरंत बाद चाय/कॉफ़ी से बचें</span>
                <span className="text-[11px] text-outline">चाय और कॉफ़ी में मौजूद टैनिन (Tannins) आयरन के अवशोषण को 60% तक रोक देते हैं।</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: BLOATING TRIGGER TRACKER */}
      {activeTab === "bloatTracker" && (
        <section className="space-y-3 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
            <div>
              <h4 className="font-serif text-base font-bold text-primary">
                {language === "hi" ? "व्यक्तिगत ब्लोटिंग ट्रिगर ट्रैकर" : "Personal Bloating Trigger Diary"}
              </h4>
              <p className="text-xs text-outline mt-0.5">
                {language === "hi"
                  ? "माहवारी के आसपास जो चीजें आपके पेट में भारीपन या गैस पैदा करती हैं, उन्हें चुनें:"
                  : "Check items that trigger abdominal puffiness or gas around your cycle:"}
              </p>
            </div>

            <div className="space-y-2">
              {BLOATING_TRIGGER_OPTIONS.map((opt) => {
                const isSelected = personalBloatTriggers.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleBloatTrigger(opt.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-secondary-container/40 border-secondary"
                        : "bg-surface-container border-outline-variant/20"
                    }`}
                  >
                    <span className="text-xs text-on-surface font-medium">
                      {language === "hi" ? opt.labelHi : opt.labelEn}
                    </span>
                    <span className="material-symbols-outlined text-base text-secondary">
                      {isSelected ? "check_box" : "check_box_outline_blank"}
                    </span>
                  </div>
                );
              })}
            </div>

            {personalBloatTriggers.length > 0 && (
              <div className="p-3 rounded-xl bg-surface-container-low border border-primary/20 text-xs text-on-surface-variant leading-relaxed">
                <span className="font-semibold text-primary block mb-0.5">
                  {language === "hi" ? "सहेली व्यक्तिगत सलाह:" : "Saheli Personalized Note:"}
                </span>
                {language === "hi"
                  ? `आपने ${personalBloatTriggers.length} ट्रिगर्स चुने हैं। ल्यूटियल और माहवारी के दिनों में इन खाद्य पदार्थों को कम करें और अजवाइन-सौंफ का काढ़ा पिएं।`
                  : `You logged ${personalBloatTriggers.length} personal sensitivities. During your luteal and menstrual phases, moderate these items and prioritize carminative ajwain-fennel infusions.`}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
