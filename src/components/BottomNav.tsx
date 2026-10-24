"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Hide bottom nav on full-screen onboarding or dedicated voice screen
  if (pathname === "/onboarding" || pathname === "/voice") {
    return null;
  }

  const navItems = [
    {
      href: "/",
      label: t("navHome"),
      icon: "home",
      isActive: pathname === "/",
    },
    {
      href: "/my-cycle",
      label: t("navCycle"),
      icon: "calendar_month",
      isActive: pathname.startsWith("/my-cycle"),
    },
    {
      href: "/care",
      label: t("navCare"),
      icon: "spa",
      isActive: pathname.startsWith("/care"),
    },
    {
      href: "/chat",
      label: t("navChat"),
      icon: "auto_awesome",
      isActive: pathname.startsWith("/chat"),
      isSpecial: true,
    },
    {
      href: "/learn",
      label: t("navLibrary"),
      icon: "menu_book",
      isActive: pathname.startsWith("/learn"),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fff7fa]/95 backdrop-blur-xl border-t border-outline-variant/30 shadow-lg safe-pb">
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const { href, label, icon, isActive, isSpecial } = item;

          if (isSpecial) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center -mt-3 group relative px-2"
                aria-label={label}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-warm-md ${
                    isActive
                      ? "bg-primary text-white scale-105"
                      : "bg-primary-container text-white hover:scale-105"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {icon}
                  </span>
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium tracking-tight transition-colors ${
                    isActive ? "text-primary font-bold" : "text-on-surface-variant"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all rounded-xl relative group ${
                isActive ? "text-primary font-semibold" : "text-outline hover:text-on-surface-variant"
              }`}
              aria-label={label}
            >
              <div
                className={`p-1 rounded-full transition-all ${
                  isActive ? "bg-primary-fixed/60 text-primary" : "group-hover:bg-surface-container"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[24px] transition-transform ${
                    isActive ? "scale-105" : ""
                  }`}
                >
                  {icon}
                </span>
              </div>
              <span
                className={`text-[11px] leading-tight transition-colors ${
                  isActive ? "text-primary font-bold" : "text-outline"
                }`}
              >
                {label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5 animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
