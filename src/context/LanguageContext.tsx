"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Language, translations, SUPPORTED_LANGUAGES, LanguageMeta } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  supportedLanguages: LanguageMeta[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "saheli_language";
const VALID_LANGS: Language[] = ["en", "hi", "bn", "mr", "te", "ta", "gu"];

const LOCALE_MAP: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
  mr: "mr-IN",
  te: "te-IN",
  ta: "ta-IN",
  gu: "gu-IN",
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Initialize from localStorage or navigator
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved && VALID_LANGS.includes(saved)) {
        setLanguageState(saved);
      } else {
        // Detect preferred Indian language in browser
        const userLangs = navigator.languages || [navigator.language];
        for (const l of userLangs) {
          const lower = l.toLowerCase();
          if (lower.startsWith("hi")) { setLanguageState("hi"); break; }
          if (lower.startsWith("bn")) { setLanguageState("bn"); break; }
          if (lower.startsWith("mr")) { setLanguageState("mr"); break; }
          if (lower.startsWith("te")) { setLanguageState("te"); break; }
          if (lower.startsWith("ta")) { setLanguageState("ta"); break; }
          if (lower.startsWith("gu")) { setLanguageState("gu"); break; }
        }
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
    // Update html lang attribute
    document.documentElement.lang = lang;
  }, []);

  const toggleLanguage = useCallback(() => {
    // Cycles between English and Hindi as quick toggle
    setLanguage(language === "en" ? "hi" : "en");
  }, [language, setLanguage]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const entry = translations[key];
      if (entry) {
        if (entry[language]) {
          return entry[language] as string;
        }
        if (entry.en) {
          return entry.en;
        }
      }
      return fallback || key;
    },
    [language]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speakText = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }

      window.speechSynthesis.cancel();
      if (!text.trim()) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LOCALE_MAP[language] || "en-IN";
      utterance.rate = 0.95; // Gentle pace
      utterance.pitch = 1.0;

      // Try finding preferred voice
      const voices = window.speechSynthesis.getVoices();
      const targetPrefix = language === "en" ? "en" : language;
      const matchedVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith(targetPrefix)) ||
        voices.find((v) => v.lang.includes("IN"));

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        speakText,
        stopSpeaking,
        isSpeaking,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
