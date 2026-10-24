"use client";

import React from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { CamouflageProvider } from "@/context/CamouflageContext";
import { CycleProvider } from "@/context/CycleContext";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { VoiceFab } from "@/components/VoiceFab";
import { CamouflageCalculator } from "@/components/CamouflageCalculator";
import { PwaRegister } from "@/components/PwaRegister";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CamouflageProvider>
        <CycleProvider>
          <div className="min-h-screen bg-background text-on-surface flex flex-col relative selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
          {/* PWA offline registration */}
          <PwaRegister />

          {/* Fullscreen Emergency Camouflage Mask */}
          <CamouflageCalculator />

          {/* Top Fixed Header */}
          <Header />

          {/* Centered App Container */}
          <div className="flex-1 w-full max-w-md md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto flex flex-col relative pb-20 md:pb-10 px-3 sm:px-6 lg:px-8">
            {children}
          </div>

          {/* Voice Interaction FAB */}
          <VoiceFab />

          {/* Bottom 5-Tab Navigation Dock */}
          <BottomNav />
        </div>
        </CycleProvider>
      </CamouflageProvider>
    </LanguageProvider>
  );
}
