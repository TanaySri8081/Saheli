"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export function VoiceFab() {
  const pathname = usePathname();
  const { language } = useLanguage();

  // Hide on screens that have their own voice interface, input keyboard, or onboarding
  if (
    pathname === "/voice" ||
    pathname === "/chat" ||
    pathname === "/onboarding"
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 md:right-8 z-30 pointer-events-auto">
      <Link
        href="/voice"
        className="flex items-center gap-2 pl-3.5 pr-4 py-2.5 rounded-full bg-primary text-white shadow-warm-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 group"
        aria-label="Open Voice Companion"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-container"></span>
        </span>
        <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">
          mic
        </span>
        <span className="text-xs font-semibold tracking-wide">
          {language === "hi" ? "बोलें / Speak" : "Speak / बोलें"}
        </span>
      </Link>
    </div>
  );
}
