export interface PainLevelDetail {
  level: number;
  labelEn: string;
  labelHi: string;
  category: "mild" | "moderate" | "severe";
  accentColor: string; // Tailwind hex
  containerColor: string;
  textColor: string;
  clinicalDescriptionEn: string;
  clinicalDescriptionHi: string;
  homeRemedyEn: string;
  homeRemedyHi: string;
  isRedFlag: boolean;
}

export const PAIN_SCALE_DATA: Record<number, PainLevelDetail> = {
  0: {
    level: 0,
    labelEn: "No Pain",
    labelHi: "कोई दर्द नहीं",
    category: "mild",
    accentColor: "#44664d",
    containerColor: "#c5eccc",
    textColor: "#00210e",
    clinicalDescriptionEn: "Completely pain-free and comfortable. Normal physiological state.",
    clinicalDescriptionHi: "पूर्णतः सहज और दर्दमुक्त। सामान्य शारीरिक स्थिति।",
    homeRemedyEn: "Maintain regular hydration, balanced nutrition, and gentle movement.",
    homeRemedyHi: "नियमित जलपान, संतुलित भोजन और हल्का टहलना जारी रखें।",
    isRedFlag: false,
  },
  1: {
    level: 1,
    labelEn: "Very Mild",
    labelHi: "हल्की सुगबुगाहट",
    category: "mild",
    accentColor: "#44664d",
    containerColor: "#c5eccc",
    textColor: "#00210e",
    clinicalDescriptionEn: "Barely perceptible pelvic tingling or mild heaviness. Does not distract.",
    clinicalDescriptionHi: "पेट के निचले हिस्से में हल्का भारीपन। दैनिक कार्य सामान्य रूप से जारी।",
    homeRemedyEn: "Warm water sip, gentle pelvic breathing, warm clothing.",
    homeRemedyHi: "हल्का गुनगुना पानी पिएं, गहरी सांस लें और गर्माहट बनाए रखें।",
    isRedFlag: false,
  },
  2: {
    level: 2,
    labelEn: "Mild",
    labelHi: "सहनीय हल्का दर्द",
    category: "mild",
    accentColor: "#44664d",
    containerColor: "#c5eccc",
    textColor: "#00210e",
    clinicalDescriptionEn: "Minor cramping or lower back ache; easily ignored during daily activities.",
    clinicalDescriptionHi: "हल्की मरोड़ या पीठ का खिंचाव। कार्य आसानी से किए जा सकते हैं।",
    homeRemedyEn: "Ajwain-saunf warm infusion, hot water bag on lower abdomen for 15 minutes.",
    homeRemedyHi: "अजवाइन-सौंफ का गुनगुना पानी, 15 मिनट के लिए गर्म पानी की थैली से सिकाई।",
    isRedFlag: false,
  },
  3: {
    level: 3,
    labelEn: "Noticeable",
    labelHi: "स्पष्ट दर्द",
    category: "mild",
    accentColor: "#44664d",
    containerColor: "#c5eccc",
    textColor: "#00210e",
    clinicalDescriptionEn: "Noticeable pelvic contractions, but requires no interruption of normal routine.",
    clinicalDescriptionHi: "स्पष्ट गर्भाशयी संकुचन, लेकिन सामान्य दिनचर्या में बाधा नहीं डालता।",
    homeRemedyEn: "Cat-cow yoga stretch, child's pose (Balasana), warm herbal tea with jaggery.",
    homeRemedyHi: "मार्जरी आसन (Cat-Cow), बालासन में विश्राम, गुड़ वाली हर्बल चाय।",
    isRedFlag: false,
  },
  4: {
    level: 4,
    labelEn: "Moderate",
    labelHi: "मध्यम दर्द",
    category: "moderate",
    accentColor: "#724038",
    containerColor: "#ffdad4",
    textColor: "#350f0a",
    clinicalDescriptionEn: "Moderate cramps interfering with concentration; slows down work or study.",
    clinicalDescriptionHi: "मध्यम दर्द जो एकाग्रता को प्रभावित करता है। काम या पढ़ाई की गति धीमी होती है।",
    homeRemedyEn: "Ginger-cinnamon decoction, 20 minutes recumbent rest with elevated knees.",
    homeRemedyHi: "अदरक-दालचीनी का काढ़ा, घुटनों के नीचे तकिया लगाकर 20 मिनट का आराम।",
    isRedFlag: false,
  },
  5: {
    level: 5,
    labelEn: "Distracting",
    labelHi: "असहज दर्द",
    category: "moderate",
    accentColor: "#724038",
    containerColor: "#ffdad4",
    textColor: "#350f0a",
    clinicalDescriptionEn: "Continuous pelvic spasms, lower back tightness, mild nausea or fatigue.",
    clinicalDescriptionHi: "लगातार मरोड़, कमर में अकड़न, हल्का जी मिचलाना या सुस्ती।",
    homeRemedyEn: "Castor oil pack on lower belly, magnesium-rich seeds, slow diaphragmatic breathing.",
    homeRemedyHi: "पेट पर तिल या अरंडी के तेल की हल्की मालिश, मैग्नीशियम युक्त कद्दू के बीज।",
    isRedFlag: false,
  },
  6: {
    level: 6,
    labelEn: "Pronounced Spasms",
    labelHi: "तीव्र असहजता",
    category: "moderate",
    accentColor: "#724038",
    containerColor: "#ffdad4",
    textColor: "#350f0a",
    clinicalDescriptionEn: "Strong cramping requiring pauses from physical duties; limits social/work participation.",
    clinicalDescriptionHi: "तेज मरोड़ जिसके कारण काम से ब्रेक लेना पड़ता है। आराम की सख्त आवश्यकता।",
    homeRemedyEn: "Warm bath with Epsom salts, doctor-approved OTC analgesics (e.g. Mefenamic/Paracetamol).",
    homeRemedyHi: "गुनगुने पानी से स्नान, डॉक्टर द्वारा अनुशंसित दर्द निवारक दवा का सेवन।",
    isRedFlag: false,
  },
  7: {
    level: 7,
    labelEn: "Severe",
    labelHi: "गंभीर दर्द",
    category: "severe",
    accentColor: "#ba1a1a",
    containerColor: "#ffdad6",
    textColor: "#93000a",
    clinicalDescriptionEn: "Dominating pelvic pain preventing standing or walking comfortably. Sleep disrupted.",
    clinicalDescriptionHi: "गंभीर दर्द जिसके कारण खड़ा होना या चलना कठिन हो जाता है। नींद में बाधा।",
    homeRemedyEn: "Complete bed rest, hydration with electrolytes. Schedule medical consultation if recurring.",
    homeRemedyHi: "पूर्ण विश्राम, ओआरएस या इलेक्ट्रोलाइट्स युक्त जल। बार-बार होने पर डॉक्टर से जांच कराएं।",
    isRedFlag: true,
  },
  8: {
    level: 8,
    labelEn: "Very Intense",
    labelHi: "असहनीय दर्द",
    category: "severe",
    accentColor: "#ba1a1a",
    containerColor: "#ffdad6",
    textColor: "#93000a",
    clinicalDescriptionEn: "Intense debilitating pain; thinking is difficult. May experience nausea or chills.",
    clinicalDescriptionHi: "अत्यधिक तीव्र दर्द, सोचने या बात करने में कठिनाई। जी मिचलाना या कंपकंपी।",
    homeRemedyEn: "Consult a gynecologist to rule out Endometriosis, Adenomyosis, or ovarian cysts.",
    homeRemedyHi: "एंडोमेट्रियोसिस या सिस्ट की जांच हेतु स्त्री रोग विशेषज्ञ (Gynecologist) से मिलें।",
    isRedFlag: true,
  },
  9: {
    level: 9,
    labelEn: "Excruciating",
    labelHi: "अत्यधिक तीव्र दर्द",
    category: "severe",
    accentColor: "#ba1a1a",
    containerColor: "#ffdad6",
    textColor: "#93000a",
    clinicalDescriptionEn: "Excruciating spasms, risk of vomiting, dizziness, or fainting (vasovagal syncope).",
    clinicalDescriptionHi: "असहनीय ऐंठन, उल्टी का खतरा, चक्कर आना या बेहोशी की स्थिति।",
    homeRemedyEn: "Immediate clinical intervention recommended. Do not suffer in silence.",
    homeRemedyHi: "तुरंत नजदीकी डॉक्टर या क्लिनिक से संपर्क करें। दर्द को अनदेखा न करें।",
    isRedFlag: true,
  },
  10: {
    level: 10,
    labelEn: "Clinical Emergency",
    labelHi: "आपातकालीन स्थिति",
    category: "severe",
    accentColor: "#ba1a1a",
    containerColor: "#ffdad6",
    textColor: "#93000a",
    clinicalDescriptionEn: "Unbearable agony requiring emergency urgent care. Inability to communicate or stay conscious.",
    clinicalDescriptionHi: "अत्यधिक गंभीर आपातकाल। तुरंत निकटतम अस्पताल या इमरजेंसी रूम जाएं।",
    homeRemedyEn: "Emergency hospital evaluation. Screen for ectopic pregnancy, torsion, or acute pelvic rupture.",
    homeRemedyHi: "तुरंत अस्पताल जाएं। एक्टोपिक गर्भधारण या गंभीर पेल्विक जटिलता की तत्काल जांच आवश्यक।",
    isRedFlag: true,
  },
};

export function getPainLevelInfo(level: number): PainLevelDetail {
  const clamped = Math.max(0, Math.min(10, Math.round(level)));
  return PAIN_SCALE_DATA[clamped] || PAIN_SCALE_DATA[0];
}

export function getAllPainLevels(): PainLevelDetail[] {
  return Object.values(PAIN_SCALE_DATA);
}

export const CLINICAL_RED_FLAG_WARNING = {
  en: "Clinical Notice: Severe pelvic pain that resists standard analgesics, radiates down legs, causes fainting, or accompanies heavy bleeding (soaking a pad in under 1 hour) warrants an in-person gynecological ultrasound to evaluate for Endometriosis or Adenomyosis.",
  hi: "चिकित्सीय सूचना: असहनीय पेल्विक दर्द जो सामान्य दवाओं से ठीक न हो, पैरों तक फैले, चक्कर लाए या अत्यधिक रक्तस्राव (1 घंटे में पैड भीगना) हो, तो एंडोमेट्रियोसिस की जांच के लिए तुरंत डॉक्टर से अल्ट्रासाउंड कराएं।",
};
