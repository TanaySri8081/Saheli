# Saheli — Step-by-Step Implementation Plan (ImplementationPlan.md)

This implementation plan outlines the engineering roadmap to build the **Saheli (सहेली)** full-stack Next.js progressive web application from the ground up, faithful to the Stitch design specifications (Project ID: `2276645037607231820`) and system architecture.

---

## Phase 1: Project Foundation & Design System Setup
- [x] **1.1 Initialize Next.js 14+ Project:**
  - Create Next.js project using App Router, TypeScript, and ESLint.
  - Configure `tsconfig.json` with strict typing and `@/*` alias pathing.
- [x] **1.2 Configure Tailwind CSS with Stitch Tokens:**
  - Inject all semantic color tokens (`primary: #482e47`, `primary-container: #60445f`, `secondary: #44664d`, `tertiary: #562a23`, `background: #fff7fa`, etc.).
  - Set up font family tokens (`headline-*`, `display-*` using **Newsreader**; `body-*`, `label-*`, `title-*` using **Plus Jakarta Sans**).
  - Configure border-radius and spacing scales matching Stitch `tailwind.config`.
- [x] **1.3 Typography & Static Assets Setup:**
  - Integrate Google Fonts (`Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400`, `Plus Jakarta Sans:wght@400..700`, `Material Symbols Outlined`).
  - Set up public SVGs (Saheli lotus brand mark, phase illustrations, audio waveforms).
- [x] **1.4 PWA Manifest & Service Worker Setup:**
  - Create `manifest.json` with standalone display mode and `#fff7fa` theme.
  - Setup offline caching rules for fonts, CSS, and static assets.

---

## Phase 2: Global Layout Shell, Navigation & Camouflage Mode
- [x] **2.1 Global App Shell Component (`layout.tsx`):**
  - Implement top fixed header with bilingual toggle `[ EN | हिंदी ]` and audio read-aloud button.
  - Implement fixed 5-tab bottom navigation dock (`Home`, `My Cycle`, `Care`, `Ask Saheli`, `Library`) with active-state styling and glassmorphism backdrop blur.
  - Implement floating action button (FAB) for instant voice access.
- [x] **2.2 Emergency Calculator Camouflage System (`useEmergencyCamouflage`):**
  - Create state hook to toggle instant calculator interface upon:
    - Triple-tapping header logo.
    - Device shake motion (via `devicemotion` API).
  - Build functional arithmetic calculator screen mask that hides all health UI.

---

## Phase 3: Client State, Local-First Engine & Calculation Math
- [x] **3.1 Local Storage & Offline Database Adapter:**
  - Implement `IndexedDB` / `localStorage` local-first storage adapter.
  - Handle Guest User initialization without requiring cloud login.
- [x] **3.2 Mathematical Cycle Estimation Engine (`cycleMath.ts`):**
  - Implement transparent rolling average algorithm based on past recorded dates.
  - Compute visible uncertainty intervals ($\pm 2$ to $\pm 4$ days).
  - Compute biological phases: Menstrual (Days 1–5), Follicular (Days 6–13), Ovulatory (Days 14–16), Luteal (Days 17–28).
- [x] **3.3 Stepped Pain Scale Engine (`painScale.ts`):**
  - Clinical definitions mapping levels 0–10 to descriptive advice, somatic care, and triage flags.

---

## Phase 4: Core Flow Screens Implementation
- [x] **4.1 Onboarding & Setup (`/onboarding`):**
  - 3-step setup form with skip capability.
  - Language selection, cycle rhythm options, optional last period date picker, and Indian dietary preferences.
  - High-trust privacy sanctuary card with plain-language DPDP Act commitment.
- [x] **4.2 Home Dashboard (`/`):**
  - Personalized greeting with bilingual audio daily summary.
  - SVG Circular Cycle Ring with phase colors and countdown card.
  - Daily check-in module (mood chips, physical symptom toggles, stepped pain buttons, and save toast).
  - Quick "Ask Saheli" prompt bar.
  - Follicular nutrition spotlight card (Palak dal recipe) & self-care ritual.
  - PCOS and Endometriosis guide preview cards.
- [x] **4.3 My Cycle & Calendar (`/my-cycle`):**
  - Interactive monthly calendar grid with recorded flow, predicted window, and fertile tags.
  - Selected day detail sheet with symptom notes and entry editing.
  - Cycle regularity metrics (3-month variance, average length).
  - Gynecologist visit report export CTA.
- [x] **4.4 Symptom Journal & Logger (`/symptoms`):**
  - Categorized multi-select chips (Physical, Sleep, Mood, Flow).
  - Stepped 0–10 pain slider with dynamic color and clinical guidance.
  - Voice-to-text dictation using browser SpeechRecognition for Hindi and English.
  - Longitudinal pain history sparkline.

---

## Phase 5: Nutrition, Conditions & Clinical Export
- [x] **5.1 Care & Nutrition Module (`/care`):**
  - Segmented tabs: Food & Nutrition, Self-Care, Hygiene & Myths, Seek Help.
  - Indian healing meals with budget tags (Khichdi, Gur-Chana, Dahi-Flaxseed).
  - Interactive Matka water intake tracker with ajwain/jeera herbal tips.
  - Somatic exercises (*Abhyanga*, *Supta Baddha Konasana*).
  - Red flag clinical alert panel.
- [x] **5.2 Health Library (`/learn`):**
  - Search input with spoken Hindi/English voice search.
  - Category pill carousel (Foundations, PCOS, Endo, Myths, Youth).
  - Spotlight editorial card and curated guide list.
  - Doctor consultation question toolkit.
- [x] **5.3 Condition Deep-Dives:**
  - Build `/learn/pcos`: Rotterdam criteria, bodily signs, myth vs. fact cards, and interactive doctor question checklist.
  - Build `/learn/endometriosis`: Pain validation, diagnostic roadmap, emergency warning signs, and checklist with WhatsApp export.
- [x] **5.4 Doctor Clinical Report PDF Generator (`reportGenerator.ts` / `DoctorSummaryModal.tsx`):**
  - Generate clean, printable PDF containing 3–6 month cycle statistics, pain frequency charts, and doctor discussion points.

---

## Phase 6: AI Companion & Voice Interaction Module
- [x] **6.1 Saheli AI Chat Interface (`/chat`):**
  - Grounded RAG conversational stream.
  - FOGSI/ACOG guideline citation badges.
  - Audio playback button for synthesized voice response.
  - Automatic emergency triage detection and warning box.
- [x] **6.2 Fullscreen Voice Sanctuary (`/voice`):**
  - Dynamic multi-frequency sound waveform visualizer.
  - Live bilingual transcription and instant translation preview.
  - Active call timer, tap-to-pause center mic button, and cancel/submit actions.
- [x] **6.3 Web Speech API Integration (`speechService.ts`):**
  - Implement browser-native SpeechRecognition (STT) and SpeechSynthesis (TTS) supporting `en-IN` and `hi-IN` voices with zero cloud audio transmission.

---

## Phase 7: Reminders & Privacy Controls
- [x] **7.1 Discreet Reminders Screen (`/reminders`):**
  - Private Lock Screen Mode with live interactive camouflage preview.
  - Configurable alerts for approaching period, PMS, delayed check-in, herbal tea nudges, and medications.
  - Quiet hours (Do Not Disturb) and tone selection.
- [x] **7.2 Privacy & Data Control Settings (`/settings/privacy`):**
  - Local-first vs. encrypted cloud toggle.
  - Biometric screen lock toggle.
  - Export consultation packet in PDF, JSON, or CSV with 6-digit PIN.
  - Nuclear reset action (permanent wipe of all health records).

---

## Phase 8: Supabase Backend & Production Validation
- [x] **8.1 Supabase Schema & RLS Policies Deployment:**
  - PostgreSQL schema and migrations in `supabase/migrations/20261024000000_init_saheli_schema.sql` (`profiles`, `period_logs`, `symptom_logs`, `consent_records`, `reminders`, `medication_schedules`, `education_articles` with `pgvector`).
  - Strict Row Level Security policy isolation with `auth.uid() = user_id`.
- [x] **8.2 API Route Handlers Implementation:**
  - Implemented `/api/cycle/log`, `/api/cycle/estimate`, `/api/symptoms`, `/api/chat`, `/api/education/search`, `/api/care/nutrition`, `/api/reminders`, `/api/account/data`.
- [x] **8.3 Medical Guidelines Ingestion for RAG:**
  - Seeded vetted FOGSI, ACOG, and Monash guidelines in `src/data/clinicalGuidelines.json` and grounded RAG in `src/lib/clinicalRag.ts`.
- [x] **8.4 Verification & Audits:**
  - Completed cross-device responsive testing (Mobile 390px, Tablet 768px, Desktop 1024px+).
  - Validated 100% offline functionality for tracking, calendar, and nutrition with pre-cached PWA Service Worker.
  - Verified WCAG AA/AAA contrast and accessibility across all interactive controls.
