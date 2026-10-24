export type LanguagePreference = 'en' | 'hi' | 'hinglish';
export type CycleRhythm = 'standard' | 'irregular' | 'pcos' | 'education_only';
export type DietPreference = 'veg' | 'eggetarian' | 'nonveg' | 'vegan';
export type FlowIntensity = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
export type Mood = 'calm' | 'energized' | 'sensitive' | 'tired' | 'anxious';

export type BiologicalPhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface UserProfile {
  id: string;
  display_name: string;
  language_preference: LanguagePreference;
  cycle_rhythm_type: CycleRhythm;
  diet_preference: DietPreference;
  focus_areas: string[];
  is_anonymous: boolean;
  discreet_mode_enabled: boolean;
  biometric_shield_enabled: boolean;
  avg_cycle_length: number; // e.g. 28 days
  avg_period_duration: number; // e.g. 5 days
  last_period_date: string; // ISO date 'YYYY-MM-DD'
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface PeriodLog {
  id: string;
  start_date: string; // 'YYYY-MM-DD'
  end_date?: string | null; // 'YYYY-MM-DD'
  flow_intensity: FlowIntensity;
  cycle_length_days?: number | null;
  is_predicted: boolean;
  notes?: string | null;
  created_at: string;
}

export interface SymptomLog {
  id: string;
  log_date: string; // 'YYYY-MM-DD'
  pain_level: number; // 0 to 10
  symptoms: string[];
  mood?: Mood;
  flow_level?: 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
  water_ml?: number;
  reflection?: string | null;
  created_at: string;
}

export interface CyclePhaseInfo {
  phase: BiologicalPhase;
  phaseNameEn: string;
  phaseNameHi: string;
  dayInCycle: number;
  totalCycleDays: number;
  colorHex: string;
  containerColorHex: string;
  textColorHex: string;
  summaryEn: string;
  summaryHi: string;
  nutritionTipEn: string;
  nutritionTipHi: string;
}

export interface PredictionResult {
  nextPeriodStartDate: string; // 'YYYY-MM-DD'
  nextPeriodEndDate: string; // 'YYYY-MM-DD'
  estimatedOvulationDate: string; // 'YYYY-MM-DD'
  fertileWindowStart: string; // 'YYYY-MM-DD'
  fertileWindowEnd: string; // 'YYYY-MM-DD'
  uncertaintyDays: number; // +/- 2, 4, or 7 days
  daysUntilNextPeriod: number;
  isLate: boolean;
  daysLate: number;
}

export interface MedicationReminder {
  id: string;
  name: string;
  instructions: string;
  time: string; // e.g. "09:00 AM"
  category: 'supplement' | 'pain_relief' | 'hormonal' | 'general';
  activeDays?: string;
}

export interface ReminderPreferences {
  discreetMode: boolean;
  periodApproaching: boolean;
  periodApproachingDays: number;
  periodApproachingTime: string;
  pmsMoodAwareness: boolean;
  fertileWindow: boolean;
  delayedPeriodCheckin: boolean;
  warmInfusions: boolean;
  ironReminders: boolean;
  ironReminderTime: string;
  gentleMovement: boolean;
  dndEnabled: boolean;
  dndStartTime: string;
  dndEndTime: string;
  chimeStyle: 'temple_bell' | 'soft_chime' | 'vibrate_only';
  alertLanguage: 'en' | 'hi';
  medications: MedicationReminder[];
}
