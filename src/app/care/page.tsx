"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCycle } from "@/context/CycleContext";
import { BiologicalPhase, DietPreference } from "@/types";

interface Recipe {
  id: string;
  nameEn: string;
  nameHi: string;
  category: "all" | "veg" | "budget" | "vegan";
  phase: BiologicalPhase;
  cookTime: string;
  costTag: string;
  benefitEn: string;
  benefitHi: string;
  ingredientsEn: string[];
  ingredientsHi: string[];
  instructionsEn: string;
  instructionsHi: string;
}

const RECIPES: Recipe[] = [
  {
    id: "palak-khichdi",
    nameEn: "Moong Dal & Palak Khichdi with Desi Ghee",
    nameHi: "पालक-मूंग दाल खिचड़ी व शुद्ध घी",
    category: "veg",
    phase: "menstrual",
    cookTime: "20 min",
    costTag: "< ₹40",
    benefitEn: "High non-heme iron combined with lemon juice (Vitamin C) for optimal ferritin absorption.",
    benefitHi: "पालक से भरपूर आयरन और नींबू का रस (विटामिन सी) जो खून की कमी को दूर करने में सहायक है।",
    ingredientsEn: ["1/2 cup yellow moong dal", "1/2 cup rice", "1 cup washed spinach (palak)", "1 tbsp A2 cow ghee", "1/2 lemon juice", "Cumin & turmeric"],
    ingredientsHi: ["1/2 कप पीली मूंग दाल", "1/2 कप चावल", "1 कप धुली बारीक कटी पालक", "1 बड़ा चम्मच देशी घी", "1/2 नींबू का रस", "जीरा और हल्दी"],
    instructionsEn: "Wash dal and rice together. Pressure cook with turmeric, salt, and spinach for 3 whistles. Finish with a tadka of ghee, cumin, and hing, then squeeze fresh lemon.",
    instructionsHi: "दाल-चावल को धोकर पालक, हल्दी और नमक के साथ 3 सीटी तक पकाएं। ऊपर से घी और जीरे का तड़का लगाएं और नींबू निचोड़ें।",
  },
  {
    id: "gur-chana",
    nameEn: "Roasted Chana & Organic Jaggery (Gur-Chana)",
    nameHi: "भुना चना और जैविक गुड़ (गुड़-चना)",
    category: "budget",
    phase: "menstrual",
    cookTime: "No Cooking",
    costTag: "< ₹15",
    benefitEn: "Classic zero-cooking Indian superfood providing 4mg bioavailable iron and steady complex carbohydrates.",
    benefitHi: "बिना पकाए तुरंत ऊर्जा और 4 मिलीग्राम आयरन देने वाला पारंपरिक भारतीय सुपरफूड।",
    ingredientsEn: ["1 small katori roasted peeled chana", "1 tbsp unrefined organic gur (jaggery)"],
    ingredientsHi: ["1 छोटी कटोरी भुने छिलके वाले चने", "1 बड़ा चम्मच शुद्ध जैविक गुड़"],
    instructionsEn: "Keep a small steel dabba handy. Consume alongside mid-afternoon warm water or herbal infusion.",
    instructionsHi: "दोपहर के समय गुनगुने पानी या काढ़े के साथ एक छोटी कटोरी चने और गुड़ का सेवन करें।",
  },
  {
    id: "ajwain-kadha",
    nameEn: "Warm Ajwain, Saunf & Ginger Infusion",
    nameHi: "अजवाइन, सौंफ और अदरक का गुनगुना काढ़ा",
    category: "vegan",
    phase: "menstrual",
    cookTime: "7 min",
    costTag: "< ₹10",
    benefitEn: "Thymol in ajwain acts as a natural antispasmodic relaxing uterine muscle contractions.",
    benefitHi: "अजवाइन में मौजूद थाइमोल गर्भाशय की ऐंठन को शांत करता है और पेट फूलने से तुरंत राहत देता है।",
    ingredientsEn: ["1 tsp ajwain (carom seeds)", "1 tsp saunf (fennel seeds)", "1 inch crushed ginger", "1.5 cups water", "1 tsp jaggery"],
    ingredientsHi: ["1 चम्मच अजवाइन", "1 चम्मच सौंफ", "1 इंच कुटा अदरक", "1.5 कप पानी", "1 चम्मच गुड़"],
    instructionsEn: "Boil water with ajwain, saunf, and ginger for 5 minutes until reduced. Strain, sweeten with jaggery, and sip slowly.",
    instructionsHi: "पानी में अजवाइन, सौंफ और अदरक को 5 मिनट तक उबालें। छानकर हल्का गुड़ मिलाएं और घूंट-घूंट करके पिएं।",
  },
  {
    id: "sprout-salad",
    nameEn: "Sprouted Moong & Pomegranate Chaat",
    nameHi: "अंकुरित मूंग व अनार दाना चाट",
    category: "vegan",
    phase: "follicular",
    cookTime: "5 min",
    costTag: "< ₹35",
    benefitEn: "Enzymatically active sprouts promote estrogen metabolism and restore vitality after bleeding.",
    benefitHi: "अंकुरित दालें नए एस्ट्रोजन हार्मोन के निर्माण में मदद करती हैं और शरीर को ताजगी देती हैं।",
    ingredientsEn: ["1 cup sprouted green moong", "1/2 cup fresh pomegranate arils", "1/2 cucumber diced", "Rock salt & chaat masala", "Fresh coriander"],
    ingredientsHi: ["1 कप अंकुरित हरी मूंग", "1/2 कप अनार के ताजे दाने", "1/2 बारीक कटा खीरा", "सेंधा नमक व चाट मसाला", "हरा धनिया"],
    instructionsEn: "Steam sprouts for 2 minutes for easy digestion. Mix in pomegranate, cucumber, rock salt, and lemon.",
    instructionsHi: "अंकुरित मूंग को 2 मिनट हल्की भाप दें। अनार, खीरा, सेंधा नमक और नींबू मिलाकर ताज़ा खाएं।",
  },
  {
    id: "mint-chaas",
    nameEn: "Probiotic Mint & Roasted Jeera Chaas",
    nameHi: "पुदीना और भुना जीरा मट्ठा (छाछ)",
    category: "veg",
    phase: "ovulatory",
    cookTime: "3 min",
    costTag: "< ₹15",
    benefitEn: "Earthen-pot chilled chaas restores lactobacillus gut flora and cools internal core temperature.",
    benefitHi: "मटके की ठंडी छाछ आंतों के मित्र बैक्टीरिया को बढ़ाती है और शरीर की आंतरिक गर्मी को शांत करती है।",
    ingredientsEn: ["1/2 cup homemade curd", "1 cup water from matka", "1/2 tsp roasted cumin powder", "5 fresh mint leaves", "Pinch of black salt"],
    ingredientsHi: ["1/2 कप घर का ताजा दही", "1 कप मटके का पानी", "1/2 चम्मच भुना जीरा पाउडर", "5 ताजे पुदीने के पत्ते", "चुटकी भर काला नमक"],
    instructionsEn: "Whisk curd and water with a wooden mathani. Add roasted cumin, rock salt, and crushed mint.",
    instructionsHi: "दही और मटके के पानी को मथनी से मथें। भुना जीरा, काला नमक और पुदीना मिलाकर भोजन के बाद पिएं।",
  },
  {
    id: "til-gud-ladoo",
    nameEn: "Sesame & Sunflower Seed Laddoos (Seed Cycling)",
    nameHi: "तिल और सूरजमुखी के बीज के पौष्टिक लड्डू",
    category: "veg",
    phase: "luteal",
    cookTime: "15 min",
    costTag: "< ₹50",
    benefitEn: "High in zinc and selenium to support corpus luteum progesterone production and curb sweet cravings.",
    benefitHi: "जिंक और सेलेनियम से भरपूर तिल प्रोजेस्टेरोन हार्मोन को सहारा देते हैं और मीठे की तलब को संतुलित करते हैं।",
    ingredientsEn: ["1/2 cup white sesame seeds (til)", "1/2 cup sunflower seeds", "1 cup soft jaggery", "1/2 tsp cardamom powder"],
    ingredientsHi: ["1/2 कप सफेद तिल", "1/2 कप सूरजमुखी के बीज", "1 कप नरम गुड़", "1/2 चम्मच इलायची पाउडर"],
    instructionsEn: "Dry roast seeds lightly. Melt jaggery with a drop of ghee, fold in seeds and cardamom, and shape into small bite-sized laddoos.",
    instructionsHi: "बीजों को हल्का सूखा भूनें। पिघले हुए गुड़ में बीज और इलायची मिलाकर छोटे-छोटे लड्डू बना लें।",
  },
];

export default function CarePage() {
  const { language, speakText, isSpeaking } = useLanguage();
  const { currentPhaseInfo, profile } = useCycle();

  const [activePhase, setActivePhase] = useState<BiologicalPhase>(currentPhaseInfo.phase);
  const [foodFilter, setFoodFilter] = useState<"all" | "veg" | "budget" | "vegan">("all");
  const [waterMl, setWaterMl] = useState<number>(1500);

  const phaseNames = {
    menstrual: { en: "Menstrual Phase", hi: "माहवारी (दिन 1-5)" },
    follicular: { en: "Follicular Phase", hi: "कणिका (दिन 6-11)" },
    ovulatory: { en: "Ovulatory Window", hi: "अंडोत्सर्ग (दिन 12-15)" },
    luteal: { en: "Luteal Phase", hi: "ल्यूटियल (दिन 16-28)" },
  };

  const filteredRecipes = RECIPES.filter((r) => {
    const matchesPhase = r.phase === activePhase;
    const matchesCategory = foodFilter === "all" || r.category === foodFilter;
    return matchesPhase && matchesCategory;
  });

  const handleAddWater = (amt: number) => {
    setWaterMl((prev) => Math.max(0, Math.min(3500, prev + amt)));
  };

  return (
    <main className="flex-1 w-full px-4 py-5 flex flex-col gap-5 max-w-md mx-auto">
      {/* 1. Header & Hormonal Sync Banner */}
      <section>
        <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
          {language === "hi" ? "पोषण और कल्याण" : "Care & Hormonal Nutrition"}
        </span>
        <h1 className="font-serif text-2xl font-medium text-primary">
          {language === "hi" ? "रसोई व प्राकृतिक देखभाल" : "Kitchen Sanctuary & Care"}
        </h1>
        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
          {language === "hi"
            ? "भारतीय परंपरा और वैज्ञानिक पोषण का संगम। अपने चक्र के अनुसार शरीर को पोषण दें।"
            : "Traditional Indian wisdom meets hormonal biology. Nourish your body in rhythm with your cycle."}
        </p>
      </section>

      {/* 2. Phase Tab Selector */}
      <section className="flex bg-surface-container p-1 rounded-2xl border border-outline-variant/30 overflow-x-auto scrollbar-none">
        {(["menstrual", "follicular", "ovulatory", "luteal"] as BiologicalPhase[]).map((p) => {
          const isSelected = activePhase === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setActivePhase(p)}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-primary text-white shadow-sm"
                  : "text-outline hover:text-on-surface"
              }`}
            >
              {language === "hi" ? phaseNames[p].hi : phaseNames[p].en}
            </button>
          );
        })}
      </section>

      {/* 3. Interactive Matka Hydration Tracker */}
      <section className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center text-2xl shadow-sm">
              🏺
            </div>
            <div>
              <h3 className="font-serif text-base font-medium text-primary">
                {language === "hi" ? "मटका जल ट्रैकर" : "Matka Hydration Tracker"}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {language === "hi" ? `${waterMl} ml / 2500 ml पूर्ण` : `${waterMl} ml of 2500 ml target`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleAddWater(-250)}
              className="w-8 h-8 rounded-lg bg-surface-container-highest text-primary font-bold text-xs flex items-center justify-center active:scale-95 transition-transform"
              title="Decrease 250ml"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => handleAddWater(250)}
              className="h-8 px-3 rounded-lg bg-secondary text-white font-semibold text-xs flex items-center gap-1 active:scale-95 transition-transform shadow-sm"
            >
              <span>+250ml</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-secondary h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (waterMl / 2500) * 100)}%` }}
          />
        </div>

        {/* Ayurvedic Microtip */}
        <p className="text-[11px] text-on-surface-variant leading-relaxed bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20">
          <span className="font-semibold text-primary">{language === "hi" ? "आयुर्वेद परामर्श: " : "Ayurvedic Insight: "}</span>
          {language === "hi"
            ? "मिट्टी के घड़े का पानी स्वाभाविक रूप से क्षारीय (alkaline) होता है, जो माहवारी के दौरान पित्त दोष को शांत रखता है और एसिडिटी से बचाता है।"
            : "Earthen pot water is naturally micro-alkaline. It balances internal thermal heat (Pitta) without shocking the digestive fire (Agni)."}
        </p>
      </section>

      {/* 4. Seed Cycling Protocol Card */}
      <section className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">spa</span>
            <h3 className="font-serif text-lg font-medium text-primary">
              {language === "hi" ? "बीज चक्रण विधि (Seed Cycling)" : "Hormonal Seed Cycling Protocol"}
            </h3>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-surface-container text-outline">
            {language === "hi" ? "प्राकृतिक नियम" : "Evidence-Based"}
          </span>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          {language === "hi"
            ? "विभिन्न बीजों में मौजूद लिग्नन्स और आवश्यक फैटी एसिड मासिक धर्म चक्र के दोनों चरणों को प्राकृतिक रूप से संतुलित करते हैं।"
            : "Specific seed lignans and essential zinc/selenium naturally calibrate estrogen and progesterone ratios across the two halves of your cycle."}
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className={`p-3 rounded-xl border text-xs ${
            activePhase === "menstrual" || activePhase === "follicular"
              ? "bg-secondary-container/40 border-secondary"
              : "bg-surface-container border-outline-variant/20 opacity-75"
          }`}>
            <span className="font-semibold text-secondary block mb-1">
              {language === "hi" ? "चरण 1: दिन 1–14" : "Phase 1: Days 1–14"}
            </span>
            <span className="font-bold text-primary block">
              {language === "hi" ? "अलसी + कद्दू के बीज" : "Flax + Pumpkin Seeds"}
            </span>
            <span className="text-[11px] text-outline mt-0.5 block">
              {language === "hi" ? "1-1 चम्मच पिसा हुआ (एस्ट्रोजन समर्थन)" : "1 tbsp each ground (Estrogen balance)"}
            </span>
          </div>

          <div className={`p-3 rounded-xl border text-xs ${
            activePhase === "ovulatory" || activePhase === "luteal"
              ? "bg-tertiary-fixed/60 border-tertiary"
              : "bg-surface-container border-outline-variant/20 opacity-75"
          }`}>
            <span className="font-semibold text-tertiary block mb-1">
              {language === "hi" ? "चरण 2: दिन 15–28" : "Phase 2: Days 15–28"}
            </span>
            <span className="font-bold text-primary block">
              {language === "hi" ? "तिल + सूरजमुखी के बीज" : "Sesame + Sunflower Seeds"}
            </span>
            <span className="text-[11px] text-outline mt-0.5 block">
              {language === "hi" ? "1-1 चम्मच पिसा हुआ (प्रोजेस्टेरोन पोषण)" : "1 tbsp each ground (Progesterone support)"}
            </span>
          </div>
        </div>
      </section>

      {/* 5. Indian Healing Meals & Kitchen Filters */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-medium text-primary">
            {language === "hi" ? "चरण-अनुकूल घरेलू व्यंजन" : "Phase-Aligned Healing Meals"}
          </h3>

          {/* Quick Dietary Filter */}
          <div className="flex gap-1">
            {[
              { id: "all", labelEn: "All", labelHi: "सभी" },
              { id: "veg", labelEn: "Veg", labelHi: "शाकाहारी" },
              { id: "budget", labelEn: "<₹40", labelHi: "<₹40" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFoodFilter(f.id as typeof foodFilter)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold border transition-all ${
                  foodFilter === f.id
                    ? "bg-primary text-white border-primary"
                    : "bg-surface-container text-outline border-outline-variant/30"
                }`}
              >
                {language === "hi" ? f.labelHi : f.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Recipes Feed */}
        <div className="space-y-3">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-warm-sm space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif text-base font-semibold text-primary">
                      {language === "hi" ? recipe.nameHi : recipe.nameEn}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-secondary-container text-[#2c4e36]">
                        {recipe.cookTime}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface-container text-outline">
                        {recipe.costTag}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      speakText(
                        language === "hi"
                          ? `${recipe.nameHi}। ${recipe.benefitHi}। बनाने की विधि: ${recipe.instructionsHi}`
                          : `${recipe.nameEn}. ${recipe.benefitEn}. Preparation: ${recipe.instructionsEn}`
                      )
                    }
                    className="p-2 rounded-full bg-surface-container text-primary hover:bg-surface-container-high transition-colors"
                    title="Listen to recipe"
                  >
                    <span className="material-symbols-outlined text-[18px]">volume_up</span>
                  </button>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {language === "hi" ? recipe.benefitHi : recipe.benefitEn}
                </p>

                {/* Ingredients Pills */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block mb-1">
                    {language === "hi" ? "सामग्री (Ingredients):" : "Key Ingredients:"}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(language === "hi" ? recipe.ingredientsHi : recipe.ingredientsEn).map((ing, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-surface-container text-[11px] text-on-surface-variant"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preparation Guide */}
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs text-on-surface-variant leading-relaxed">
                  <span className="font-semibold text-primary block mb-0.5">
                    {language === "hi" ? "विधि:" : "Preparation:"}
                  </span>
                  {language === "hi" ? recipe.instructionsHi : recipe.instructionsEn}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-outline text-center py-4">
              {language === "hi" ? "इस फ़िल्टर के लिए कोई व्यंजन नहीं मिले।" : "No recipes found under this filter."}
            </p>
          )}
        </div>
      </section>

      {/* 6. Evening Somatic Rest Rituals */}
      <section className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary text-2xl">bedtime</span>
          <div>
            <h3 className="font-serif text-lg font-medium text-primary">
              {language === "hi" ? "शाम का विश्राम अनुष्ठान" : "Evening Somatic Care Ritual"}
            </h3>
            <span className="text-[11px] text-outline">
              {language === "hi" ? "नर्वस सिस्टम को शांत करने वाले 3 सरल अभ्यास" : "3 calming practices to soothe your nervous system"}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex gap-2.5 items-start">
            <span className="font-bold text-primary text-base">1</span>
            <div>
              <span className="font-semibold text-primary block">
                {language === "hi" ? "नमक मिले गुनगुने पानी में पैर भिगोना (5 मिनट)" : "Warm Salt Foot Soak (5 mins)"}
              </span>
              <p className="text-on-surface-variant mt-0.5">
                {language === "hi"
                  ? "एक बाल्टी में हल्का गर्म पानी और सेंधा नमक डालकर 5 मिनट पैर रखें। यह पेल्विक रक्त प्रवाह को संतुलित करता है।"
                  : "Soaking feet in warm water with rock salt grounds your energy and encourages restorative pelvic circulation."}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex gap-2.5 items-start">
            <span className="font-bold text-primary text-base">2</span>
            <div>
              <span className="font-semibold text-primary block">
                {language === "hi" ? "दीवार के सहारे पैर ऊपर (विपरीत करणी - 10 मिनट)" : "Legs-Up-The-Wall Pose (Viparita Karani)"}
              </span>
              <p className="text-on-surface-variant mt-0.5">
                {language === "hi"
                  ? "कमर के नीचे तकिया रखकर पैरों को दीवार के सहारे सीधा करें। यह कमर दर्द और भारीपन को तुरंत दूर करता है।"
                  : "Elevating legs reverses gravity, calming venous congestion and alleviating lower back cramping."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
