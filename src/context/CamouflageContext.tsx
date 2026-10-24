"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

interface CamouflageContextType {
  isCamouflaged: boolean;
  activateCamouflage: () => void;
  deactivateCamouflage: () => void;
  toggleCamouflage: () => void;
  recordLogoTap: () => void;
}

const CamouflageContext = createContext<CamouflageContextType | undefined>(undefined);

export function CamouflageProvider({ children }: { children: React.ReactNode }) {
  const [isCamouflaged, setIsCamouflaged] = useState<boolean>(false);
  const tapTimesRef = useRef<number[]>([]);

  const activateCamouflage = useCallback(() => {
    setIsCamouflaged(true);
  }, []);

  const deactivateCamouflage = useCallback(() => {
    setIsCamouflaged(false);
  }, []);

  const toggleCamouflage = useCallback(() => {
    setIsCamouflaged((prev) => !prev);
  }, []);

  // Triple-tap tracker on brand header
  const recordLogoTap = useCallback(() => {
    const now = Date.now();
    // Keep taps within last 1.2 seconds
    const recentTaps = [...tapTimesRef.current.filter((t) => now - t < 1200), now];
    tapTimesRef.current = recentTaps;

    if (recentTaps.length >= 3) {
      tapTimesRef.current = [];
      activateCamouflage();
    }
  }, [activateCamouflage]);

  // Shake detection via DeviceMotionEvent
  useEffect(() => {
    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;
    let lastTime = Date.now();
    const SHAKE_THRESHOLD = 22; // m/s² delta

    const handleMotion = (event: DeviceMotionEvent) => {
      const current = event.accelerationIncludingGravity;
      if (!current || current.x === null || current.y === null || current.z === null) return;

      const currentTime = Date.now();
      const diffTime = currentTime - lastTime;

      if (diffTime > 100) {
        if (lastX !== null && lastY !== null && lastZ !== null) {
          const deltaX = Math.abs(current.x - lastX);
          const deltaY = Math.abs(current.y - lastY);
          const deltaZ = Math.abs(current.z - lastZ);
          const speed = deltaX + deltaY + deltaZ;

          if (speed > SHAKE_THRESHOLD) {
            activateCamouflage();
          }
        }

        lastX = current.x;
        lastY = current.y;
        lastZ = current.z;
        lastTime = currentTime;
      }
    };

    if (typeof window !== "undefined" && "DeviceMotionEvent" in window) {
      window.addEventListener("devicemotion", handleMotion);
    }

    // Keyboard shortcut (Alt+C or double Escape)
    let lastEscTime = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "c" || e.key === "C")) {
        e.preventDefault();
        toggleCamouflage();
      } else if (e.key === "Escape") {
        const now = Date.now();
        if (now - lastEscTime < 500) {
          toggleCamouflage();
        }
        lastEscTime = now;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (typeof window !== "undefined" && "DeviceMotionEvent" in window) {
        window.removeEventListener("devicemotion", handleMotion);
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activateCamouflage, toggleCamouflage]);

  return (
    <CamouflageContext.Provider
      value={{
        isCamouflaged,
        activateCamouflage,
        deactivateCamouflage,
        toggleCamouflage,
        recordLogoTap,
      }}
    >
      {children}
    </CamouflageContext.Provider>
  );
}

export function useCamouflage() {
  const context = useContext(CamouflageContext);
  if (!context) {
    throw new Error("useCamouflage must be used within a CamouflageProvider");
  }
  return context;
}
