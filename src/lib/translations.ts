export type Language = 'en' | 'hi';

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: TranslationDictionary = {
  // App Branding & Global
  appName: {
    en: "Saheli",
    hi: "सहेली",
  },
  tagline: {
    en: "Your Gentle Cycle & Health Companion",
    hi: "आपकी मासिक धर्म और स्वास्थ्य सहेली",
  },
  clinicalDisclaimer: {
    en: "Educational companion. Not medical diagnostic. Consult a doctor for severe pain.",
    hi: "शैक्षिक साथी। चिकित्सीय निदान नहीं। असहनीय दर्द में डॉक्टर से सलाह लें।",
  },
  emergencyMode: {
    en: "Camouflage Mode",
    hi: "सुरक्षित मोड",
  },
  speak: {
    en: "Speak",
    hi: "बोलें",
  },
  readAloud: {
    en: "Listen to Page",
    hi: "सुनें",
  },
  reading: {
    en: "Speaking...",
    hi: "सुना रहे हैं...",
  },

  // Navigation Tabs
  navHome: {
    en: "Home",
    hi: "होम",
  },
  navCycle: {
    en: "My Cycle",
    hi: "माहवारी",
  },
  navCare: {
    en: "Care",
    hi: "पोषण",
  },
  navChat: {
    en: "Ask Saheli",
    hi: "सहेली AI",
  },
  navLibrary: {
    en: "Library",
    hi: "ज्ञान",
  },

  // Camouflage Mask
  calcTitle: {
    en: "Calculator",
    hi: "कैलकुलेटर",
  },
  calcHint: {
    en: "Enter '777=' or hold AC to exit disguise",
    hi: "छिपे मोड से बाहर निकलने के लिए '777=' दबाएं या AC दबाए रखें",
  },

  // Common Actions
  save: {
    en: "Save",
    hi: "सहेजें",
  },
  saved: {
    en: "Saved successfully",
    hi: "सफलतापूर्वक सहेजा गया",
  },
  cancel: {
    en: "Cancel",
    hi: "रद्द करें",
  },
  next: {
    en: "Next",
    hi: "आगे",
  },
  back: {
    en: "Back",
    hi: "पीछे",
  },
  skip: {
    en: "Skip",
    hi: "छोड़ें",
  },
  viewDetails: {
    en: "View Details",
    hi: "विवरण देखें",
  },
};
