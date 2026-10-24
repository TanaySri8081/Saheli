# Saheli — Database Architecture & SQL Schema (Schema.md)

**Database Platform:** PostgreSQL 15+ (via Supabase)  
**Security Model:** Strict Row Level Security (RLS) per Table  
**Vector Extension:** `pgvector` for Medically Approved RAG Similarity Search  
**Document Version:** 1.0.0  
**Status:** Approved for Implementation  

---

## 1. Entity Relationship Diagram (ERD)

```
       ┌────────────────────────┐
       │     auth.users         │
       └───────────┬────────────┘
                   │ 1:1
                   ▼
       ┌────────────────────────┐
       │        profiles        │
       └───────────┬────────────┘
                   │
         ┌─────────┼──────────┬──────────┬──────────┬──────────┐
         │ 1:N     │ 1:N      │ 1:N      │ 1:N      │ 1:N      │ 1:N
         ▼         ▼          ▼          ▼          ▼          ▼
 ┌──────────┐┌──────────┐┌──────────┐┌─────────┐┌──────────┐┌─────────────┐
 │  period  ││ symptom  ││ consent  ││reminders││medication││user_        │
 │  _logs   ││  _logs   ││ _records ││         ││_schedules││summaries    │
 └──────────┘└──────────┘└──────────┘└─────────┘└──────────┘└─────────────┘

 [Public Educational Data]
 ┌────────────────────────┐
 │   education_articles   │ ◄── pgvector Cosine Embedding Search
 └────────────────────────┘
```

---

## 2. Complete PostgreSQL DDL Script

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- 1. PROFILES & PREFERENCES TABLE
-- ============================================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT DEFAULT 'Saheli',
    language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'hi', 'hinglish')),
    cycle_rhythm_type TEXT DEFAULT 'standard' CHECK (cycle_rhythm_type IN ('standard', 'irregular', 'pcos', 'education_only')),
    diet_preference TEXT DEFAULT 'veg' CHECK (diet_preference IN ('veg', 'eggetarian', 'nonveg', 'vegan')),
    focus_areas TEXT[] DEFAULT '{}',
    is_anonymous BOOLEAN DEFAULT false,
    discreet_mode_enabled BOOLEAN DEFAULT true,
    biometric_shield_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. PERIOD LOGS TABLE
-- ============================================================================
CREATE TABLE public.period_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    flow_intensity TEXT CHECK (flow_intensity IN ('spotting', 'light', 'medium', 'heavy')),
    cycle_length_days INT, -- Computed length from previous start_date
    is_predicted BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_period_logs_user_date ON public.period_logs(user_id, start_date DESC);

-- ============================================================================
-- 3. SYMPTOM LOGS TABLE
-- ============================================================================
CREATE TABLE public.symptom_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    pain_level INT NOT NULL CHECK (pain_level >= 0 AND pain_level <= 10),
    symptoms TEXT[] NOT NULL DEFAULT '{}',
    mood TEXT CHECK (mood IN ('calm', 'energized', 'sensitive', 'tired', 'anxious')),
    flow_level TEXT CHECK (flow_level IN ('none', 'spotting', 'light', 'medium', 'heavy')),
    encrypted_reflection TEXT, -- Client-side AES-GCM encrypted notes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_log_date UNIQUE (user_id, log_date)
);

CREATE INDEX idx_symptom_logs_user_date ON public.symptom_logs(user_id, log_date DESC);

-- ============================================================================
-- 4. CONSENT & PRIVACY AUDIT RECORDS
-- ============================================================================
CREATE TABLE public.consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    consent_version TEXT NOT NULL,
    data_storage_preference TEXT DEFAULT 'local_only' CHECK (data_storage_preference IN ('local_only', 'encrypted_cloud')),
    analytics_opt_in BOOLEAN DEFAULT false,
    research_opt_in BOOLEAN DEFAULT false,
    consented_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. REMINDERS & NOTIFICATION PREFERENCES TABLE
-- ============================================================================
CREATE TABLE public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reminder_type TEXT NOT NULL CHECK (reminder_type IN ('period_approaching', 'pms_awareness', 'fertile_window', 'delayed_checkin', 'desi_care', 'hydration', 'medication')),
    scheduled_time TIME NOT NULL DEFAULT '09:00:00',
    days_before INT DEFAULT 2,
    is_discreet BOOLEAN DEFAULT true,
    custom_label TEXT,
    tone_style TEXT DEFAULT 'temple_bell' CHECK (tone_style IN ('temple_bell', 'soft_chime', 'vibrate_only')),
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. MEDICATION & SUPPLEMENT SCHEDULES TABLE
-- ============================================================================
CREATE TABLE public.medication_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dosage TEXT,
    scheduled_time TIME NOT NULL,
    frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'cycle_days_1_2', 'post_meal')),
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. USER DOCTOR SUMMARIES (EXPORT CACHE)
-- ============================================================================
CREATE TABLE public.user_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    timeframe_start DATE NOT NULL,
    timeframe_end DATE NOT NULL,
    summary_data JSONB NOT NULL,
    access_pin_hash TEXT, -- Optional 6-digit pin for doctor link access
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. APPROVED MEDICAL ARTICLES & RAG EMBEDDINGS (PUBLIC READ)
-- ============================================================================
CREATE TABLE public.education_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('pcos', 'endometriosis', 'cycle_basics', 'nutrition', 'myths', 'adolescent')),
    title_en TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    summary_hi TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_hi TEXT NOT NULL,
    reviewed_by TEXT NOT NULL,
    guideline_source TEXT NOT NULL, -- e.g. 'FOGSI', 'ACOG', 'Monash'
    read_time_minutes INT DEFAULT 5,
    embedding VECTOR(768), -- pgvector embeddings for RAG retrieval
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_category ON public.education_articles(category);
-- Vector Cosine Distance Index (HNSW for fast similarity lookup)
CREATE INDEX idx_articles_embedding ON public.education_articles USING hnsw (embedding vector_cosine_ops);
```

---

## 3. Row Level Security (RLS) Policies

All user data tables restrict queries strictly to authenticated owners.

```sql
-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.period_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_articles ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read & update their own profile
CREATE POLICY "Users can manage own profile"
    ON public.profiles FOR ALL
    USING (auth.uid() = id);

-- Period Logs: Strict owner isolation
CREATE POLICY "Users can manage own period logs"
    ON public.period_logs FOR ALL
    USING (auth.uid() = user_id);

-- Symptom Logs: Strict owner isolation
CREATE POLICY "Users can manage own symptom logs"
    ON public.symptom_logs FOR ALL
    USING (auth.uid() = user_id);

-- Consent Records: Strict owner isolation
CREATE POLICY "Users can manage own consent records"
    ON public.consent_records FOR ALL
    USING (auth.uid() = user_id);

-- Reminders: Strict owner isolation
CREATE POLICY "Users can manage own reminders"
    ON public.reminders FOR ALL
    USING (auth.uid() = user_id);

-- Medication Schedules: Strict owner isolation
CREATE POLICY "Users can manage own medications"
    ON public.medication_schedules FOR ALL
    USING (auth.uid() = user_id);

-- User Summaries: Strict owner isolation
CREATE POLICY "Users can manage own summaries"
    ON public.user_summaries FOR ALL
    USING (auth.uid() = user_id);

-- Educational Articles: Public read access for all
CREATE POLICY "Anyone can read medical articles"
    ON public.education_articles FOR SELECT
    USING (true);
```

---

## 4. TypeScript Database Types

```typescript
export type LanguagePreference = 'en' | 'hi' | 'hinglish';
export type CycleRhythm = 'standard' | 'irregular' | 'pcos' | 'education_only';
export type DietPreference = 'veg' | 'eggetarian' | 'nonveg' | 'vegan';
export type FlowIntensity = 'spotting' | 'light' | 'medium' | 'heavy';
export type Mood = 'calm' | 'energized' | 'sensitive' | 'tired' | 'anxious';

export interface Profile {
  id: string;
  display_name: string;
  language_preference: LanguagePreference;
  cycle_rhythm_type: CycleRhythm;
  diet_preference: DietPreference;
  focus_areas: string[];
  is_anonymous: boolean;
  discreet_mode_enabled: boolean;
  biometric_shield_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface PeriodLog {
  id: string;
  user_id: string;
  start_date: string;
  end_date?: string | null;
  flow_intensity: FlowIntensity;
  cycle_length_days?: number | null;
  is_predicted: boolean;
  notes?: string | null;
  created_at: string;
}

export interface SymptomLog {
  id: string;
  user_id: string;
  log_date: string;
  pain_level: number;
  symptoms: string[];
  mood?: Mood;
  flow_level?: string;
  encrypted_reflection?: string | null;
  created_at: string;
}

export interface ReminderConfig {
  id: string;
  user_id: string;
  reminder_type: string;
  scheduled_time: string;
  days_before: number;
  is_discreet: boolean;
  custom_label?: string;
  tone_style: 'temple_bell' | 'soft_chime' | 'vibrate_only';
  enabled: boolean;
  created_at: string;
}

export interface EducationArticle {
  id: string;
  slug: string;
  category: string;
  title_en: string;
  title_hi: string;
  summary_en: string;
  summary_hi: string;
  content_en: string;
  content_hi: string;
  reviewed_by: string;
  guideline_source: string;
  read_time_minutes: number;
  created_at: string;
}
```
