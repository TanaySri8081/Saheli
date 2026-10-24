-- ============================================================================
-- SAHELI (सहेली) — POSTGRESQL PRODUCTION MIGRATION
-- Migration: 20261024000000_init_saheli_schema.sql
-- Platform: Supabase PostgreSQL 15+ with pgvector
-- Security: Strict Row Level Security (RLS) across all user tables
-- Compliance: India DPDP Act 2023 & Clinical Privacy Architecture
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- 1. PROFILES & USER PREFERENCES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT DEFAULT 'सहेली / Friend',
    language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'hi', 'hinglish')),
    cycle_rhythm_type TEXT DEFAULT 'standard' CHECK (cycle_rhythm_type IN ('standard', 'irregular', 'pcos', 'education_only')),
    diet_preference TEXT DEFAULT 'veg' CHECK (diet_preference IN ('veg', 'eggetarian', 'nonveg', 'vegan')),
    focus_areas TEXT[] DEFAULT ARRAY['cycle_awareness', 'nutrition', 'natural_relief'],
    is_anonymous BOOLEAN DEFAULT true,
    discreet_mode_enabled BOOLEAN DEFAULT true,
    biometric_shield_enabled BOOLEAN DEFAULT false,
    avg_cycle_length INT DEFAULT 28,
    avg_period_duration INT DEFAULT 5,
    last_period_date DATE,
    onboarding_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. PERIOD LOGS (CYCLE REPOSITORIES)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.period_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    flow_intensity TEXT CHECK (flow_intensity IN ('none', 'spotting', 'light', 'medium', 'heavy')),
    cycle_length_days INT,
    is_predicted BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_period_logs_user_date ON public.period_logs(user_id, start_date DESC);

-- ============================================================================
-- 3. SYMPTOM & PAIN LOGS (0-10 STEPPED CLINICAL SCALE)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.symptom_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    pain_level INT NOT NULL CHECK (pain_level >= 0 AND pain_level <= 10),
    symptoms TEXT[] NOT NULL DEFAULT '{}',
    mood TEXT CHECK (mood IN ('calm', 'energized', 'sensitive', 'tired', 'anxious')),
    flow_level TEXT CHECK (flow_level IN ('none', 'spotting', 'light', 'medium', 'heavy')),
    water_ml INT DEFAULT 1500,
    encrypted_reflection TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_log_date UNIQUE (user_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_symptom_logs_user_date ON public.symptom_logs(user_id, log_date DESC);

-- ============================================================================
-- 4. CONSENT & PRIVACY AUDIT RECORDS (INDIA DPDP ACT 2023)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    consent_version TEXT NOT NULL DEFAULT '2026.1',
    data_storage_preference TEXT DEFAULT 'local_only' CHECK (data_storage_preference IN ('local_only', 'encrypted_cloud')),
    analytics_opt_in BOOLEAN DEFAULT false,
    research_opt_in BOOLEAN DEFAULT false,
    consented_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. REMINDERS & NOTIFICATION PREFERENCES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reminder_type TEXT NOT NULL CHECK (reminder_type IN ('period_approaching', 'pms_awareness', 'fertile_window', 'delayed_checkin', 'desi_care', 'hydration', 'medication')),
    scheduled_time TIME NOT NULL DEFAULT '08:00:00',
    days_before INT DEFAULT 2,
    is_discreet BOOLEAN DEFAULT true,
    custom_label TEXT,
    tone_style TEXT DEFAULT 'temple_bell' CHECK (tone_style IN ('temple_bell', 'soft_chime', 'vibrate_only')),
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. MEDICATION & SUPPLEMENT SCHEDULES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.medication_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    instructions TEXT,
    scheduled_time TEXT NOT NULL DEFAULT '09:00 AM',
    category TEXT DEFAULT 'general' CHECK (category IN ('supplement', 'pain_relief', 'hormonal', 'general')),
    active_days TEXT DEFAULT 'Every morning',
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. DOCTOR CONSULTATION EXPORT SUMMARIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    timeframe_start DATE NOT NULL,
    timeframe_end DATE NOT NULL,
    summary_data JSONB NOT NULL,
    access_pin_hash TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. APPROVED MEDICAL ARTICLES & RAG EMBEDDINGS (PUBLIC READ)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.education_articles (
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
    embedding VECTOR(768),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_category ON public.education_articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_embedding ON public.education_articles USING hnsw (embedding vector_cosine_ops);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.period_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_articles ENABLE ROW LEVEL SECURITY;

-- Profiles: Users manage own record
CREATE POLICY "Users can manage own profile"
    ON public.profiles FOR ALL
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Period Logs: User owner isolation
CREATE POLICY "Users can manage own period logs"
    ON public.period_logs FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Symptom Logs: User owner isolation
CREATE POLICY "Users can manage own symptom logs"
    ON public.symptom_logs FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Consent Records: User owner isolation
CREATE POLICY "Users can manage own consent records"
    ON public.consent_records FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Reminders: User owner isolation
CREATE POLICY "Users can manage own reminders"
    ON public.reminders FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Medication Schedules: User owner isolation
CREATE POLICY "Users can manage own medication schedules"
    ON public.medication_schedules FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- User Summaries: User owner isolation
CREATE POLICY "Users can manage own summaries"
    ON public.user_summaries FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Education Articles: Public Read Access
CREATE POLICY "Anyone can view medical education articles"
    ON public.education_articles FOR SELECT
    TO anon, authenticated
    USING (true);
