"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { UserProfile, PeriodLog, SymptomLog, CyclePhaseInfo, PredictionResult } from "@/types";
import { storage, getDefaultProfile } from "@/lib/storage";
import {
  getCurrentCycleDay,
  getPhaseForCycleDay,
  predictCycle,
  calculateRollingAverageCycleLength,
  formatDate,
} from "@/lib/cycleMath";

interface CycleContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  periodLogs: PeriodLog[];
  logPeriod: (data: Omit<PeriodLog, "id" | "created_at">) => void;
  removePeriodLog: (id: string) => void;
  symptomLogs: SymptomLog[];
  logSymptom: (data: Omit<SymptomLog, "id" | "created_at">) => void;
  getSymptomForDate: (dateStr: string) => SymptomLog | null;
  currentCycleDay: number;
  currentPhaseInfo: CyclePhaseInfo;
  prediction: PredictionResult;
  rollingAvgLength: number;
  wipeAllData: () => void;
  exportDataJson: () => string;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

// Deterministic SSR reference date: 2026-10-24
const SSR_REFERENCE_DATE = new Date(2026, 9, 24);

export function CycleProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(getDefaultProfile());
  const [periodLogs, setPeriodLogs] = useState<PeriodLog[]>([]);
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([]);
  const [clientDate, setClientDate] = useState<Date>(SSR_REFERENCE_DATE);
  const [isClient, setIsClient] = useState(false);

  // Load from local storage and update current date upon client mount
  useEffect(() => {
    setIsClient(true);
    setClientDate(new Date());
    setProfile(storage.getUserProfile());
    setPeriodLogs(storage.getPeriodLogs());
    setSymptomLogs(storage.getSymptomLogs());
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    const updated = storage.saveUserProfile(updates);
    setProfile(updated);
  }, []);

  const logPeriod = useCallback((data: Omit<PeriodLog, "id" | "created_at">) => {
    const saved = storage.savePeriodLog(data);
    const updatedLogs = storage.getPeriodLogs();
    setPeriodLogs([...updatedLogs]);

    // Also update profile last_period_date if this is the newest start date
    const profileDate = new Date(profile.last_period_date);
    const newDate = new Date(saved.start_date);
    if (newDate >= profileDate) {
      updateProfile({ last_period_date: saved.start_date });
    }
  }, [profile.last_period_date, updateProfile]);

  const removePeriodLog = useCallback((id: string) => {
    storage.deletePeriodLog(id);
    setPeriodLogs([...storage.getPeriodLogs()]);
  }, []);

  const logSymptom = useCallback((data: Omit<SymptomLog, "id" | "created_at">) => {
    storage.saveSymptomLog(data);
    setSymptomLogs([...storage.getSymptomLogs()]);
  }, []);

  const getSymptomForDate = useCallback((dateStr: string) => {
    return storage.getSymptomLogForDate(dateStr);
  }, []);

  const wipeAllData = useCallback(() => {
    storage.wipeAllLocalData();
    setProfile(storage.getUserProfile());
    setPeriodLogs(storage.getPeriodLogs());
    setSymptomLogs(storage.getSymptomLogs());
  }, []);

  const exportDataJson = useCallback(() => {
    return storage.exportAllDataAsJson();
  }, []);

  // Compute calculated metrics
  const rollingAvgLength = useMemo(() => {
    return calculateRollingAverageCycleLength(periodLogs, profile.avg_cycle_length || 28);
  }, [periodLogs, profile.avg_cycle_length]);

  const currentCycleDay = useMemo(() => {
    const effectiveDate = isClient ? clientDate : SSR_REFERENCE_DATE;
    return getCurrentCycleDay(profile.last_period_date, effectiveDate);
  }, [profile.last_period_date, isClient, clientDate]);

  const currentPhaseInfo = useMemo(() => {
    return getPhaseForCycleDay(
      currentCycleDay,
      rollingAvgLength,
      profile.avg_period_duration || 5
    );
  }, [currentCycleDay, rollingAvgLength, profile.avg_period_duration]);

  const prediction = useMemo(() => {
    const effectiveDate = isClient ? clientDate : SSR_REFERENCE_DATE;
    return predictCycle(profile, periodLogs, effectiveDate);
  }, [profile, periodLogs, isClient, clientDate]);

  return (
    <CycleContext.Provider
      value={{
        profile,
        updateProfile,
        periodLogs,
        logPeriod,
        removePeriodLog,
        symptomLogs,
        logSymptom,
        getSymptomForDate,
        currentCycleDay,
        currentPhaseInfo,
        prediction,
        rollingAvgLength,
        wipeAllData,
        exportDataJson,
      }}
    >
      {children}
    </CycleContext.Provider>
  );
}

export function useCycle() {
  const context = useContext(CycleContext);
  if (!context) {
    throw new Error("useCycle must be used within a CycleProvider");
  }
  return context;
}
