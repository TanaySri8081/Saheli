import { NextRequest, NextResponse } from "next/server";
import { BiologicalPhase } from "@/types";

interface PhaseNutritionPlan {
  phase: BiologicalPhase;
  phaseNameEn: string;
  phaseNameHi: string;
  healingMealEn: string;
  healingMealHi: string;
  seedCyclingEn: string;
  seedCyclingHi: string;
  hydrationMl: number;
  culinaryPrincipleEn: string;
  culinaryPrincipleHi: string;
}

const NUTRITION_PLANS: Record<BiologicalPhase, PhaseNutritionPlan> = {
  menstrual: {
    phase: "menstrual",
    phaseNameEn: "Menstrual Phase (Rest & Replenish)",
    phaseNameHi: "माहवारी चरण (विश्राम और पुनर्जनन)",
    healingMealEn: "Moong Dal Khichdi with A2 cow ghee, roasted cumin, and steamed spinach.",
    healingMealHi: "देसी घी, भुना जीरा और पालक के साथ हल्की मूंग दाल खिचड़ी।",
    seedCyclingEn: "1 tbsp freshly ground Flax seeds + 1 tbsp Pumpkin seeds (Phase 1).",
    seedCyclingHi: "1 चम्मच पिसी अलसी + 1 चम्मच कद्दू के बीज (चरण 1)।",
    hydrationMl: 2500,
    culinaryPrincipleEn: "Warm, grounding, easily digestible foods rich in iron and anti-inflammatory spices.",
    culinaryPrincipleHi: "गर्म, सुपाच्य और प्राकृतिक आयरन से भरपूर भोजन जो पाचन अग्नि को शांत रखे।",
  },
  follicular: {
    phase: "follicular",
    phaseNameEn: "Follicular Phase (Vitality & Growth)",
    phaseNameHi: "फॉलिक्युलर चरण (ऊर्जा और निर्माण)",
    healingMealEn: "Sprouted moong & methi cheela with fresh mint-coriander chutney.",
    healingMealHi: "अंकुरित मूंग व मेथी का चीला, हरी पुदीना-धनिया चटनी के साथ।",
    seedCyclingEn: "1 tbsp freshly ground Flax seeds + 1 tbsp Pumpkin seeds.",
    seedCyclingHi: "1 चम्मच ताज़ा पिसी अलसी + 1 चम्मच कद्दू के बीज।",
    hydrationMl: 2200,
    culinaryPrincipleEn: "Fresh, vibrant, fiber-dense foods that support rising estrogen and follicular maturation.",
    culinaryPrincipleHi: "ताजा, रेशेदार और एंटीऑक्सीडेंट युक्त आहार जो एस्ट्रोजन संतुलन को सहारा दे।",
  },
  ovulatory: {
    phase: "ovulatory",
    phaseNameEn: "Ovulatory Phase (Peak Radiance)",
    phaseNameHi: "ओव्यूलेटरी चरण (शिखर चमक और ऊर्जा)",
    healingMealEn: "Quinoa or brown rice bowl with fermented kanji, roasted paneer, and pomegranate seeds.",
    healingMealHi: "देसी फर्मेंटेड कांजी, भुना पनीर और अनार के दानों के साथ पौष्टिक बाउल।",
    seedCyclingEn: "1 tbsp Sesame seeds (til) + 1 tbsp Sunflower seeds (surajmukhi).",
    seedCyclingHi: "1 चम्मच तिल + 1 चम्मच सूरजमुखी के बीज (चरण 2)।",
    hydrationMl: 2500,
    culinaryPrincipleEn: "Antioxidant-dense, liver-supporting foods (cruciferous greens, amla) for estrogen clearance.",
    culinaryPrincipleHi: "लिवर को सक्रिय रखने वाले फल और हरी सब्जियां जो अतिरिक्त एस्ट्रोजन के निकास में सहायक हों।",
  },
  luteal: {
    phase: "luteal",
    phaseNameEn: "Luteal Phase (Soothe & Nourish)",
    phaseNameHi: "ल्यूटियल चरण (शांति और पोषण)",
    healingMealEn: "Roasted sweet potato chaat with pumpkin seeds, cinnamon, and warm haldi-ginger milk.",
    healingMealHi: "शकरकंद चाट, दालचीनी और रात को गर्म हल्दी-अदरक का दूध।",
    seedCyclingEn: "1 tbsp Sesame seeds + 1 tbsp Sunflower seeds (Progesterone support).",
    seedCyclingHi: "1 चम्मच तिल + 1 चम्मच सूरजमुखी के बीज (प्रोजेस्टेरोन संतुलन)।",
    hydrationMl: 2200,
    culinaryPrincipleEn: "Complex carbohydrates and magnesium-rich foods to stabilize blood glucose and soothe PMS.",
    culinaryPrincipleHi: "मैग्नीशियम और जटिल कार्ब्स युक्त आहार जो मूड को स्थिर रखे और मीठे की लालसा घटाए।",
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phaseParam = (searchParams.get("phase") || "menstrual").toLowerCase() as BiologicalPhase;

  const plan = NUTRITION_PLANS[phaseParam] || NUTRITION_PLANS.menstrual;

  return NextResponse.json({
    status: "success",
    phase: phaseParam,
    plan,
    desiRemedies: [
      {
        nameEn: "Ajwain-Jeera Warm Water",
        nameHi: "अजवाइन-जीरा गुनगुना पानी",
        benefitEn: "Relieves gas, abdominal bloating, and uterine muscle spasms.",
        benefitHi: "गैस, पेट फूलने और गर्भाशय की ऐंठन में अत्यंत लाभकारी।",
      },
      {
        nameEn: "A2 Ghee with Warm Milk",
        nameHi: "गुनगुने दूध में आधा चम्मच गाय का घी",
        benefitEn: "Balances Vata dosha, lubricates pelvic tissues, and eases bowel movements.",
        benefitHi: "वात दोष को शांत करता है और पाचन को सुगम बनाता है।",
      },
    ],
  });
}
