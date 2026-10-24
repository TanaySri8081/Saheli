export interface ClinicalResponse {
  answerEn: string;
  answerHi: string;
  citation: string;
  actionProtocolEn: string[];
  actionProtocolHi: string[];
  isEmergency: boolean;
  emergencyNoticeEn?: string;
  emergencyNoticeHi?: string;
}

interface KnowledgeTopic {
  keywords: string[];
  citation: string;
  answerEn: string;
  answerHi: string;
  protocolEn: string[];
  protocolHi: string[];
}

const KNOWLEDGE_BASE: KnowledgeTopic[] = [
  {
    keywords: ["cramp", "pain", "dard", "ache", "period pain", "dysmenorrhea", "marod", "aithan", "ऐंठन", "मरोड़", "दर्द"],
    citation: "FOGSI Good Clinical Practice: Dysmenorrhea Management",
    answerEn:
      "Menstrual cramps (primary dysmenorrhea) are caused by prostaglandins—natural hormone-like chemicals that prompt the uterine muscular wall to contract and shed its lining. While mild cramping is normal, intense pain that interferes with standing, school, or work requires clinical attention.",
    answerHi:
      "माहवारी में मरोड़ या दर्द प्रोस्टाग्लैंडीन (prostaglandins) नामक प्राकृतिक रसायनों के कारण होता है, जो गर्भाशय की मांसपेशियों को सिकुड़ने में मदद करते हैं। हल्की ऐंठन सामान्य है, लेकिन अगर दर्द असहनीय हो जाए तो यह एंडोमेट्रियोसिस का संकेत हो सकता है।",
    protocolEn: [
      "Apply hot water bottle or heat compress to lower abdomen for 15–20 minutes.",
      "Sip warm Ajwain-Saunf (carom & fennel) infusion with a small piece of jaggery.",
      "Practice restorative Balasana (Child's Pose) or gentle cat-cow pelvic stretches.",
      "Avoid excess caffeine which can constrict pelvic blood vessels.",
    ],
    protocolHi: [
      "15–20 मिनट के लिए पेट के निचले हिस्से पर गर्म पानी की थैली से सिकाई करें।",
      "अजवाइन और सौंफ का गुनगुना काढ़ा पिएं, जो प्राकृतिक एंटीस्पास्मोडिक का काम करता है।",
      "बालासन (Child's Pose) में लेटकर गहरी सांस लें जिससे पेल्विक मांसपेशियों को आराम मिले।",
      "चाय और कॉफी का अधिक सेवन कम करें, क्योंकि कैफीन रक्त वाहिकाओं को सिकोड़ता है।",
    ],
  },
  {
    keywords: ["pcos", "pcod", "irregular", "facial hair", "hirsutism", "acne", "poly", "सिस्ट", "पीसीओएस", "अनियमित"],
    citation: "International Evidence-Based Guideline for the Assessment & Management of PCOS",
    answerEn:
      "PCOS (Polycystic Ovary Syndrome) is an endocrine and metabolic condition characterized by delayed ovulation, elevated androgen markers, and immature ovarian follicles. It is not your fault and is highly responsive to balanced meal sequencing and stress management.",
    answerHi:
      "पीसीओएस (PCOS) एक हार्मोनल और मेटाबॉलिक स्थिति है जिसमें समय पर डिंब (egg) नहीं बनता। इसके मुख्य लक्षणों में अनियमित माहवारी, चेहरे पर अनचाहे बाल, मुंहासे और इंसुलिन असंतुलन शामिल हैं। संतुलित आहार और तनाव नियंत्रण से इसे आसानी से प्रबंधित किया जा सकता है।",
    protocolEn: [
      "Meal sequencing: Eat high-fiber sabzi/salad and protein (dal/paneer) before roti/rice.",
      "Sip 1 cup of spearmint (pudina) tea daily to support natural androgen balance.",
      "Incorporate gentle daily strength movement or 30-minute brisk walking.",
      "Consult your gynecologist for fasting insulin and LH:FSH hormone panel.",
    ],
    protocolHi: [
      "भोजन का क्रम: रोटी या चावल खाने से पहले सलाद और दाल खाएं ताकि शुगर स्पाइक न हो।",
      "दिन में 1 कप ताजी पुदीने की चाय पिएं, जो अतिरिक्त एंड्रोजन हार्मोन को कम करने में सहायक है।",
      "रोजाना 30 मिनट का तेज टहलना या हल्का व्यायाम करें।",
      "फास्टिंग इंसुलिन और हार्मोनल जांच के लिए स्त्री रोग विशेषज्ञ से परामर्श लें।",
    ],
  },
  {
    keywords: ["endo", "endometriosis", "deep pain", "severe pain", "radiat", "endometrial", "एंडोमेट्रियोसिस", "गंभीर"],
    citation: "ACOG Practice Bulletin #218: Management of Endometriosis",
    answerEn:
      "Endometriosis occurs when tissue similar to the uterine lining implants outside the uterus—on ovaries, fallopian tubes, or pelvic peritoneum. It causes chronic inflammation and severe pain that standard painkillers frequently fail to relieve.",
    answerHi:
      "एंडोमेट्रियोसिस में गर्भाशय के अंदर बनने वाले ऊतक जैसी परत गर्भाशय के बाहर (अंडाशय, फैलोपियन ट्यूब या पेल्विक अंगों पर) विकसित होने लगती है। यह तेज सूजन और गहरा दर्द पैदा करती है जो सामान्य दवाओं से शांत नहीं होता।",
    protocolEn: [
      "Track daily pain scores (0–10 scale) on Saheli across 2–3 cycles for objective data.",
      "Schedule an expert gynecological transvaginal ultrasound or pelvic MRI.",
      "Apply castor oil pack externally on lower belly for soothing anti-inflammatory warmth.",
      "Seek advice from a gynecologist specialized in pelvic pain and minimally invasive excision.",
    ],
    protocolHi: [
      "सहेली के 0-10 दर्द स्केल पर 2-3 महीनों का लगातार रिकॉर्ड रखें ताकि डॉक्टर को पैटर्न दिखे।",
      "विशेषज्ञ स्त्री रोग विशेषज्ञ से पेल्विक अल्ट्रासाउंड या एमआरआई की जांच कराएं।",
      "पेट के निचले हिस्से पर गर्म अरंडी के तेल की पट्टी से हल्की सिकाई करें।",
      "दर्द को 'सामान्य' समझकर सहन न करें; सही समय पर चिकित्सा विशेषज्ञ से मिलें।",
    ],
  },
  {
    keywords: ["heavy", "bleeding", "clot", "pad", "soak", "blood", "khun", "rakt", "थक्का", "रक्तस्राव", "भारी"],
    citation: "FOGSI Clinical Practice Guideline: Abnormal Uterine Bleeding",
    answerEn:
      "Heavy menstrual bleeding (menorrhagia) is defined clinically as soaking through a pad or tampon every 1–2 hours consecutively, or passing clots larger than a one-rupee coin. Bleeding lasting beyond 7–8 days should be evaluated to rule out fibroids, polyps, or thyroid imbalances.",
    answerHi:
      "अत्यधिक रक्तस्राव (Menorrhagia) उसे कहते हैं जब हर 1-2 घंटे में पैड पूरी तरह भीग जाए या ₹1 के सिक्के से बड़े खून के थक्के निकलें। यदि माहवारी 7-8 दिनों से अधिक समय तक लगातार चले तो फाइब्रॉएड या थायराइड की जांच जरूरी है।",
    protocolEn: [
      "Track number of pads changed per day and record in your Saheli symptom journal.",
      "Replenish lost iron with roasted chana and jaggery (gur) plus vitamin C (lemon).",
      "Rest horizontally with legs slightly elevated to relieve venous pressure.",
      "Consult a doctor if bleeding is accompanied by dizziness, pale skin, or weakness.",
    ],
    protocolHi: [
      "दिन भर में बदले गए पैड की संख्या सहेली डायरी में नोट करें।",
      "गुड़-चना और नींबू पानी का सेवन करें ताकि खोए हुए आयरन की तुरंत भरपाई हो सके।",
      "पैरों के नीचे तकिया लगाकर विश्राम करें जिससे पेल्विक दबाव कम हो।",
      "यदि चक्कर आ रहे हों या अत्यधिक कमजोरी महसूस हो, तो तुरंत डॉक्टर से मिलें।",
    ],
  },
  {
    keywords: ["ovulat", "fertile", "discharge", "mucus", "egg", "window", "अंडोत्सर्ग", "गर्भाधान", "स्राव"],
    citation: "ACOG Clinical Consensus: Ovulation Tracking & Bodily Biomarkers",
    answerEn:
      "Ovulation typically occurs around 14 days before your next expected period. As estrogen peaks, cervical mucus shifts to a clear, stretchy 'egg-white' consistency, and mild one-sided pelvic twinges (Mittelschmerz) may be felt.",
    answerHi:
      "अंडोत्सर्ग (Ovulation) आमतौर पर अगली संभावित माहवारी से लगभग 14 दिन पहले होता है। इस समय एस्ट्रोजन बढ़ने से सफेद स्राव (cervical mucus) कच्चे अंडे की सफेदी जैसा खिंचावदार और पारदर्शी हो जाता है। कुछ महिलाओं को पेट के एक तरफ हल्का खिंचाव महसूस हो सकता है।",
    protocolEn: [
      "Notice clear, stretchy cervical fluid indicating peak biological fertility window.",
      "Hydrate well with earthen pot (matka) water or fresh coconut water.",
      "Remember that digital apps provide statistical estimations, not absolute birth control.",
      "Nourish with antioxidant-rich foods like pomegranate, berries, and leafy greens.",
    ],
    protocolHi: [
      "पारदर्शी और खिंचावदार सफेद स्राव इस बात का संकेत है कि अंडाशय से डिंब मुक्त हो रहा है।",
      "मटके का पानी या नारियल पानी पिएं ताकि शरीर अंदर से हाइड्रेटेड रहे।",
      "ध्यान रखें: ऐप द्वारा दिए गए अनुमान संदर्भ के लिए हैं, इन्हें गर्भनिरोधक न समझें।",
      "अनार और हरी पत्तेदार सब्जियों जैसे एंटीऑक्सीडेंट आहार का सेवन करें।",
    ],
  },
  {
    keywords: ["delay", "late", "missed", "deri", "ruk", "chhuti", "रुका", "देरी", "छूटा"],
    citation: "ACOG Practice Bulletin #219: Evaluation of Amenorrhea",
    answerEn:
      "A period is considered clinically delayed if it is more than 7 days past your expected date. Common non-pregnancy triggers include acute emotional stress, illness, intense travel, sudden weight shifts, or thyroid/prolactin fluctuations.",
    answerHi:
      "यदि माहवारी अनुमानित तिथि से 7 दिन से अधिक देर हो जाए, तो इसे देरी माना जाता है। गर्भावस्था के अलावा इसके मुख्य कारणों में मानसिक तनाव, हालिया बीमारी, यात्रा, अचानक वजन में बदलाव या थायराइड असंतुलन शामिल हैं।",
    protocolEn: [
      "Review past 2-3 weeks for sleep disruptions, emotional strain, or medication changes.",
      "If sexually active, take a home pregnancy test using early morning first-void urine.",
      "Sip warm ginger-cinnamon tea and practice 10 minutes of slow diaphragmatic breathing.",
      "Consult your doctor if you miss 3 consecutive periods in a row.",
    ],
    protocolHi: [
      "पिछले 2-3 हफ्तों के तनाव, नींद या यात्रा के शेड्यूल पर गौर करें।",
      "यदि आप शारीरिक रूप से सक्रिय हैं, तो सुबह के पहले पेशाब से प्रेगनेंसी टेस्ट करें।",
      "अदरक-दालचीनी का गुनगुना काढ़ा पिएं और गहरी सांस लेने का अभ्यास करें।",
      "यदि लगातार 3 महीने माहवारी न आए, तो स्त्री रोग विशेषज्ञ से जांच अवश्य कराएं।",
    ],
  },
];

const EMERGENCY_KEYWORDS = [
  "fainting", "fainted", "blackout", "blacking out", "soaking 2 pads", "soaking through",
  "unbearable pain", "cannot walk", "vomiting blood", "severe hemorrhage", "high fever",
  "बेहोश", "चक्कर", "असहनीय दर्द", "अत्यधिक रक्तस्राव", "उल्टी", "चल नहीं पा",
];

export function queryClinicalRag(userQuery: string, currentLanguage: "en" | "hi" = "en"): ClinicalResponse {
  const queryLower = userQuery.toLowerCase();

  // 1. Check for Emergency Red Flags
  const isEmergency = EMERGENCY_KEYWORDS.some((kw) => queryLower.includes(kw));

  // 2. Match with Knowledge Base
  let bestMatch: KnowledgeTopic | null = null;
  let maxScore = 0;

  for (const topic of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (queryLower.includes(kw.toLowerCase())) {
        score += 2;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = topic;
    }
  }

  // 3. Fallback Response if no specific topic matched
  if (!bestMatch || maxScore === 0) {
    bestMatch = {
      keywords: [],
      citation: "FOGSI / ACOG Holistic Reproductive Guidelines",
      answerEn:
        "Every menstrual cycle is a vital sign reflecting your overall hormonal, metabolic, and emotional balance. Normal cycles naturally range between 21 to 35 days with 2 to 7 days of bleeding.",
      answerHi:
        "मासिक धर्म चक्र आपके समग्र हार्मोनल, शारीरिक और मानसिक स्वास्थ्य का एक महत्वपूर्ण आईना है। 21 से 35 दिनों के बीच का चक्र और 2 से 7 दिनों का रक्तस्राव चिकित्सकीय रूप से सामान्य माना जाता है।",
      protocolEn: [
        "Track pain intensity and symptoms regularly on your Saheli dashboard.",
        "Maintain gentle hydration using earthen pot water and herbal infusions.",
        "Prioritize 7-8 hours of sound sleep to support nightly gonadotropin rhythm.",
        "Consult an OB-GYN physician for persistent concerns or severe symptoms.",
      ],
      protocolHi: [
        "सहेली डैशबोर्ड पर अपने दर्द और लक्षणों को नियमित रूप से दर्ज करें।",
        "मटके का पानी और घरेलू हर्बल काढ़े से शरीर को हाइड्रेटेड रखें।",
        "हार्मोनल संतुलन के लिए 7-8 घंटे की गहरी नींद को प्राथमिकता दें।",
        "यदि कोई लक्षण लगातार परेशान करे, तो स्त्री रोग विशेषज्ञ से सलाह लें।",
      ],
    };
  }

  const emergencyNoticeEn = isEmergency
    ? "🚨 URGENT CLINICAL SAFEGUARD: The symptoms described (such as severe debilitating pain, fainting, or rapid pad saturation in under 1 hour) may indicate an acute complication like ovarian cyst rupture, torsion, or severe hemorrhage. Please seek immediate in-person emergency hospital care."
    : undefined;

  const emergencyNoticeHi = isEmergency
    ? "🚨 आपातकालीन चिकित्सकीय चेतावनी: आपके द्वारा बताए गए लक्षण (जैसे अत्यधिक तीव्र दर्द, बेहोशी या 1 घंटे में पैड भीगना) सिस्ट फटने या गंभीर रक्तस्राव का संकेत हो सकते हैं। कृपया बिना देर किए तुरंत निकटतम अस्पताल की इमरजेंसी में जाएं।"
    : undefined;

  return {
    answerEn: bestMatch.answerEn,
    answerHi: bestMatch.answerHi,
    citation: bestMatch.citation,
    actionProtocolEn: bestMatch.protocolEn,
    actionProtocolHi: bestMatch.protocolHi,
    isEmergency,
    emergencyNoticeEn,
    emergencyNoticeHi,
  };
}
