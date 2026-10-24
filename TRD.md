# Saheli — Technical Requirement Document (TRD)

**System Architecture & Engineering Specification**  
**Project:** Saheli (सहेली) Web Application  
**Runtime:** Node.js 18+ / Edge Runtime  
**Frontend Framework:** Next.js (App Router) + React + TypeScript  
**Styling Framework:** Tailwind CSS (Custom Design Tokens matching Stitch Design System)  
**Database & Auth:** Supabase (PostgreSQL 15+ with pgvector & Row Level Security)  
**Document Version:** 1.0.0  
**Status:** Approved for Implementation  

---

## 1. System Architecture Overview

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                     CLIENT LAYER (Next.js PWA)                         │
 │                                                                        │
 │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐ │
 │  │ Responsive UI    │  │ Web Speech API   │  │ Client Storage       │ │
 │  │ (Tailwind + SVG) │  │ (Speech/TTS/STT) │  │ (IndexedDB / Local)  │ │
 │  └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘ │
 └───────────┼─────────────────────┼───────────────────────┼─────────────┘
             │                     │                       │
             ▼                     ▼                       ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │            BACKEND SERVICES LAYER (Next.js Route Handlers)             │
 │                                                                        │
 │  ┌──────────────────────────────────────────────────────────────────┐  │
 │  │ API Endpoints:                                                   │  │
 │  │  • POST   /api/cycle/log         • GET    /api/cycle/estimate    │  │
 │  │  • POST   /api/symptoms          • POST   /api/chat (RAG)        │  │
 │  │  • GET    /api/education/search  • GET    /api/care/nutrition    │  │
 │  │  • POST   /api/reminders         • POST   /api/summary (PDF/Doc) │  │
 │  │  • DELETE /api/account/data                                      │  │
 │  └──────────────────────────────────────────────────────────────────┘  │
 │                                                                        │
 │  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐  │
 │  │ Cycle Math Engine  │ │ Safety Triage Guard│ │ AI RAG Pipeline    │  │
 │  │ (Simple Rolling Avg│ │ (Red Flag Regex &  │ │ (Vector Search +   │  │
 │  │  Uncertainty Calc) │ │  Clinical Rules)   │ │  Medical Citations)│  │
 │  └────────────────────┘ └────────────────────┘ └────────────────────┘  │
 └────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │               DATA & SECURITY LAYER (Supabase / PostgreSQL)            │
 │                                                                        │
 │  ┌──────────────────────────────────────────────────────────────────┐  │
 │  │ Tables: profiles, period_logs, symptom_logs, consent_records,    │  │
 │  │         reminders, medical_articles (pgvector)                   │  │
 │  └──────────────────────────────────────────────────────────────────┘  │
 │  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
 │  │ Row Level Security (RLS)│  │ End-to-End Client Encryption Keys   │  │
 │  │ (Strict user isolation) │  │ (Web Crypto AES-GCM for note text)  │  │
 │  └─────────────────────────┘  └─────────────────────────────────────┘  │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack & Key Libraries

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Core Framework** | Next.js 14+ (App Router) | High-performance Server Components (RSC), fast hydration, edge-ready API route handlers, and native SEO optimization. |
| **Language** | TypeScript (Strict Mode) | Strong typing across health schemas, cycle algorithms, and API contracts. |
| **Styling** | Tailwind CSS | Utility-first CSS configured with custom color tokens (`primary: #482e47`, `primary-container: #60445f`, etc.) matching Stitch design specs. Zero runtime style overhead. |
| **Database** | PostgreSQL via Supabase | Relational data integrity, native Row Level Security (RLS), and `pgvector` for similarity search on approved medical articles. |
| **Authentication** | Supabase Auth + Guest Token | Supports authenticated users (email/magic link) alongside persistent local Guest IDs for maximum privacy. |
| **Voice / Speech** | Web Speech API (STT / SpeechSynthesis) | Built directly into modern browsers; enables zero-latency spoken queries and audio read-aloud without sending voice audio to third-party cloud servers. |
| **PDF Generation** | `@react-pdf/renderer` or `jspdf` | Client-side generation of Doctor Visit Clinical Reports without sending patient data to a remote print server. |
| **PWA & Offline** | `next-pwa` / Service Worker | Full offline asset caching, offline calendar navigation, and local symptom logging. |

---

## 3. Server Route Handlers & API Specifications

### 3.1 Cycle Tracking APIs
- **`POST /api/cycle/log`**
  - **Body:** `{ start_date: string, end_date?: string, flow_intensity: 'spotting'|'light'|'medium'|'heavy', notes?: string }`
  - **Logic:** Upserts period log entry into `period_logs`. Recalculates rolling cycle average.
- **`GET /api/cycle/estimate`**
  - **Query:** `?user_id=...`
  - **Logic:** Queries past 3–6 recorded cycle lengths.
  - **Algorithm:**
    $$\text{Average Length} = \frac{\sum (\text{End}_{i} - \text{Start}_{i})}{N}$$
    $$\text{Uncertainty Interval} = \pm \max(2, \text{Standard Deviation})$$
  - **Returns:** `{ next_period_start: string, next_period_end: string, fertile_start: string, fertile_end: string, cycle_length_avg: number, uncertainty_days: number }`

### 3.2 Symptom Journal APIs
- **`POST /api/symptoms`**
  - **Body:** `{ date: string, pain_level: number (0-10), symptoms: string[], mood: string, flow?: string, reflection?: string, is_encrypted: boolean }`
  - **Logic:** Stores log entry in `symptom_logs`. If `pain_level >= 8`, returns safety warning flag in response.

### 3.3 AI / RAG Chat APIs
- **`POST /api/chat`**
  - **Body:** `{ message: string, language: 'en' | 'hi' | 'hinglish', history: ChatMessage[] }`
  - **Pipeline Steps:**
    1. **Input Filter & Red-Flag Triage:** Inspects prompt for emergency patterns (e.g., severe acute pain, hemorrhagic bleeding). If detected, triggers immediate safety recommendation.
    2. **Vector Retrieval:** Generates query embedding and runs cosine similarity against `education_articles` in Supabase (`pgvector`). Retrieves top 3 medically reviewed passages.
    3. **LLM Generation:** Calls model with system prompt constraining answers strictly to retrieved knowledge, demanding respectful, non-prescriptive tone with citations.
    4. **Safety Verification:** Ensures no medications or unapproved cures are prescribed.
  - **Returns:** `{ answer: string, citations: string[], is_emergency: boolean, spoken_text: string }`

### 3.4 Care, Nutrition & Library APIs
- **`GET /api/education/search`**
  - **Query:** `?q=...&category=...&lang=...`
  - **Logic:** Returns matching approved medical articles with category tags (`pcos`, `endometriosis`, `myths`, `nutrition`).
- **`GET /api/care/nutrition`**
  - **Query:** `?phase=follicular|luteal|menstrual|ovulatory&diet=veg|nonveg|vegan|budget`
  - **Logic:** Returns curated Indian food recipes, ingredients, costs, and preparation times.

### 3.5 Reminders & Summary APIs
- **`POST /api/reminders`**
  - **Body:** `{ reminder_type: string, scheduled_time: string, is_discreet: boolean, custom_label?: string, enabled: boolean }`
  - **Logic:** Configures local notification schedules or web push subscriptions.
- **`POST /api/summary`**
  - **Body:** `{ timeframe_months: number, include_symptoms: boolean, include_trends: boolean }`
  - **Returns:** Structured JSON data payload suitable for on-device PDF formatting.
- **`DELETE /api/account/data`**
  - **Logic:** Cascades deletion across all tables associated with user ID or session ID; confirms zero residual cloud storage.

---

## 4. AI & RAG Pipeline Architecture

```
User Query (Text or Spoken Hindi/English)
  │
  ▼
[Input Validation & Privacy Gate]
  ├─ Strips PII / Names
  └─ Checks Emergency Red Flags (e.g. soaking >2 pads/hr, sudden acute pain)
        ├─ If Red Flag: Immediate triage banner returned without delay
        └─ If Normal: Proceeds to RAG Retrieval
  │
  ▼
[pgvector Cosine Similarity Match]
  └─ Table: medical_articles (Vector size: 768 / 1536)
  └─ Threshold: similarity > 0.78
  │
  ▼
[System Prompt & Strict Grounding Guardrails]
  ├─ Context: Approved medical excerpts from FOGSI & ACOG
  ├─ Directives:
  │    - Do NOT diagnose illnesses.
  │    - Do NOT prescribe dosages or pharmaceutical drugs.
  │    - Provide practical Indian lifestyle context (hydration, rest, warmth).
  │    - Include plain-text citations at the end of guidance.
  │    - Provide answer in user's chosen language (English or Hindi).
  │
  ▼
[Final Response Synthesis & Audio TTS Payload]
```

### Fallback Guarantee (Works Without AI)
If the AI service is unreachable, offline, or rate-limited:
- The chat interface falls back directly to keyword-indexed FAQs and vetted library summaries.
- Core cycle logging, calendar displays, symptom journaling, and food recommendations run 100% locally with zero cloud dependencies.

---

## 5. Security & Privacy Engineering

1. **Row Level Security (RLS):**
   - Every database table enforces PostgreSQL RLS policies where `auth.uid() = user_id`.
   - Guest accounts utilize a unique hardware-derived client token stored securely in `IndexedDB`.
2. **Client-Side Sensitive Note Encryption:**
   - Free-form personal reflections in the Symptom Journal can be encrypted via the Web Crypto API (`AES-GCM-256`) using a user-held passphrase before transmission.
3. **Emergency Camouflage Mechanics:**
   - Client-side state hook (`useEmergencyCamouflage`) toggles an instant mathematical calculator mask upon:
     - Triple-tap on top brand mark.
     - Device shake event (via `devicemotion` API).
4. **Zero Third-Party Trackers:**
   - No Google Analytics, no Facebook Pixel, no remote advertising SDKs.
   - Self-hosted telemetry strictly limited to anonymized, opt-in error rates.

---

## 6. Offline-First & Progressive Web App (PWA) Architecture

- **Service Worker Strategy:**
  - `CacheFirst` for static font assets (Newsreader, Plus Jakarta Sans, Google Material Symbols).
  - `StaleWhileRevalidate` for educational articles and nutrition guidance.
  - `NetworkFirst` with local IndexedDB fallback for cycle logs and check-ins.
- **PWA Manifest:**
  - Name: `Saheli Health Companion`
  - Short Name: `Saheli`
  - Display: `standalone`
  - Background: `#fff7fa`
  - Theme Color: `#482e47`
  - Icons: Maskable SVG & PNG icons adhering to Android/iOS guidelines.
