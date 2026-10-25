"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCamouflage } from "@/context/CamouflageContext";

export function Header() {
  const pathname = usePathname();
  const { language, setLanguage, t, speakText, stopSpeaking, isSpeaking, supportedLanguages } = useLanguage();
  const { recordLogoTap, activateCamouflage } = useCamouflage();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // If on fullscreen voice or onboarding, we may keep header minimal
  const isOnboarding = pathname === "/onboarding";

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    // Contextual read aloud depending on current page
    let speechContent = "";
    if (pathname === "/") {
      speechContent =
        language === "hi"
          ? "सहेली होम डैशबोर्ड में आपका स्वागत है। आज आपकी माहवारी का सुरक्षित चरण और पोषण सुझाव यहाँ उपलब्ध हैं।"
          : "Welcome to Saheli Home Dashboard. View your cycle status, daily check-in, and phase nutrition here.";
    } else if (pathname === "/my-cycle") {
      speechContent =
        language === "hi"
          ? "माहवारी कैलेंडर और चक्र ट्रैकर। अपनी पिछली तिथियां देखें और डॉक्टर रिपोर्ट डाउनलोड करें।"
          : "My Cycle and menstrual calendar. Review your cycle regularity and export clinical summaries.";
    } else if (pathname === "/care") {
      speechContent =
        language === "hi"
          ? "पोषण और कल्याण केंद्र। अपने हार्मोनल चरण के अनुकूल घरेलू आहार और जलयोजन देखें।"
          : "Care and Nutrition sanctuary. Phase-aligned Indian meals, water tracker, and somatic relief.";
    } else if (pathname === "/chat") {
      speechContent =
        language === "hi"
          ? "सहेली एआई साथी। अपने प्रजनन स्वास्थ्य, पीसीओएस या लक्षणों के बारे में बेझिझक पूछें।"
          : "Ask Saheli companion. Inquire about reproductive health, menstrual symptoms, and clinical care.";
    } else if (pathname === "/learn" || pathname.startsWith("/learn/")) {
      speechContent =
        language === "hi"
          ? "सहेली स्वास्थ्य पुस्तकालय। पीसीओएस, एंडोमेट्रियोसिस और हार्मोनल स्वास्थ्य के प्रमाणित लेख।"
          : "Health Library. Evidence-based guides on PCOS, Endometriosis, and reproductive wellness.";
    } else {
      speechContent =
        language === "hi"
          ? "सहेली—आपकी संवेदनशील और सुरक्षित स्वास्थ्य साथी।"
          : "Saheli, your compassionate and private menstrual health companion.";
    }

    speakText(speechContent);
  };

  const desktopNavItems = [
    {
      href: "/",
      label: t("navDashboard"),
      icon: "home",
      exact: true,
    },
    {
      href: "/my-cycle",
      label: t("navCycle"),
      icon: "calendar_month",
      exact: false,
    },
    {
      href: "/care",
      label: t("navCare"),
      icon: "spa",
      exact: false,
    },
    {
      href: "/chat",
      label: t("navChat"),
      icon: "auto_awesome",
      exact: false,
      badge: "CarePath",
    },
    {
      href: "/learn",
      label: t("navLibrary"),
      icon: "menu_book",
      exact: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fff7fa]/90 backdrop-blur-md border-b border-outline-variant/30 transition-all">
      {/* Top Clinical Disclaimer Strip */}
      <div className="bg-surface-container-low px-4 py-1 text-center border-b border-outline-variant/20">
        <p className="text-[11px] font-sans text-on-surface-variant flex items-center justify-center gap-1.5 leading-tight">
          <span className="material-symbols-outlined text-[14px] text-tertiary">info</span>
          <span>{t("clinicalDisclaimer")}</span>
        </p>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Tap Counter for Camouflage */}
        <Link
          href="/"
          onClick={recordLogoTap}
          className="flex items-center gap-2.5 cursor-pointer select-none group flex-shrink-0"
          title="Triple-tap to disguise screen"
        >
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant/40 shadow-warm-sm group-active:scale-95 transition-transform flex-shrink-0">
            <Image
              src="/logo-icon.png"
              alt="Saheli Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl font-medium tracking-tight text-primary leading-none">
                Saheli
              </span>
              <span className="font-sans text-xs font-normal text-on-surface-variant">
                सहेली
              </span>
            </div>
            <span className="text-[10px] text-outline tracking-wider uppercase font-semibold">
              {isOnboarding ? "Setup" : "Care Sanctuary"}
            </span>
          </div>
        </Link>

        {/* Desktop Central Navigation Links */}
        {!isOnboarding && (
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-surface-container/60 p-1 rounded-full border border-outline-variant/30">
            {desktopNavItems.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "bg-primary text-white shadow-warm-sm"
                      : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Audio Read-Aloud Button */}
          <button
            onClick={handleReadAloud}
            aria-label="Read Page Aloud"
            className={`p-2 rounded-full transition-all ${
              isSpeaking
                ? "bg-primary text-white animate-pulse"
                : "bg-surface-container text-primary hover:bg-surface-container-high"
            }`}
            title={isSpeaking ? t("reading") : t("readAloud")}
          >
            <span className="material-symbols-outlined text-[20px] block">
              {isSpeaking ? "volume_up" : "volume_up"}
            </span>
          </button>

          {/* Multilingual Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                if (showTooltip) setShowTooltip(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-surface-container border border-outline-variant/40 hover:bg-surface-container-high transition-all text-on-surface"
              title="Change Language / भाषा बदलें"
              aria-label="Select Language"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">translate</span>
              <span className="font-sans font-medium">
                {supportedLanguages.find((l) => l.code === language)?.nativeName || "EN"}
              </span>
              <span className="material-symbols-outlined text-[14px] text-outline">
                {showLangMenu ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Language Dropdown Popover */}
            {showLangMenu && (
              <div className="absolute right-0 top-10 w-44 bg-surface rounded-2xl shadow-xl border border-outline-variant/30 py-1.5 z-50 animate-in fade-in zoom-in-95 font-sans">
                <div className="px-3 py-1 text-[10px] font-bold text-outline uppercase tracking-wider border-b border-outline-variant/20 mb-1">
                  Languages / भाषाएँ
                </div>
                {supportedLanguages.map((l) => {
                  const isSelected = language === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                        isSelected
                          ? "bg-primary-fixed/50 font-bold text-primary"
                          : "text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-medium">{l.nativeName}</span>
                        <span className="text-[10px] text-outline">({l.name})</span>
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          check
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Discretion / Camouflage Mode Button */}
          <button
            onClick={activateCamouflage}
            aria-label="Discreet Camouflage Mode"
            className="p-2 rounded-full bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
            title="Emergency Disguise (Calculator)"
          >
            <span className="material-symbols-outlined text-[20px] block">
              calculate
            </span>
          </button>

          {/* Profile & Privacy Settings Menu */}
          <div className="relative">
            <button
              onClick={() => setShowTooltip(!showTooltip)}
              aria-label="Profile and Privacy Controls"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">
                tune
              </span>
            </button>

            {/* Dropdown Popover */}
            {showTooltip && (
              <div className="absolute right-0 top-11 w-56 bg-surface rounded-2xl shadow-xl border border-outline-variant/30 py-2 z-50 animate-in fade-in zoom-in-95 font-sans">
                <div className="px-3.5 py-1.5 border-b border-outline-variant/20 mb-1">
                  <div className="text-xs font-serif font-semibold text-primary">
                    {t("controlsTitle")}
                  </div>
                  <div className="text-[10px] text-on-surface-variant">
                    {t("deviceSandbox")}
                  </div>
                </div>

                <Link
                  href="/reminders"
                  onClick={() => setShowTooltip(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    alarm
                  </span>
                  <span>
                    {t("remindersTitle")}
                  </span>
                </Link>

                <Link
                  href="/settings/privacy"
                  onClick={() => setShowTooltip(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    shield_lock
                  </span>
                  <span>
                    {t("privacyControl")}
                  </span>
                </Link>

                <div className="h-px bg-outline-variant/20 my-1" />

                <button
                  onClick={() => {
                    setShowTooltip(false);
                    activateCamouflage();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-tertiary hover:bg-surface-container transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    visibility_off
                  </span>
                  <span>
                    {t("emergencyMask")}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
