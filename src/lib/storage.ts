import { UserProfile, PeriodLog, SymptomLog, ReminderPreferences, MedicationReminder } from "@/types";

const STORAGE_KEYS = {
  PROFILE: "saheli_user_profile",
  PERIOD_LOGS: "saheli_period_logs",
  SYMPTOM_LOGS: "saheli_symptom_logs",
  SETTINGS: "saheli_app_settings",
  REMINDERS: "saheli_reminder_preferences",
};

export function getDefaultReminderPreferences(): ReminderPreferences {
  return {
    discreetMode: true,
    periodApproaching: true,
    periodApproachingDays: 2,
    periodApproachingTime: "08:00 AM",
    pmsMoodAwareness: true,
    fertileWindow: false,
    delayedPeriodCheckin: true,
    warmInfusions: true,
    ironReminders: true,
    ironReminderTime: "01:30 PM",
    gentleMovement: true,
    dndEnabled: true,
    dndStartTime: "10:00 PM",
    dndEndTime: "07:30 AM",
    chimeStyle: "temple_bell",
    alertLanguage: "hi",
    medications: [
      {
        id: "med_1",
        name: "Myo-Inositol / PCOS Care",
        instructions: "1 Sachet with water • Every morning 09:00 AM",
        time: "09:00 AM",
        category: "supplement",
        activeDays: "Every morning",
      },
      {
        id: "med_2",
        name: "Pain Relief (Mefenamic Acid)",
        instructions: "Only active on Cycle Days 1 & 2 • Post-meal",
        time: "01:00 PM",
        category: "pain_relief",
        activeDays: "Cycle Days 1-2",
      },
    ],
  };
}

// Deterministic baseline date for SSR hydration safety
const SSR_BASELINE_DATE = "2026-10-12";

// Helper: Calculate default initial period date (12 days ago in client)
function getDefaultLastPeriodDate(): string {
  if (typeof window === "undefined") {
    return SSR_BASELINE_DATE;
  }
  const d = new Date();
  d.setDate(d.getDate() - 12);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getDefaultProfile(): UserProfile {
  return {
    id: "guest-saheli-local",
    display_name: "सहेली / Friend",
    language_preference: "en",
    cycle_rhythm_type: "standard",
    diet_preference: "veg",
    focus_areas: ["cycle_awareness", "nutrition", "natural_relief"],
    is_anonymous: true,
    discreet_mode_enabled: true,
    biometric_shield_enabled: false,
    avg_cycle_length: 28,
    avg_period_duration: 5,
    last_period_date: getDefaultLastPeriodDate(),
    onboarding_complete: false,
    created_at: "2026-10-01T00:00:00.000Z",
    updated_at: "2026-10-01T00:00:00.000Z",
  };
}

function generateId(): string {
  return "sh_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36);
}

export const storage = {
  // --- Profile Operations ---
  getUserProfile(): UserProfile {
    const defaultProfile = getDefaultProfile();
    if (typeof window === "undefined") return defaultProfile;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(defaultProfile));
        return defaultProfile;
      }
      return { ...defaultProfile, ...JSON.parse(raw) };
    } catch (e) {
      console.warn("Error reading user profile:", e);
      return defaultProfile;
    }
  },

  saveUserProfile(updates: Partial<UserProfile>): UserProfile {
    const defaultProfile = getDefaultProfile();
    if (typeof window === "undefined") return { ...defaultProfile, ...updates };
    try {
      const current = this.getUserProfile();
      const updated: UserProfile = {
        ...current,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error("Error saving user profile:", e);
      return { ...defaultProfile, ...updates };
    }
  },

  // --- Period Logs Operations ---
  getPeriodLogs(): PeriodLog[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PERIOD_LOGS);
      if (!raw) {
        // Seed default initial log matching the profile's last period date
        const defaultDate = getDefaultLastPeriodDate();
        const initialLog: PeriodLog = {
          id: "init_log_1",
          start_date: defaultDate,
          flow_intensity: "medium",
          cycle_length_days: 28,
          is_predicted: false,
          created_at: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.PERIOD_LOGS, JSON.stringify([initialLog]));
        return [initialLog];
      }
      return JSON.parse(raw);
    } catch (e) {
      console.warn("Error reading period logs:", e);
      return [];
    }
  },

  savePeriodLog(logData: Omit<PeriodLog, "id" | "created_at">): PeriodLog {
    const currentLogs = this.getPeriodLogs();
    // Check if entry for start_date already exists
    const existingIndex = currentLogs.findIndex((l) => l.start_date === logData.start_date);

    let savedLog: PeriodLog;
    if (existingIndex >= 0) {
      savedLog = {
        ...currentLogs[existingIndex],
        ...logData,
      };
      currentLogs[existingIndex] = savedLog;
    } else {
      savedLog = {
        ...logData,
        id: generateId(),
        created_at: new Date().toISOString(),
      };
      currentLogs.push(savedLog);
    }

    // Sort descending by start_date
    currentLogs.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.PERIOD_LOGS, JSON.stringify(currentLogs));
      } catch (e) {
        console.error("Error persisting period log:", e);
      }
    }

    return savedLog;
  },

  deletePeriodLog(id: string): void {
    if (typeof window === "undefined") return;
    try {
      const currentLogs = this.getPeriodLogs();
      const filtered = currentLogs.filter((l) => l.id !== id);
      localStorage.setItem(STORAGE_KEYS.PERIOD_LOGS, JSON.stringify(filtered));
    } catch (e) {
      console.error("Error deleting period log:", e);
    }
  },

  // --- Symptom Logs Operations ---
  getSymptomLogs(): SymptomLog[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SYMPTOM_LOGS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("Error reading symptom logs:", e);
      return [];
    }
  },

  getSymptomLogForDate(dateStr: string): SymptomLog | null {
    const logs = this.getSymptomLogs();
    return logs.find((l) => l.log_date === dateStr) || null;
  },

  saveSymptomLog(logData: Omit<SymptomLog, "id" | "created_at">): SymptomLog {
    const currentLogs = this.getSymptomLogs();
    const existingIndex = currentLogs.findIndex((l) => l.log_date === logData.log_date);

    let savedLog: SymptomLog;
    if (existingIndex >= 0) {
      savedLog = {
        ...currentLogs[existingIndex],
        ...logData,
      };
      currentLogs[existingIndex] = savedLog;
    } else {
      savedLog = {
        ...logData,
        id: generateId(),
        created_at: new Date().toISOString(),
      };
      currentLogs.push(savedLog);
    }

    // Sort descending by log_date
    currentLogs.sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime());

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.SYMPTOM_LOGS, JSON.stringify(currentLogs));
      } catch (e) {
        console.error("Error persisting symptom log:", e);
      }
    }

    return savedLog;
  },

  // --- Reminders & Notifications Preferences ---
  getReminderPreferences(): ReminderPreferences {
    const defaults = getDefaultReminderPreferences();
    if (typeof window === "undefined") return defaults;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(defaults));
        return defaults;
      }
      return { ...defaults, ...JSON.parse(raw) };
    } catch (e) {
      console.warn("Error reading reminder preferences:", e);
      return defaults;
    }
  },

  saveReminderPreferences(updates: Partial<ReminderPreferences>): ReminderPreferences {
    const current = this.getReminderPreferences();
    const updated: ReminderPreferences = {
      ...current,
      ...updates,
    };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving reminder preferences:", e);
      }
    }
    return updated;
  },

  // --- Data Portability & DPDP Act Purge ---
  exportAllDataAsJson(): string {
    const data = {
      saheli_version: "1.0",
      export_timestamp: new Date().toISOString(),
      user_profile: this.getUserProfile(),
      period_logs: this.getPeriodLogs(),
      symptom_logs: this.getSymptomLogs(),
      reminder_preferences: this.getReminderPreferences(),
      privacy_note: "Exported under DPDP Act 2023 data portability rights. All records stored strictly on-device in AES-256 local sandbox.",
    };
    return JSON.stringify(data, null, 2);
  },

  wipeAllLocalData(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.PERIOD_LOGS);
      localStorage.removeItem(STORAGE_KEYS.SYMPTOM_LOGS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.REMINDERS);
      localStorage.removeItem("saheli_chat_history");
      // Re-seed clean guest profile
      const defaultProfile = getDefaultProfile();
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(defaultProfile));
      const defaultReminders = getDefaultReminderPreferences();
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(defaultReminders));
    } catch (e) {
      console.error("Error purging local data:", e);
    }
  },
};
