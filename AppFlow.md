# Saheli — App Flow & Screen-by-Screen User Journey (AppFlow.md)

This document provides a comprehensive, screen-by-screen architectural walkthrough of the **Saheli (सहेली)** web application, detailing user pathways, interface elements, micro-interactions, states, and screen transitions based on the 12 Stitch screens (Project ID: `2276645037607231820`).

---

## 1. Global Navigation & Layout Shell

### 1.1 Top Fixed Header (Present on Tab Screens)
- **Brand Identity:** Lotus logo + "Saheli" typography in Newsreader with subtle subtitle indicating current page.
- **Bilingual Switcher:** Pill-shaped toggle `[ EN | हिंदी ]` that switches UI strings and audio language immediately without reloading.
- **Audio Narrator Button:** Speaker icon (`volume_up`) triggering spoken audio narration of the active page.
- **Emergency / Discretion Trigger:** Triple-tapping the header brand logo triggers the **Emergency Calculator Camouflage**.
- **Context Banner Strip:** Slim disclaimer badge: *"Educational companion. Not diagnostic. Consult a doctor for severe symptoms."*

### 1.2 Bottom Fixed Navigation Dock (5 Primary Tabs)
Fixed at the bottom with safe area padding, glassmorphic backdrop blur (`backdrop-blur-xl`), and gentle plum shadow:
1. **Home (`/`):** Material icon `home` — Main dashboard, cycle status ring, daily check-in, phase care spotlight.
2. **My Cycle (`/my-cycle`):** Material icon `calendar_month` — Interactive menstrual calendar, past regularity metrics, doctor report export.
3. **Care (`/care`):** Material icon `spa` — Phase-aligned Indian meals, water tracker, somatic comfort rituals.
4. **Ask Saheli (`/chat`):** Material icon `auto_awesome` (with plum highlight circle) — AI RAG conversational companion.
5. **Library (`/learn`):** Material icon `menu_book` — Vetted articles, condition awareness (PCOS, Endometriosis), myth debunking.

### 1.3 Floating Action Button (FAB)
- Present on `Home`, `My Cycle`, `Care`, `Library`, and `Guide` screens.
- Pill button anchored at bottom-right (`bottom-24 right-4`): *"बोलें / Speak"* with microphone icon.
- Tapping it instantly launches the fullscreen **Voice Interaction & Audio Waves (`/voice`)** modal.

---

## 2. Screen-by-Screen Detailed Flow

```
                     ┌───────────────────────────┐
                     │ 1. Onboarding & Setup     │
                     │    (/onboarding)          │
                     └─────────────┬─────────────┘
                                   │
                      [Save & Enter / Guest]
                                   │
                                   ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                            2. Home Dashboard (/)                            │
 └──────┬───────────────┬──────────────┬──────────────┬──────────────┬─────────┘
        │               │              │              │              │
        │ [Log Flow]    │ [Calendar]   │ [Care Card]  │ [Search]     │ [PCOS/Endo]
        ▼               ▼              ▼              ▼              ▼
 ┌──────────────┐┌──────────────┐┌────────────┐┌──────────────┐┌──────────────┐
 │ 4. Symptom   ││ 3. My Cycle  ││ 7. Care &  ││ 5. Ask Saheli││ 8. Health    │
 │    Logger    ││    Calendar  ││    Nutrition││   AI Chat   ││    Library   │
 │ (/symptoms)  ││ (/my-cycle)  ││  (/care)   ││   (/chat)    ││   (/learn)   │
 └──────┬───────┘└──────┬───────┘└────────────┘└──────┬───────┘└──────┬───────┘
        │               │                             │               │
        │               │ [Export Report]             │ [Voice Wave]  │ [Deep Dive]
        │               ▼                             ▼               ▼
        │        ┌──────────────┐              ┌──────────────┐┌──────────────┐
        │        │ 11. Reminders│              │ 6. Voice Wave││ 9. PCOS Guide│
        │        │     & Alerts │              │   & Audio    ││10. Endo Guide│
        │        │ (/reminders) │              │   (/voice)   │└──────────────┘
        │        └──────────────┘              └──────────────┘
        ▼
 ┌──────────────────────────────┐
 │ 12. Privacy & Data Settings  │
 │     (/settings/privacy)      │
 └──────────────────────────────┘
```

---

### Screen 1: Onboarding & Setup (`/onboarding`)
- **Entry Trigger:** First app visit, or clicking "Reset Profile" in Settings.
- **Top Bar:** Step progress indicator (`Step 1 of 3 • Profile & Care`) + `Skip setup` link.
- **Hero Card:** Warm welcome banner: *"Your health, your pace, your privacy."* with zero-ads trust badge and a 45-second bilingual audio guide player button.
- **Form Sections:**
  1. *Identity:* Name input (explicitly labeled *"Optional, e.g. Priya"*).
  2. *Language Selection:* Radio cards for `English with Hindi audio support`, `हिंदी (पूर्ण अनुभव)`, and `Hinglish conversational blend`.
  3. *Cycle Rhythm Picker:* Buttons for `Standard (~28-32 days)`, `Longer/Irregular (35-50+ days)`, `Managing PCOS`, and `Not tracking dates right now`.
  4. *Last Period Date:* Date button triggering a date picker, or quick buttons: *"I'm on my period today"* / *"I don't remember"*.
  5. *Dietary Preferences:* Chips for `Vegetarian (शाकाहारी)`, `Eggetarian`, `Non-Vegetarian`, `Vegan/Dairy-free`.
  6. *Privacy Sanctuary Box:* High-contrast Deep Plum card reinforcing zero data selling, on-device encryption, and open access.
- **Exit Actions:**
  - `Save & Enter My Dashboard`: Saves preferences to local state/database and navigates to `/`.
  - `Continue as Anonymous Guest`: Skips account creation and initializes a local-only guest session.

---

### Screen 2: Home Dashboard (`/`)
- **Header:** Personalized greeting (*"Good morning, Priya • Take a gentle moment for yourself today"*) with a *"सुनें / Listen"* button.
- **Core Cycle Progress Ring:**
  - SVG Circular ring displaying current day (e.g., `Day 14 of 28`).
  - Color segments: Coral (Menstrual flow), Plum (Follicular phase), Green (Fertile window), Muted plum (Luteal phase).
  - Next period countdown card: *"In ~14 days • Nov 12 (Based on 28-day recorded average. Dates are estimates)"*.
  - Linear horizontal timeline representing the 4 biological phases.
  - Quick action buttons: `View Details` (goes to `/my-cycle`) and `Log Flow` (goes to `/symptoms`).
- **Daily Check-In Module:**
  - Mood selector chips with emojis (`🌿 Calm`, `✨ Energized`, `🌸 Sensitive`, `🌙 Tired`, `☁️ Anxious`).
  - Physical symptom quick-toggles (`Mild Cramps`, `Headache`, `Bloating`, `Clear Skin`, `Tender Breasts`).
  - Stepped pain scale buttons (`0, 2, 4, 6, 8, 10`) with dynamic descriptive text.
  - `Save Check-in` button with an auto-dismissing confirmation toast: *"✓ Entry saved safely to your device"*.
- **Ask Saheli Prompt Bar:**
  - Search input with prompt suggestions: *"Why do cramps happen?"*, *"Iron-rich snacks for fatigue"*, *"Normal cycle variation"*.
  - Voice trigger button leading directly to `/voice`.
- **Phase-Aligned Nutrition Spotlight:**
  - Feature card for current phase (e.g. *Palak Dal & Roasted Peanuts* with high-iron tags, cook time, and recipe link).
  - Evening ritual card (*Chamomile infusion & legs-up-the-wall*).
- **Health Awareness Highlights:**
  - Medically reviewed article preview cards for **PCOS** and **Endometriosis** linking directly to their respective guide pages.

---

### Screen 3: My Cycle & Calendar (`/my-cycle`)
- **Header:** Month switcher controls (`< October 2024 >`) and summary stats (*Cycle Day 14 • 28-Day Cycle Rhythm*).
- **Calendar Grid:**
  - Full monthly calendar matrix (Sun–Sat).
  - Past logged flow days highlighted with coral filled circles.
  - Current day highlighted with double plum border rings and active pulse indicator.
  - Predicted future period window styled with dashed coral outlines.
  - Fertile/ovulation window highlighted in soft botanical sage.
  - Days with logged symptoms marked with an accent indicator dot.
  - Accessible multi-color legend and non-contraception clinical notice.
- **Selected Date Detail Sheet:**
  - Tapping any calendar day expands its specific log: logged symptoms, pain level, energy notes.
  - `Edit Entry for Date` button opening the logger pre-filled for that date.
- **Cycle History & Variability:**
  - 3-month rolling regularity statistics: Average cycle length (`28.6 Days`), healthy range comparison (`21–35 Days`).
  - Historical cycle interval cards (`C1: Sep 14–Oct 11 [28 Days]`, `C2: Aug 16–Sep 13 [29 Days]`, etc.).
  - Physician's reassuring clinical note explaining normal month-to-month variation.
- **Clinical Summary Export Card:**
  - CTA button: `Export Clinical Summary (PDF)` for gynecologist appointments.

---

### Screen 4: Symptom Journal & Logger (`/symptoms`)
- **Top Ribbon:** Date navigation selector (`< Today, Oct 28 >`) + Local auto-save status indicator.
- **Pain & Sensation Stepped Scale (0–10):**
  - Segmented buttons for levels 0 through 10.
  - Live feedback card updating dynamically with medical descriptors (e.g., Level 3: *Mild Noticeable*, Level 6: *Pronounced Discomfort*, Level 10: *Critical pain level / Clinical triage advised*).
- **Symptom Category Grid (Multiselect Chips):**
  - *Physical & Body:* Mild cramps, lower back ache, headache, bloating, tender breasts, nausea.
  - *Energy & Sleep:* Restful sleep, fatigue, restless, high stamina.
  - *Mood & Mental Well-being:* Calm, irritable, emotional sensitivity, focused, anxious.
  - *Flow & Discharge:* None, spotting, light, medium, heavy (single-select row).
- **Personal Reflections & Bilingual Dictation:**
  - Expandable reflection text area.
  - Micro-interaction button: `🎙️ Dictate in Hindi or English (बोलकर लिखें)` using the browser's speech recognition engine to transcribe directly into the note box.
- **Longitudinal Pattern Insight:**
  - Sparkline graphic comparing pain levels on Day 14 across past 4 cycles.
- **Primary Bottom Action:** `Save Today's Entry` with tactile checkmark state.

---

### Screen 5: Ask Saheli AI Companion (`/chat`)
- **Header:** Clinical grounding badge (`FOGSI / ACOG Aligned`) + Clear conversation button (`delete_sweep`).
- **Prompt Suggestions:** Horizontal scrollable chips with common Hindi/English questions.
- **Conversation Feed:**
  - User messages (Deep plum speech bubbles).
  - Voice notes (Audio player bar with visual waveform and transcribed Hindi/English text).
  - Assistant responses (Warm ivory cards with official citation badges, bulleted self-care protocols, and audio playback buttons).
- **Urgent Care Red Flag Box:**
  - Automatically injected emergency alert triggered when keywords indicating severe hemorrhaging or debilitating pain appear.
- **Sticky Bottom Dock:**
  - Text input field + quick microphone pulse button + language preference toggle.
  - Privacy indicator: *"Educational companion. Confidential & private on this phone."*

---

### Screen 6: Voice Interaction & Audio Waves (`/voice`)
- **Mode:** Fullscreen ambient listening experience.
- **Top Controls:** Privacy guarantee pill (*"On-Device Privacy"*) + bilingual mode toggle (`हिंदी` vs `English`).
- **Harmonic Waveform Visualizer:**
  - Animated multi-frequency harmonic sound wave SVG that pulses in real time with microphone input levels.
  - Real-time active conversation timer (`0:07 / Active`).
- **Live Transcription & Translation:**
  - Original Hindi spoken text rendered with real-time confidence rating (e.g. `98% confidence`).
  - Instant English clinical clarification preview.
  - Inline `Edit` and `Clear` controls.
- **Voice Action Dock:**
  - `Cancel` button (left).
  - Large pulsing center microphone button (tap to pause/resume).
  - `Submit (पूछें)` button (right).
- **Auxiliary Controls:**
  - `Auto-read response (उत्तर बोलकर सुनाएं)` toggle switch.
  - `Prefer typing? Switch to keyboard` fallback link.

---

### Screen 7: Care & Nutrition (`/care`)
- **Category Filter Tabs:** `Food & Nutrition`, `Self-Care`, `Hygiene & Myths`, `Seek Help`.
- **Hormonal Sync Banner:** Highlights the active phase (e.g., *Follicular • Estrogen rising • Day 8 of 28*).
- **Kitchen Preference Filters:** Chips for `All Foods`, `Vegetarian (शाकाहारी)`, `Budget-Friendly (<₹50)`, `Vegan`, `Eggs/Non-Veg`.
- **Everyday Indian Healing Meals:**
  - *Moong Dal & Spinach Khichdi* with Desi Ghee & lemon (cook time 20m, non-heme iron absorption).
  - *Gur-Chana* (roasted chickpea & jaggery, zero-cooking, ferritin boost).
  - *Dahi with Flaxseeds & Banana* (probiotics, magnesium, phytoestrogens).
- **Interactive Hydration Tracker:**
  - Matka visualizer showing progress (e.g., `6 of 8 glasses logged`).
  - `+ Add glass` button with smooth animated progress bar filling.
  - Microtip box with herbal infusion recipe (*Ajwain-Jeera water*).
- **Gentle Physical Comfort Section:**
  - Warm sesame oil *Abhyanga* guide.
  - Restorative *Supta Baddha Konasana* pose instruction.
  - Night wind-down ritual tips.
- **Red Flag Clinical Alert:**
  - Guidance on when cramps or bleeding require in-person gynecological consultation.

---

### Screen 8: Health Library (`/learn`)
- **Top Controls:** Search bar with integrated voice search button (`बोलें`) + Medical Advisory Board credential badge.
- **Category Pill Carousel:** `All Topics`, `Cycle Foundations`, `PCOS & Hormones`, `Pelvic Pain & Endo`, `Food & Nourishment`, `Mental Well-Being`, `Myths vs. Reality`, `First Period & Youth`.
- **Spotlight Editorial Banner:**
  - Large featured editorial on *Understanding PCOS* with audio reading CTA and doctor byline.
- **Curated Clinical Article Cards:**
  - *Understanding Endometriosis & Chronic Pelvic Pain*.
  - *Everyday Indian Nutrition for Hormonal Balance*.
  - *Demystifying Cycle Regularity: What is Normal?*.
  - *First Period & Adolescent Care Companion*.
  - *Period Myths Debunked by Gynecologists*.
- **Doctor Consultation Toolkit:**
  - Link to download printable doctor discussion question sheets and export symptom logs as PDF.

---

### Screen 9: Understanding PCOS Guide (`/learn/pcos`)
- **Metadata Header:** Byline by Dr. Ananya Sen, MD (OB-GYN), read time, and bookmark button.
- **Audio Narrator Bar:** Audio progress scrubber with play/pause in Hindi and English.
- **Educational Breakdown:**
  - *Rotterdam Diagnostic Criteria:* 3 clinical pillars explained simply (ovulatory delay, androgens, follicular pattern).
  - *Bodily Signs Grid:* Menstrual regularity, skin & jawline acne, insulin resistance signs, and mental well-being.
  - *Daily Nourishment:* Glycemic pairing principles with Indian meals.
- **Interactive Myth vs. Fact Cards:**
  - Myth: *"PCOS means you can never get pregnant"* → Fact: Most treatable cause of ovulatory delay.
  - Myth: *"Must eliminate all roti, rice, and dairy"* → Fact: Extreme restriction worsens cortisol and insulin sensitivity.
- **Gynecologist Checklist:**
  - Interactive checkboxes for recommended tests (LH/FSH ratio, fasting insulin, AMH) with a `Copy Selected Questions to Notes` action.

---

### Screen 10: Understanding Endometriosis Guide (`/learn/endometriosis`)
- **Header:** Medical review badge by Dr. Radhika Sharma, MD + audio player.
- **Validation Card:** Reassuring statement: *"Your pain is real, not imagined. Severe pain is not just cramps."*
- **Anatomy & Pathophysiology:** Explanation of endometrial-like tissue outside the uterus.
- **Symptom Tracker Guide:** Tracking dysmenorrhea, deep pelvic ache, menorrhagia, and fatigue.
- **Diagnostic Roadmap:** 4-step sequence (Symptom Log → Expert TVS Ultrasound → High-Res MRI → Diagnostic Laparoscopy).
- **Emergency Safeguard Banner:** Immediate red flags (torsion risk, uncontrollable bleeding, high fever).
- **Self-Advocacy Checklist:** Checkable list of items to pack for the clinic with a `Share via WhatsApp` export button.

---

### Screen 11: Reminders & Routine Alerts (`/reminders`)
- **Discreet Shared-Phone Mode (Spotlight Feature):**
  - Master toggle switch: `Private Lock Screen Mode`.
  - Live interactive lock screen preview comparing **Disguised Mode** (*"Daily Pause: Drink warm water"*) vs. **Standard Mode** (*"Saheli: Period in 2 Days"*).
- **Cycle & Period Alerts:**
  - Period Approaching (options for 1, 2, or 3 days before; customizable alert time).
  - PMS & Mood Shift Awareness.
  - Fertile Window & Ovulation (disabled by default).
  - Delayed Period Check-in (gentle non-anxious prompt after 5 days).
- **Daily Desi Care Nudges:**
  - Warm Herbal Infusions (11:00 AM, 4:30 PM).
  - Iron & Hemoglobin Reminders (post-lunch).
  - Gentle Movement / Rest Permission nudges.
- **Medication & Prescription Schedule:**
  - Active prescriptions list (e.g., *Myo-Inositol at 09:00 AM*, *Mefenamic Acid on Days 1-2*).
  - `+ Add Medication or Supplement` button.
  - Upcoming Gynecologist Appointment reminder card.
- **Quiet Hours & Tone Selector:**
  - Do Not Disturb window (`10:00 PM – 07:30 AM`).
  - Chime style selection (`Temple Bell`, `Soft Chime`, `Vibrate Only`).
  - Alert language selection (`English` vs `हिंदी`).

---

### Screen 12: Privacy & Data Control Settings (`/settings/privacy`)
- **Sovereign Architecture Banner:** Declaration of zero commercialization and compliance with the India DPDP Act 2023.
- **On-Device Storage Settings:**
  - `Device-Only Local Storage` toggle (active by default).
  - `Biometric & Screen Shield` toggle (fingerprint / Face Unlock / 4-digit PIN).
  - `Ephemeral Voice & AI Chats` toggle (scrubs transcripts from memory immediately upon exit).
- **Cloud & Research Preferences (Opt-in Only):**
  - Zero-Knowledge Cloud Backup with client-held passphrase.
  - Anonymous, stripped health research participation toggle.
- **Doctor Consultation Export Packet:**
  - Format selector: `Clinical PDF` vs `Encrypted JSON/CSV`.
  - Timeframe selector: `Last 3 Months`, `Full 12 Months`, or `Consultation Checklist`.
  - Actions: `Download Encrypted PDF` (generates random 6-digit access PIN) and `Share via Password-Protected Link`.
- **Discretion & Danger Zone:**
  - `Emergency Quick-Disguise`: Test calculator disguise camouflage mode.
  - `Clear AI Chat Transcripts`: Immediate purge of local conversation memory.
  - `Permanent Data Destruction`: Red button confirming permanent deletion of all cycle logs, encryption keys, and preferences.
