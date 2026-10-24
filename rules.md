# Saheli — Engineering Guidelines & Architectural Rules (rules.md)

This document establishes the **non-negotiable rules, constraints, coding conventions, and ethical boundaries** for all engineers, agents, and contributors building the **Saheli (सहेली)** application.

---

## 1. Absolute Ethical & Privacy Principles

### Rule 1.1: Zero Commercialization & Advertising
- **NO third-party tracking scripts, advertising SDKs, pixel trackers, or user profiling libraries** may ever be added to this codebase.
- User health data (period dates, symptoms, pain levels, mood, reflections) must never be transmitted, sold, or shared with marketing or data-broker entities.
- Compliant with the India **Digital Personal Data Protection (DPDP) Act 2023**.

### Rule 1.2: Sovereign Local-First Architecture
- The application must function **locally on the user's device first**.
- A user must be able to use the complete core application as an **Anonymous Guest** without creating a cloud account, entering an email, or providing personal identifiers.
- All primary cycle calculations, symptom logs, and calendar data must persist in client-side storage (`IndexedDB` with `localStorage` fallback) before any cloud synchronization.

### Rule 1.3: Shared-Phone & Discretion Protection
- In shared-family households, privacy is a safety requirement:
  - All push notifications must default to **Discreet Mode** (showing generic mindfulness phrases like *"Daily Pause: Drink warm water"* instead of menstrual terms).
  - The **Emergency Calculator Camouflage** feature must remain instantly accessible via triple-tap on the header logo or phone shake motion.
  - One-tap data destruction must physically delete all local databases and keys immediately.

---

## 2. Clinical & Medical Safety Guardrails

### Rule 2.1: Non-Diagnostic & Non-Prescriptive Boundaries
- Saheli is an educational and supportive wellness companion, **NOT a medical doctor or diagnostic instrument**.
- Under no circumstances may the application or AI assistant:
  - Issue a definitive medical diagnosis (e.g., cannot state *"You have PCOS"* or *"You have Endometriosis"*).
  - Prescribe pharmaceutical drugs, alter prescribed dosages, or endorse unverified supplements.
  - Make claims that dietary foods "cure" chronic conditions.
- Every page and AI response must display or link to the standard clinical disclaimer:
  > *"Educational companion. Not diagnostic. Consult a doctor for severe symptoms."*

### Rule 2.2: Mandatory Emergency Red-Flag Triage
- If a user inputs symptoms indicating acute health emergencies, the system must immediately surface a prominent **Urgent Care Warning Banner** directing them to emergency medical attention:
  - Blood loss exceeding **2 saturated menstrual pads/tampons per hour for 2+ consecutive hours**.
  - Sudden, acute, sharp one-sided pelvic pain (risk of ovarian torsion or ruptured cyst).
  - High fever or chills accompanied by pelvic pain.
  - Fainting, severe dizziness, or persistent vomiting.

### Rule 2.3: Zero Hallucination in Medical Advice
- All educational copy and AI responses must be strictly grounded in peer-reviewed clinical guidelines:
  - **FOGSI** (Federation of Obstetric and Gynaecological Societies of India)
  - **ACOG** (American College of Obstetricians and Gynecologists)
  - **Monash International Evidence-Based PCOS Guidelines**
- Every AI response must provide citations indicating its authoritative source passage.

---

## 3. Offline-First & AI Independence

### Rule 3.1: Complete Core Functionality Without AI
- **Core features MUST NOT rely on an active LLM API.**
- The following features must be 100% operational offline with zero internet connection:
  - Mathematical cycle predictions and calendar phase visualizers.
  - Daily check-in logging and stepped pain scale tracking.
  - Care & Nutrition recipes, hydration tracker, and somatic exercise guides.
  - Static Health Library guides (PCOS, Endometriosis, cycle regularity, myth-busting).
- The AI Chat (`/chat`) is an optional enhancement; if offline or unavailable, it must gracefully degrade to indexed local FAQs.

---

## 4. Design & UI Code Conventions

### Rule 4.1: Strict Fidelity to Stitch Design System (`Design.md`)
- Use the **Warm Editorial Healthcare** theme:
  - Headlines: `Newsreader` (Serif).
  - Body & UI: `Plus Jakarta Sans`.
  - Color Tokens: Only use defined semantic colors (`primary: #482e47`, `primary-container: #60445f`, `secondary: #44664d`, `tertiary: #562a23`, `background: #fff7fa`, etc.).
  - **NEVER use generic raw Tailwind colors** (e.g. `bg-red-500`, `bg-blue-600`, `bg-green-500`). Use curated semantic tokens.
  - Avoid cold, sterile medical whites; use Warm Ivory (`#fff7fa`) and soft layered surfaces.

### Rule 4.2: Mobile-First & Accessibility (WCAG AA/AAA)
- Minimum touch target for all buttons, inputs, and chips is **48x48px** with at least `8px` separation.
- Form inputs must have distinct focus rings with `2px` offset for keyboard accessibility.
- All interactive icon-only buttons must have descriptive `aria-label` attributes.

### Rule 4.3: Cultural & Linguistic Authenticity
- Honor everyday Indian dietary realities: promote accessible ingredients (spinach *palak dal*, roasted *chana*, *jaggery/gur*, *dahi*, *methi* seeds) rather than expensive imported items.
- Maintain bilingual parity: every core action must support both English and natural Hindi (*सहेली, मासिक धर्म, घरेलू नुस्खे, दिनचर्या*).

---

## 5. Code Structure & Engineering Standards

### Rule 5.1: File & Directory Organization
```
c:\Users\acer\Desktop\Saheli\
├── PRD.md                  # Product Requirement Document
├── TRD.md                  # Technical Requirement Document
├── AppFlow.md              # Screen-by-Screen User Journey
├── Design.md               # Stitch Design System & Tokens
├── Schema.md               # Database Blueprint & SQL Schema
├── ImplementationPlan.md   # Step-by-Step Engineering Roadmap
├── tracker.md              # Progress Checklist
├── rules.md                # Engineering Rules & Constraints
├── src/
│   ├── app/                # Next.js App Router (12 Screens)
│   │   ├── layout.tsx      # Root layout with header & bottom nav
│   │   ├── page.tsx        # Home Dashboard (Screen 2)
│   │   ├── onboarding/     # Onboarding & Setup (Screen 1)
│   │   ├── my-cycle/       # Cycle & Calendar (Screen 3)
│   │   ├── symptoms/       # Symptom Logger (Screen 4)
│   │   ├── chat/           # AI Companion (Screen 5)
│   │   ├── voice/          # Voice Waves (Screen 6)
│   │   ├── care/           # Care & Nutrition (Screen 7)
│   │   ├── learn/          # Library & Condition Guides (Screens 8, 9, 10)
│   │   ├── reminders/      # Discreet Reminders (Screen 11)
│   │   └── settings/       # Privacy & Camouflage Settings (Screen 12)
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Buttons, chips, cards, inputs
│   │   ├── calendar/       # Menstrual calendar grid & wheels
│   │   ├── audio/          # Waveforms, audio player capsules
│   │   └── camouflage/     # Working calculator mask
│   ├── lib/                # Utilities, cycle math, date helpers
│   ├── services/           # Speech, storage, Supabase, RAG
│   └── types/              # TypeScript database & state interfaces
```

### Rule 5.2: TypeScript Rigor
- Strict mode enabled (`"strict": true`).
- Prohibit `any` types; all API responses, database records, and component props must be explicitly typed.
- Database operations must use typed interfaces from [`Schema.md`](file:///c:/Users/acer/Desktop/Saheli/Schema.md).
