export type Language = 'en' | 'hi' | 'bn' | 'mr' | 'te' | 'ta' | 'gu';

export interface LanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
  speechLocale: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', speechLocale: 'en-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', speechLocale: 'hi-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechLocale: 'bn-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechLocale: 'mr-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechLocale: 'te-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechLocale: 'ta-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechLocale: 'gu-IN' },
];

export interface TranslationDictionary {
  [key: string]: Partial<Record<Language, string>> & {
    en: string;
    hi: string;
  };
}

export const translations: TranslationDictionary = {
  // App Branding & Global
  appName: {
    en: "Saheli",
    hi: "सहेली",
    bn: "সাহেলি",
    mr: "सहेली",
    te: "సహేలి",
    ta: "சஹேலி",
    gu: "સહેલી",
  },
  tagline: {
    en: "Your Gentle Cycle & Health Companion",
    hi: "आपकी मासिक धर्म और स्वास्थ्य सहेली",
    bn: "আপনার মাসিক স্বাস্থ্য ও সুস্থতা সঙ্গী",
    mr: "तुमची मासिक पाळी आणि आरोग्य सखी",
    te: "మీ రుతుస్రావ చక్రం మరియు ఆరోగ్య నేస్తం",
    ta: "உங்கள் மாதவிடாய் மற்றும் நல்வாழ்வு தோழி",
    gu: "તમારી માસિક ધર્મ અને આરોગ્ય સાથી",
  },
  clinicalDisclaimer: {
    en: "Educational companion. Not medical diagnostic. Consult a doctor for severe pain.",
    hi: "शैक्षिक साथी। चिकित्सीय निदान नहीं। असहनीय दर्द में डॉक्टर से सलाह लें।",
    bn: "শিক্ষামূলক সঙ্গী। চিকিৎসাগত রোগনির্ণয় নয়। তীব্র ব্যথায় ডাক্তারের পরামর্শ নিন।",
    mr: "शैक्षणिक मार्गदर्शक। वैद्यकीय निदान नाही। तीव्र वेदनेसाठी डॉक्टरांचा सल्ला घ्या।",
    te: "విద్యా సంబంధిత సహచరి. వైద్య నిర్ధారణ కాదు. తీవ్రమైన నొప్పికి వైద్యుడిని సంప్రదించండి.",
    ta: "கல்வி வழிகாட்டி. மருத்துவக் கணிப்பு அல்ல. கடுமையான வலிக்கு மருத்துவரை அணுகவும்.",
    gu: "શૈક્ષણિક માર્ગદર્શક. તબીબી નિદાન નથી. અસહ્ય પીડા માટે ડૉક્ટરની સલાહ લો.",
  },
  emergencyMode: {
    en: "Camouflage Mode",
    hi: "सुरक्षित मोड",
    bn: "গোপন মোড",
    mr: "छुप्या मोड",
    te: "గోప్యతా మోడ్",
    ta: "மறைமுகப் பயன்முறை",
    gu: "ગુપ્ત મોડ",
  },
  speak: {
    en: "Speak",
    hi: "बोलें",
    bn: "বলুন",
    mr: "बोला",
    te: "మాట్లాడండి",
    ta: "பேசுங்கள்",
    gu: "બોલો",
  },
  readAloud: {
    en: "Listen to Page",
    hi: "सुनें",
    bn: "শুনুন",
    mr: "ऐका",
    te: "వినండి",
    ta: "கேளுங்கள்",
    gu: "સાંભળો",
  },
  reading: {
    en: "Speaking...",
    hi: "सुना रहे हैं...",
    bn: "পাঠ করা হচ্ছে...",
    mr: "वाचत आहे...",
    te: "చదువుతోంది...",
    ta: "பேசுகிறது...",
    gu: "બોલી રહ્યા છીએ...",
  },

  // Navigation Tabs
  navHome: {
    en: "Home",
    hi: "होम",
    bn: "হোম",
    mr: "मुख्यपृष्ठ",
    te: "హోమ్",
    ta: "முகப்பு",
    gu: "હોમ",
  },
  navCycle: {
    en: "My Cycle",
    hi: "माहवारी",
    bn: "মাসিক চক্র",
    mr: "मासिक पाळी",
    te: "నా చక్రం",
    ta: "என் சுழற்சி",
    gu: "મારું ચક્ર",
  },
  navCare: {
    en: "Care & Nutrition",
    hi: "पोषण व राहत",
    bn: "যত্ন ও পুষ্টি",
    mr: "काळजी व पोषण",
    te: "సంరక్షణ & పోషణ",
    ta: "கவனிப்பு & ஊட்டச்சத்து",
    gu: "સંભાળ અને પોષણ",
  },
  navChat: {
    en: "Ask Saheli",
    hi: "सहेली AI",
    bn: "সাহেলি AI",
    mr: "सहेली AI",
    te: "సహేలి AI",
    ta: "சஹேலி AI",
    gu: "સહેલી AI",
  },
  navLibrary: {
    en: "Library",
    hi: "ज्ञान भंडार",
    bn: "স্বাস্থ্য পাঠাগার",
    mr: "ज्ञानकोश",
    te: "లైబ్రరీ",
    ta: "நூலகம்",
    gu: "પુસ્તકાલય",
  },

  // Camouflage Mask
  calcTitle: {
    en: "Calculator",
    hi: "कैलकुलेटर",
    bn: "ক্যালকুলেটর",
    mr: "कॅल्क्युलेटर",
    te: "కాలిక్యులేటర్",
    ta: "கால்குலேட்டர்",
    gu: "કેલ્ક્યુલેટર",
  },
  calcHint: {
    en: "Enter '777=' or hold AC to exit disguise",
    hi: "छिपे मोड से बाहर निकलने के लिए '777=' दबाएं या AC दबाए रखें",
    bn: "গোপন মোড থেকে প্রস্থান করতে '777=' চাপুন বা AC চেপে রাখুন",
    mr: "छुप्या मोडमधून बाहेर पडण्यासाठी '777=' दाबा किंवा AC दाबून ठेवा",
    te: "గోప్యతా మోడ్ నుండి నిష్క్రమించడానికి '777=' నొక్కండి లేదా AC పట్టుకోండి",
    ta: "மறைமுகப் பயன்முறையிலிருந்து வெளியேற '777=' அழுத்தவும் அல்லது AC-ஐ அழுத்தவும்",
    gu: "ગુપ્ત મોડમાંથી બહાર નીકળવા માટે '777=' દબાવો અથવા AC પકડી રાખો",
  },

  // Common Actions
  save: {
    en: "Save",
    hi: "सहेजें",
    bn: "সংরক্ষণ করুন",
    mr: "जतन करा",
    te: "సేవ్ చేయండి",
    ta: "சேமி",
    gu: "સાચવો",
  },
  saved: {
    en: "Saved successfully",
    hi: "सफलतापूर्वक सहेजा गया",
    bn: "সফলভাবে সংরক্ষিত হয়েছে",
    mr: "यशस्वीरित्या जतन झाले",
    te: "విజయవంతంగా సేవ్ చేయబడింది",
    ta: "வெற்றிகரமாக சேமிக்கப்பட்டது",
    gu: "સફળતાપૂર્વક સાચવવામાં આવ્યું",
  },
  cancel: {
    en: "Cancel",
    hi: "रद्द करें",
    bn: "বাতিল",
    mr: "रद्द करा",
    te: "రద్దు చేయండి",
    ta: "ரத்துசெய்",
    gu: "રદ કરો",
  },
  next: {
    en: "Next",
    hi: "आगे",
    bn: "পরবর্তী",
    mr: "पुढे",
    te: "తదుపరి",
    ta: "அடுத்து",
    gu: "આગળ",
  },
  back: {
    en: "Back",
    hi: "पीछे",
    bn: "পেছনে",
    mr: "मागे",
    te: "వెనుకకు",
    ta: "பின்",
    gu: "પાછળ",
  },
  skip: {
    en: "Skip",
    hi: "छोड़ें",
    bn: "এড়িয়ে যান",
    mr: "वगळा",
    te: "దాటవేయి",
    ta: "தவிர்",
    gu: "છોડો",
  },
  viewDetails: {
    en: "View Details",
    hi: "विवरण देखें",
    bn: "বিস্তারিত দেখুন",
    mr: "तपशील पहा",
    te: "వివరాలు చూడండి",
    ta: "விவரங்களைக் காண்க",
    gu: "વિગત જુઓ",
  },
  languageSelector: {
    en: "Language",
    hi: "भाषा",
    bn: "ভাষা",
    mr: "भाषा",
    te: "భాష",
    ta: "மொழி",
    gu: "ભાષા",
  },
};
