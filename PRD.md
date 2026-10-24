# Saheli — Product Requirement Document (PRD)

**Project Name:** Saheli (सहेली)  
**Tagline:** A Free-First, Privacy-First Menstrual Health Companion for Education, Cycle Awareness, Nutrition & Care Navigation  
**Target Audience:** Students, adolescent girls, and young adults (primarily in India), with an emphasis on low-bandwidth accessibility, shared-family phone privacy, and bilingual comfort (English + Hindi).  
**Stitch Project ID:** `2276645037607231820`  
**Document Version:** 1.0.0  
**Status:** Approved for Implementation  

---

## 1. Executive Summary & Problem Statement

### 1.1 The Problem
- **Taboo and Stigma:** Menstruation remains a heavily stigmatized topic across millions of households in India. Young women often experience fear, shame, and isolation upon menarche.
- **Predatory Data Harvesting:** Mainstream cycle tracking apps commercially harvest, monetize, or expose intimate reproductive data, creating severe privacy risks in conservative or shared-household contexts.
- **Clinical Gaslighting & Delay:** Conditions like PCOS (affecting ~1 in 5 Indian women) and Endometriosis (average diagnostic delay of 7–10 years) are frequently dismissed as "normal cramps" or personal weakness.
- **Western Diet Disconnect:** Most wellness apps promote expensive western supplements and diets (e.g., avocado, acai, organic berries) that are culturally foreign and unaffordable to typical Indian college students or families.
- **Digital Literacy & Language Barriers:** Complex English medical portals fail young learners who think in Hindi, Hinglish, or prefer auditory/spoken learning.

### 1.2 The Solution
**Saheli (सहेली)** is a free, privacy-first, and culturally authentic menstrual health progressive web application (PWA). It provides:
1. **Mathematical, Transparent Cycle Estimates** with visible uncertainty ranges (no pseudo-scientific black-box algorithms).
2. **Comprehensive Symptom & Pain Journaling** using standard clinical stepped scales (0–10) and multi-domain tagging.
3. **Cited Educational AI & Audio Sanctuary (RAG)** grounded strictly in FOGSI and ACOG guidelines, with strict non-diagnostic bounds.
4. **Culturally Authentic Indian Nutrition & Care** featuring accessible pantry remedies (*ghar ke nuskhe*, palak dal, khichdi, gur-chana, soaked methi).
5. **Shared-Phone Privacy Architecture** featuring local on-device encryption, lock screen notification disguises, and an emergency calculator camouflage mode.
6. **Doctor-Ready Clinical Summaries** for self-advocacy during hurried hospital visits.

---

## 2. Core Personas

### Persona 1: Ananya (17, 1st Year College Student, Tier-2 City)
- **Context:** Experiences severe dysmenorrhea on Day 1. Lives with family and shares a household tablet or budget Android phone with siblings.
- **Pain Points:** Worried her parents will see period tracking notifications on the lock screen. Embarrassed to ask questions aloud.
- **Saheli Value:** Disguised lock-screen notifications ("Drink warm water"), anonymous guest mode, bilingual voice companion, and evidence that severe cramps deserve medical evaluation.

### Persona 2: Priya (22, Working Graduate, Managing PCOS)
- **Context:** Has irregular cycles (35–50 days) and frustrating hormonal acne. Overwhelmed by contradictory internet advice demanding zero carbs and extreme workouts.
- **Pain Points:** Standard calendar apps predict periods inaccurately and give panic-inducing pregnancy alerts.
- **Saheli Value:** Irregular/PCOS mode that switches priority from date predictions to metabolic symptom tracking, low-glycemic Indian meal pairing, and a checklist of questions for her gynecologist.

---

## 3. Guiding Product Principles

1. **Free-First & Forever:** No paywalls, no subscriptions, no premium tier locking away reproductive dignity.
2. **Privacy as a Human Right:** No ad networks, no tracking pixels, no selling of intimate logs. Compliant with the India Digital Personal Data Protection (DPDP) Act 2023.
3. **Evidence-Based & Non-Diagnostic:** Saheli is a companion, never a medical doctor. Content is curated with FOGSI (Federation of Obstetric and Gynaecological Societies of India) and ACOG (American College of Obstetricians and Gynecologists) standards. Always flags urgent red flags for clinical triage.
4. **Works With or Without AI:** Core calendar calculations, symptom tracking, nutrition guides, and library articles function completely offline without calling an LLM.
5. **Dignified Editorial Aesthetics:** An empathetic visual haven utilizing warm plum, botanical sage, soft terracotta, and literary typography (Newsreader + Plus Jakarta Sans).

---

## 4. Feature Specifications by Module

### 4.1 Onboarding & Consent Module
- **Explicit Consent Notice:** Plain-language declaration of what data is collected, why, and how it is stored.
- **Zero-Barrier Entry:** Option to continue as an "Anonymous Guest" (persisting data in local browser storage) or sign in.
- **Preference Capture:** 
  - Preferred display name (optional nickname, e.g. "Priya").
  - Primary language (`English`, `हिंदी`, or `Hinglish conversational blend`).
  - Baseline cycle rhythm (`Standard 28–32d`, `Irregular 35–50+d`, `PCOS Management`, or `Education-Only`).
  - Dietary profile (`Vegetarian`, `Eggetarian`, `Non-Vegetarian`, `Vegan`).
  - Focus areas (Remedies, Iron-rich meals, PCOS care).

### 4.2 Cycle Tracking & Calendar Module
- **Transparent Cycle Math:** Cycle predictions calculate simple rolling averages of past recorded cycles (default: 28 days) with visible uncertainty intervals (e.g. *"In ~14 days • Nov 12 (±2 days)"*).
- **Interactive Calendar Grid:**
  - Menstrual Flow (Coral circular tags).
  - Follicular Phase (Soft plum highlights).
  - Ovulation & Fertile Window (Dashed sage boundaries with explicit disclaimer: *Not intended as contraception*).
  - Luteal Phase (Lavender/neutral).
  - Selected Day Details card showing logged symptoms and physical notes.
- **Past Cycle History & Regularity:** Visual summary metrics displaying average cycle length, variance, and 6-month history cards.
- **Export Doctor Summary CTA:** One-click generation of clinical summary reports.

### 4.3 Symptom & Mood Journal Module
- **Stepped Pain Scale (0–10):** Clinically calibrated descriptors from *0 (None)* to *10 (Intense / Immediate clinical care advised)*.
- **Categorized Multi-Select Tags:**
  - *Physical & Body:* Cramps, Lower back ache, Headache, Bloating, Tender breasts, Nausea.
  - *Energy & Sleep:* Restful sleep, Fatigue, Restless, High stamina.
  - *Mood & Mental Well-being:* Calm, Irritable, Emotional sensitivity, Focused, Anxious.
  - *Flow & Discharge:* None, Spotting, Light, Medium, Heavy.
- **Personal Reflections & Notes:** Free-form journal field.
- **On-Device Bilingual Voice Dictation:** Voice-to-text recording in Hindi and English directly converting spoken observations into journal notes.
- **Longitudinal Trend Sparkline:** Visual trendline correlating cycle day with discomfort history.

### 4.4 Saheli AI Companion & Voice Interaction Module
- **Conversational RAG (Retrieval-Augmented Generation):**
  - Answers user questions strictly using verified clinical source passages.
  - Shows cited guidelines (e.g., *FOGSI Adolescent Health Guidelines*, *ACOG Practice Bulletins*).
  - Synthesizes clear, actionable, non-jargon guidance.
- **Audio & Voice Pipeline:**
  - Spoken audio summaries (*"सुनें / Listen"*) in English and Hindi.
  - Spoken query input with live animated waveform feedback.
  - Bilingual live transcription and instant translation preview with confidence score.
- **Urgent Symptom Safety Guardrail:** Hardcoded triage detection triggering emergency warning banners if symptoms indicate acute hemorrhage, severe one-sided pain (torsion risk), or fainting.

### 4.5 Health Education Library (Condition Awareness)
- **Curated Articles:**
  - *Understanding PCOS Guide:* Rotterdam criteria, hormonal foundations, daily care, myth vs. fact cards, and downloadable gynecologist question checklist.
  - *Understanding Endometriosis Guide:* Validating chronic pelvic pain, diagnostic ultrasound/MRI/laparoscopy roadmap, flare-up comfort, and surgical warning signs.
  - *Menstrual Cycle Foundations & Regularity:* Normal variations, stress delay, menarche support.
  - *Debunking Cultural Myths:* Bathing, washing hair, sour foods (*khatta*), and social exclusion myths evaluated with modern medical science.
- **Search & Voice Discovery:** Keyword and spoken Hindi search for articles.

### 4.6 Care & Nutrition Module
- **Phase-Aligned Guidance:** Automatically highlights meals tailored to the user's active cycle phase (e.g., Iron & B-vitamins in Follicular/Menstrual).
- **Affordable Indian Healing Meals:**
  - *Spinach & Moong Dal Khichdi* with Desi Ghee and lemon (high iron bioavailability).
  - *Gur-Chana* (roasted gram & jaggery for ferritin support under ₹15).
  - *Set Dahi with Flaxseeds & Banana* (probiotics, magnesium, and phytoestrogens).
- **Interactive Matka Water Tracker:** Quick-log water intake widget with herbal infusion microtips (ajwain, jeera water).
- **Somatic Self-Care:** Restorative postures (*Supta Baddha Konasana*), warm sesame *Abhyanga* massage, and evening wind-down rituals.

### 4.7 Discreet Reminders & Notification Module
- **Shared-Phone Lock Screen Camouflage:**
  - *Discreet Mode (Default):* Lock screen displays *"Daily Pause: Drink warm water"* or *"Check in with yourself"*.
  - *Standard Mode:* Explicit period alerts (*"Period expected in 2 days"*).
- **Customizable Reminder Types:**
  - Period Approaching (1, 2, or 3 days prior).
  - PMS & Luteal Phase Awareness.
  - Delayed Period Check-in (after 5 days delay, gentle non-anxious prompt).
  - Daily Desi Care & Herbal Infusions (11:00 AM, 4:30 PM).
  - Medication & Supplement alerts (e.g., Myo-Inositol, Iron).
- **Quiet Hours:** Configurable Do Not Disturb window (default: 10:00 PM – 7:30 AM).

### 4.8 Privacy & Data Governance Module
- **On-Device Storage Preference:** Toggle between local browser storage and end-to-end encrypted cloud backup.
- **Emergency Calculator Camouflage:** Triple-tap header or shake phone to instantly replace the UI with a working arithmetic calculator.
- **Data Portability:** Export complete logs as clinical PDF, encrypted JSON, or CSV with an optional 6-digit access PIN for healthcare providers.
- **One-Tap Data Destruction:** Immediate purge of all stored entries, encryption keys, and cache.

---

## 5. Success Metrics & Impact Evaluation

| Metric Category | Target Objective | Measurement Method |
|-----------------|------------------|---------------------|
| **Clinical Literacy** | +20% improvement in cycle & PCOS awareness | Pre- and post-educational questionnaires |
| **User Privacy Trust** | 0 privacy complaints or leaks | Zero remote analytics tracking personal health payloads |
| **Low-Bandwidth UX** | Sub-2-second load times on 3G networks | Lighthouse audits and bundle size budgets (<150KB initial JS) |
| **Accessibility** | 100% WCAG AA/AAA compliance | Minimum 48px touch targets, high-contrast text, screen reader labels |
| **Care Navigation** | Increased confidence during doctor visits | Qualitative feedback from exported PDF utilization |
